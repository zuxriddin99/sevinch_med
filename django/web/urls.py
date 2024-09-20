from django.urls import include, path

app_name = "web"
urlpatterns = [
    path("auth/", include("web.auth.urls", namespace="auth")),
]
