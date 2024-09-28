from django.urls import path
from .views import *

urlpatterns = [
    path('search/', search, name='search'),
    path('book/<int:pk>/', book_detail, name='book_detail'),
    path('register/', register, name='register'),
    path('login/', login, name='login'),
    path('cart/<str:un>/', get_user_cart, name='get_user_cart'),
    path('cart/<str:un>/add/', add_book_to_cart, name='add_book_to_cart'),
    path('cart/<str:un>/remove/', remove_book_from_cart, name='remove_book_from_cart'),
    path('cart/<str:un>/update/', update_book_quantity, name='update_book_quantity'),
    path('cart/<str:un>/total/', get_total_book_type, name='get_total_book_type'),
    path('myorder/add/', add_order, name='add_order'),
    path('myorder/<str:mvd>/cancel/', cancel_order, name='cancel_order'),
    path('myorder/<str:mvd>/', get_order, name='get_order'),  # Thêm đường dẫn mới
    path('myorder/<str:un>/all/', get_all_order, name='get_all_order'), 
    path('profile/<str:un>/', get_profile, name='add_order'),
    path('profile/<str:un>/update/', update_profile, name='update_profile'),
    path('profile/<str:un>/change_password/', change_password, name='change_password'),
]