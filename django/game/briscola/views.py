from django.shortcuts import render, render_to_response
from django.http import HttpResponseRedirect
from django.urls import reverse
from django.template import RequestContext

from django.contrib.auth import authenticate, login, logout

from django.contrib.auth.models import User,Permission
from .models import Comment
from .forms import *
from templatetags.app_filters import *
from django.views.decorators.csrf import csrf_protect
from django.contrib.auth.decorators import login_required, permission_required, user_passes_test

from django.http import HttpResponse
from django.contrib.auth.models import Group

"""
Display of the front page of the application.
The login form.

@param request client's request
"""
def index(request):
	context = {}
	if request.method=='POST':
  		form = LoginForm(request.POST)
		if form.is_valid():
			user = authenticate(username=form.cleaned_data['username'], password=form.cleaned_data['password'] )
			context['uuu'] = user
			if user is not None:
				context['uuu'] = user.username
				login(request, user)

	context['loginForm'] = LoginForm()

	return render(request,'briscola/main.html', context)
"""
Renders the page which tell us more about the briscola.

@param request client's request
"""
def moreAboutBriscola(request):
	return render(request,'briscola/moreAboutBriscola.html', {})

"""
Renders the page which tell us how to play briscola.

@param request client's request
"""
def howToPlay(request):
	return render(request,'briscola/howToPlayBriscola.html', {})

"""
Renders the play page of the web application.
Login is needed to obtain the play page.
@param request client's request
"""
@login_required(login_url='index')
def play(request):
	return render(request,'briscola/playPage.html', {})

"""
Renders the round over page of the web application.
Login is needed.
@param request client's request
"""
@login_required(login_url='index')
def roundOver(request, winner):
	return render(request,'briscola/roundOverPage.html', {'winner': winner})

"""
Logs out the user.
@param request client's request
"""
def logoutUser(request):
    logout(request)
    return HttpResponseRedirect(reverse('index'))

"""
If the request does not contains correctly filled register from,
renders the register form.
Othervise, registers the user and redirects to the 'registrationSucces'
page.
@param request client's request
"""
def register(request):
    gotoDiv = False;
    if request.method == 'POST' :
        form = RegistrationForm(request.POST)
        if form.is_valid():
            user = User.objects.create_user(
            username=form.cleaned_data['username'],
            password=form.cleaned_data['password1'],
            email=form.cleaned_data['email'])
            number = form.cleaned_data['randNumber']
            permission = Permission.objects.get(codename='edit_comment')
            user.user_permissions.add(permission)
            if number%3 == 1:
               permission = Permission.objects.get(codename='add_comment')
               user.user_permissions.add(permission)
               group = Group.objects.get(name='AddComment')
               user.groups.add(group)

            user.save()

            return HttpResponseRedirect('./success')
    else:
        form = RegistrationForm()
    gotoDiv = 'loginRegister'
    return render(request,
    'briscola/registration.html',
    {'registrationForm': form , 'gotoDiv': gotoDiv})

"""
	Process the register success event.
	Renders the page which notify the user that the registration has been sucessful.
	@param request client's request
"""
def register_success(request):
    return render(request,
	'briscola/registrationSuccess.html',{'loginForm': LoginForm()})

"""
	Renders the page with all comments about the application/game.
	@param request client's request
"""
def comments(request):
	context = {'comments': Comment.objects.all()}
	return render(request,
	'briscola/comments.html',context)

"""
	Renders the page to edit comment.
	Each user can only edit his/her own comment.
	Superuser can edit all comments.
	@param request client's request
"""
@login_required(login_url='comments')
@permission_required('briscola.edit_comment', login_url='comments')
def commentEdit(request, comment_id): #2nd from the url
  context = {}
  if not Comment.objects.filter(pk=comment_id).exists():
	  return HttpResponseRedirect(reverse('comments'))

  comment = Comment.objects.get(pk=comment_id)

  if comment.author != request.user and  not request.user.is_superuser:
	  return HttpResponseRedirect(reverse('comments'))

  eaform = EditCommentForm(instance=comment)

  if request.method=='POST':
    eaform = EditCommentForm(request.POST, instance=comment)
    if eaform.is_valid():
      eaform.save()
      return HttpResponseRedirect(reverse('comments'))

  context['comment'] = comment
  context['edit_comment_form'] = eaform

  return render(request, 'briscola/comment_edit.html', context)

"""
	Renders the page to delete comment.
	Each user can only delete his/her own comment.
	Superuser can edit all comments.
	@param request client's request
"""
@login_required(login_url='comments')
def commentDelete(request, comment_id): #2nd from the url
  context = {'loginForm': LoginForm()}

  if not Comment.objects.filter(pk=comment_id).exists():
	  return HttpResponseRedirect(reverse('comments'))
  comment = Comment.objects.get(pk=comment_id)
  if comment.author == request.user or request.user.is_superuser:
        comment.delete()

  return HttpResponseRedirect(reverse('comments'))

"""
	Renders the page to add comment.
	Only loged in users that are in the group AddComment can
	add new comment.

	@param request client's request
"""
#check if it is in certain group
#@user_passes_test(lambda u: u.has_perm('briscola.add_comment'), login_url='comments')
#or with group
@login_required(login_url='comments')
@user_passes_test(is_addComent, login_url='comments')
def commentAdd(request): #2nd from the url
  context = {'loginForm': LoginForm()}
  user = request.user;

  comment = Comment(comment = "", author = user);
  eaform = EditCommentForm(instance=comment)

  if request.method=='POST':
    eaform = EditCommentForm(request.POST, instance=comment)
    if eaform.is_valid():	
      eaform.save()
      return HttpResponseRedirect(reverse('comments'))

  context['comment'] = comment
  context['edit_comment_form'] = eaform

  return render(request, 'briscola/comment_add.html', context)
