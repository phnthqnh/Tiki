import React, { useCallback, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Thêm useLocation vào import
import Book from "../components/Book";
import bookApi from '../api/book'; // Sử dụng API để fetch dữ liệu từ backend
import ListL from "../components/ListL";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Filter from "../components/Filter";
import Search from "../components/Search"; // Import component Search
import './Home.css';

function useQuery() {
    return new URLSearchParams(useLocation().search);
}
  
function removeAccents(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, 'd').replace(/Đ/g, 'D');
}

function Home() {
    const navigate = useNavigate();
    const query = useQuery();
    const searchQuery = removeAccents(query.get('q')?.toLowerCase() || '');
    const [books, setBooks] = useState([]); // Sách lấy từ backend
    const [filteredBooks, setFilteredBooks] = useState([]); // Danh sách sách đã lọc
    const [loading, setLoading] = useState(true); // Trạng thái đang tải dữ liệu
    const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
    const [totalPages, setTotalPages] = useState(1); // Tổng số trang

    // Fetch dữ liệu sách từ API khi component được mount hoặc khi currentPage thay đổi
    useEffect(() => {
        const fetchBooks = async (page = 1) => {
            setLoading(true);
            try {
                const params = { page }; // Thêm tham số phân trang
                const response = await bookApi.getAllBook(params); // Gọi API để lấy danh sách sách
                
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
    }, [currentPage]); // Gọi lại hàm khi currentPage thay đổi

    useEffect(() => {
        const filtered = books.filter(book =>
            removeAccents(book.name.toLowerCase()).includes(searchQuery)
        );
        setFilteredBooks(filtered);
    }, [searchQuery]);

    // Hàm để xử lý khi bộ lọc thay đổi
    const handleFilterBooks = useCallback((filteredBooks) => {
        setFilteredBooks(filteredBooks);
    }, []);

    // Hàm xử lý khi nhấn vào một cuốn sách
    const handleBookClick = (id) => {
        navigate(`/book/${id}`);
    };

    // Hàm để xử lý chuyển trang
    const handlePageChange = (page) => {
        setCurrentPage(page); // Cập nhật trang hiện tại
    };

    return (
        <>
            <Header />

            <div className="d-none d-lg-block position-relative">
                <div className="page-header pt-2 border-radius-xl">
                    <div className="container h-100 px-7">
                        <div className="row">
                            <div className="col-lg-7 mt-auto mb-3">
                                <p className="mb-0">
                                    <a href="/" className="text-secondary" onClick={() => navigate("/")}>
                                        Trang chủ
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bộ lọc chỉ hiện trên di động */}
            <div className="col-12 d-sm-none">
                <Filter books={books} onFilterBooks={handleFilterBooks} />
            </div>

            <div className="container mt-3">
                <div className="row d-flex justify-content-between">
                    {/* Sidebar danh sách lọc */}
                    <div className="col-2 d-none d-lg-block mt-1">
                        <ListL books={books} onFilterBooks={handleFilterBooks} />
                    </div>

                    {/* Hiển thị danh sách sách */}
                    <div className="col-sm-10 col-12 d-flex flex-wrap" id="book">
                        <div className="row row-cols-2 row-cols-sm-3 row-cols-md-4 row-cols-lg-5 w-100 gap-lg-0 h-25">
                            {loading ? (
                                <div className="w-100 text-center">
                                    <p>Đang tải dữ liệu...</p>
                                </div>
                            ) : filteredBooks.length > 0 ? (
                                filteredBooks.map((book) => (
                                    <div id="bookid" className="col-sm-2 mb-4" key={book.id}>
                                        <Book data={book} onClick={() => handleBookClick(book.id)} />
                                    </div>
                                ))
                            ) : (
                                <div className="w-100 text-center">
                                    <p>Không tìm thấy cuốn sách nào</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

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
            </div>
            <Footer />
        </>
    );
}

export default Home;
