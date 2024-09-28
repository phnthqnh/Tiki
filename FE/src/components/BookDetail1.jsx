import { useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import bookApi from '../api/book'; // Đường dẫn tới bookApi
import './BookDetail1.css';
import Star from './Star';
import Dong from './Dong';

function BookDetail1() {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [isContentVisible, setIsContentVisible] = useState(false);

    useEffect(() => {
        const fetchBook = async () => {
            try {
                // Chỉnh sửa ở đây
                const bookDetail = await bookApi.getDetailBook(id);
                setBook(bookDetail);
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu sách:', error);
                setError('Không thể lấy dữ liệu sách.');
            }
        };

        fetchBook();
    }, [id]);

    const [mainImage, setMainImage] = useState('');

    useEffect(() => {
        // Kiểm tra book và images trước khi cập nhật mainImage
        if (book && book.images && book.images.length > 0) {
            setMainImage(book.images[0].base_url);
        }
    }, [book]); // Chạy effect khi book thay đổi

    // mainImage = book.images[0].thumbnail_url

    if (!book) return <div>Không tìm thấy sách.</div>; // Hiển thị thông báo khi không có dữ liệu

    const handleThumbnailClick = (newBaseUrl) => {
        setMainImage(newBaseUrl);
    };

    const toggleContent = () => {
        setIsContentVisible(!isContentVisible);
    };

    const getThumbnails = () => {
        const images = book.images;
        let thumbnails = [];
        while (thumbnails.length < 4) {
            thumbnails = thumbnails.concat(images).slice(0, 4);
        }
        return thumbnails;
    };

    const thumbnails = getThumbnails();
    const dp = Math.round(100 - ((book.price / book.original_price) * 100));

    return (
        <>
            <div className="mt-sm-5 mt-1">
                <div className="card">
                    <div className='m-2'>
                        <div className='border border-5'>
                            <img
                                src={mainImage}
                                className="img-fluid p-1"
                                alt="Bản Đồ"
                            />
                            <p className="free-gift rounded fw-bold text-danger m-2">MIỄN PHÍ GÓI QUÀ</p>
                        </div>
                        <div className="thumbnail-images d-flex">
                            {thumbnails.map((image, index) => (
                                <img
                                    key={index}
                                    src={image.thumbnail_url}
                                    className="rounded img-fluid m-1"
                                    alt={`Thumbnail ${index + 1}`}
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => handleThumbnailClick(image.base_url)}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="card p-3 d-sm-none">
                        <div className="row">
                            <div className="col-12 mb-2">
                                <span className="badge bg-primary text-primary bg-opacity-10 me-2">
                                    <img className='img1' src="https://salt.tikicdn.com/ts/upload/81/61/d4/92e63f173e7983b86492be159fe0cff4.png" alt="" />
                                    CHÍNH HÃNG
                                </span>
                                <span>
                                    Tác giả: <a href="#">{book.authors ? book.authors.map(author => author.name).join(", ") : "N/A"}</a>
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
                                        <Dong val={book.current_seller.price} />
                                    </span>
                                    <span className="ms-1 p-1 border rounded-pill border-0 bg-body-secondary" style={{ fontSize: '12px', verticalAlign: 'super' }}>-{dp}%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card-body">
                        <div className='border-bottom'>
                            <p className="fw-bold h">Đặc điểm nổi bật</p>
                            <div className='d-flex gap-1'>
                                <img className='img1 ' src="https://salt.tikicdn.com/ts/upload/81/61/d4/92e63f173e7983b86492be159fe0cff4.png" alt="" />
                                <p>Kích thước lớn và bìa cứng, tạo cam giac sang trọng và bền bỉ.</p>
                            </div>
                            <div className='d-flex gap-1'>
                                <img className='img1 ' src="https://salt.tikicdn.com/ts/upload/81/61/d4/92e63f173e7983b86492be159fe0cff4.png" alt="" />
                                <p>Hình vẽ ngộ nghĩnh và màu sắc song động, thu hút sự chú ý của trẻ em.</p>
                            </div>
                            <div className='d-flex gap-1'>
                                <img className='img1' src="https://salt.tikicdn.com/ts/upload/81/61/d4/92e63f173e7983b86492be159fe0cff4.png" alt="" />
                                <p>Cung cấp thông tin tổng quát về diện tích, dân số và ngôn ngữ của các quốc gia.</p>
                            </div>
                        </div>
                        <div className='d-flex'>
                            <img className='mt-1' style={{ width: '24px', height: '24px', textAlign: 'center' }} src="https://salt.tikicdn.com/ts/ta/d3/d4/1c/1d4ee6bf8bc9c5795529ac50a6b439dd.png" alt="" />
                            <p className='p-2'><span className="link-secondary">Xem thêm</span> Tóm tắt nội dung sách</p>
                            <div className='ms-auto'>
                                <button onClick={toggleContent} className="btn ">
                                    {isContentVisible ? '<' : '>'}
                                </button>
                            </div>
                        </div>
                        <div>
                            {isContentVisible && (
                                <div className="content">
                                    <p>{book.short_description}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default BookDetail1;
