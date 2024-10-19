from django.urls import include, path

from web.clients.views import ClientsListAPIView, ClientListView, ClientCreateAPIView, ClientDetailAPIView

app_name = "clients"
urlpatterns = [
    path("list/api/", ClientsListAPIView.as_view(), name="list-api"),
    path("create/api/", ClientCreateAPIView.as_view(), name="create-api"),
    path("<int:pk>/get/api/", ClientDetailAPIView.as_view(), name="get-api"),
    path("list/", ClientListView.as_view(), name="list"),
]
