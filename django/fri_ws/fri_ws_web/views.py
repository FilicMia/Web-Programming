from django.shortcuts import render
from django.http import HttpResponseRedirect
from django.urls import reverse

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required, permission_required

import sys

from .models import Article, Comment
from .forms import LoginForm, EditArticleForm

# Create your views here.

app_name = 'fri_ws_web'
def index(request):
  context = {'loginForm':LoginForm()}
  article_list = Article.objects.order_by('-pub_date')[:5]
  context['articles'] = article_list
  
  if request.method=='POST':
    form = LoginForm(request.POST)
    if form.is_valid():
      user = authenticate(username=form.cleaned_data['username'], password=form.cleaned_data['password'])
      if user is not None:
        login(request, user)
      #  context['username'] = user
      #context['username'] = form.cleaned_data['username']
  else:
    form = LoginForm()
  context['loginForm'] = form
  #sys.stderr.write(context['user'])
  return render(request, 'fri_ws_web/index.html', context)


def logout_user(request):
  logout(request)
  return HttpResponseRedirect(reverse('index'))

def article_view(request, article_id):
  context = {'loginForm':LoginForm()}
  
  article = Article.objects.get(pk=article_id)
  context['article'] = article
  
  return render(request, 'fri_ws_web/article_view.html', context)

@permission_required('fri_ws_web.edit_article')
def article_edit(request, article_id):
  context = {'loginForm':LoginForm()}
  article = Article.objects.get(pk=article_id)
  eaform = EditArticleForm(instance=article)
  
  if request.method=='POST':
    eaform = EditArticleForm(request.POST, instance=article)
    if eaform.is_valid():
      eaform.save()
      return HttpResponseRedirect(reverse('index'))
      
  context['article'] = article
  context['edit_article_form'] = eaform

  return render(request, 'fri_ws_web/article_edit.html', context)
