from django.test import TestCase
from briscola.models import *
from django.contrib.auth.models import User,Permission
from .forms import *

class SaveCommentTestCase(TestCase):
    def setUp(self):
        user = User.objects.create_user(
        username="Dani",
        password="Dani",
        email="dani@kkk.com")
        Comment.objects.all().delete()
        Comment.objects.create(comment = "Lijep dan.", author = user)

    def test_if_saved_Good(self):

        user = User.objects.get(username="Dani")
        comment = Comment.objects.get(comment = "Lijep dan.")
        self.assertEqual(comment.author, user)

class TestRegisterForm(TestCase):

    def test(self):
        username="Dani"
        password="Dani"
        email="dani@kkk.com"
        form_data = {'username': username, 'password1': password }
        form = RegistrationForm(data=form_data)
        self.assertFalse(form.is_valid())

class TestRegisterWithTheSameUsername(TestCase):
    def setUp(self):
        user = User.objects.create_user(
        username="Dani",
        password="Dani",
        email="dani@kkk.com")

    def test_login(self):
        username="Dani"
        password="Dani"
        email="dani@kkk.com"
        response = self.client.post("/register/", {'username': username,'password1': "k", 'password2': "k", 'email': email, 'rand': 8})
        self.assertFormError(response, 'registrationForm', 'username', "The username already exists. Please try another one.")

class TestrRegistrationFormIsValid(TestCase):

    def test(self):
        username="Dani"
        password="Dani"
        email="dani"
        form_data = {'username': username,'password1': "k", 'password2': "k", 'email': email, 'rand': 8}
        form = RegistrationForm(data=form_data)
        self.assertFalse(form.is_valid())

class TestLoginFormIsValid(TestCase):

    def test(self):
        username="Dani"
        password="Dani"
        email="dani@kkk.com"
        form_data = {'username': username, 'password': password }
        form = LoginForm(data=form_data)
        self.assertTrue(form.is_valid())
