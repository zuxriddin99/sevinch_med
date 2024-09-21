from rest_framework import mixins, viewsets
from rest_framework.serializers import Serializer
from django.views import generic


class HomeView(generic.TemplateView):
    template_name = 'index.html'
