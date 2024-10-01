import React, { useCallback, useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom"; // Thêm useLocation vào import
import BookAdmin from "../components/BookAdmin";
import { Modal, Button, Form } from 'react-bootstrap';
import bookApi from '../api/book'; // Sử dụng API để fetch dữ liệu từ backend
import Header from "../components/Header";
import Footer from "../components/Footer";
import './Home.css';
import sellerApi from "../api/seller";
import categoryApi from "../api/category";
import orderApi from "../api/order";
import Dong from "../components/Dong";

function useQuery() {
    return new URLSearchParams(useLocation().search);
}
  
function removeAccents(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, 'd').replace(/Đ/g, 'D');
}

function HomeAdmin() {
    const navigate = useNavigate();
    const query = useQuery();
    const searchQuery = removeAccents(query.get('q')?.toLowerCase() || '');
    const [books, setBooks] = useState([]); // Sách lấy từ backend
    const [filteredBooks, setFilteredBooks] = useState([]); // Danh sách sách đã lọc
    const [loading, setLoading] = useState(true); // Trạng thái đang tải dữ liệu
    const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
    const [totalPages, setTotalPages] = useState(1); // Tổng số trang
    const [sellers, setSellers] = useState([]); // Sách lấy từ backend
    const [filteredSellers, setFilteredSellers] = useState([]); // Dữ liệu sellers
    const [currentView, setCurrentView] = useState('books');
    const [categories, setCategories] = useState([]);
    const [filteredCategories, setFilteredCategories] = useState([]);

    // Thông tin cho việc thêm mới thể loại và người bán
    const [cateName, setCateName] = useState('');
    const [cateId, setCateId] = useState(null);

    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);

    const [sellerName, setSellerName] = useState('');
    const [sellerId, setSellerId] = useState(null);

    const [orderStatus, setOrderStatus] = useState(null);
    const [orderMVD, setOrderMVD] = useState(null);


    // Xử lý việc mở hộp thoại thêm mới
    const [activeModal, setActiveModal] = useState(null);
    const handleShow = (modalName, id) => {
        setActiveModal(modalName);
        setSellerId(id);
        setCateId(id);
        setOrderMVD(id);
    };
    const handleClose = () => setActiveModal(null);    
    

    // Thêm thể loại
    const handleAddCategory = async () => {
        try {
            await categoryApi.addCategory(cateName);
            alert("Thêm mới thể loại thành công");
            setCateName('');
            handleClose();
            //Cập nhật lại danh sách
            const response = await categoryApi.getAllCategory();
            setCategories(response.categories)
            setFilteredCategories(response.categories);
        } catch(error) {
            console.error("Có lỗi xảy ra khi thêm thể loại:", error);
            alert("Có lỗi xảy ra khi thêm thể loại."); 
        }
    };

    const handleUpdateCategory = async () => {
        try {
            await categoryApi.updateCategory(cateId, cateName);
            alert("Cập nhật thể loại thành công");
            
            setCateName(''); 
            handleClose();
            
            //Cập nhật lại danh sách
            const response = await categoryApi.getAllCategory();
            setCategories(response.categories)
            setFilteredCategories(response.categories);
        } catch (error) {
            console.error("Có lỗi xảy ra khi cập nhật thể loại:", error);
            alert("Có lỗi xảy ra khi cập nhật thể loại.");
        }
    };

    const handleDeleteCategory = async () => {
        try {
            await categoryApi.deleteCategory(cateId); 
            alert("Xóa thể loại thành công");
    
            //Cập nhật lại danh sách
            const response = await categoryApi.getAllCategory();
            setCategories(response.categories)
            setFilteredCategories(response.categories);
    
            handleClose(); // Đóng modal
        } catch (error) {
            console.error("Có lỗi xảy ra khi xóa thể loại:", error);
            alert("Có lỗi xảy ra khi xóa thể loại");
        }
        };

    //Thêm người bán
    const handleAddSeller = async () => {
        try {
            await sellerApi.addSeller(sellerName);
            alert("Thêm mới người bán thành công");
            setSellerName('');
            handleClose();
            //Cập nhật lại danh sách
            const response = await sellerApi.getAllSeller();
            setSellers(response.sellers)
            setFilteredSellers(response.sellers);
        } catch(error) {
            console.error("Có lỗi xảy ra khi thêm người bán:", error);
            alert("Có lỗi xảy ra khi thêm người bán."); 
        }
    };

    //Sửa người bán
    const handleUpdateSeller = async () => {
        try {
            // Giả sử sellerId là ID của người bán cần cập nhật
            await sellerApi.updateSeller(sellerId, sellerName);
            alert("Cập nhật người bán thành công");
            
            setSellerName(''); // Reset tên người bán
            handleClose(); // Đóng modal
            
            // Cập nhật lại danh sách người bán
            const response = await sellerApi.getAllSeller();
            setSellers(response.sellers); // Cập nhật state
            setFilteredSellers(response.sellers); // Cập nhật danh sách đã lọc (nếu có)
        } catch (error) {
            console.error("Có lỗi xảy ra khi cập nhật người bán:", error);
            alert("Có lỗi xảy ra khi cập nhật người bán.");
        }
    };

    const handleDeleteSeller = async () => {
    try {
        // Gọi API để xóa người bán theo ID
        await sellerApi.deleteSeller(sellerId); // sellerId là ID của người bán cần xóa
        alert("Xóa người bán thành công");

        // Cập nhật lại danh sách người bán
        const response = await sellerApi.getAllSeller();
        setSellers(response.sellers);
        setFilteredSellers(response.sellers);

        handleClose(); // Đóng modal
    } catch (error) {
        console.error("Có lỗi xảy ra khi xóa người bán:", error);
        alert("Có lỗi xảy ra khi xóa người bán.");
    }
    };


    // const handleOrderShow = (modalName, id) => {
    //     setActiveModal(modalName);
    //     setOrderMVD(id)
        
    // };
    // const handleOrderShow = () => setActiveModal(null);    
 

    // Fetch dữ liệu sách từ API khi component được mount hoặc khi currentPage thay đổi
    useEffect(() => {
        if (currentView === 'books') {
            const fetchBooks = async (page = 1) => {
                setLoading(true);
                try {
                    const params = { page }; // Thêm tham số phân trang
                    const response = await bookApi.AllBooks(params); // Gọi API để lấy danh sách sách
                    if (response) {
                        setBooks(response.books || []); // Cập nhật dữ liệu sách từ API
                        setFilteredBooks(response.books || []); // Đặt mặc định sách được hiển thị là tất cả sách
                        setTotalPages(response.total_pages || 1); // Cập nhật tổng số trang từ API
                    } else {
                        console.error("Lỗi trong phản hồi API:", response);
                    }
                } catch (error) {
                    console.error("Lỗi khi lấy sách:", error);
                    alert("Có lỗi xảy ra khi tải sách. Vui lòng thử lại sau.");
                } finally {
                    setLoading(false); // Kết thúc trạng thái tải
                }
            };
            fetchBooks(currentPage); // Gọi hàm fetch với trang hiện tại
        } else if (currentView === 'sellers') {
            // setLoading(true);
            const fetchSellers = async () => {
                try {
                    const response = await sellerApi.getAllSeller(); // Sử dụng phương thức getUserOrder
                    console.log('DL người bán:', response)
                    setSellers(response.sellers)
                    setFilteredSellers(response.sellers);
                    // setOrders(response); // Lưu danh sách đơn hàng vào state
                } catch (error) {
                    console.error("Có lỗi xảy ra khi lấy đơn hàng:", error);
                }
            };
    
            fetchSellers(); 
        } else if (currentView === 'categories') {
            const fetchCategories = async () => {
                try {
                    const response = await categoryApi.getAllCategory();
                    console.log('DL thể loại:', response)
                    setCategories(response.categories)
                    setFilteredCategories(response.categories);
                } catch (error) {
                    console.error("Có lỗi xảy ra khi lấy dữ liệu thể loại sách:", error);
                }
            };

            fetchCategories(); 
        } else if (currentView === 'orders') {
            const fetchOrders = async () => {
                try {
                    const response = await orderApi.AdminOrder();
                    // console.log('DL order:', response)
                    setOrders(response.orders)
                    // console.log('DL orders:', orders)
                    setFilteredOrders(response.orders);
                } catch (error) {
                    console.error("Có lỗi xảy ra khi lấy dữ liệu danh sách đơn hàng", error);
                }
            };

            fetchOrders(); 
        }
    }, [currentView, currentPage]); // Gọi lại hàm khi currentView hoặc currentPage thay đổi
    

    useEffect(() => {
        const filteredBook = books.filter(book =>
            removeAccents(book.name.toLowerCase()).includes(searchQuery)
        );
        setFilteredBooks(filteredBook);
        // const filteredSeller = sellers.filter(seller =>
        //     removeAccents(seller.name.toLowerCase()).includes(searchQuery)
        // );
        // setFilteredBooks(filteredSeller);
    }, [searchQuery]);

    // Hàm để xử lý chuyển trang
    const handlePageChange = (page) => {
        setCurrentPage(page); // Cập nhật trang hiện tại
    };


    const handleUpdateOrder = async () => {
        try {
            await orderApi.updateStatus(orderMVD, orderStatus);
            alert("Cập nhật trạng thái đơn hàng thành công");

            setOrderStatus(''); 
            // handleClose();

            //Cập nhật lại danh sách
            const response = await orderApi.AdminOrder();
            setOrders(response.orders)
                    // console.log('DL orders:', orders)
            setFilteredOrders(response.orders);
        } catch (error) {
            console.error("Có lỗi xảy ra khi cập nhật đơn hàng:", error);
            alert("Phải chọn giá trị trạng thái");
        }
    };

  

    return (
        <>
            <Header />

            <div className="container mt-3">
                <div className="row d-flex justify-content-between">
                    {/* Sidebar danh sách lọc */}
                    <div className="col-1 h-100 bg-primary-subtle text-center d-none d-lg-block mt-1">
                        <div onClick={() => setCurrentView('books')} style={{ cursor: 'pointer', fontWeight: currentView === 'books' ? 'bold' : 'normal' }}>
                            Books
                        </div>
                        <div onClick={() => setCurrentView('categories')} style={{ cursor: 'pointer', fontWeight: currentView === 'categories' ? 'bold' : 'normal' }}>
                            Categories
                        </div>
                        <div onClick={() => setCurrentView('sellers')} style={{ cursor: 'pointer', fontWeight: currentView === 'sellers' ? 'bold' : 'normal' }}>
                            Sellers
                        </div>
                        <div onClick={() => setCurrentView('orders')} style={{ cursor: 'pointer', fontWeight: currentView === 'orders' ? 'bold' : 'normal' }}>
                            Orders
                        </div>
                    </div>

                    {/* Hiển thị danh sách sách */}
                    <div className="col-11 d-flex flex-column" id="book">
                        <table class="table table-striped table-hover">
                            <thead>
                                <tr className="text-center">
                                    {/* Hiển thị tiêu đề dựa trên loại danh sách */}
                                    {currentView === 'books' && (
                                        <>
                                        <th className="align-middle" scope="col">ID</th>
                                        <th className="align-middle" scope="col">Ảnh</th>
                                        <th className="align-middle" scope="col">Tên sách</th>
                                        <th className="align-middle" scope="col">Tác giả</th>
                                        <th className="align-middle" scope="col">Giá gốc</th>
                                        <th className="align-middle" scope="col">Giá bán</th>
                                        <th className="align-middle" scope="col">Đã bán</th>
                                        <th className="align-middle" scope="col">Trong kho</th>
                                        <th className="align-middle" style={{minWidth: '111px'}} scope="col"></th>
                                        </>
                                    )}
                                    {currentView === 'sellers' && (
                                        <>
                                            <th className="align-middle" scope="col">ID</th>
                                            <th className="align-middle" scope="col" style={{paddingRight:'125px'}}>Tên người bán</th>
                                        </>
                                    )}
                                    {currentView === 'categories' && (
                                        <>
                                            <th className="align-middle" scope="col">ID</th>
                                            <th className="align-middle" scope="col" style={{paddingRight:'125px'}}>Tên thể loại</th>
                                        </>
                                    )}
                                </tr>
                            </thead> 
                            <tbody>
                                { loading ? (
                                    <tr>
                                        <td colSpan="9" className="text-center">
                                        <p>Đang tải dữ liệu...</p>
                                        </td>
                                    </tr>
                                ) : currentView === 'books' ? (
                                    filteredBooks.length > 0 ? (
                                    filteredBooks.map((book) => (
                                            <BookAdmin key={book.id} data={book}/>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="9" className="text-center">
                                            <p>Không tìm thấy cuốn sách nào</p>
                                        </td>
                                    </tr>
                                    
                                    )
                                    
                                ) : currentView === 'sellers' ? (
                                    filteredSellers.length > 0 ? (
                                        filteredSellers.map((seller) => (
                                            <tr key={seller.id}>
                                                <td className="text-center align-middle">{seller.id}</td>
                                                <td className="text-center align-middle">
                                                    {seller.name}
                                                    <div className="float-end">
                                                        <Button className="me-2" variant="primary" onClick={() => handleShow('seller-update', seller.id)}>Sửa</Button>
                                                        <Button variant="danger" onClick={() => handleShow('seller-delete', seller.id)}>Xóa</Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="2" className="text-center">
                                                <p>Không tìm thấy người bán nào</p>
                                            </td>
                                        </tr>
                                    )
                                ) : currentView === 'categories' ? (
                                    filteredCategories.length > 0 ? (
                                        filteredCategories.map((category) => (
                                            <tr key={category.id}>
                                                <td className="text-center align-middle">{category.id}</td>
                                                <td className="text-center align-middle">
                                                    {category.name}
                                                    <div className="float-end">
                                                        <Button className="me-2" variant="primary" onClick={() => handleShow('category-update', category.id)}>Sửa</Button>
                                                        <Button variant="danger" onClick={() => handleShow('category-delete', category.id)}>Xóa</Button>
                                                    </div>
                                                    </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="2" className="text-center">
                                                <p>Không tìm thấy thể loại nào</p>
                                            </td>
                                        </tr>
                                    )
                                ) : currentView === 'orders' ? (
                                    filteredOrders.length > 0 ? (
                                        filteredOrders.map((order) => (
                                            <>
                                            <div key={order.tracking_number} className="card p-3 mb-3">
                                                <div className="row">
                                                    <div className="card-header bg-white py-1 d-flex justify-content-between">
                                                        <Link className="mb-2 link-underline link-underline-opacity-0 text-black" 
                                                        to={`/ad/book/${order.tracking_number}`}>
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
                                                                    <h5>{item.name}</h5>
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
                                                    {order.status === "Giao thành công" ? (
                                                        <button className='btn btn-secondary' disabled>Hoàn thành đơn hàng</button>
                                                    ) : (
                                                    <button className='btn btn-danger'  onClick={() => handleShow('order-update', order.tracking_number)}>Cập nhật trạng thái</button>
                                                    )}
                                                </div>
                                                </div>
                                            </div>
                                        </>
                                        ))
                                    ) : (
                                        <p>Không có đơn hàng nào.</p>
                                    )
                                ): (
                                    <tr>
                                        <td colSpan="9" className="text-center">
                                            <p>Chọn một chức năng từ sidebar</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>    
                    </div>
                </div>
                {currentView === 'books' && (
                    <>
                        <Link className='btn btn-primary mt-3' to="/ad/book/create" style={{marginLeft:"90%"}}>Thêm sách</Link>
                        {/* Phân trang (pagination) */}
                        <div className="container d-none d-sm-flex d-flex m-5 justify-content-center align-items-center gap-3">
                            {[...Array(totalPages).keys()].map((page) => (
                                <div key={page + 1}>
                                    <button
                                        type="button"
                                        className={`btn btn-outline ${currentPage === page + 1 ? 'btn-primary active' : 'text-secondary'}`}
                                        onClick={() => handlePageChange(page + 1)}
                                    >
                                        {page + 1}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </>
                )}
                {currentView === 'sellers' && (
                    <>
                        <Link className='btn btn-primary mt-3' style={{marginLeft:"90%"}} onClick={() => handleShow('seller')}>Thêm mới</Link>
                    </>
                )}
                {currentView === 'categories' && (
                    <>
                        <Link className='btn btn-primary mt-3' style={{marginLeft:"90%"}} onClick={() => handleShow('category')}>Thêm mới</Link>
                    </>
                )}
            </div>
            {/* Sửa trạng thái */}
            <Modal show={activeModal === 'order-update'} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Cập nhật trạng thái đơn hàng {orderMVD}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={(e) => e.preventDefault()}>
                        <Form.Group>
                            <Form.Label>Chọn trạng thái đơn hàng mới</Form.Label>
                            <select 
                                className="form-control"
                                value={orderStatus} 
                                onChange={(e) => setOrderStatus(e.target.value)}
                            >
                                <option value="">Chọn...</option>
                                <option value="Đang chờ xác nhận">Đang chờ xác nhận</option>
                                <option value="Đang chuẩn bị hàng">Đang chuẩn bị hàng</option>
                                <option value="Đang giao hàng">Đang giao hàng</option>
                                <option value="Giao thành công">Giao thành công</option>
                                <option value="Bị hủy">Bị hủy</option>
                            </select>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Đóng
                    </Button>
                    <Button variant="primary" onClick={handleUpdateOrder}>
                        Cập nhật
                    </Button>
                </Modal.Footer>
            </Modal>
            {/* Hộp thoại thêm thể loại sách */}
            <Modal show={activeModal === 'category'} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Thêm mới thể loại</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={(e) => e.preventDefault()}>
                        <Form.Group controlId="formCategoryName">
                            <Form.Label>Tên thể loại</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Nhập tên thể loại"
                                value={cateName}
                                onChange={(e) => setCateName(e.target.value)}
                                required
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Đóng
                    </Button>
                    <Button variant="primary" onClick={handleAddCategory}>
                        Thêm
                    </Button>
                </Modal.Footer>
            </Modal>
            {/* Sửa thể loại */}
            <Modal show={activeModal === 'category-update'} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Sửa thể loại</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={(e) => e.preventDefault()}>
                        <Form.Group>
                            <Form.Label>Tên thể loại mới</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Nhập tên thể loại mới"
                                value={cateName}
                                onChange={(e) => setCateName(e.target.value)}
                                required
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Đóng
                    </Button>
                    <Button variant="primary" onClick={handleUpdateCategory}>
                        Sửa
                    </Button>
                </Modal.Footer>
            </Modal>
            {/* Xóa thể loại */}
            <Modal show={activeModal === 'category-delete'} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Xóa Thể Loại</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Bạn có chắc chắn muốn xóa thể loại này không?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Hủy
                    </Button>
                    <Button variant="danger" onClick={handleDeleteCategory}>
                        Xóa
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Thêm mới người bán */}
            <Modal show={activeModal === 'seller'} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Thêm mới người bán</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={(e) => e.preventDefault()}>
                        <Form.Group controlId="formCategoryName">
                            <Form.Label>Tên người bán</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Nhập tên người bán"
                                value={sellerName}
                                onChange={(e) => setSellerName(e.target.value)}
                                required
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Đóng
                    </Button>
                    <Button variant="primary" onClick={handleAddSeller}>
                        Thêm
                    </Button>
                </Modal.Footer>
            </Modal>
            {/* Sửa người bán */}
            <Modal show={activeModal === 'seller-update'} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Sửa người bán</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={(e) => e.preventDefault()}>
                        <Form.Group>
                            <Form.Label>Tên người bán mới</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Nhập tên người bán mới"
                                value={sellerName}
                                onChange={(e) => setSellerName(e.target.value)}
                                required
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Đóng
                    </Button>
                    <Button variant="primary" onClick={handleUpdateSeller}>
                        Sửa
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={activeModal === 'category-update'} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Sửa thể loại</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={(e) => e.preventDefault()}>
                        <Form.Group>
                            <Form.Label>Tên thể loại mới</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Nhập tên thể loại mới"
                                value={cateName}
                                onChange={(e) => setCateName(e.target.value)}
                                required
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Đóng
                    </Button>
                    <Button variant="primary" onClick={handleUpdateCategory}>
                        Sửa
                    </Button>
                </Modal.Footer>
            </Modal>
            
            {/* Xóa người bán */}
            <Modal show={activeModal === 'seller-delete'} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Xóa Người Bán</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Bạn có chắc chắn muốn xóa người bán này không?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Hủy
                    </Button>
                    <Button variant="danger" onClick={handleDeleteSeller}>
                        Xóa
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={activeModal === 'category-delete'} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Xóa Thể Loại</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Bạn có chắc chắn muốn xóa thể loại này không?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Hủy
                    </Button>
                    <Button variant="danger" onClick={handleDeleteCategory}>
                        Xóa
                    </Button>
                </Modal.Footer>
            </Modal>

            <Footer />
        </>
    );
}

export default HomeAdmin;
