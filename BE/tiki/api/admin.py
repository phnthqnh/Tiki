from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from .models import *
# Register your models here.

class UserAccountAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'is_active', 'is_staff')  # Hiển thị các trường này trong danh sách
    search_fields = ('username', 'email')  # Cho phép tìm kiếm theo username và email
    actions = ['delete_user']

    def delete_user(self, request, queryset):
        for user_account in queryset:
            # Xóa CartOrder liên quan trước
            CartOrder.objects.filter(user=user_account).delete()
            user_account.delete()
        self.message_user(request, _("Selected users have been deleted."))

    delete_user.short_description = _("Delete selected users and their carts")

admin.site.register(UserAccount, UserAccountAdmin)

admin.site.register(Category)
admin.site.register(Seller)
admin.site.register(Image)
admin.site.register(Book)

class OrderAdmin(admin.ModelAdmin):
    list_display = ['tracking_number', 'user', 'tongtien', 'status']
    list_filter= ['user', 'status']
    search_fields = ['tracking_number', 'user__username']  # Cho phép tìm kiếm theo tracking_number và username của user
admin.site.register(Order, OrderAdmin)

class OrderItemAdmin(admin.ModelAdmin):
    list_display = ['order', 'book', 'quantity']
    list_filter= ['order']
    search_fields = ['order']
admin.site.register(OrderItem, OrderItemAdmin)

# class CartOrderAdmin(admin.ModelAdmin):
#     list_display = ['user', 'books']  # Hiển thị các trường này trong danh sách
#     # search_fields = ('user')
admin.site.register(CartOrder)

class CartOrderItemAdmin(admin.ModelAdmin):
    list_display = ('cart_order', 'book', 'quantity') 
    search_fields = ('cart_order', 'book')  

admin.site.register(CartOrderItem, CartOrderItemAdmin)
