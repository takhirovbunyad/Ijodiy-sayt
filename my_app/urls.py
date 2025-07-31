from django.urls import path
from .views import first, main, load_more_cards , rep , sher_detail , sherlar_royxati

urlpatterns = [
    path('' , first , name = 'dashboard') ,
    path('main/' , main , name = "main_page") ,
    path('load_more_cards/', load_more_cards, name='load_more_cards'),
    path('repairing/' , rep , name = 'repairing') ,
    path('sher/', sherlar_royxati, name='sherlar_royxati'),
    path('sher/<int:pk>/', sher_detail, name='sher_detail'),
]
