from django.shortcuts import render
from django.http import HttpResponseRedirect
from django.urls import reverse

from django.contrib.auth import authenticate, login, logout

from .models import Article
from .forms import LoginForm

# Create your views here.

def index(request):
  context = {}
  articles = Article.objects.order_by('-pub_date')[:5]
 
  if request.method=='POST':
    form = LoginForm(request.POST)
   # if form.is_valid():
    #  user = authenticate(username=form.cleaned_data['username'], password=form.cleaned_data['password'] )
     # if user is not None:
      #  login(request, user)
  
  context['articles'] = articles
  context['loginForm'] = LoginForm()

  return render(request, 'friws/index.html', context)


