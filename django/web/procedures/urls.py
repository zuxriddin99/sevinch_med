from django.urls import include, path

from web.procedures.views import ProcedureListAPIView, ProcedureListView, ReferralPersonCreateAPIView

app_name = "procedures"
urlpatterns = [
    path("", ProcedureListView.as_view(), name="list"),
    path("list/api/", ProcedureListAPIView.as_view(), name="list-api"),
    path("create/", ReferralPersonCreateAPIView.as_view(), name="create"),
]
