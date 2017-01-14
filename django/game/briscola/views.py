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

# Create your views here.
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
	context['users'] = User.objects.all()
	context['loginForm'] = LoginForm()

	return render(request,'briscola/main.html', context)

def moreAboutBriscola(request):
	return render(request,'briscola/moreAboutBriscola.html', {})

def howToPlay(request):
	return render(request,'briscola/howToPlayBriscola.html', {})

@login_required(login_url='index')
def play(request):
	return render(request,'briscola/playPage.html', {})

@login_required(login_url='index')
def roundOver(request, winner):
	return render(request,'briscola/roundOverPage.html', {'winner': winner})

def logoutUser(request):
    logout(request)
    return HttpResponseRedirect(reverse('index'))

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

def register_success(request):
    return render(request,
	'briscola/registrationSuccess.html',{'loginForm': LoginForm()})
def comments(request):
	context = {'comments': Comment.objects.all()}
	return render(request,
	'briscola/comments.html',context)

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

@login_required(login_url='comments')
def commentDelete(request, comment_id): #2nd from the url
  context = {'loginForm': LoginForm()}

  if not Comment.objects.filter(pk=comment_id).exists():
	  return HttpResponseRedirect(reverse('comments'))
  comment = Comment.objects.get(pk=comment_id)
  if comment.author == request.user or request.user.is_superuser:
        comment.delete()

  return HttpResponseRedirect(reverse('comments'))

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
