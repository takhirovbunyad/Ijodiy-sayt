from django.urls import path
from . import views

urlpatterns = [
    path("register/", views.register, name="register"),
    path("verify/", views.verify_email, name="verify_email"),
    path("login/", views.login_view, name="login"),
    path('hisobim/', views.hisobim_view, name='hisobim'),
    path('change-password/', views.change_password_view, name='change_password'),
]
