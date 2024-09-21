from django.contrib import messages
from django.contrib.auth import authenticate, login
from django.shortcuts import render, redirect
from django.views import generic
from gunicorn.config import User

from web.auth import forms


class AuthView(generic.View):
    model = User
    template_name = "auth/login.html"

    def post(self, request, *args, **kwargs):
        form = forms.AuthForm(data=request.POST)

        if not form.is_valid():
            print(form.errors)
            messages.error(request, "So'rov yuborishda xaolik yuz berda. Dasturchi bilan bog'laning.")
            return redirect("web:auth:login", )

        username = form.cleaned_data['username']
        password = form.cleaned_data['password']
        remember_me = form.cleaned_data['remember_me']
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            if remember_me:
                request.session.set_expiry(1209600)  # 2 weeks
            else:
                request.session.set_expiry(0)  # Expires when browser is closed
            return redirect('web:home')
        else:
            messages.error(request, "Foydalanuvchi nomi yoki parol noto'g'ri")
            return render(request, "auth/login.html",
                          {"username": username, "password": password})

    def get(self, request, *args, **kwargs):
        return render(request, "auth/login.html", )
