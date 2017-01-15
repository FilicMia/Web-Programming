import re
from django import forms
from django.contrib.auth.models import User
from .models import Comment
from django.utils.translation import ugettext_lazy as _

"""
Class representing the login form.
@item username
@item password
"""
class LoginForm(forms.Form):
  username = forms.CharField(label='Username:', max_length=100)
  password = forms.CharField(label='Password',max_length=100, widget=forms.PasswordInput)

"""
Class representing the registration form.
It contains self defined check method.

@item username username of the user
@item email e-mail of the user
@item password1 password set from the new user.
@item password2 password check
@item randNum identicates if the new user will be added to the group AddComment or not
"""
class RegistrationForm(forms.Form):

    username = forms.RegexField(regex=r'^\w+$', widget=forms.TextInput(attrs=dict(required=True, max_length=30)), label=_("Username"), error_messages={ 'invalid': _("This value must contain only letters, numbers and underscores.") })
    email = forms.EmailField(widget=forms.TextInput(attrs=dict(required=True, max_length=30)), label=_("Email address"))
    password1 = forms.CharField(widget=forms.PasswordInput(attrs=dict(required=True, max_length=30, render_value=False)), label=_("Password"))
    password2 = forms.CharField(widget=forms.PasswordInput(attrs=dict(required=True, max_length=30, render_value=False)), label=_("Password (again)"))
    randNumber = forms.IntegerField(widget=forms.NumberInput(attrs=dict(required=True, max_length=1)) ,label=_("Random number (0-9)"), error_messages={ 'invalid': _("This number is just one integer. Please provide one such a number. Do not be afraid! :D") })
    #server validation of data
    def clean_username(self):
        """
        Checks if the username already exists in the database.
        """
        try:
            user = User.objects.get(username__iexact=self.cleaned_data['username'])
        except User.DoesNotExist:
            return self.cleaned_data['username']
        raise forms.ValidationError(_("The username already exists. Please try another one."))

    def clean(self):
        """
        Checks if the password1 and password2 are the same.
        """
        if 'password1' in self.cleaned_data and 'password2' in self.cleaned_data:
            if self.cleaned_data['password1'] != self.cleaned_data['password2']:
                raise forms.ValidationError(_("The two password fields did not match."))
        return self.cleaned_data

"""
Form for editing the comment. It contains only the textual field for
editing the comment.
"""
class EditCommentForm(forms.ModelForm):
  class Meta:
    model = Comment
    fields = ['comment']
