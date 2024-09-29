from django.shortcuts import render, get_object_or_404
from .models import *
from rest_framework.response import Response
from .serializers import *
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.db.models import Q
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.pagination import PageNumberPagination

@api_view(['GET'])
def search(request):
    seller = request.GET.get('seller', None)
    category = request.GET.get('category', None)
    sort_price = request.GET.get('sort', None)
    vote = request.GET.get('vote', 0)
    query = request.GET.get('query', None)

    books = Book.objects.all()

    if query:
        books = books.filter(name__icontains=query)

    if seller:
        seller_names = seller.split(',')
        query = Q()
        for name in seller_names:
            query |= Q(current_seller__name__icontains=name.strip())
        books = books.filter(query)

    if category:
        books = books.filter(categories__name__icontains=category)

    if vote:
        books = books.filter(rating_average__gte=vote)

    if sort_price is not None:
        if sort_price.lower() == 'true':
            books = books.order_by('-current_seller__price')
        else:
            books = books.order_by('current_seller__price')

    # Phân trang
    paginator = Paginator(books, 10)  # Số sách trên một trang
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    serializer = BookSerializer(page_obj, many=True)

    return Response({
        'books': serializer.data,
        'total_pages': paginator.num_pages,
    })



@api_view(['GET'])
def book_detail(request, pk):
    try:
        book = Book.objects.get(pk=pk)
        serializer = BookSerializer(book)
        return Response(serializer.data)
    except Book.DoesNotExist:
        return Response({'error': 'Book not found'}, status=404)
    

@api_view(['GET'])
def get_all_books(request):
    try:
        # Lấy tất cả sách từ cơ sở dữ liệu
        books = Book.objects.all()
        paginator = PageNumberPagination()
        
        # Thiết lập số sách trên mỗi trang là 15
        paginator.page_size = 10
        
        # Phân trang dựa trên request
        result_page = paginator.paginate_queryset(books, request)
        
        # Chuyển đổi các đối tượng sách thành định dạng mong muốn
        r = []
        for book in result_page:
            serializer = BookSerializer(book)
            img = serializer.data['images'][0] if serializer.data['images'] else None
            b = {
                'id': book.id,
                'image': img['thumbnail_url'] if img else '',
                'name': book.name,
                'author': book.author,
                'original_price': book.original_price,
                'price': book.price,
                'quantity_sold': book.quantity_sold,
                'quantity_in_stock': book.quantity_in_stock,
            }
            r.append(b)
        
        # Trả về kết quả với tổng số trang
        return Response({
            'books': r,
            'total_pages': paginator.page.paginator.num_pages,
        }, status=200)
    
    except Book.DoesNotExist:
        return Response({'error': 'Book not found'}, status=404)


@api_view(['POST'])
def create_book(request):
    serializer = BookSerializer(data=request.data)
    if serializer.is_valid():
        categories = request.data['categories']
        current_seller = request.data['current_seller'] 

        if not categories or not current_seller:
            return Response({"error": "categories and current_seller are required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Lấy đối tượng Category và Seller từ ID
            category = Category.objects.get(id=categories['id'])
            seller = Seller.objects.get(id=current_seller['id'])
        except Category.DoesNotExist:
            return Response({"error": "Category not found."}, status=status.HTTP_400_BAD_REQUEST)
        except Seller.DoesNotExist:
            return Response({"error": "Seller not found."}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer.save(categories=category, current_seller=seller)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def update_book(request, pk):
    try:
        # Lấy user có username là `un`
        book = Book.objects.get(id=pk)

        # Cập nhật thông tin sách từ dữ liệu trong request
        serializer = BookSerializer(book, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    except Book.DoesNotExist:
        # Trả về lỗi nếu sách không tồn tại
        return Response({'error': 'Book not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        # Xử lý ngoại lệ chung khác và trả về lỗi 500
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['DELETE'])
def delete_book(request, pk):
    try:
        book = Book.objects.get(id=pk)
        # Xóa sách
        book.delete()
        # Trả về thông báo xóa thành công
        return Response({'detail': 'Book deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
    except Book.DoesNotExist:
        # Trả về l��i nếu sách không tồn tại
        return Response({'error': 'Book not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        # Xử lý ngoại lệ chung khác và trả về lỗi 500
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def get_all_seller(request):
    try:
        sellers = Seller.objects.all()
        r = []
        for seller in sellers:
            # serializer = SellerSerializer(seller)
            s = {
                'id': seller.id,
                'name': seller.name
            }
            r.append(s)
        return Response({"sellers": r}, status=200)
    except Book.DoesNotExist:
        return Response({'error': 'Seller not found'}, status=404)

@api_view(['POST'])
def create_seller(request):
    name = request.data.get('name')

    if not name:
        return Response({"error": "name is required."}, status=status.HTTP_400_BAD_REQUEST)


    serializer = SellerSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def update_seller(request, pk):
    try:
        # Lấy user có username là `un`
        seller = Seller.objects.get(id=pk)

        # Cập nhật thông tin sách từ dữ liệu trong request
        serializer = SellerSerializer(seller, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    except Seller.DoesNotExist:
        # Trả về lỗi nếu sách không tồn tại
        return Response({'error': 'Seller not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        # Xử lý ngoại lệ chung khác và trả về lỗi 500
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['DELETE'])
def delete_seller(request, pk):
    try:
        seller = Seller.objects.get(id=pk)
        # Xóa sách
        seller.delete()
        # Trả về thông báo xóa thành công
        return Response({'detail': 'Seller deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
    except Seller.DoesNotExist:
        # Trả về l��i nếu sách không tồn tại
        return Response({'error': 'Seller not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        # Xử lý ngoại lệ chung khác và trả về lỗi 500
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

@api_view(['GET'])
def all_order(request):
    try:
        orders = Order.objects.all()
        result = []
        for order in orders:
            order_item = OrderItem.objects.filter(order = order)
            items_data = [
                {
                    'id' : item.book.id,
                    'name': item.book.name,
                    'original_price': item.book.original_price,
                    'price': item.book.price,
                    'quantity': item.quantity,
                    'total': item.book.price * item.quantity,
                }
                for item in order_item
            ]
            order_data = {
                    'tracking_number': order.tracking_number,
                    'user': {
                        'id': order.user.id,
                        'username': order.user.username,
                        'email': order.user.email,
                    },
                    'status': order.status,
                    'tongtien': order.tongtien,
                    'book': items_data,
                }
            
            result.append(order_data)

        return Response(result, status=200)
    except Order.DoesNotExist:
        return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

@api_view(['POST'])
def update_order(request, mvd):
    try:
        order = Order.objects.get(tracking_number=mvd)
    except Order.DoesNotExist: 
        return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    
    serializer = OrderAdminSerializer(instance=order, data=request.data, partial=True)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def register(request):
    # Tạo một instance của serializer với dữ liệu từ request
    serializer = RegisterSerializer(data=request.data)
        
        # Kiểm tra dữ liệu có hợp lệ không
    if serializer.is_valid():
        email = serializer.validated_data['email']
        password = serializer.validated_data['password']
        username = serializer.validated_data['username']
        is_staff = serializer.validated_data['is_staff']

        serializer.save()
        # Trả về thông tin người dùng vừa đăng ký
        user = UserAccountManager().authenticate(request, email=email, password=password)
        if user is not None:
            # Tạo token cho người dùng
            return Response({
                'username': user.username,
                'email': user.email,
                'password': user.password,
                'is_staff': user.is_staff,
            }, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
@permission_classes([IsAuthenticated]) 
def change_password(request, un):
    print(request.headers)  # Kiểm tra xem request đã có 'Authorization' header chưa
    
    serializer = ChangePasswordSerializer(data=request.data, context={'request': request})
    user = UserAccount.objects.get(username=un)

    if user is None:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    if serializer.is_valid():
        user.set_password(serializer.validated_data['new_password'])
        user.save()
        return Response({"message": "Đổi mật khẩu thành công."}, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
# @permission_classes([AllowAny])  # Cho phép bất kỳ ai cũng có thể truy cập vào view này
def login(request):
    serializer = UserLoginSerializer(data=request.data)
    if serializer.is_valid():
        # Xác thực thành công, trả về thông tin người dùng
        email = serializer.validated_data['email']
        password = serializer.validated_data['password']

        # Xác thực người dùng
        user = UserAccountManager().authenticate(request, email=email, password=password)

        if user is not None:
            cart_order = CartOrder.objects.get(user=user)
            # Tạo token cho người dùng
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'userID': user.id,
                'email': user.email,
                'username': user.username,
                'is_staff': user.is_staff,
                'is_superuser': user.is_superuser,
                'total_book': cart_order.total_book_type(),
            }, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Thông tin đăng nhập không chính xác.'}, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def get_user_cart(request, un):
    try:
        # Lấy giỏ hàng của user hiện tại
        # lấy ra user có username là un
        user = UserAccount.objects.get(username = un)
        
        # Kiểm tra xem user đó có tồn tại hay không
        if user is None:
            return Response({'error': 'User not found'}, status=404)
        
        # Lấy giỏ hàng của user đó
        cart_order = CartOrder.objects.get(user=user)

        # lấy tất cả các cartitem có cart_order = cart_order
        cart_order_item = CartOrderItem.objects.filter(cart_order = cart_order)
        # cart_order_item = CartOrderItem.objects.get(cart_order = cart_order)
        
        # Lấy danh sách các sách trong gi�� hàng
        # cart_items = cart_order.books.all()
        items_data = [
            {
                'id' : item.book.id,
                'name': item.book.name,
                'original_price': item.book.original_price,
                'price': item.book.price,
                'quantity': item.quantity,
                'total': item.book.price * item.quantity,
            }
            for item in cart_order_item
        ]
        result = {
                'Total_book_type': cart_order.total_book_type(),
                'book': items_data,
            }
        
        return Response(result, status=200)
    except CartOrder.DoesNotExist:
        return Response({'error': 'User does not have a cart'}, status=404)
    
@api_view(['GET'])
def get_total_book_type(request, un):
    try:
        # Lấy user có username là `un`
        user = UserAccount.objects.get(username=un)
        
        # Kiểm tra xem user có tồn tại hay không
        if user is None:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        
        # Lấy gi�� hàng của user
        cart_order = CartOrder.objects.get(user=user)
        
        # Trả về t��ng số loại sách trong gi�� hàng
        result = {
            'total': cart_order.total_book_type(),
        }
        
        return Response(result, status=200)
    except CartOrder.DoesNotExist:
        return Response({'error': 'User does not have a cart'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['POST'])
def add_book_to_cart(request, un):
    try:
        # Lấy user có username là `un`
        user = UserAccount.objects.get(username=un)

        # Kiểm tra xem user có tồn tại hay không
        if user is None:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        # Lấy hoặc tạo giỏ hàng của user
        cart_order, created = CartOrder.objects.get_or_create(user=user)

        # Lấy dữ liệu từ request
        book_id = request.data.get('book_id')  # Lấy book_id từ request
        quantity = request.data.get('quantity', 1)  # Lấy số lượng, mặc định là 1

        # Kiểm tra book_id có được cung cấp hay không
        if not book_id:
            return Response({'error': 'Book ID is required'}, status=status.HTTP_400_BAD_REQUEST)

        # Lấy sách dựa trên book_id
        book = get_object_or_404(Book, id=book_id)

        # Kiểm tra xem sách đã có trong CartOrderItem của giỏ hàng hay chưa
        cart_item, item_created = CartOrderItem.objects.get_or_create(cart_order=cart_order, book=book)

        # Nếu item đã tồn tại, chỉ cập nhật số lượng
        if item_created:
            cart_item.quantity = int(quantity)  # Cộng thêm số lượng mới vào số lượng hiện tại
            cart_item.save()
        else:
            # Nếu là item mới, đặt số lượng theo số lượng yêu cầu
            cart_item.quantity = int(quantity)
            cart_item.save()

        # Thêm sách vào danh sách books của CartOrder nếu chưa có
        if book not in cart_order.books.all():
            cart_order.books.add(book)

        # Tính toán tổng số loại sách trong giỏ hàng
        total_book_type = cart_order.total_book_type()

        # Trả về giỏ hàng đã cập nhật
        return Response({
            'message': 'Book added to cart successfully',
            'total_book_type': total_book_type,
            'book': {
                'book_title': book.name,
                'quantity': cart_item.quantity
            }
        }, status=status.HTTP_200_OK)

    except UserAccount.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    except Book.DoesNotExist:
        return Response({'error': 'Book not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def remove_book_from_cart(request, un):
    try:
        # Lấy user có username là `un`
        user = UserAccount.objects.get(username=un)

        # Kiểm tra xem user có tồn tại hay không
        if user is None:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        # Lấy giỏ hàng của user
        cart_order = CartOrder.objects.get(user=user)

        # Lấy book_id từ request
        book_id = request.data.get('book_id')

        # Kiểm tra xem book_id có được cung cấp hay không
        if not book_id:
            return Response({'error': 'Book ID is required'}, status=status.HTTP_400_BAD_REQUEST)

        # Lấy sách dựa trên book_id
        book = get_object_or_404(Book, id=book_id)

        # Kiểm tra xem sách có tồn tại trong CartOrderItem hay không
        cart_item = CartOrderItem.objects.filter(cart_order=cart_order, book=book).first()

        if cart_item:
            cart_item.delete()  # Xóa mục CartOrderItem tương ứng

            # Nếu sách không còn trong bất kỳ mục nào của giỏ hàng, xóa khỏi danh sách books của CartOrder
            if not CartOrderItem.objects.filter(cart_order=cart_order, book=book).exists():
                cart_order.books.remove(book)

            # Tính toán lại tổng số loại sách trong giỏ hàng
            total_book_type = cart_order.total_book_type()

            return Response({
                'message': 'Book removed from cart successfully',
                'total_book_type': total_book_type,
            }, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Book not found in cart'}, status=status.HTTP_404_NOT_FOUND)

    except UserAccount.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    except Book.DoesNotExist:
        return Response({'error': 'Book not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def update_book_quantity(request, un):
    try:
        # Lấy user có username là `un`
        user = UserAccount.objects.get(username=un)

        # Kiểm tra xem user có tồn tại hay không
        if user is None:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        # Lấy giỏ hàng của user
        cart_order = CartOrder.objects.get(user=user)

        # Lấy dữ liệu từ request
        book_id = request.data.get('book_id')  # Lấy book_id từ request
        new_quantity = request.data.get('quantity')  # Lấy số lượng mới từ request

        # Kiểm tra xem book_id và new_quantity có được cung cấp hay không
        if not book_id or new_quantity is None:
            return Response({'error': 'Book ID and new quantity are required'}, status=status.HTTP_400_BAD_REQUEST)

        # Lấy sách dựa trên book_id
        book = get_object_or_404(Book, id=book_id)

        # Lấy mục trong giỏ hàng có chứa sách tương ứng
        cart_item = CartOrderItem.objects.filter(cart_order=cart_order, book=book).first()

        if cart_item:
            # Cập nhật số lượng mới cho mục giỏ hàng
            cart_item.quantity = int(new_quantity)
            cart_item.save()

            # Tính toán lại tổng số loại sách trong giỏ hàng
            total_book_type = cart_order.total_book_type()

            return Response({
                'message': 'Book quantity updated successfully',
                'total_book_type': total_book_type,
                'book': {
                    'book_title': book.name,
                    'quantity': cart_item.quantity
                }
            }, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Book not found in cart'}, status=status.HTTP_404_NOT_FOUND)

    except UserAccount.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    except Book.DoesNotExist:
        return Response({'error': 'Book not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def add_order(request):
    # Tạo đơn hàng mới
    serializer = OrderSerializer(data=request.data)
    
    if serializer.is_valid():
        
         # Lưu thông tin order cơ bản từ serializer (không có books)
        order = serializer.save()  # Lưu order trước khi thêm sách

        # Thêm các sách vào đơn hàng
        books_data = request.data.get('books', [])  # Lấy danh sách sách từ request
        
        # books = []
        for book_data in books_data:
            book_id = book_data.get('id')  # Lấy ID của sách
            # quantity = book_data.get('quantity', 1)  # Mặc định số lượng là 1 nếu không có
            
            # Lấy đối tượng Book từ ID
            try:
                book = Book.objects.get(id=book_id)
                # books.append(book)
            except Book.DoesNotExist:
                return Response({"error": f"Sách với ID {book_id} không tồn tại"}, status=status.HTTP_400_BAD_REQUEST)
            # order_new = Order(order=order, books=books)
            # order_new.save()
            # Tạo OrderItem cho mỗi sách và thêm vào Order
            # order_item = OrderItem(order=order, book=book, quantity=quantity)
            # order_item.save()

        # Sau khi thêm sách, trả về thông tin order
        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
def cancel_order(request, mvd):
    # Hủy đơn hàng
    order = get_object_or_404(Order, tracking_number=mvd)
    
    if order.status == 'Đang chờ xác nhận':  # Chỉ cho phép hủy khi đơn hàng đang chờ hoặc đang chuẩn bị
        order.status = 'Bị hủy'
        order.save()
        return Response({'message': 'Đơn hàng đã được hủy thành công.'}, status=status.HTTP_200_OK)
    
    return Response({'message': 'Không thể hủy đơn hàng trong trạng thái này.'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def get_order(request, mvd):
    # Lấy thông tin đơn hàng dựa vào ID
    order = get_object_or_404(Order, tracking_number=mvd)
    serializer = OrderSerializer(order)
    return Response({
            "message": "Đơn hàng đã được tạo thành công!",
            "hovaten": order.hovaten,
            "sdt": order.sdt,
            "email": order.email,
            "tinh": order.tinh,
            "huyen": order.huyen,
            "diachi": order.diachi,
            "magiamgia": order.magiamgia,
            "tongtien": order.tongtien,
            "tracking_number": order.tracking_number,
            "status": order.status,
            "created_at": order.created_at,
            "books": [
                {
                    "id": item.book.id,
                    "name": item.book.name,
                    "quantity": item.quantity,
                }
                for item in order.orderitem_set.all()  # Lấy danh sách các OrderItem liên kết với Order
            ]
        }, status=status.HTTP_200_OK)
    # return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
def get_all_order(request, un):
    # print(un)
    try:
        # Lấy tất cả đơn hàng của người dùng theo username
        user = UserAccount.objects.get(username = un)
        if user is None:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)  # Kiểm tra xem user có tồn tại hay không

        # Lấy order của user đó
        orders = Order.objects.filter(user=user)
        result = []
        for order in orders:
        # lấy tất cả các cartitem có cart_order = cart_order
            order_item = OrderItem.objects.filter(order = order)
            # cart_order_item = CartOrderItem.objects.get(cart_order = cart_order)
            
            # Lấy danh sách các sách trong gi�� hàng
            # cart_items = cart_order.books.all()
            items_data = [
                {
                    'id' : item.book.id,
                    'name': item.book.name,
                    'original_price': item.book.original_price,
                    'price': item.book.price,
                    'quantity': item.quantity,
                    'total': item.book.price * item.quantity,
                }
                for item in order_item
            ]
            order_data = {
                    'tracking_number': order.tracking_number,
                    'status': order.status,
                    'tongtien': order.tongtien,
                    'book': items_data,
                }
            
            result.append(order_data)

        
        return Response(result, status=200)
    except CartOrder.DoesNotExist:
        return Response({'error': 'User does not have a order'}, status=404)
    


@api_view(['GET'])
def get_profile(request, un):
    try:
        # Lấy thông tin user từ database theo username
        user = UserAccount.objects.get(username = un)
        if user is None:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND) 
        # Trả về dữ liệu dạng JSON của người dùng
        user_data = {
            'username': user.username,
            'email': user.email,
        }
        return Response(user_data, status=status.HTTP_200_OK)
    except UserAccount.DoesNotExist:
        return Response({"message": "User không tồn tại"}, status=status.HTTP_404_NOT_FOUND)

# 2. Cập nhật thông tin tài khoản người dùng
@api_view(['PUT'])
def update_profile(request, un):
    try:
        # Lấy đối tượng user từ database theo username
        user = get_object_or_404(UserAccount, username=un)
        data = request.data
        
        # Cập nhật thông tin user
        user.username = data.get('username', user.username)
        user.email = data.get('email', user.email)
        if 'password' in data and data['password']:
            user.set_password(data['password'])  # Đặt lại mật khẩu mới nếu có

        u = {
            'username': user.username,
            'email': user.email,
        }
        # Lưu lại thay đổi vào database
        user.save()
        return Response({"message": "Cập nhật tài khoản thành công", "profile": u}, status=status.HTTP_200_OK)
    except UserAccount.DoesNotExist:
        return Response({"message": "User không tồn tại"}, status=status.HTTP_404_NOT_FOUND)

# Xem các thể loại sách
@api_view(['GET'])
def category_list(request):
    try:
        categories = Category.objects.all()
        r = []
        for category in categories:
            s = {
                'id': category.id,
                'name': category.name
            }
            r.append(s)
        return Response({"categories": r}, status=200)
    except Category.DoesNotExist:
        return Response({'error': 'Category not found'}, status=404)
    
# Thêm thể loại sách
@api_view(['POST'])
def add_category(request):
    try:
        # Lấy dữ liệu từ request
        name = request.data.get('name')

        # Kiểm tra nếu 'name' bị thiếu
        if not name:
            return Response({'error': 'Name is required'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = CategorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
# Sửa thể loại sách
@api_view(['POST'])
def update_category(request, category_id):
    try:
        # Lấy thể loại dựa trên ID
        category = Category.objects.get(id=category_id)
        
        serializer = CategorySerializer(category, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    except Category.DoesNotExist:
        return Response({'error': 'Category not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
# Xóa thể loại sách theo id của thể loại
@api_view(['DELETE'])
def delete_category(request, category_id):
    try:
        # Lấy thể loại dựa trên ID
        category = Category.objects.get(id=category_id)
        category.delete()  # Xóa thể loại

        return Response({'message': 'Category deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
        
    except Category.DoesNotExist:
        return Response({'error': 'Category not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

