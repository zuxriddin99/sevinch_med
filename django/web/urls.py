from django.urls import include, path

from web.views import TestView

app_name = "web"
urlpatterns = [
    path("auth/", include("web.auth.urls", namespace="auth")),
    path("", TestView.as_view(), name="test"),
]
