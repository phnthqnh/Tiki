import React, { useContext, useState, useEffect } from 'react' // Hook của React dùng để lấy giá trị từ context. Ở đây dùng để truy cập thông tin giỏ hàng từ CartContext
import Search from "./Search"
import { Link } from "react-router-dom"
import vecto from "../images/Vector.png"
import ngan from '../images/ngan.png'
import { Navbar, Container, Col } from 'react-bootstrap'
import search from '../images/search.png'
import './Book.css'
import { CartContext } from "./CartContext"
import photo from '../images/logo.png'
import cartApi from '../api/cart'
import './Book.css'
import { useNavigate, useLocation } from 'react-router-dom'

function Header() {
    const { cartItems, setCartItems } = useContext(CartContext); // Lấy thông tin giỏ hàng từ CartContext
    const [totalBook, setTotalBook] = useState(0); // Trạng thái để lưu tổng số sách
    const [showDropdown, setShowDropdown] = useState(false)
    const navigate = useNavigate();
    const location = useLocation();

    const username = localStorage.getItem('username');
    const isLoggedIn = Boolean(username); // Trả về true nếu username tồn tại, ngược lại false
    const [is_staff, setIsStaff] = useState(false);
    // const is_staff = false

    // Kiểm tra giá trị khi load component
    useEffect(() => {
        const is_staff = localStorage.getItem('is_staff');
        setIsStaff(is_staff === 'true'); // Đảm bảo so sánh đúng kiểu
    }, []);
    // console.log("NV: ", is_staff);

    const handleCartClick = (e) => {
        if (!isLoggedIn) {
            e.preventDefault(); // Ngăn chặn hành vi mặc định của <Link>
            alert("Chưa đăng nhập, vui lòng đăng nhập trước!");
            navigate('/login');
            return;
        }
        if (is_staff) {
            e.preventDefault();
            alert("Admin không có giỏ hàng");
            navigate('/ad');
            return;
        }
        if (location.pathname === `/buy/cart/${username}`) {
            e.preventDefault();
            alert("Bạn đang ở trong giỏ hàng!");
        }
        else {
            e.preventDefault();
            navigate(`/buy/cart/${username}`);
        }
    };

    useEffect(() => {
        const fetchTotalBook = async () => {
            try {
                if (username) {
                    const response = await cartApi.getTotalCart(username); // Giả định response có cấu trúc { total: số lượng sách }
                    // console.log(response)
                    setTotalBook(response.total); // Gán tổng số sách vào state
                }
            } catch (error) {
                console.error("Lỗi khi lấy tổng sách trong giỏ hàng:", error);
            }
        };
        fetchTotalBook();
    }, [username]);

    const handleLogout = () => {
        const confirmLogout = window.confirm("Bạn có chắc chắn muốn đăng xuất khỏi tài khoản không?");
        // nếu người dùng chọn "OK" thì hiển thị alter('Đã đăng xuất)

        if (confirmLogout) {
            // Xóa token và tên người dùng khỏi localStorage
            localStorage.removeItem('access');
            localStorage.removeItem('refresh');
            localStorage.removeItem('username');
            alert('Đăng xuất thành công!');
            // setUsername(null);

            // Thực hiện các thao tác khác cần thiết sau khi đăng xuất (ví dụ: điều hướng đến trang đăng nhập)
            // Ví dụ: sử dụng useNavigate từ react-router-dom để điều hướng
            navigate('/');
            // window.location.reload(); // Tải lại trang để cập nhật giao diện
        }
    };
    

    return <>
        <Navbar expand="lg" className="d-none d-sm-block back-color">
            {/* Màn hình to */}
            <Container className="d-flex" id="nav">
                <Col id="logo" className="me-3">
                    <Navbar href="/" className="d-none d-sm-block">
                        <a href={is_staff ? "/ad" : "/"} className="flex-column align-items-center text-decoration-none">
                            <img 
                            src={photo} 
                            alt="Tiki Logo"
                            className="logo w-100"
                            />
                        </a>
                    </Navbar>
                </Col>
                <Col sm={8} id="search">
                    <Search />
                </Col>
                <Col sm={3} id="toggle">
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Link className='ms-5 link-underline link-underline-opacity-0' to={is_staff ? "/ad" : "/"}>
                            <img
                                src="https://salt.tikicdn.com/ts/upload/b4/90/74/6baaecfa664314469ab50758e5ee46ca.png"
                                alt="header_menu_item_home"
                                id="IMG_2"
                            />
                            <span rel="nofollow" id="A_2">
                                Trang chủ
                            </span>
                        </Link>
                        {username ? (
                            <Link
                                className="ms-4 link-underline link-underline-opacity-0 account-dropdown"
                                onMouseEnter={() => setShowDropdown(true)} // Hiện menu khi hover vào icon tài khoản
                                onMouseLeave={() => setShowDropdown(false)} // Ẩn menu khi chuột ra khỏi
                                style={{ position: 'relative', cursor: 'pointer' }}
                            >
                            <img
                                src="https://salt.tikicdn.com/ts/upload/07/d5/94/d7b6a3bd7d57d37ef6e437aa0de4821b.png"
                                alt="header_header_account_img"
                                id="IMG_2"
                            />
                                <span id="A_2">{username}</span>
                                {showDropdown && (
                                <div className="dropdown-menu">
                                    <Link to="/profile">Thông tin cá nhân</Link>
                                    <Link to={`/myorder/`}>Đơn hàng của tôi</Link>
                                    <Link onClick={handleLogout}>Đăng xuất</Link>
                                </div>
                                )}
                            </Link>
                        ) : (
                            <Link className='ms-4 link-underline link-underline-opacity-0' to="/login" style={{ position: 'relative' }}>
                                <img
                                src="https://salt.tikicdn.com/ts/upload/07/d5/94/d7b6a3bd7d57d37ef6e437aa0de4821b.png"
                                alt="header_header_account_img"
                                id="IMG_2"
                                />
                                <span id="A_2">{"Tài khoản"}</span> 
                            </Link>
                        )}
                        <img className='ps-5' src={ngan} alt="" />
                    </Navbar.Collapse>
                </Col>
                {/* Giỏ hàng */}
                <Link className="nav-link d-none d-sm-block" 
                    to={`cart/${username}`} 
                    style={{ position: 'relative' }}
                    onClick={handleCartClick}>
                    <div id="cart">
                        <i className="bi bi-cart2 cart-color"></i>
                        <span class="position-absolute translate-middle badge rounded-pill bg-danger">
                        {totalBook}
                        {/* {cartItems.length} */}
                        </span>
                    </div>
                </Link>
            </Container>
        </Navbar>
        <Navbar expand="lg" className="d-sm-none back-color">
            {/* Màn hình nhỏ */}
            <Container className="d-flex gap-0" id="nav-sm">
                {/* quay lại */}
                <a href="/" className="ms-4">
                    <img src={vecto} alt="" />
                </a>
                {/* menu */}

                <Navbar.Toggle 
                    aria-controls="offcanvasNavbar" 
                    className="navbar-dark"
                />
                <Navbar.Offcanvas
                    id="offcanvasNavbar"
                    aria-labelledby="offcanvasNavbarLabel"
                    placement="start"
                >
                    <div className="offcanvas-header justify-content-between" style={{background: '#1BA8FF'}}>
                        <a className='text-white d-flex align-items-center' href="/" style={{textDecorationLine: 'none'}}>
                            <div className='avatar'>Qu</div>
                            <div className='ms-3'>Phan Thi Quynh</div>
                        </a>
                        <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" size="20" height="20" width="20" 
                        xmlns="http://www.w3.org/2000/svg">
                            <path className='text-white' d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                        </svg>
                    </div>
                    <div className="offcanvas-body">
                        <div className='mb-3'>
                            <img
                                src="https://salt.tikicdn.com/ts/upload/b4/90/74/6baaecfa664314469ab50758e5ee46ca.png"
                                alt="header_menu_item_home"
                                id="IMG_2"
                            />
                            <a rel="nofollow" id="A_2" href="/">
                                Trang chủ
                            </a>
                        </div>
                        <div className='pb-3 border-bottom'>
                            <img
                            src="https://salt.tikicdn.com/ts/upload/07/d5/94/d7b6a3bd7d57d37ef6e437aa0de4821b.png"
                            alt="header_header_account_img"
                            id="IMG_2"
                            />
                            <span id="A_2">Tài khoản</span>
                        </div>
                        <div className="mt-3">
                            <p style={{color: 'rgb(120, 120, 120)'}}>HỖ TRỢ</p>
                            <p>HOTLINE: <strong className='text-success'>1900-6035</strong> (1000đ/phút)</p>
                            <div className='d-flex justify-content-between'>Hỗ trợ khách hàng 
                                <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" size="20" height="20" width="20" 
                                    xmlns="http://www.w3.org/2000/svg">
                                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                                </svg> 
                            </div>
                        </div>
                    </div>
                </Navbar.Offcanvas>

                {/* search */}
                <div className="input-group bg-white align-items-center  border border-1 rounded-2" style={{width: "60%"}}>
                    <div className="ms-3">
                        <img src={search} alt="" />
                    </div>
                    <input type="text" class="form-control border border-0" placeholder="Bạn đang tìm kiếm gì" aria-label="Amount (to the nearest dollar)"/>
                </div>
                {/* giỏ hàng */}
                <Link className="nav-link" to={`cart/${username}`} style={{ position:'relative' }}>
                    <div id="cart" className='me-4'>
                        <i className="bi bi-cart2 cart-color"></i>
                        <span class="position-absolute translate-middle badge rounded-pill bg-danger">
                        {totalBook}
                        </span>
                    </div>
                </Link>
            </Container>
        </Navbar>
    </>
  }

export default Header
