import os
import django
import json
from datetime import datetime
# Thiết lập biến môi trường cho cài đặt Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'tiki.settings')  # Thay 'tiki' bằng tên dự án của bạn
django.setup()

from api.models import Book, Image, Seller, Category  # Thay 'api' bằng tên ứng dụng của bạn

# Đường dẫn đến file JSON
json_file_path = 'a.json'  # Đảm bảo đường dẫn đúng

# Đọc dữ liệu từ file JSON
with open(json_file_path, 'r', encoding='utf-8') as file:
    book_data = json.load(file)

def import_data_from_json(json_data):
    for item in json_data:
        print(f"Processing item: {item}")  # Kiểm tra giá trị của item

        # Xử lý Category
        if 'categories' in item and isinstance(item['categories'], dict):
            category_data = item['categories']
            category, _ = Category.objects.get_or_create(
                id=category_data['id'],
                defaults={'name': category_data['name']}
            )
        else:
            print(f"Error: 'categories' missing or not a dictionary in item {item.get('id', 'unknown')}")
            continue  # Bỏ qua nếu thiếu categories

        # Xử lý Seller
        if 'current_seller' in item and isinstance(item['current_seller'], dict):
            seller_data = item['current_seller']
            seller, _ = Seller.objects.get_or_create(
                id=seller_data['id'],
                defaults={'name': seller_data['name']}
            )
            seller_price = seller_data.get('price', 0)  # Lấy giá của seller
        else:
            print(f"Error: 'current_seller' missing or not a dictionary in item {item.get('id', 'unknown')}")
            continue  # Bỏ qua nếu thiếu current_seller
        
        # Lấy tên tác giả
        # Lấy giá trị name từ authors
        if 'authors' in item and isinstance(item['authors'], list) and item['authors']:
            author = item['authors'][0]  # Lấy tác giả đầu tiên (nếu có nhiều tác giả, bạn có thể thay đổi cách này)
            name_author = author.get('name', '')
        else:
            # print(f"Error: 'authors' missing or not a list in item {item.get('id', 'unknown')}")
            name_author = '' 
        
        # Lấy giá trị loại bìa từ specifications
        book_cover_type = None
        if 'specifications' in item:
            for specification in item['specifications']:
                if 'attributes' in specification:
                    for attribute in specification['attributes']:
                        if attribute['code'] == 'book_cover':
                            book_cover_type = attribute['value']
                            break
                if book_cover_type is not None:
                    break
        # Lấy giá trị isbn từ specifications
        isbn_type = None
        if 'specifications' in item:
            for specification in item['specifications']:
                if 'attributes' in specification:
                    for attribute in specification['attributes']:
                        if attribute['code'] == 'isbn':
                            isbn_type = attribute['value']
                            break
                if isbn_type is not None:
                    break
        #lấy giá trị edition từ specifications
        edition_type = None
        if 'specifications' in item:
            for specification in item['specifications']:
                if 'attributes' in specification:
                    for attribute in specification['attributes']:
                        if attribute['code'] == 'edition':
                            edition_type = attribute['value']
                            break
                if edition_type is not None:
                    break
        value = 0
        if 'quantity_sold' in item:
            quantity_sold = item['quantity_sold']
            value = quantity_sold.get('value', 0)

        #lấy giá trị publisher_vn từ specification
        publisher_vn_type = None
        if 'specifications' in item:
            for specification in item['specifications']:
                if 'attributes' in specification:
                    for attribute in specification['attributes']:
                        if attribute['code'] == 'publisher_vn':
                            publisher_vn_type = attribute['value']
                            break
                if publisher_vn_type is not None:
                    break
        
        #lấy giá trị publication_date từ specification
        publication_date_type = None
        if 'specifications' in item:
            for specification in item['specifications']:
                if 'attributes' in specification:
                    for attribute in specification['attributes']:
                        if attribute['code'] == 'publication_date':
                            publication_date_type = attribute['value']
                            publication_date_type = datetime.strptime(publication_date_type, '%Y-%m-%d %H:%M:%S').date()
                            break
                if publication_date_type is not None:
                    break

        #lấy giá trị manufacturer từ specification
        manufacturer_type = None
        if 'specifications' in item:
            for specification in item['specifications']:
                if 'attributes' in specification:
                    for attribute in specification['attributes']:
                        if attribute['code'] =='manufacturer':
                            manufacturer_type = attribute['value']
                            break
                if manufacturer_type is not None:
                    break
        #lấy giá trị number_of_page từ specification
        number_of_page_type = None
        if 'specifications' in item:
            for specification in item['specifications']:
                if 'attributes' in specification:
                    for attribute in specification['attributes']:
                        if attribute['code'] =='number_of_page':
                            number_of_page_type = attribute['value']
                            break
                if number_of_page_type is not None:
                    break
        #lấy giá trị dich_gia từ specification
        dich_gia_type = None
        if 'specifications' in item:
            for specification in item['specifications']:
                if 'attributes' in specification:
                    for attribute in specification['attributes']:
                        if attribute['code'] =='dich_gia':
                            dich_gia_type = attribute['value']
                            break
                if dich_gia_type is not None:
                    break
        # lấy giá trị dimensions từ specification
        dimensions_type = None
        if 'specifications' in item:
            for specification in item['specifications']:
                if 'attributes' in specification:
                    for attribute in specification['attributes']:
                        if attribute['code'] == 'dimensions':
                            dimensions_type = attribute['value']
                            break
                if dimensions_type is not None:
                    break
        

        # Import images
        images = item.get('images', [])
        image_objects = []
        for img in images:
            image, _ = Image.objects.get_or_create(
                base_url=img['base_url'],
                defaults={
                    'large_url': img['large_url'],
                    'medium_url': img['medium_url'],
                    'small_url': img['small_url'],
                    'thumbnail_url': img['thumbnail_url'],
                }
            )
            image_objects.append(image)

        # Tạo hoặc cập nhật đối tượng Book
        book_data = {
            'id': item['id'],
            'name': item['name'],
            'author': name_author,
            'description': item['description'],
            'short_description': item['short_description'],
            'list_price': item['list_price'],
            'price': seller_price,
            'original_price': item['original_price'],
            'rating_average': item['rating_average'],
            'book_cover': item['book_cover'],
            'categories': category,
            'current_seller': seller,
            'loai_bia': book_cover_type,
            'isbn13': isbn_type,
            'edition': edition_type,
            'quantity_sold': value,
            'publisher_vn': publisher_vn_type,
            'publication_date': publication_date_type,
            'dimensions': dimensions_type,
            'manufacturer': manufacturer_type,
            'dich_gia': dich_gia_type,
            'number_of_page': number_of_page_type,
            'is_hidden': item.get('isHidden', False),
            'quantity_in_stock': item.get('quantityInStock', 0),
        }

        book, created = Book.objects.update_or_create(
            id=book_data['id'],
            defaults=book_data
        )
        book.images.set(image_objects)  # Liên kết các hình ảnh với sách
        book.save()

# Gọi hàm để nhập dữ liệu từ file JSON
import_data_from_json(book_data)
