from __future__ import unicode_literals

from django.db import models
##import user
from django.contrib.auth.models import User
from datetime import datetime

# Create your models here.
class Article(models.Model):
    title = models.TextField(max_length=254, default = '')
    content = models.TextField()
    pub_date = models.DateTimeField( default=datetime.now )
    author = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    def __unicode__(self):              # __unicode__ on Python 2
        return self.title

class Comment(models.Model):
  comment = models.TextField()
  color = models.CharField(max_length=10, null=True)
  pub_date = models.DateTimeField( default=datetime.now )
  article = models.ForeignKey( Article, on_delete=models.CASCADE )
  author = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
  def __unicode__(self):              # __unicode__ on Python 2
      return self.comment
