import Footer from '../components/Footer';
import Header from '../components/Header';
import bookApi from '../api/book';
import sellerApi from '../api/seller';
import categoryApi from '../api/category';
import { useParams, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

function AddBook() {
    const { id } = useParams();
    const navigate = useNavigate(); // Dùng navigate để điều hướng
    const [book, setBook] = useState(null);
    const [sellers, setSellers] = useState([]);
    const [categories, setCategories] = useState([]); // State lưu danh sách categories
    const [error, setError] = useState('');

    // Khởi tạo state để lưu thông tin cập nhật sách
    const [formData, setFormData] = useState({
        images: [],
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
        categories: {},
        current_seller: {},
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

    const fetchSellers = async () => {
        try {
            const response = await sellerApi.getAllSeller(); // Gọi API lấy danh sách seller
            // console.log('dl seller', response.sellers)
            setSellers(response.sellers); // Lưu danh sách seller vào state
        } catch (error) {
            console.error('Lỗi khi lấy danh sách seller:', error);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await categoryApi.getAllCategory(); // Gọi API lấy danh sách category
            // console.log('dl category', response.categories)
            setCategories(response.categories); // Lưu danh sách category vào state
        } catch (error) {
            console.error('Lỗi khi lấy danh sách seller:', error);
        }
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('base_url') || name.startsWith('large_url') 
            || name.startsWith('medium_url') || name.startsWith('small_url')
            || name.startsWith('thumbnail_url')) { 
        // Tìm chỉ số hình ảnh từ name
            const index = name.replace(/[^0-9]/g, ''); // Lấy chỉ số hình ảnh từ name

            // Cập nhật mảng images trong formData
            setFormData((prevData) => {
                const updatedImages = [...prevData.images];
                updatedImages[index] = {
                    ...updatedImages[index],
                    [name.replace(/\d+/, '')]: value, // Cập nhật giá trị tương ứng
                };
                return { ...prevData, images: updatedImages };
            });
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };
    console.log(formData)

    // Hàm cập nhật formData khi chọn seller
    const handleSellerChange = (e) => {
        const selectedSellerId = e.target.value;
        const selectedSeller = sellers.find((seller) => seller.id === parseInt(selectedSellerId));
        setFormData({
            ...formData,
            current_seller: selectedSeller ? { id: selectedSeller.id, name: selectedSeller.name } : {},
        });
    };

    // Hàm cập nhật formData khi chọn category
    const handleCategoryChange = (e) => {
        const selectedCategoryId = e.target.value;
        const selectedCategory = categories.find((category) => category.id === parseInt(selectedCategoryId));
        setFormData({
            ...formData,
            categories: selectedCategory ? { id: selectedCategory.id, name: selectedCategory.name } : {},
        });
    };


    const handleBackClick = () => {
        navigate('/ad'); // Điều hướng về trang listbooks
    };
    useEffect(() => {
        fetchSellers();
        fetchCategories();
    }, []);

    const addImageField = () => {
        setFormData((prevData) => ({
            ...prevData,
            images: [...prevData.images, { base_url: '', large_url: '', medium_url: '', small_url: '', thumbnail_url: '' }]
        }));
    };

    return( <>
        <Header/>
        <div className="container bg-white mt-3">
            <div className="row p-2 ">
            <div className="col-md-4">
                    <h4 className="mt-3">Ảnh</h4>
                    <form className="needs-validation d-flex justify-content-between flex-wrap mt-3" noValidate>
                    {formData.images.map((image, index) => (
                        <>
                        <img 
                            src={image.base_url || 'https://via.placeholder.com/150'}
                            alt='book'
                            className='me-4 '
                            style={{ width: "20%" }}
                        />
                        <div className="form-group mb-3">
                            <label htmlFor={`base_url${index}`}>Base_url</label>
                            <input
                                type="url"
                                className="form-control"
                                id={`base_url${index}`} 
                                name={`base_url${index}`} 
                                value={image.base_url}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group col-5 mb-3">
                            <label htmlFor={`large_url${index}`}>Large_url</label>
                            <input
                                type="url"
                                className="form-control"
                                id={`large_url${index}`} 
                                name={`large_url${index}`} 
                                value={image.large_url}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group  mb-3">
                            <label htmlFor={`medium_url${index}`}>Medium_url</label>
                            <input
                                type="url"
                                className="form-control"
                                id={`medium_url${index}`} 
                                name={`medium_url${index}`}
                                value={image.medium_url}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group col-5  mb-3">
                            <label htmlFor={`small_url${index}`}>Small_url</label>
                            <input
                                type="url"
                                className="form-control"
                                id={`small_url${index}`} 
                                name={`small_url${index}`} 
                                value={image.small_url}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor={`thumbnail_url${index}`}>Thumbnail_url</label>
                            <input
                                type="url"
                                className="form-control"
                                id={`thumbnail_url${index}`} 
                                name={`thumbnail_url${index}`}
                                value={image.thumbnail_url}
                                onChange={handleChange}
                            />
                        </div>
                        </>
                    ))}
                    <button type="button" className="btn btn-primary" onClick={addImageField}>Thêm ảnh</button>
                    </form>
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
                                <label htmlFor="publication_date">Ngày xuất bản*</label>
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
                            {/* <select
                                id="categories"
                                name="categories" // Thêm name để có thể cập nhật formData
                                className="form-select"
                                value={formData.categories} // Gán giá trị cho select
                                onChange={handleChange} // Thêm sự kiện onChange
                                required
                            >
                                <option value="">Chọn...</option> 
                                {categories.map((category) => (
                                    <option key={category.id} value={category.name}>
                                        {category.name}
                                    </option>
                                ))}
                            </select> */}
                            <select id="categories" onChange={handleCategoryChange} className="form-select" required>
                                <option value="">Chọn...</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                            <div className="invalid-feedback">Vui lòng chọn thể loại.</div>
                        </div>
                        <div className="form-group col-md-4">
                            <label htmlFor="current_seller" className="form-label">Nhà xuất bản *</label>
                            {/* <select
                                id="current_seller"
                                name="current_seller" // Thêm name để có thể cập nhật formData
                                className="form-select"
                                value={formData.current_seller} // Gán giá trị cho select
                                onChange={handleChange} // Thêm sự kiện onChange
                                required
                            >
                                <option value="">Chọn...</option> 
                                {sellers.map((seller) => (
                                    <option key={seller.id} value={seller.name}>
                                        {seller.name}
                                    </option>
                                ))}
                            </select> */}
                            <select id="current_seller" onChange={handleSellerChange} className="form-select" required>
                                <option value="">Chọn...</option>
                                {sellers.map((seller) => (
                                    <option key={seller.id} value={seller.id}>
                                        {seller.name}
                                    </option>
                                ))}
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