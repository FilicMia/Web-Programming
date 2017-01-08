from __future__ import unicode_literals

from django.db import models
from django.contrib.auth.models import User
from datetime import datetime

# Create your models here.

class Measurement(models.Model):
  temperature = models.FloatField('in degrees C')
  humidity = models.FloatField('in percent')

class Article(models.Model):
  title = models.CharField(max_length=100, default='')
  content = models.TextField()
  pub_date = models.DateTimeField('date published', default=datetime.now)
  author = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
  
  class Meta:
    permissions = (
      ('edit_article', 'Can edit the article'),
    )

class Comment(models.Model):
  comment = models.TextField()
  pub_date = models.DateTimeField('date published')
  article = models.ForeignKey(Article, on_delete=models.CASCADE, null=True)
  author = models.ForeignKey(User, on_delete=models.CASCADE)
  
