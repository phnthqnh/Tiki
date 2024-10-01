from django.urls import path
from .views import *

urlpatterns = [
    path('search/', search, name='search'),
    path('book/<int:pk>/', book_detail, name='book_detail'),
    path('ad/book/', get_all_books, name='get_all_books'),
    path('ad/book/create/', create_book, name='create_book'),
    path('ad/book/<int:pk>/update/', update_book, name='update_book'),
    path('ad/book/<int:pk>/delete/', delete_book, name='delete_book'),
    path('ad/seller/', get_all_seller, name='get_all_seller'),
    path('ad/seller/create', create_seller, name='create_seller'),
    path('ad/seller/<int:pk>/update/', update_seller, name='update_seller'),
    path('ad/seller/<int:pk>/delete/', delete_seller, name='delete_seller'), 
    path('ad/all_order/', all_order, name='all_order'),
    path('ad/update_order/<str:mvd>/', update_order, name='update_order'),
    # Xem, them, sua, xoa danh sach the loai
    path('ad/categories/', category_list, name='get_categories_list'),
    path('ad/add_category/', add_category, name='add_category'),
    path('ad/update_category/<int:category_id>/', update_category, name='update_category'),
    path('ad/delete_category/<int:category_id>/', delete_category, name='delete_category'),
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