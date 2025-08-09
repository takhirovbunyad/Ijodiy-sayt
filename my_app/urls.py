from django.urls import path
from my_app import views

urlpatterns = [
    path('' , views.main , name = "main_page") ,
    path('load_more_cards/', views.load_more_cards, name='load_more_cards'),
    path('repairing/' , views.rep , name = 'repairing') ,
    path('sher/', views.sherlar_royxati, name='sherlar_royxati'),
    path('sher/<int:pk>/', views.sher_detail, name='sher_detail'),
    path('books/', views.books_page, name='books_page'),
]
