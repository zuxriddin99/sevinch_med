from django.urls import include, path

from web.clients.views import AuthView, ClientsListAPIView, ClientListView

app_name = "clients"
urlpatterns = [
    path("list/api/", ClientsListAPIView.as_view(), name="list-api"),
    path("list/", ClientListView.as_view(), name="list"),
]
