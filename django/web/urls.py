from django.urls import include, path

from web.views import HomeView

app_name = "web"
urlpatterns = [
    path("clients/", include("web.clients.urls", namespace="clients")),
    path("referrals/", include("web.referrals.urls", namespace="referrals")),
    path("procedures/", include("web.procedures.urls", namespace="procedures")),
    path("home/", HomeView.as_view(), name="home"),
    path("", include("web.auth.urls", namespace="auth")),
]
