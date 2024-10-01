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
        fields = ['username', 'password', 'email', 'is_staff']

    def create(self, validated_data):
        # Tạo người dùng mới và lưu vào cơ sở dữ liệu
        user = UserAccount.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
            email=validated_data['email'],
            is_staff=validated_data['is_staff'],
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
    
class OrderAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ['status']




class CartSerializer(serializers.ModelSerializer):
    class Meta:
        model = CartOrder
        fields = ['user', 'books']  # Hoặc thêm các trường cần thiết khác


class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = ['base_url', 'name', 'is_gallery', 'label', 'large_url', 'medium_url', 'small_url', 'thumbnail_url']

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['name']

class SellerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Seller
        fields = ['name']

class BookSerializer(serializers.ModelSerializer):
    images = ImageSerializer(many=True)
    categories = CategorySerializer(read_only=True)
    current_seller = SellerSerializer(read_only=True)

    class Meta:
        model = Book
        fields = '__all__'  # Or specify the fields you want to include


    def create(self, validated_data):
        images_data = validated_data.pop('images', [])
        # Tạo đối tượng Book
        book = Book.objects.create(**validated_data)

        # Tạo và liên kết các hình ảnh với đối tượng Book
        images = []
        for image_data in images_data:
            image = Image.objects.create(
                base_url=image_data.get('base_url'),
                large_url=image_data.get('large_url'),
                medium_url=image_data.get('medium_url'),
                small_url=image_data.get('small_url'),
                thumbnail_url=image_data.get('thumbnail_url'),
                is_gallery=image_data.get('is_gallery', True),
                label=image_data.get('label', None),
                name=book.name  # Cập nhật tên hình ảnh bằng tên sách
            )
            images.append(image)
                
        book.images.set(images)  # Thêm hình ảnh vào sách

        book.save()  # Lưu lại sách
        return book

    def update(self, instance, validated_data):
        images_data = validated_data.pop('images', [])

        instance.name = validated_data.get('name', instance.name)
        instance.author = validated_data.get('author', instance.author)
        instance.description = validated_data.get('description', instance.description)
        instance.short_description = validated_data.get('short_description', instance.short_description)
        instance.quantity_in_stock = validated_data.get('quantity_in_stock', instance.quantity_in_stock)
        instance.list_price = validated_data.get('list_price', instance.list_price)
        instance.price = validated_data.get('price', instance.price)
        instance.original_price = validated_data.get('original_price', instance.original_price)
        instance.rating_average = validated_data.get('rating_average', instance.rating_average)
        instance.book_cover = validated_data.get('book_cover', instance.book_cover)  # Nếu bạn cho phép cập nhật ảnh bìa
        instance.categories_id = validated_data.get('categories', instance.categories_id)
        instance.current_seller_id = validated_data.get('current_seller', instance.current_seller_id)


        # Xóa tất cả hình ảnh cũ
        instance.images.clear()
        images = []
        for image_data in images_data:
            image, created = Image.objects.update_or_create(
                base_url=image_data.get('base_url'),
                defaults={
                    'large_url': image_data.get('large_url'),
                    'medium_url': image_data.get('medium_url'),
                    'small_url': image_data.get('small_url'),
                    'thumbnail_url': image_data.get('thumbnail_url'),
                    'is_gallery': image_data.get('is_gallery', True),
                    'label': image_data.get('label', None),
                    'name': instance.name  # Cập nhật tên hình ảnh bằng tên sách
                }
            )
            images.append(image)  # Thêm hình ảnh vào danh sách tạm thời

        # Sử dụng `set()` để cập nhật danh sách hình ảnh cho đối tượng `instance`
        instance.images.set(images)
        instance.save()  # Lưu lại sách
        return instance

