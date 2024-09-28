import React, { useContext, useState, useEffect } from 'react';
import { CartContext } from '../components/CartContext';
import cartApi from '../api/cart';
import Dong from '../components/Dong';
import { useNavigate } from "react-router-dom";
import Header from '../components/Header';
import Footer from '../components/Footer';

function Cart() {
    const { removeFromCart, updateQuantity } = useContext(CartContext);
    const navigate = useNavigate();
    const [cartData, setCartData] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const username = localStorage.getItem('username');

    // Hàm gọi API để lấy dữ liệu giỏ hàng từ server khi component được mount
    useEffect(() => {
        const fetchCartData = async () => {
            try {
                const data = await cartApi.getUserCart(username); // Gọi API lấy dữ liệu giỏ hàng cho người dùng
                // console.log("data", data);
                setCartData(data.book || []); // Đảm bảo rằng API trả về một object chứa danh sách books
            } catch (error) {
                console.error('Failed to fetch cart data:', error);
            }
        };

        fetchCartData(); // Gọi hàm fetchCartData để lấy giỏ hàng từ server
    }, []);

    // Hàm xử lý xóa sản phẩm khỏi giỏ hàng
    const handleRemoveFromCart = async (id) => {
        try {
            await cartApi.removeBookFromCart(username, id); // Xóa sách khỏi giỏ hàng trên server bằng API
            setCartData(cartData.filter(item => item.id !== id)); // Cập nhật lại trạng thái giỏ hàng trên client
            alert('Đã xóa sản phẩm khỏi giỏ hàng');
            // sau khi xóa xong thì load lại trang giỏ hàng
            navigate(`/cart/${username}`)
        } catch (error) {
            console.error('Failed to remove item from cart:', error);
        }
    };

    // Hàm xử lý tăng số lượng sản phẩm
    const handleQuantityIncrease = async (id, quantity) => {
        const newQuantity = quantity + 1;
        try {
            await cartApi.updateBookQuantity(username, id, newQuantity); // Gọi API cập nhật số lượng sản phẩm
            updateQuantity(id, newQuantity); // Cập nhật lại trạng thái giỏ hàng trên client
            setCartData(cartData.map(item => item.id === id ? { ...item, quantity: newQuantity, total: item.price * newQuantity } : item));
        } catch (error) {
            console.error('Failed to increase item quantity:', error);
        }
    };

    // Hàm xử lý giảm số lượng sản phẩm
    const handleQuantityDecrease = async (id, quantity) => {
        if (quantity > 1) {
            const newQuantity = quantity - 1;
            try {
                await cartApi.updateBookQuantity(username, id, newQuantity); // Gọi API cập nhật số lượng sản phẩm
                updateQuantity(id, newQuantity); // Cập nhật lại trạng thái giỏ hàng trên client
                setCartData(cartData.map(item => item.id === id ? { ...item, quantity: newQuantity, total: item.price * newQuantity } : item));
            } catch (error) {
                console.error('Failed to decrease item quantity:', error);
            }
        }
    };

    // Hàm xử lý chọn sản phẩm
    const handleSelectItem = (id) => {
        if (selectedItems.includes(id)) {
            setSelectedItems(selectedItems.filter(item => item !== id));
        } else {
            setSelectedItems([...selectedItems, id]);
        }
    };

    // Hàm xử lý chọn tất cả sản phẩm
    const handleSelectAll = () => {
        if (selectedItems.length === cartData.length) {
            setSelectedItems([]); // Bỏ chọn tất cả nếu đã chọn hết
        } else {
            setSelectedItems(cartData.map(item => item.id)); // Chọn tất cả sản phẩm
        }
    };

    // Tính tổng tiền gốc Original price
    // console.log('cartData', cartData)
    const originalTotal = cartData
       .filter(item => selectedItems.includes(item.id))
       .reduce((total, item) => total + item.original_price * item.quantity, 0);
    // console.log('originalTotal', originalTotal)

    // Tính tổng tiền và số sản phẩm từ cartData
    const totalAmount = cartData
        .filter(item => selectedItems.includes(item.id))
        .reduce((total, item) => total + item.total, 0);

    const totalItems = selectedItems.length;

    // giá đã giảm
    const discountedTotal = originalTotal - totalAmount ;

    // Hàm xử lý thanh toán
    const handleCheckout = async () => {
        if (selectedItems.length === 0) {
            alert('Vui lòng chọn sản phẩm trước khi mua');
        } else {
            // try {
            //     // Gọi API để xử lý thanh toán cho các sản phẩm đã chọn
            //     await cartApi.checkout(selectedItems);
            //     alert('Mua hàng thành công');
            //     setSelectedItems([]);
            //     navigate('/'); // Điều hướng về trang chủ sau khi thanh toán thành công
            // } catch (error) {
            //     console.error('Failed to checkout:', error);
            //     alert('Thanh toán thất bại');
            // }
            const selectedProducts = cartData.filter(item => selectedItems.includes(item.id));
            localStorage.setItem('order', JSON.stringify(selectedProducts)); 
            localStorage.setItem('item', JSON.stringify(selectedItems)); 
            selectedItems.forEach(id => removeFromCart(id));
            navigate('/order', { state: { selectedProducts } }); 
        }
    };

    return (
        <>
            <Header />
            <div className='container'>
                <a onClick={() => navigate(-1)} className="text-secondary">Trang chủ</a>{" "} {" > "} Giỏ hàng
            </div>
            <div className="container mt-3 mb-5">
                <h2>Giỏ hàng của bạn</h2>
                {cartData.length === 0 ? (
                    <p>Hiện chưa có sản phẩm nào trong giỏ hàng</p>
                ) : (
                    <div className="row">
                        {/* Danh sách sản phẩm */}
                        <div className="col-md-8">
                            <div className="card p-3">
                                <div className="d-flex border-bottom pb-2 align-items-center mb-3">
                                    <div className='col-sm-5 col-12 me-5'>
                                        <input 
                                            type="checkbox" 
                                            className="form-check-input me-2"
                                            checked={selectedItems.length === cartData.length}
                                            onChange={handleSelectAll}
                                        />
                                        <label>Chọn tất cả ({cartData.length} sản phẩm)</label>
                                    </div>
                                    <div className='col-sm-7 d-flex gap-lg-1'>
                                        <div className="col-sm-3 border-start text-center">Đơn giá</div>
                                        <div className="col-sm-3 border-start border-end text-center">Số lượng</div>
                                        <div className="col-sm-2 text-end">Thành tiền</div>
                                    </div>
                                </div>
                                <div className="card-body d-none d-sm-block">
                                    {cartData.map((item) => (
                                        <div key={item.id} className="d-flex align-items-start py-3 mb-3">
                                            <input 
                                                type="checkbox" 
                                                className="form-check-input me-3 col-sm-1"
                                                checked={selectedItems.includes(item.id)}
                                                onChange={() => handleSelectItem(item.id)}
                                            />
                                            <div className="col-sm-5">
                                                <h6>{item.name}</h6>
                                            </div>
                                            <div className="col-sm-2 col-12 text-center">
                                                <p className='text-danger ms-4'><Dong val={item.price} /></p>
                                            </div>
                                            <div className="d-flex align-items-start justify-content-center col-sm-2 text-end">
                                                <button className="btn btn-outline-secondary btn-sm" onClick={() => handleQuantityDecrease(item.id, item.quantity)}>-</button>
                                                <span className="mx-2">{item.quantity}</span>
                                                <button className="btn btn-outline-secondary btn-sm" onClick={() => handleQuantityIncrease(item.id, item.quantity)}>+</button>
                                            </div>
                                            <div className="col-sm-2 text-center">
                                                <p className='text-danger'><Dong val={item.total} /></p>
                                            </div>
                                            <button className="btn btn-outline-danger btn-sm text-center" onClick={() => handleRemoveFromCart(item.id)}>
                                                <i className="bi bi-trash-fill"></i>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Tổng kết và thanh toán */}
                        <div className="col-md-4">
                            <div className="card p-3">
                                <h5 className='mb-4'>Tóm tắt giỏ hàng</h5>
                                <div className="d-flex justify-content-between mb-2">
                                    <span>Tổng số sản phẩm</span>
                                    <span>{totalItems}</span>
                                </div>
                                <div className="d-flex justify-content-between mb-2">
                                    <span>Tạm tính</span>
                                    <span className='text-danger'><Dong val={originalTotal} /></span>
                                </div>
                                <div className="d-flex justify-content-between mb-2">
                                    <span>Giảm giá</span>
                                    <span><Dong val={discountedTotal}/></span>
                                </div>
                                <div className="d-flex justify-content-between mb-2">
                                    <span>Tổng tiền</span>
                                    <span className='text-danger'><Dong val={totalAmount} /></span>
                                </div>
                                <button className='btn btn-danger' onClick={handleCheckout}>Thanh toán</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
}

export default Cart;
