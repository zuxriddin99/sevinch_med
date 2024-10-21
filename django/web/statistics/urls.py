from django.urls import include, path

from web.statistics.views import StatisticsListAPIView, StatisticView

app_name = "statistics"
urlpatterns = [
    path("list/api/", StatisticsListAPIView.as_view(), name="list-api"),
    path("", StatisticView.as_view(), name="list"),
]
