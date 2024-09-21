from django.urls import include, path

from web.views import HomeView

app_name = "web"
urlpatterns = [
    path("home/", HomeView.as_view(), name="home"),
    path("", include("web.auth.urls", namespace="auth")),
]
