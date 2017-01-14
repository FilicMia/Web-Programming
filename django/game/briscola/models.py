from __future__ import unicode_literals
from django.db import models
##import user
from django.contrib.auth.models import User
from django.utils import timezone

# Create your models here.
class Comment(models.Model):
  comment = models.TextField()
  pub_date = models.DateTimeField( default=timezone.now )
  author = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
  class Meta:
    permissions = (
      ('edit_comment', 'Can edit the comment'),
     ('create_comment', 'Can create the comment'),
    )

  def __unicode__(self):              # __unicode__ on Python 2
      return self.comment
