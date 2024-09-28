import React, { useEffect, useState } from "react";
import Header from "../components/Header"
import Footer from "../components/Footer"
import Dong from '../components/Dong';
import orderApi from "../api/order";
import { Link, useNavigate } from 'react-router-dom';
import { Nav, Modal, Button } from 'react-bootstrap'
import Star from "../components/Star";

function MyOrder() {
    const [orders, setOrders] = useState([]); // State để lưu danh sách đơn hàng
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate(); // Hook để điều hướng
    const [showModal, setShowModal] = useState(false)
    const [selectedStar, setSelectedStar] = useState(null); // Trạng thái lưu số sao đã chọn

    // Hàm xử lý khi người dùng chọn sao
    const handleStarClick = (st) => {
        setSelectedStar(st);
    };

    const handleShowModal = () => setShowModal(true)
    const handleCloseModal = () => setShowModal(false)
    const handleFeedback = async (e) => {
        alert('Đánh giá thành công')
        handleCloseModal()
    };

    const un = localStorage.getItem('username');
    console.log('username', un)

    useEffect(() => {
        // Hàm để lấy tất cả đơn hàng
        const fetchOrders = async () => {
            
            try {
                const response = await orderApi.getAllOrders(un); // Sử dụng phương thức getUserOrder
                console.log('response', response)
                setOrders(response); // Lưu danh sách đơn hàng vào state
            } catch (error) {
                console.error("Có lỗi xảy ra khi lấy đơn hàng:", error);
            }
        };

        fetchOrders(); // Gọi hàm để lấy đơn hàng
    }, []); // Chạy chỉ một lần khi component được mount

    const handleCancelOrder = async (mvd) => {
        console.log('mvd', mvd)
        try {
            // Gọi API để hủy đơn hàng
            await orderApi.cancelOrder(mvd);

            // Cập nhật lại danh sách đơn hàng sau khi hủy thành công
            setOrders(orders.filter(order => order.tracking_number !== mvd));
            setErrorMessage(''); // Xóa thông báo lỗi (nếu có)
            navigate('/myorder/')
        } catch (error) {
            console.error("Có lỗi xảy ra khi hủy đơn hàng:", error);
            setErrorMessage(error.message); // Lưu thông báo lỗi vào state để hiển thị
        }
    };

    return (
        <>
            <Header />
            <div className='container'>
                <a onClick={() => navigate(-1)} className="text-secondary">Trang chủ</a>{" "} {" > "} Đơn hàng của bạn
            </div>
            <div className="container mt-3 mb-5">
                <h2>Đơn hàng của bạn</h2>
                {orders ? (
                    orders.map((order) => (
                        <div key={order.tracking_number} className="card p-3 mb-3">
                            <div className="row">
                                <div className="card-header bg-white py-1 d-flex justify-content-between">
                                    <Link className="mb-2 link-underline link-underline-opacity-0 text-black" 
                                    to={`/myorder/${order.tracking_number}`}>
                                        Mã đơn hàng: 
                                        <span className="text-primary">{order.tracking_number}</span></Link>
                                    {/* nếu status = 'bị hủy' thì text chuyển sang màu đỏ */}

                                    <div>Trạng thái: 
                                    <span 
                                        className={
                                        order.status === "Bị hủy" ? "text-danger ms-2 " :
                                        order.status === "Giao thành công" ? "text-success ms-2" : 
                                        "text-primary ms-2"
                                        }
                                    >
                                        {order.status}
                                    </span>
                                    </div>
                                </div>
                                <div className="card-body d-flex justify-content-between">
                                    <div className="">
                                        {order.book.map((item) => (
                                            <div key={item.id}>
                                                <h4>{item.name}</h4>
                                                <p>x{item.quantity}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="">
                                        <span className='ms-2 pt-0'><Dong val={order.tongtien}/></span>
                                    </div>
                                </div>
                                <div className="card-footer bg-white d-flex justify-content-between">
                                    <div className="mt-2">Thành tiền: <span className='text-danger ms-2 pt-0 '><Dong val={order.tongtien}/></span></div>
                                    {/* Hiển thị nút dựa trên trạng thái đơn hàng */}
                                    {order.status === "Đang chờ xác nhận" ? (
                                        <button className='btn btn-danger' onClick={() => handleCancelOrder(order.tracking_number)}>Hủy đơn hàng</button>
                                    ) : order.status === "Giao thành công" ? (
                                        <button className='btn btn-danger' onClick={handleShowModal}>Đánh giá</button>
                                    ) : (
                                        <button className='btn btn-secondary' disabled>Không thể hủy</button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Không có đơn hàng nào.</p>
                )}
            </div>
            {/* Modal cho Đánh giá đơn hàng */}
            <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Đánh giá đơn hàng</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="container">
                        <ul className="list-group list-group-flush">
                            {/* Đánh giá */}
                            <li className="list-group-item">
                                <ul className="list-unstyled">
                                {/* Tạo các mục chọn sao */}
                                {[5, 4, 3, 2, 1].map((star) => (
                                    <li
                                    key={star}
                                    className='mt-3'
                                    onClick={() => handleStarClick(star)}
                                    style={{ cursor: 'pointer' }} // Thêm con trỏ để người dùng biết mục này có thể click
                                    >
                                    {/* Khi số sao chọn khớp với sao hiện tại, chữ đổi sang đậm */}
                                    <span style={{ fontWeight: selectedStar === star ? 'bold' : 'normal', fontSize: selectedStar === star ? '16px' : '14px' }}>
                                        <Star st={star} /> {star} sao
                                    </span>
                                    </li>
                                ))}
                                {/* Ô nhập đánh giá */}
                                <li className='mt-3'>
                                    <textarea className="form-control" rows="3" placeholder="Nhập đánh giá của bạn..." />
                                </li>
                                </ul>
                            </li>
                        </ul>
                        {/* gửi đánh giá */}
                        <div className="text-center mt-3">
                            <Button variant="primary" onClick={handleFeedback}>Gửi đánh giá</Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
            <Footer />
        </>
    );
}

export default MyOrder;