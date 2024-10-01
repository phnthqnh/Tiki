from typing import Iterable
from django.db import models
from django.core.exceptions import ValidationError
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.contrib.auth import get_user_model

class UserAccountManager(BaseUserManager):
    # Tạo người dùng thông thường
    def create_user(self, email, username, password=None, **extra_fields):
        if not email:
            raise ValueError('Người dùng phải có một địa chỉ email')
        email = self.normalize_email(email)
        user = self.model(email=email, username=username, **extra_fields)
        user.set_password(password)  # Mã hóa mật khẩu
        user.save(using=self._db)
        return user

    # Tạo người dùng quản trị
    def create_superuser(self, email, username, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, username, password, **extra_fields)
    
     # Tùy chỉnh hàm authenticate
    def authenticate(self, request, email=None, password=None, **kwargs):
        User = get_user_model()  # Lấy mô hình người dùng hiện tại
        try:
            user = User.objects.get(email=email)  # Sử dụng User.objects thay vì self.get_queryset()
        except User.DoesNotExist:
            return None
        if user.check_password(password):
            return user
        return None

class UserAccount(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(max_length=255, unique=True)
    username = models.CharField(max_length=255, unique=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)  # Cho phép người dùng truy cập vào Django admin

    # Trường mà Django sẽ sử dụng để xác định danh tính người dùng
    USERNAME_FIELD = 'email'  # Bạn có thể chọn 'email' nếu muốn đăng nhập bằng email
    REQUIRED_FIELDS = ['username']  # Những trường bắt buộc khi tạo superuser

    # Trình quản lý cho mô hình này
    objects = UserAccountManager()

    def __str__(self):
        return self.username
    
    def save(self, *args, **kwargs):
        # tao role tu dong khi tao moi project
        super(UserAccount, self).save(*args, **kwargs)
        try:
            cart= CartOrder.objects.get(user= self)
        except:
            cart= CartOrder.objects.create(user= self)
            cart.save()


# @receiver(post_save, sender=UserAccount)
# def create_cart_for_user(sender, instance, created, **kwargs):
#     if created:
#         CartOrder.objects.create(user=instance)

class CartOrder(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(UserAccount, on_delete=models.CASCADE, null=True, blank=True)
    books = models.ManyToManyField('Book', blank=True)
    def __str__(self):
        return f"Cart of {self.user.username}"
    
    def total_book_type(self):
        return self.books.count()
    
    # def get_items(self):
    #     # Lấy danh sách book 
    #     return self.cartorderitem_set.all()
    

class CartOrderItem(models.Model):
    cart_order = models.ForeignKey(CartOrder, on_delete=models.CASCADE)  # Liên kết tới giỏ hàng
    book = models.ForeignKey('Book', on_delete=models.CASCADE)  # Liên kết tới sách
    quantity = models.PositiveIntegerField(default=1)  # Số lượng của cuốn sách trong giỏ hàng

    def __str__(self):
        return f"{self.quantity} of {self.book.name} in {self.cart_order}"
        
    def clean(self):
        # Kiểm tra xem giỏ hàng của user này đã có sách này chưa
        if self.book not in self.cart_order.books.all():
            raise ValidationError("Sách này không có trong giỏ hàng của user này")



class Category(models.Model):
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class Seller(models.Model):
    id = models.IntegerField(primary_key=True)
    name = models.CharField(max_length=255)
    def __str__(self):
        return self.name


class Image(models.Model): # ảnh của book
    name = models.CharField(max_length=5000, blank=True, null=True) # tên của book 
    base_url = models.URLField()
    is_gallery = models.BooleanField(default=True)
    label = models.CharField(max_length=255, null=True, blank=True)
    large_url = models.URLField()
    medium_url = models.URLField()
    small_url = models.URLField()
    thumbnail_url = models.URLField()

    def __str__(self):
        return self.name

class Book(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=5000)
    author = models.CharField(max_length=255, null=True, blank=True)
    description = models.TextField()
    short_description = models.TextField()
    # thêm số lượng trong kho
    quantity_in_stock = models.PositiveIntegerField(default=0)
    list_price = models.IntegerField(null=True, blank=True)
    price = models.IntegerField()
    original_price = models.IntegerField()
    rating_average = models.DecimalField(max_digits=3, decimal_places=2)
    book_cover = models.FileField(upload_to='book_covers/', null=True, blank=True) #Đổi kiểu dữ liệu của book_cover thành FileField (Tác dụng tương tự như ImageField)
    categories = models.ForeignKey(Category, on_delete=models.CASCADE)
    current_seller = models.ForeignKey(Seller, on_delete=models.CASCADE)
    images = models.ManyToManyField(Image)
    loai_bia = models.CharField(max_length=255, null=True, blank=True)
    isbn13 = models.CharField(max_length=255, null=True, blank=True)
    edition= models.CharField(max_length=255, null=True, blank=True)
    quantity_sold = models.CharField(max_length=255, default='0')
    publisher_vn = models.TextField(blank=True, null=True)
    publication_date = models.DateField(blank=True, null=True)
    dimensions = models.TextField(blank=True, null=True)
    manufacturer = models.TextField(blank=True, null=True)
    dich_gia = models.TextField(blank=True, null=True)
    number_of_page = models.CharField(max_length=255,blank=True, null=True)
    is_hidden = models.BooleanField(default=False)
    percent = models.DecimalField(max_digits=5, decimal_places=2, default=0)  # Increased max_digits for safety

    def __str__(self):
        return self.name

    def cal_percent(self):
        if self.original_price > 0:
            return round((1 - (self.price / self.original_price)) * 100, 2)
        return 0

    # def clean(self):
    #     # Additional validation before saving
    #     if self.list_price < 0 or self.price < 0:
    #         raise ValidationError('Price values must be non-negative.')

    def save(self, *args, **kwargs):
        self.clean()  # Ensure data validation
        self.percent = self.cal_percent()
        super().save(*args, **kwargs)

import random
import string
class Order(models.Model):
    STATUS_CHOICES = [
        ("Đang chờ xác nhận", 'Đang chờ xác nhận'),  # Trạng thái mặc định
        ("Đang chuẩn bị hàng", 'Đang chuẩn bị hàng'),
        ("Đang giao hàng", 'Đang giao hàng'),
        ("Giao thành công", 'Giao thành công'),
        ("Bị hủy", 'Bị hủy'),
    ]

    tracking_number = models.CharField(max_length=10, unique=True, editable=False)
    user = models.ForeignKey(UserAccount, on_delete=models.CASCADE)  # Liên kết với người dùng
    books = models.ManyToManyField(Book, blank=True)  # Nhiều sách trong đơn hàng
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Đang chờ xác nhận')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    hovaten = models.CharField(max_length=200)
    sdt = models.CharField(max_length=12)
    email = models.EmailField(max_length=255)
    tinh = models.CharField(max_length=255)
    huyen = models.CharField(max_length=255)
    diachi = models.CharField(max_length=255)
    magiamgia = models.CharField(max_length=20, null=True, blank=True)
    tongtien = models.FloatField(default=0.0)

    def __str__(self):
        return self.tracking_number
    
    def save(self, *args, **kwargs):
        if not self.tracking_number:
            self.tracking_number = self.generate_tracking_number()
        super().save(*args, **kwargs)

    def generate_tracking_number(self):
        return ''.join(random.choices(string.digits, k=10)) 


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    def clean(self):
        # Kiểm tra xem giỏ hàng của user này đã có sách này chưa
        if self.book not in self.order.books.all():
            raise ValidationError("Sách này không có trong giỏ hàng của user này")