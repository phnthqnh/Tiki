import React, { useCallback, useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom"; // Thêm useLocation vào import
import BookAdmin from "../components/BookAdmin";
import bookApi from '../api/book'; // Sử dụng API để fetch dữ liệu từ backend
import Header from "../components/Header";
import Footer from "../components/Footer";
import './Home.css';
import sellerApi from "../api/seller";

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
                    console.log('response', response)
                    setSellers(response.sellers)
                    setFilteredSellers(response.sellers);
                    // setOrders(response); // Lưu danh sách đơn hàng vào state
                } catch (error) {
                    console.error("Có lỗi xảy ra khi lấy đơn hàng:", error);
                }
            };
    
            fetchSellers(); 
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

    // // Hàm để xử lý khi bộ lọc thay đổi
    // const handleFilterBooks = useCallback((filteredBooks) => {
    //     setFilteredBooks(filteredBooks);
    // }, []);

    // Hàm xử lý khi nhấn vào một cuốn sách
    // const handleBookClick = (id) => {
    //     navigate(`/book/${id}`);
    // };

    // Hàm để xử lý chuyển trang
    const handlePageChange = (page) => {
        setCurrentPage(page); // Cập nhật trang hiện tại
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
                                            <th className="align-middle" scope="col">Tên người bán</th>
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
                                                <td className="text-center align-middle">{seller.name}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="2" className="text-center">
                                                <p>Không tìm thấy người bán nào</p>
                                            </td>
                                        </tr>
                                    )
                                )  : (
                                    <tr>
                                        <td colSpan="9" className="text-center">
                                            <p>Chọn một loại danh sách từ sidebar</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>    
                    </div>
                </div>
                {currentView === 'books' && (
                    <>
                        <Link className='btn btn-primary mt-3' to="/addbooks" style={{marginLeft:"90%"}}>Thêm sách</Link>
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
                        <Link className='btn btn-primary mt-3' to="/addbooks" style={{marginLeft:"90%"}}>Thêm mới</Link>
                        {/* Phân trang (pagination) */}
                    </>
                )}
            </div>
            <Footer />
        </>
    );
}

export default HomeAdmin;
