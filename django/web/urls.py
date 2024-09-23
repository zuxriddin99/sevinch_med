from django.urls import include, path

from web.views import HomeView

app_name = "web"
urlpatterns = [
    path("clients/", include("web.clients.urls", namespace="clients")),
    path("home/", HomeView.as_view(), name="home"),
    path("", include("web.auth.urls", namespace="auth")),
]
