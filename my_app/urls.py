from django.urls import path
from my_app import views

urlpatterns = [
    path('' , views.main , name = "main_page") ,
    path('dash/', views.first, name='dash_page'),    path('load_more_cards/', views.load_more_cards, name='load_more_cards'),
    path('repairing/' , views.rep , name = 'repairing') ,
    path('sher/', views.sherlar_royxati, name='sherlar_royxati'),
    path('books/', views.books_page, name='books_page'),
    path('api/books/<int:pk>/', views.book_detail_api, name='book_detail_api'),
    path('philosophy/', views.philosophy_view, name='philosophy_list'),
    path("search/", views.search_page, name="search_page"),
    path("search-results/", views.search_results, name="search_results"),
    path('search-api/', views.search_api, name='search_api'),
    path("dash/<int:pk>/", views.dash_detail_page, name="dash_detail_page"),
    path("dash/<int:pk>/json/", views.dash_detail_json, name="dash_detail_json"),
    path("sher/<int:pk>/", views.sher_detail_page, name="sher_detail_page"),
    path("sher/<int:pk>/json/", views.sher_detail_json, name="sher_detail_json"),
    path("philosophy/<int:pk>/", views.philosophy_detail_page, name="philosophy_detail_page"),
    path("philosophy/<int:pk>/json/", views.philosophy_detail_json, name="philosophy_detail_json"),
    path("books/<int:pk>/", views.book_detail_page, name="book_detail_page"),
    path("books/<int:pk>/json/", views.book_detail_json, name="book_detail_json"),
    path("books/file/<int:pk>/", views.book_file_view, name="book_file"),
    path('logout/', views.logout_view , name='logout'),
    path('contact/', views.contact_view, name='contact'),

]
