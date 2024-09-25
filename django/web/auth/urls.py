from django.urls import include, path
from django.contrib.auth.views import LogoutView

from web.auth.views import AuthView, logout_view

app_name = "auth"
urlpatterns = [
    path("", AuthView.as_view(), name="login"),
    path("logout/", logout_view, name="log-out"),
]
