from django.urls import path
from .views import *

urlpatterns = [
    path('search/', search, name='search'),
    path('book/<int:pk>/', book_detail, name='book_detail'),
    path('admin/book/', get_all_books, name='get_all_books'),
    path('admin/book/create', create_book, name='create_book'),
    path('admin/book/<int:pk>/update', update_book, name='update_book'),
    path('admin/book/<int:pk>/delete', delete_book, name='delete_book'),
    path('admin/seller/', get_all_seller, name='get_all_seller'),
    path('admin/seller/create', create_seller, name='create_seller'),
    path('admin/seller/<int:pk>/update', update_seller, name='update_seller'),
    path('admin/seller/<int:pk>/delete', delete_seller, name='delete_seller'),
    # path('category/', get_all_category, name='get_all_category'),
    # path('category/<int:pk>/update', update_category, name='update_category'),
    # path('category/<int:pk>/delete', delete_category, name='delete_category'),
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