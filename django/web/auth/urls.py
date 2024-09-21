from django.urls import include, path

from web.auth.views import AuthView

app_name = "auth"
urlpatterns = [
    path("", AuthView.as_view(), name="login"),
]
