import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import bookApi from '../api/book'; // Giả sử bạn đã tạo bookApi để gọi API
import Star from './Star';
import Dong from './Dong';

function BookDetail2() {
    const { id } = useParams();
    const [book, setBook] = useState(null); // State để lưu trữ thông tin sách
    const [loading, setLoading] = useState(true); // State để theo dõi trạng thái tải

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const bookDetail = await bookApi.getDetailBook(id);
                setBook(bookDetail);
                setLoading(false); // Đặt loading thành false sau khi nhận được dữ liệu
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu sách:', error);
                setLoading(false); // Đặt loading thành false khi có lỗi
            }
        };

        fetchBook();
    }, [id]);

    if (loading) return <p>Đang tải...</p>; // Hiển thị thông báo đang tải khi dữ liệu đang được lấy
    if (!book) return <p>Không tìm thấy sách.</p>; // Kiểm tra nếu không có sách

    // Phiên bản
    // const EditionAttr = book.edition;
    const Edition = book.edition || "";
    // Công ty phát hành
    // const PublisherAttr = book.publisher_vn;
    const Publisher = book.publisher_vn || "";
    // Ngày xuất bản
    // const DateAttr = book.publication_date;
    const Date = book.publication_date || "";
    // Kích thước
    // const DimensionAttr = book.dimensions;
    const Dimension = book.dimensions || "";
    // Dịch giả
    const DichAttr = book.dich_gia;
    const Dich = book.dich_gia || "";
    // Loại bìa
    // const CoverAttr = book.book_cover;
    const Cover = book.book_cover || "";
    // Số trang
    // const NumberOfPagesAttr = book.number_of_page;
    const NumberOfPages = book.number_of_page || "";
    // Nhà xuất bản
    // const ManufacturerAttr = book.manufacturer;
    const Manufacturer = book.manufacturer || "";

    const dp = Math.round(100 - (((book.price) / (book.original_price)) * 100));

    return (
        <>
            <div className="mt-sm-5 mt-3">
                <div className="card p-3 d-none d-sm-block">
                    <div className="row">
                        <div className="col-12 mb-2">
                            <span className="badge bg-primary text-primary bg-opacity-10 me-2">
                                <img className='img1' src="https://salt.tikicdn.com/ts/upload/81/61/d4/92e63f173e7983b86492be159fe0cff4.png" alt="" />
                                CHÍNH HÃNG
                            </span>
                            <span>
                                Tác giả: <a href="#">{book.author}</a>
                            </span>
                        </div>
                        <div className="col-12">
                            <h6 className="card-title py-2" style={{ fontSize: '20px' }}>{book.name}</h6>
                            <div className="d-flex align-items-center">
                                <ul className="card-subtitle list-unstyled d-flex" style={{ fontSize: '14px' }}>
                                    <li><span className="mr-2 fw-bold">{book.rating_average}</span></li>
                                    <li className="ps-2">
                                        <Star st={book.rating_average} />
                                    </li>
                                    <li><span className="px-2 border-end"> (928)</span></li>
                                    <li className="ps-2">
                                        <span className='text-secondary fw-light'>
                                            {book.quantity_sold ? book.quantity_sold.text : 'Đã bán 0'}
                                        </span>
                                    </li>
                                </ul>
                            </div>
                            <div className="mt-2">
                                <span className="card-text fw-medium fs-4">
                                    <Dong val={book.price} />
                                </span>
                                <span className="ms-1 p-1 border rounded-pill border-0 bg-body-secondary" style={{ fontSize: '12px', verticalAlign: 'super' }}>-{dp}%</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card p-3">
                    <p className="fw-bold pb-2" style={{ fontSize: '16px' }}>Thông tin chi tiết</p>
                    <div className="row mb-2 border-bottom">
                        <p className="col-6">Phiên bản sách</p>
                        <p className="col-6">{Edition}</p>
                    </div>
                    <div className="row mb-2 border-bottom">
                        <p className="col-6">Công ty phát hành</p>
                        <p className="col-6">{Publisher}</p>
                    </div>
                    <div className="row mb-2 border-bottom">
                        <p className="col-6">Ngày xuất bản</p>
                        <p className="col-6">{Date}</p>
                    </div>
                    <div className="row mb-2 border-bottom">
                        <p className="col-6">Kích thước</p>
                        <p className="col-6">{Dimension}</p>
                    </div>
                    <div className="row mb-2 border-bottom">
                        <p className="col-6">Dịch Giả</p>
                        <p className="col-6">{Dich}</p>
                    </div>
                    <div className="row mb-2 border-bottom">
                        <p className="col-6">Loại bìa</p>
                        <p className="col-6">{Cover}</p>
                    </div>
                    <div className="row mb-2 border-bottom">
                        <p className="col-6">Số trang</p>
                        <p className="col-6">{NumberOfPages}</p>
                    </div>
                    <div className="row mb-2">
                        <p className="col-6">Nhà xuất bản</p>
                        <p className="col-6">{Manufacturer}</p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default BookDetail2;
