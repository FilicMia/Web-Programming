from django.conf.urls import url

from . import views

urlpatterns = [
	url(r'^$', views.index, name='index'),
	url(r'^hello/', views.hello),
	url(r'^logout/',views.logout_user,name="logout"),
	url(r'^extension/', views.extension, name="extension"),
]