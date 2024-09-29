import Footer from '../components/Footer'
import Header from '../components/Header'
import bookApi from '../api/book'
import { useParams } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

function BookAdminDetail() {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [isContentVisible, setIsContentVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false); // State để theo dõi trạng thái chỉnh sửa
    const [isChangingPassword, setIsChangingPassword] = useState(false); // State để theo dõi trạng thái đổi mật khẩu

    const handleBackClick = () => {
        navigate("/ad"); // Điều hướng về trang listbooks
    };

    // Khởi tạo state để lưu thông tin cập nhật profile
    const [formData, setFormData] = useState({
        username: '',
        email: '',
    });


    useEffect(() => {
        const fetchBook = async () => {
            try {
                // Chỉnh sửa ở đây
                const bookDetail = await bookApi.getDetailBook(id);
                console.log(bookDetail)
                setBook(bookDetail);
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu sách:', error);
                setError('Không thể lấy dữ liệu sách.');
            }
        };

        fetchBook();
    }, [id]);

    // Hàm lấy thông tin profile từ backend
    // useEffect(() => {
    //     const fetchProfile = async () => {
    //         try {
    //             const data = await profileApi.getProfile(un);
    //             setProfile(data); // Lưu dữ liệu profile vào state
    //             setFormData({
    //                 username: data.username,
    //                 email: data.email,
    //             });
    //         } catch (error) {
    //             console.error('Failed to fetch profile data:', error);
    //         }
    //     };

    //     fetchProfile();
    // }, [id]);

    // Hàm xử lý khi submit cập nhật profile
    const handleUpdateProfile = async () => {
        try {
            // Gọi API cập nhật thông tin profile
            const response = await profileApi.updateProfile(un, formData.username, formData.email);
            localStorage.setItem('username', formData.username);
            localStorage.setItem('email', formData.email);
            alert('Cập nhật tài khoản thành công');
            setIsEditing(false); // Đặt lại trạng thái chỉnh sửa sau khi cập nhật thành công
        } catch (error) {
            console.log('Lỗi khi cập nhật thông tin tài khoản:', error);
            alert('Cập nhật tài khoản thất bại');
        }
    };

    return( <>
        <Header/>
        <div className="container bg-white mt-3">
            <div className="row p-2 ">
                <div className="col-md-4">
                    <img style={{width:"20%"}}></img>
                    <h3 className="mt-3">Ảnh </h3>
                    <div className="form-group mb-3">
                            <label htmlFor="base_url">Base_url</label>
                            <input
                                type="url"
                                className="form-control"
                                //id="base_url"
                                //value={base_url}
                                onChange={(e) => setBaseUrl(e.target.value)}
                                required
                            />
                    </div>
                    <div className="form-group mb-3">
                            <label htmlFor="large_url">Large_url</label>
                            <input
                                type="url"
                                className="form-control"
                                //id="large_url"
                                //value={large_url}
                                onChange={(e) => setLargeUrl(e.target.value)}
                                required
                            />
                    </div>
                    <div className="form-group mb-3">
                            <label htmlFor="medium_url">Medium_url</label>
                            <input
                                type="url"
                                className="form-control"
                                //id="medium_url"
                                //value={medium_url}
                                onChange={(e) => setMediumUrl(e.target.value)}
                                required
                            />
                    </div>
                    <div className="form-group mb-3">
                            <label htmlFor="small_url">Small_url</label>
                            <input
                                type="url"
                                className="form-control"
                                //id="small_url"
                                //value={small_url}
                                onChange={(e) => setSmallUrl(e.target.value)}
                                required
                            />
                    </div>
                    <h3 className="mt-3">Ảnh thu nhỏ </h3>
                    <div className="form-group mb-3">
                            <label htmlFor="base_url">Base_url</label>
                            <input
                                type="url"
                                className="form-control"
                                //id="base_url"
                                //value={base_url}
                                onChange={(e) => setBaseUrl(e.target.value)}
                                required
                            />
                    </div>
                    <div className="form-group mb-3">
                            <label htmlFor="large_url">Large_url</label>
                            <input
                                type="url"
                                className="form-control"
                                //id="large_url"
                                //value={large_url}
                                onChange={(e) => setLargeUrl(e.target.value)}
                                required
                            />
                    </div>
                    <div className="form-group mb-3">
                            <label htmlFor="medium_url">Medium_url</label>
                            <input
                                type="url"
                                className="form-control"
                                //id="medium_url"
                                //value={medium_url}
                                onChange={(e) => setMediumUrl(e.target.value)}
                                required
                            />
                    </div>
                    <div className="form-group mb-3">
                            <label htmlFor="small_url">Small_url</label>
                            <input
                                type="url"
                                className="form-control"
                                //id="small_url"
                                //value={small_url}
                                onChange={(e) => setSmallUrl(e.target.value)}
                                required
                            />
                    </div>
                </div>
                <div className="col-md-8">
                    <h3>Chỉnh sửa thông tin sách</h3>
                    <form className="needs-validation mt-3" noValidate >
                    <div className="row mb-3">
                        <div className="form-group col-md-4">
                            <label htmlFor="">Tên sách</label>
                            <input
                                type="text"
                                className="form-control"
                                id="name"
                                // value={book['name']}
                                onChange={(e) => setBookName(e.target.value)}
                                required
                            />
                        </div>
                    <div className="form-group col-md-4">
                        <label htmlFor="author">Tên tác giả</label>
                        <input
                            type="text"
                            className="form-control"
                            id="author"
                            // value={book['author'] ? book['author'] : 'N/A'}
                            onChange={(e) => setAuthor(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group col-md-4">
                        <label htmlFor="id">ID</label>
                        <input
                            type="text"
                            className="form-control"
                            id="id"
                            value={id}
                            onChange={(e) => setID(e.target.value)}
                            required
                        />
                    </div>
                </div>
                <div className="form-group mb-3">
                        <label htmlFor="description">Mô tả sách*</label>
                        <input
                            type="text"
                            className="form-control"
                            id="description"
                            // value={book['description']}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                </div>
                <div className="form-group mb-3">
                        <label htmlFor="short_description">Tóm tắt nội dung sách*</label>
                        <input
                            type="text"
                            className="form-control"
                            //id="short_description"
                            //value={short_description}
                            defaultValue="Giá trị mặc định"
                            onChange={(e) => setShortDescription(e.target.value)}
                            required
                        />
                </div>
                <div className="row mb-3">
                <div className="form-group col-md-4">
                        <label htmlFor="price">Giá bán</label>
                        <input
                            type="number"
                            className="form-control"
                            //id="price"
                            //value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group col-md-4">
                        <label htmlFor="original_price">Giá gốc</label>
                        <input
                            type="number"
                            className="form-control"
                            //id="original_price"
                            //value={original_price}
                            onChange={(e) => setOriginalPrice(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group col-md-4">
                        <label htmlFor="percent">Phần trăm</label>
                        <input
                            type="number"
                            className="form-control"
                            //id="percent"
                            //value={percent}
                            onChange={(e) => setPercent(e.target.value)}
                            required
                        />
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="form-group col-md-4">
                        <label htmlFor="quantity_sold">Số lượng đã bán* </label>
                        <input
                            type="number"
                            className="form-control"
                            //id="quantity_sold"
                            //value={quantity_sold}
                            onChange={(e) => setQuantitySold(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group col-md-4">
                        <label htmlFor="quantity_in_stock">Số lượng trong kho* </label>
                        <input
                            type="number"
                            className="form-control"
                            //id="quantity_in_stock"
                            //value={quantity_in_stock}
                            onChange={(e) => setQuantityInStock(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group col-md-4">
                        <label htmlFor="rating_average">Đánh giá trung bình *</label>
                        <input
                            type="number"
                            className="form-control"
                            //id="rating_average"
                            //value={rating_average}
                            onChange={(e) => setRatingAverage(e.target.value)}
                            required
                        />
                </div>
                </div>
                <div className="row mb-3">
                    <div className="form-group col-md-6">
                            <label htmlFor="book_cover">Bìa sách *</label>
                            <input
                                type="text"
                                className="form-control"
                                //id="book_cover"
                                //value={book_cover}
                                onChange={(e) => setBookCover(e.target.value)}
                                required
                            />
                    </div>
                    <div className="form-group col-md-6">
                            <label htmlFor="loai_bia">Loại bìa *</label>
                            <input
                                type="text"
                                className="form-control"
                                //id="loai_bia"
                                //value={loai_bia}
                                onChange={(e) => setLoaiBia(e.target.value)}
                                required
                            />
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="form-group col-md-6">
                            <label htmlFor="isbn13">IBN-13 *</label>
                            <input
                                type="number"
                                className="form-control"
                                //id="isbn13"
                                //value={isbn13}
                                onChange={(e) => setIBN-13(e.target.value)}
                                required
                            />
                    </div>
                    <div className="col-md-6">
                    <label htmlFor="dich_gia" className="form-group">Dịch giả *</label>
                        <select id="dich_gia" className="form-select" required>
                            <option value="">Chọn...</option>
                            <option>Có</option>
                            <option>Không </option>
                        </select>
                    <div className="invalid-feedback">Vui lòng chọn dịch giả.</div>
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col-md-4">
                        <label htmlFor="publisher_vn" className="form-group">Nhà xuất bản *</label>
                            <select id="publisher_vn" className="form-select" required>
                                <option value="">Chọn...</option>
                                <option>Nhà xuất bản Kim Đồng</option>
                                <option>Nhà xuất bản Trẻ </option>
                                <option>Nhà xuất bản Văn học </option>
                            </select>
                        <div className="invalid-feedback">Vui lòng chọn nhà xuất bản.</div>
                    </div>
                    <div className="form-group col-md-4">
                            <label htmlFor="publication_date">Ngày xuất bản *</label>
                            <input
                                type="date"
                                className="form-control"
                                //id="publication_date"
                                //value={publication_date}
                                onChange={(e) => setPublicationDate(e.target.value)}
                                required
                            />
                    </div>
                    <div className="form-group col-md-4">
                            <label htmlFor="edition">Bản *</label>
                            <input
                                type="number"
                                className="form-control"
                                //id="edition"
                                //value={edition}
                                onChange={(e) => setEdition(e.target.value)}
                                required
                            />
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="form-group col-md-6">
                            <label htmlFor="dimensions">Kích thước *</label>
                            <input
                                type="number"
                                className="form-control"
                                //id="dimensions"
                                //value={dimensions}
                                onChange={(e) => setDimensions(e.target.value)}
                                required
                            />
                    </div>
                    <div className="form-group col-md-6">
                            <label htmlFor="number_of_page">Số trang *</label>
                            <input
                                type="number"
                                className="form-control"
                                //id="number_of_page"
                                //value={number_of_page}
                                onChange={(e) => setNumberOfPage(e.target.value)}
                                required
                            />
                    </div>
                </div>
               
                <div className="row mb-3">
                    <div className="col-md-6">
                        <label htmlFor="categorys" className="form-label">Thể loại *</label>
                        <select id="categorys" className="form-select" required>
                            <option value="">Chọn...</option>
                            <option>Sách tiếng việt</option>
                            <option>Sách tư duy-Kỹ năng sống </option>
                            <option>Sách doanh nhân</option>
                            <option>Sách kỹ năng làm việc</option>
                        </select>
                        <div className="invalid-feedback">Vui lòng chọn thể loại.</div>
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="current_seller" className="form-label">Nhà cung cấp *</label>
                        <select id="urrent_seller" className="form-select" required>
                            <option value="">Chọn...</option>
                            <option>Nhà sách Fahasa</option>
                            <option>Eco Trading </option>
                            <option>Sbooks</option>
                            <option>BookShop Trading</option>
                        </select>
                        <div className="invalid-feedback">Vui lòng chọn thể loại.</div>
                    </div>
                </div>
               
 
                <button
                    type="submit"
                    className="btn btn-primary btn-block EditBooks btn-sm "
                    style={{width:"30%", margin:"30px"}}
                    >
                    Cập nhật
                </button>
                <button
                    type="submit"
                    className="btn btn-primary btn-block ListBooks btn-sm "
                    style={{width:"30%",margin:"40px"}}
                    onClick={handleBackClick}    
                    >
                    Quay lại
                </button>
               
            </form>
                </div>
            </div>
 
        </div>
        <Footer/>
        </>
    )
}

export default BookAdminDetail