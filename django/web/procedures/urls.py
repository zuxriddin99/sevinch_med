from django.urls import include, path

from web.procedures.views import ProcedureListAPIView, ProcedureListView, ReferralPersonCreateAPIView, \
    ProcedureTypeListAPIView

app_name = "procedures"
urlpatterns = [
    path("", ProcedureListView.as_view(), name="list"),
    path("list/api/", ProcedureListAPIView.as_view(), name="list-api"),
    path("type-list/api/", ProcedureTypeListAPIView.as_view(), name="type-list-api"),
    path("create/", ReferralPersonCreateAPIView.as_view(), name="create"),
]
