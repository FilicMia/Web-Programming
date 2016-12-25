from django.shortcuts import render_to_response, get_object_or_404
from django.shortcuts import render
from django.http import HttpResponseRedirect
from django.urls import reverse
from django.template import RequestContext

from django.contrib.auth import authenticate, login, logout

from .models import Article
from django.contrib.auth.models import User
from .forms import LoginForm

from django.http import HttpResponse

# Create your views here.

def index(request):
  context = {}
  articles = Article.objects.order_by('-pub_date')[:5]

  if request.method=='POST':
    form = LoginForm(request.POST)
    if form.is_valid():
       user = authenticate(username=form.cleaned_data['username'], password=form.cleaned_data['password'] )
       if user is not None:
         context['uuu'] = user.username
         login(request, user)

  context['users'] = User.objects.all()
  context['articles'] = articles
  context['loginForm'] = LoginForm()
 #<!--Extensions must be rendered-->
  return render(request, 'friws/extension.html', context)

def hello(request):
      name = "Mia"
      html = "<html><body>Hi %s this seems to work.</body></html>" % name
      return render(request, 'friws/base2.html', {"html": html})
def logout_user(request):
    logout(request)
    return HttpResponseRedirect(reverse('index'))

def extension(request):
    return render_to_response('friws/index.html', RequestContext(request))
