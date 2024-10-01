import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Dong from '../components/Dong';
import orderApi from "../api/order";
import { useNavigate, useParams } from 'react-router-dom';
import { Nav, Modal, Button } from 'react-bootstrap';
import Star from "../components/Star";

function OrderDetail() {
    const [order, setOrder] = useState(null); // State để lưu thông tin đơn hàng (null ban đầu)
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate(); // Hook để điều hướng

    const { mvd } = useParams(); // Lấy mã vận đơn (mvd) từ URL
    console.log('Mã vận đơn:', mvd);

    useEffect(() => {
        // Hàm để lấy 1 đơn hàng
        const fetchOneOrder = async () => {
            try {
                const response = await orderApi.getUserOrder(mvd); // Sử dụng phương thức getUserOrder
                console.log('response', response);
                setOrder(response); // Lưu thông tin đơn hàng vào state
            } catch (error) {
                console.error("Có lỗi xảy ra khi lấy thông tin đơn hàng:", error);
                setErrorMessage("Không thể tải thông tin đơn hàng. Vui lòng thử lại sau.");
            }
        };

        if (mvd) {
            fetchOneOrder(); // Gọi hàm để lấy đơn hàng nếu có mvd
        }
    }, [mvd]); // Chạy lại khi mvd thay đổi

    const handleCancelOrder = async (mvd) => {
        console.log('mvd', mvd)
        try {
            // Gọi API để hủy đơn hàng
            await orderApi.cancelOrder(mvd);

            // Cập nhật lại danh sách đơn hàng sau khi hủy thành công
            setOrders(orders.filter(order => order.tracking_number !== mvd));
            setErrorMessage(''); // Xóa thông báo lỗi (nếu có)
        } catch (error) {
            console.error("Có lỗi xảy ra khi hủy đơn hàng:", error);
            setErrorMessage(error.message); // Lưu thông báo lỗi vào state để hiển thị
        }
    };

    return (
        <>
            <Header />
            <div className="container mt-3 mb-5">
                <button
                    onClick={() => navigate(-1)}
                    className="btn btn-danger Page mb-3"
                    type="submit"
                >
                    Quay lại
                </button>
                {order ? (
                    <>
                        <div className="card p-3">
                            <div className="row">
                                <h2>Thông tin giao hàng</h2>
                                <div className="col-md-6 mt-3">
                                    <p className="text-secondary">Họ và tên: {order.hovaten}</p>
                                    <p className="text-secondary">Email: {order.email}</p>
                                    <p className="text-secondary">Số điện thoại: {order.sdt}</p>
                                    <p className="text-secondary">Địa chỉ: {order.diachi}, Huyện {order.huyen}, Tỉnh/Thành Phố {order.tinh}</p>
                                </div>
                            </div>
                        </div>
                        <div className="card p-3">
                            <div className="row">
                                <div className="card-header bg-white py-1 d-flex justify-content-between">
                                    <p>Mã đơn hàng: <span className="text-primary">{order.tracking_number}</span></p>
                                    <p>Trạng thái: 
                                        <span 
                                            className={
                                            order.status === "Bị hủy" ? "text-danger ms-2 " :
                                            order.status === "Giao thành công" ? "text-success ms-2" : 
                                            "text-primary ms-2"
                                            }
                                        >
                                            {order.status}
                                    </span>
                                    </p>
                                </div>
                                <div className="card-body d-flex justify-content-between">
                                    <div className="">
                                        {/* Giả sử rằng order.books là mảng chứa danh sách sách trong đơn hàng */}
                                        {order.books && order.books.map((book) => (
                                            <div key={book.id}>
                                                <h4>{book.name}</h4>
                                                <p>x{book.quantity}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="">
                                        <span className='ms-2 pt-0'><Dong val={order.tongtien} /></span>
                                    </div>
                                </div>
                                <div className="card-footer bg-white d-flex justify-content-between">
                                    <div className="col-md-10"></div>
                                    <div className="col-md-2">
                                        <div className="my-3">Tổng tiền hàng: <span className='text-danger ms-2 pt-0 '><Dong val={order.tongtien} /></span></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <p>Đang tải thông tin đơn hàng...</p> // Hiển thị khi thông tin đơn hàng chưa được tải
                )}
            </div>
            <Footer />
        </>
    )
}

export default OrderDetail;
