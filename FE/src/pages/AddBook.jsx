import Footer from '../components/Footer';
import Header from '../components/Header';
import bookApi from '../api/book';
import { useParams, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

function AddBook() {
    const { id } = useParams();
    const navigate = useNavigate(); // Dùng navigate để điều hướng
    const [book, setBook] = useState(null);
    const [error, setError] = useState('');

    // Khởi tạo state để lưu thông tin cập nhật sách
    const [formData, setFormData] = useState({
        images: {
            base_url: '',
            large_url: '',
            medium_url: '',
            small_url: ''
        },
        name: '',
        author: '',
        description: '',
        short_description: '',
        price: '',
        original_price: 0,
        percent: 0,
        quantity_sold: 0,
        quantity_in_stock: 0,
        rating_average: 0,
        loai_bia: '',
        isbn13: '',
        dich_gia: '',
        publisher_vn: '',
        publication_date: '',
        edition: '',
        dimensions: '',
        number_of_page: 0,
        categories: '',
        current_seller: ''
    });

    // Lấy thông tin sách từ API khi component được mount
    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            console.log('Dữ liệu gửi đi:', formData);
            await bookApi.addBook(formData);
            alert('Tạo sách thành công!');
            navigate('/ad'); // Điều hướng về trang /ad
        } catch (error) {
            console.error('Lỗi khi tạo sách:', error.response);
            setError('Không thể tạo sách.');
        }
    }


    const handleChange = (e) => {
        const { name, value } = e.target;
        if (['base_url', 'large_url', 'medium_url', 'small_url'].includes(name)) {
            // Cập nhật thông tin hình ảnh
            setFormData((prevData) => ({
                ...prevData,
                images: {
                    ...prevData.images,
                    [name]: value,
                },
            }));
        } else {
            // Cập nhật các thông tin khác
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const handleBackClick = () => {
        navigate('/ad'); // Điều hướng về trang listbooks
    };


    return( <>
        <Header/>
        <div className="container bg-white mt-3">
            <div className="row p-2 ">
            <div className="col-md-4">
                    <img src={""} alt='base_url' style={{width:"20%"}}></img>
                    <h3 className="mt-3">Ảnh </h3>
                    {['base_url', 'large_url', 'medium_url', 'small_url'].map((field) => (
                            <div className="form-group mb-3" key={field}>
                                <label htmlFor={field}>{field}</label>
                                <input
                                    type="url"
                                    className="form-control"
                                    id={field}
                                    name={field}
                                    value={formData.images[field]}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                    ))}
                </div>
                <div className="col-md-8">
                    <h3>Chỉnh sửa thông tin sách</h3>
                    <form className="needs-validation d-flex flex-wrap justify-content-between mt-3" noValidate>
                        <div className="form-group col-md-7 mb-3">
                                <label htmlFor="name">Tên sách*</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                        </div>
                        <div className="form-group col-md-4">
                                <label htmlFor="author">Tên tác giả</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="author"
                                    name="author"
                                    value={formData.author}
                                    onChange={handleChange}
                                />
                        </div>
                        <div className="form-group col-md-12 h-100 mb-3">
                            <label htmlFor="description">Mô tả sách*</label>
                            <input
                                type="text"
                                className="form-control"
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group col-md-12 mb-3">
                                <label htmlFor="short_description">Tóm tắt nội dung sách*</label>
                                <input 
                                    type="text"
                                    className="form-control"
                                    id="short_description"
                                    name="short_description"
                                    value={formData.short_description}
                                    onChange={handleChange}
                                    required
                                />
                        </div>
                        <div className="form-group col-md-2 mb-3">
                                <label htmlFor="price">Giá bán*</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="price"
                                        name='price'
                                        value={formData.price}
                                        onChange={handleChange}
                                        required
                                    />
                        </div>
                        <div className="form-group col-md-3">
                            <label htmlFor="original_price">Giá gốc*</label>
                            <input
                                type="number"
                                className="form-control"
                                id="original_price"
                                name='original_price'
                                value={formData.original_price}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group col-md-2">
                            <label htmlFor="percent">Phần trăm</label>
                            <input
                                type="number"
                                className="form-control"
                                id="percent"
                                name='percent'
                                value={formData.percent}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group col-md-3 mb-3">
                            <label htmlFor="quantity_sold">Số lượng đã bán </label>
                            <input
                                type="number"
                                className="form-control"
                                id="quantity_sold"
                                name='quantity_sold'
                                value={formData.quantity_sold}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group col-md-3 mb-3">
                            <label htmlFor="quantity_in_stock">Số lượng trong kho* </label>
                            <input
                                type="number"
                                className="form-control"
                                id="quantity_in_stock"
                                name='quantity_in_stock'
                                value={formData.quantity_in_stock}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group col-md-4">
                            <label htmlFor="rating_average">Đánh giá trung bình*</label>
                            <input
                                type="number"
                                className="form-control"
                                id="rating_average"
                                name='rating_average'
                                value={formData.rating_average}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group col-md-4">
                                <label htmlFor="loai_bia">Loại bìa</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="loai_bia"
                                     name='loai_bia'
                                    value={formData.loai_bia}
                                    onChange={handleChange}
                                />
                        </div>
                        <div className="form-group col-md-3">
                            <label htmlFor="isbn13">IBN-13</label>
                            <input
                                type="number"
                                className="form-control"
                                id="isbn13"
                                 name='isbn13'
                                value={formData.isbn13}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group col-md-4 mb-3">
                            <label htmlFor="dich_gia">Dịch giả</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="dich_gia"
                                     name='dich_gia'
                                    value={formData.dich_gia}
                                    onChange={handleChange}
                                />
                        <div className="invalid-feedback">Vui lòng chọn dịch giả.</div>
                        </div>
                        <div className="form-group col-md-4">
                            <label htmlFor="publisher_vn" className="form-group">Công ty phát hành</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="publisher_vn"
                                     name='publisher_vn'
                                    value={formData.publisher_vn}
                                    onChange={handleChange}
                                />
                        </div>
                        <div className="form-group col-md-3">
                                <label htmlFor="publication_date">Ngày xuất bản</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    id="publication_date"
                                     name='publication_date'
                                    value={formData.publication_date}
                                    onChange={handleChange}
                                />
                        </div>
                        <div className="form-group col-md-4 mb-3">
                                <label htmlFor="edition">Phiên bản</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="edition"
                                     name='edition'
                                    defaultValue={formData.edition}
                                    onChange={handleChange}
                                />
                        </div>
                        <div className="form-group col-md-4">
                                <label htmlFor="dimensions">Kích thước</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="dimensions"
                                     name='dimensions'
                                    value={formData.dimensions}
                                    onChange={handleChange}
                                />
                        </div>
                        <div className="form-group col-md-3 mb-3">
                                <label htmlFor="number_of_page">Số trang</label>
                                <input
                                    type="number"
                                    className="form-control mt-2"
                                    id="number_of_page"
                                    name='number_of_page'
                                    value={formData.number_of_page}
                                    onChange={handleChange}
                                />
                        </div>
                        <div className="form-group col-md-4">
                            <label htmlFor="categories" className="form-label">Thể loại *</label>
                            <select
                                id="categories"
                                name="categories" // Thêm name để có thể cập nhật formData
                                className="form-select"
                                value={formData.categories} // Gán giá trị cho select
                                onChange={handleChange} // Thêm sự kiện onChange
                                required
                            >
                                <option value={""}>Chọn...</option>
                                <option value={"Sách tiếng việt"}>Sách tiếng việt</option>
                                <option value={"Sách tư duy-Kỹ năng sống"}>Sách tư duy-Kỹ năng sống </option>
                                <option value={"Sách doanh nhân"}>Sách doanh nhân</option>
                                <option value={"Sách kỹ năng làm việc"}>Sách kỹ năng làm việc</option>
                            </select>
                            <div className="invalid-feedback">Vui lòng chọn thể loại.</div>
                        </div>
                        <div className="form-group col-md-4">
                            <label htmlFor="current_seller" className="form-label">Nhà xuất bản *</label>
                            <select
                                id="current_seller"
                                name="current_seller" // Thêm name để có thể cập nhật formData
                                className="form-select"
                                value={formData.current_seller} // Gán giá trị cho select
                                onChange={handleChange} // Thêm sự kiện onChange
                                required
                            >
                                <option value="">Chọn...</option> {/* Giá trị mặc định cho option */}
                                <option value="Nhà sách Fahasa">Nhà sách Fahasa</option>
                                <option value="Eco Trading">Eco Trading</option>
                                <option value="Sbooks">Sbooks</option>
                                <option value="BookShop Trading">BookShop Trading</option> 
                            </select>
                            <div className="invalid-feedback">Vui lòng chọn nhà xuất bản</div>
                        </div>
                <button
                    type="submit"
                    className="btn my-4 btn-primary btn-block EditBooks btn-sm "
                    style={{width:"48%", height:"48px"}}
                    onClick={handleCreate}
                    >
                    Tạo mới
                </button>
                <button
                    type="submit"
                    className="btn my-4 btn-primary btn-block ListBooks btn-sm "
                    style={{width:"48%"}}
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

export default AddBook