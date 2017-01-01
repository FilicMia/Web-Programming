from django.shortcuts import render
from django.http import HttpResponseRedirect
from django.urls import reverse
from django.template import RequestContext

from django.contrib.auth import authenticate, login, logout

from django.contrib.auth.models import User
from .forms import LoginForm
from django.contrib.auth.decorators import login_required

from django.http import HttpResponse

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

	return render(request,'briscola/index.html', context)
def moreAboutBriscola(request):
	return render(request,'briscola/moreAboutBriscola.html', {'victim':'happy people'})

@login_required(login_url='index')
def play(request):
	return render(request,'briscola/playPage.html', {'victim':'happy people'})
def logoutUser(request):
    logout(request)
    return HttpResponseRedirect(reverse('index'))
