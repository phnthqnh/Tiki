import React, { useState, useEffect, useMemo  } from 'react'
import { Nav, Modal, Button } from 'react-bootstrap'
import ngan from '../images/ngan.png'
import loc from '../images/loc.png'

const SeenCat = new Set()
function Filter({ books, onFilterBooks }) {
    const [showModal, setShowModal] = useState(false)

    const handleShowModal = () => setShowModal(true)
    const handleCloseModal = () => setShowModal(false)

    const [categories, setCategories] = useState([]);
    const [providers, setProviders] = useState([]);
    const [selectedProviders, setSelectedProviders] = useState([])
    const [selectedCategory, setSelectedCategory] = useState(null)
    const [selectedRating, setSelectedRating] = useState(null)
    const [showAllProviders, setShowAllProviders] = useState(false)

    useEffect(() => {
        SeenCat.clear()
        books.forEach(book => {
            if (book.categories && book.categories.name) {
                SeenCat.add(book.categories.name)
            }
        })
        setCategories(Array.from(SeenCat))
    }, [books])

    // const displayedProviders = showAllProviders ? providers : providers.slice(0, 4)

    //xử lý khi người dùng chọn nhà cung cấp
    const handleProviderChange = (event) => {
        const provider = event.target.value;
        setSelectedProviders(prev => 
            event.target.checked 
                ? [...prev, provider] 
                : prev.filter(p => p !== provider)
        );
    };

    // xử lý khi người dùng chọn danh mục
    const handleCategoriesChange = (category) => {
        setSelectedCategory(prev => 
            prev === category ? null : category
        );
    };

    // Xử lý khi người dùng chọn mức đánh giá
    const handleRatingChange = (rating) => {
        if (selectedRating === rating) {
            setSelectedRating(null); // Hủy chọn nếu mức sao đang được chọn
        } else {
            setSelectedRating(rating); // Chọn mức sao mới
        }
    };

    // Lọc sách theo nhà cung cấp và đánh giá, danh mục
    const filteredBooks = useMemo(() => {
        return books.filter(book => {
            const matchesProvider = selectedProviders.length === 0 || selectedProviders.includes(book.current_seller.name);
            const matchesRating = selectedRating === null || book.rating_average >= selectedRating;
            const matchesCategory = selectedCategory === null || selectedCategory === book.categories.name;
            return matchesProvider && matchesRating && matchesCategory;
        });
    }, [books, selectedProviders, selectedRating, selectedCategory]);

    useEffect(() => {
        SeenCat.clear()
        books.forEach(book => {
            if (book.current_seller && book.current_seller.name) {
                SeenCat.add(book.current_seller.name)
            }
        })
        setProviders(Array.from(SeenCat))
    }, [books])

    useEffect(() => {
        // Kiểm tra nếu danh sách sách đã lọc có thay đổi
        if (filteredBooks.length !== books.length || filteredBooks.some((book, index) => book.id !== books[index].id)) {
            onFilterBooks(filteredBooks);
        }
    }, [filteredBooks, onFilterBooks, books]);

    // console.log(filteredBooks);
    const displayedProviders = showAllProviders ? providers : providers.slice(0, 5)

    return (
        <>
            {/* Thanh Nav */}
            <Nav fill variant="tabs" defaultActiveKey="/home" className="d-sm-none bg-white">
                <Nav.Item>
                    <Nav.Link eventKey="popular">Phổ biến</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="best-seller">Bán chạy</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="new-arrival">Hàng mới</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="price">
                        Giá <i className="bi bi-sort-down"></i>
                    </Nav.Link>
                </Nav.Item>
            </Nav>

            <Nav fill variant="tabs" defaultActiveKey="/home" className="d-sm-none bg-white">
                <Nav.Item>
                    <Nav.Link className='d-flex align-items-center' eventKey="filter" onClick={handleShowModal}>
                        <span>
                            <img src={loc} alt="icon lọc" />
                            Lọc
                        </span>
                        <img className='px-2' src={ngan} alt="icon ngan" />
                        <img
                            width={32}
                            height={16}
                            src="https://salt.tikicdn.com/ts/tka/a8/31/b6/802e2c99dcce64c67aa2648edb15dd25.png"
                            alt="tikinow"
                        />
                    </Nav.Link>
                </Nav.Item>
            </Nav>

            {/* Modal cho phần lọc sản phẩm */}
            <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Lọc Sản Phẩm</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="container">
                        <ul className="list-group list-group-flush">
                            {/* danh mục */}
                            <li className="list-group-item">
                                <h4 className='fw-semibold' style={{ fontSize: '16px'}}>Danh mục sản phẩm</h4>
                                <ul className='list-unstyled category'>
                                    {categories.map((category, index) => (
                                        <li  
                                            key={index} 
                                            className={`mb-3 d-flex flex-row ${selectedCategory === category ? 'fw-bold' : ''}`}
                                            onClick={() => handleCategoriesChange(category)}
                                            style={{cursor: "pointer"}}
                                        >
                                            <span htmlFor={`category-${index}`}>{category}</span>
                                        </li>
                                    ))}
                                </ul>
                            </li>
                            {/* Nhà cung cấp */}
                            <li className="list-group-item ">
                                <h4 className='fw-semibold' style={{ fontSize: "16px"}}>Nhà cung cấp</h4>
                                <ul className="checkbox-list list-unstyled">
                                    {displayedProviders.map((provider, index) => (
                                        <li key={index} className="mb-3 d-flex flex-row">
                                            <input
                                                className="checkbox"
                                                type="checkbox"
                                                id={`provider-${index}`}
                                                value={provider}
                                                onChange={handleProviderChange}
                                            />
                                            <label htmlFor={`provider-${index}`}>{provider}</label>
                                        </li>
                                    ))}
                                </ul>
                                {providers.length > 5 && (
                                    <p className="list-group-item list-unstyled border border-0">
                                        <span
                                            onClick={() => setShowAllProviders(!showAllProviders)}
                                            style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
                                        >
                                            {showAllProviders ? <>
                                            Ẩn bớt
                                            <i class="bi bi-chevron-up px-1"></i>
                                            </> : <>
                                            Xem thêm
                                            <i class="bi bi-chevron-down px-1"></i>
                                            </>
                                            }
                                        </span>
                                    </p>
                                )}
                            </li>

                            {/* Đánh giá */}
                            <li className="list-group-item mt-2">
                                <h4 className='fw-semibold' style={{ fontSize: "16px" }}>Đánh giá</h4>
                                <ul className="list-unstyled">
                                    <li className={`mt-3 ${selectedRating === 5 ? 'fw-bold' : ''}`} 
                                        onClick={() => handleRatingChange(5)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <span> từ 5 sao</span>
                                    </li>
                                    <li className={`mt-3 ${selectedRating === 4 ? 'fw-bold' : ''}`} 
                                        onClick={() => handleRatingChange(4)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <span> từ 4 sao</span>
                                    </li>
                                    <li className={`mt-3 ${selectedRating === 3 ? 'fw-bold' : ''}`} 
                                        onClick={() => handleRatingChange(3)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <span> từ 3 sao</span>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => { 
                        setSelectedCategory(null); 
                        setSelectedProviders([]); 
                        setSelectedRating(null);
                    }}>
                        <a className='text-white' style={{textDecoration: 'none'}} href="/">Thiết lập lại</a>
                    </Button>

                    <Button variant="primary" onClick={() => {handleCloseModal()}}>
                        Áp dụng
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default Filter
