import React, { useContext, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import bookApi from '../api/book'; // Đảm bảo đường dẫn chính xác
import cartApi from '../api/cart'; // Import API để thêm sách vào giỏ hàng
import Dong from './Dong';
import { CartContext } from './CartContext';

function BookDetail4() {
    const { id } = useParams(); // Lấy tham số id từ URL
    const { addToCart, addToBuy } = useContext(CartContext); // Lấy hàm addToCart từ CartContext
    const [book, setBook] = useState(null); // State để lưu thông tin sách
    const [quantity, setQuantity] = useState(1); // Khởi tạo quantity với giá trị mặc định là 1
    const navigate = useNavigate(); // Hook để điều hướng
    const username = localStorage.getItem('username');

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const bookDetail = await bookApi.getDetailBook(id); // Gọi API để lấy chi tiết sách
                setBook(bookDetail); // Cập nhật state với thông tin sách
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu sách:', error);
                setBook(null); // Nếu không tìm thấy sách, đặt state về null
            }
        };

        fetchBook(); // Gọi hàm lấy sách
    }, [id]);

    if (!book) {
        return <div>Không tìm thấy sách</div>; // Nếu không có sách, hiển thị thông báo
    }

    const price = book.price;

    const handleQuantityChange = (event) => {
        setQuantity(parseInt(event.target.value, 10) || 1);
    };

    const handleDecrease = () => {
        setQuantity(prevQuantity => Math.max(prevQuantity - 1, 1));
    };

    const handleIncrease = () => {
        setQuantity(prevQuantity => prevQuantity + 1);
    };

    const total = quantity * price;

    // const handleBuyNow = () => {
    //     alert('Mua hàng thành công');
    //     navigate('/', { state: { total } });
    // };
    const handleBuyNow = () => {
        const item = {
            id: book.id,
            name: book.name,
            price: price,
            quantity: quantity,
            image: book.images[0].base_url
        };
    
        // Sử dụng CartContext để thêm sản phẩm vào giỏ hàng
        // addToCart(book.id, book.name, price, quantity);
        addToBuy(item); // Thêm sản phẩm vào buy
        
        // Chuyển hướng đến trang thanh toán
        navigate('/buy');
    };
    // const saveItemToStorage = (key, item) => {
    //     localStorage.setItem(key, JSON.stringify(item));
    // };

    const handleAddToCart = async () => {
        try {
            // Gọi API để thêm sách vào giỏ hàng trên server
            await cartApi.addBookToCart(username, book.id, quantity);

            // Cập nhật context (nếu cần) hoặc điều hướng lại để người dùng thấy giỏ hàng đã được cập nhật
            addToCart(book.id, book.name, price, quantity);
            alert('Đã thêm vào giỏ hàng');
            navigate('/'); // Điều hướng về trang chủ hoặc trang giỏ hàng
        } catch (error) {
            console.error('Lỗi khi thêm sách vào giỏ hàng:', error);
            alert('Không thể thêm sách vào giỏ hàng. Vui lòng thử lại sau!');
        }
    };

    return (
        <div className="mt-sm-5 mt-3">
            <div className="card p-3">
                <div className="mb-3 d-none d-sm-block">
                    <p className='fw-bold h'>Số Lượng</p>
                    <div className="row">
                        <div className="col-8 d-flex mr-1">
                            <button className="btn btn-outline-secondary" type="button" onClick={handleDecrease}>
                                -
                            </button>
                            <input type="text" style={{ width: '45px' }} className="form-control mx-2 border border-secondary text-center" value={quantity} onChange={handleQuantityChange} />
                            <button className="btn btn-outline-dark" type="button" onClick={handleIncrease}>
                                +
                            </button>
                        </div>
                    </div>
                </div>
                <div className="mb-3 d-none d-sm-block">
                    <p className='fw-bold h'>Tạm tính</p>
                    <span className="card-text fw-medium fs-4">
                        <Dong val={total} />
                    </span>
                </div>
                <div>
                    <button className="col-sm-12 col-6 btn btn-danger btn-block mb-2" onClick={handleBuyNow}>Mua ngay</button>
                    <button className="col-sm-12 col-6 btn btn-outline-primary btn-block mb-2" onClick={handleAddToCart}>Thêm vào giỏ</button>
                    <button className="col-sm-12 col-12 btn btn-outline-primary btn-block">Mua trước trả sau</button>
                </div>
            </div>
        </div>
    );
}

export default BookDetail4;
