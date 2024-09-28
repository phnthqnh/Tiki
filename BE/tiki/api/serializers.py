from rest_framework import serializers
from .models import *

class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(max_length=50, write_only=True)

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            raise serializers.ValidationError('Email và mật khẩu là bắt buộc.')

        # Không cần tạo đối tượng User ở đây
        return data  # Trả về dữ liệu đã xác thực
    
    # class Meta:
    #     model = UserAccount
    #     fields = ['username', 'email']  # Hoặc thêm các trường cần thiết khác



class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAccount
        fields = ['username', 'password', 'email']

    def create(self, validated_data):
        # Tạo người dùng mới và lưu vào cơ sở dữ liệu
        user = UserAccount.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
            email=validated_data['email'],
        )
        return user
    
class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Mật khẩu cũ không đúng.")
        return value
    
# class OrderItemSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = OrderItem
#         fields = ['book', 'quantity']


class OrderSerializer(serializers.ModelSerializer):
    # Chấp nhận books dưới dạng danh sách {
        #     {"id": 9, "quantity": 2},
        #     {"id": 10, "quantity": 1}
        # ]
        # }
    

    books = serializers.ListField(write_only=True)

    class Meta:
        model = Order
        fields = ['user', 'hovaten', 'sdt', 'email', 'tinh', 'huyen', 'diachi', 'magiamgia', 'tongtien', 'books']

    def create(self, validated_data):
        # Lấy danh sách ID sách và xóa khỏi dữ liệu validated_data để tạo Order
        books_data = validated_data.pop('books')

        # Tạo Order trước
        order = Order.objects.create(**validated_data)

        # Duyệt qua danh sách ID sách để tạo OrderItem
        for book_item  in books_data:
            book_id = book_item.get('id')
            # Lấy đối tượng Book từ ID
            quantity = book_item .get('quantity', 1)
            try:
                book = Book.objects.get(id=book_id)
                # thêm sách vào order = Order.objects.create(**validated_data) đã tạo trước đó
                order.books.add(book)

            except Book.DoesNotExist:
                raise serializers.ValidationError(f"Sách với ID {book_id} không tồn tại")

            # Tạo OrderItem với số lượng mặc định là 1
            OrderItem.objects.create(order=order, book=book, quantity=quantity)

        return order



class CartSerializer(serializers.ModelSerializer):
    class Meta:
        model = CartOrder
        fields = ['user', 'books']  # Hoặc thêm các trường cần thiết khác


class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = ['base_url', 'is_gallery', 'label', 'large_url', 'medium_url', 'small_url', 'thumbnail_url']

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['name']

class SellerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Seller
        fields = ['name']

class BookSerializer(serializers.ModelSerializer):
    images = ImageSerializer(many=True, read_only=True)
    categories = CategorySerializer(read_only=True)
    current_seller = SellerSerializer(read_only=True)

    class Meta:
        model = Book
        fields = '__all__'  # Or specify the fields you want to include