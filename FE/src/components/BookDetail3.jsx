import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import bookApi from '../api/book'; // Giả sử bạn đã tạo bookApi để gọi API

function BookDetail3() {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [error, setError] = useState('');

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

    if (error) {
        return <div>{error}</div>; // Hiển thị thông báo lỗi nếu có
    }

    if (!book) {
        return <div>Đang tải...</div>; // Hiển thị thông báo đang tải
    }

    return (
        <>
            <div className="mt-3">
                <div className="card p-3">
                    <p className="fw-bold" style={{fontSize: '16px'}}>Mô tả sản phẩm</p>
                    <img 
                        src={book.images[0].thumbnail_url} 
                        className="img-fluid border border-5 mb-3" 
                        alt="Bản Đồ" 
                        style={{ maxWidth: '100%' }} 
                    />
                    <div dangerouslySetInnerHTML={{ __html: book.description }} />
                </div>
            </div>
        </>
    );
}

export default BookDetail3;
