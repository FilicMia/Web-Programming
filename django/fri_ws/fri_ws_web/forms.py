from django import forms
from .models import Article

class LoginForm(forms.Form):
  username = forms.CharField(label='Username', max_length=100)
  password = forms.CharField(max_length=100, widget=forms.PasswordInput)

class EditArticleForm(forms.ModelForm):
  class Meta:
    model = Article
    fields = ['title', 'content', 'pub_date']
#  title = forms.CharField(label='Title', max_length=100)
#  content = forms.CharField(label='Content')
#  pub_date = forms.DateTimeField(label='Publish date')
