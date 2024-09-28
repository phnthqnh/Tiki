import React, { useState, useEffect, useMemo  } from 'react'
import Star from './Star'
import './ListL.css'

const SeenCat = new Set() // đối tượng Set() để lấy ra các nhà cung cấp và danh mục từ books mà không bị trùng lặp

function ListL({ books, onFilterBooks }) {
    // books: Mảng sách để lọc và hiển thị thông tin danh mục và nhà cung cấp.
    // onFilterBooks: Hàm callback để truyền danh sách sách đã lọc lên cấp cha.
    const [categories, setCategories] = useState([]); // Danh sách các danh mục
    const [providers, setProviders] = useState([]); // Danh sách các nhà cung
    const [selectedProviders, setSelectedProviders] = useState([]) // Các nhà cung cấp đang được chọn
    const [selectedCategory, setSelectedCategory] = useState(null) // Danh mục sách đang được chọn.
    const [selectedRating, setSelectedRating] = useState(null) // Mức đánh giá sao đang được chọn.
    const [showAllProviders, setShowAllProviders] = useState(false) // Cờ để điều chỉnh việc hiển thị tất cả nhà cung cấp hay không

    useEffect(() => { // là một hook của React cho phép thực thi mã khi component được render hoặc khi một phụ thuộc thay đổi
        SeenCat.clear()
        books.forEach(book => {
            if (book.categories && book.categories.name) {
                SeenCat.add(book.categories.name) // thêm tên vào SeenCat, kh bị trùng dữ liệu
            }
        })
        setCategories(Array.from(SeenCat)) //Chuyển SeenCat thành một mảng và lưu vào trạng thái categories. 
        //Điều này sẽ cung cấp danh sách các danh mục không trùng lặp cho giao diện người dùng.
    }, [books]) //Hook useEffect sẽ được gọi lại mỗi khi mảng books thay đổi. 
    // Khi books được cập nhật, danh sách danh mục (categories) cũng sẽ được cập nhật

    // const displayedProviders = showAllProviders ? providers : providers.slice(0, 4)

    //xử lý khi người dùng chọn nhà cung cấp
    const handleProviderChange = (event) => {
        const provider = event.target.value; //Khi người dùng chọn hoặc bỏ chọn một nhà cung cấp trong danh sách true/false
        setSelectedProviders(prev => 
            event.target.checked 
                ? [...prev, provider] // checkbox được chọn (event.target.checked là true), thêm nhà cung cấp vào mảng selectedProviders
                : prev.filter(p => p !== provider) //checkbox bị bỏ chọn (event.target.checked là false), loại bỏ nhà cung cấp khỏi mảng selectedProviders
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
    //useMemo là một hook của React dùng để ghi nhớ giá trị đã tính toán để tránh tính toán lại không cần thiết khi component re-render
    const filteredBooks = useMemo(() => {
        return books.filter(book => {
            const matchesProvider = selectedProviders.length === 0 || selectedProviders.includes(book.current_seller.name);
            /*Nếu không có nhà cung cấp nào được chọn (selectedProviders.length === 0), thì mặc định là true. 
            Nếu có nhà cung cấp được chọn, kiểm tra xem nhà cung cấp của sách có nằm trong danh sách nhà cung cấp đã chọn không*/
            const matchesRating = selectedRating === null || book.rating_average >= selectedRating;
            /*Nếu không có mức đánh giá nào được chọn (selectedRating === null), thì mặc định là true. 
            Nếu có mức đánh giá được chọn, kiểm tra xem mức đánh giá của sách có phải từ trên cao hơn hoặc bằng mức đánh giá đã chọn */
            const matchesCategory = selectedCategory === null || selectedCategory === book.categories.name;
            /*Nếu không có danh mục nào được chọn (selectedCategory === null), thì mặc định là true. 
            Nếu có danh mục được chọn, kiểm tra xem danh mục của sách có khớp với danh mục đã chọn không */
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

    useEffect(() => { //Khi filteredBooks thay đổi, gọi hàm onFilterBooks để truyền danh sách sách đã lọc lên cấp cha.
        onFilterBooks(filteredBooks);
    }, [filteredBooks, onFilterBooks]);

    const displayedProviders = showAllProviders ? providers : providers.slice(0, 5)


    return <>
            <div className="card d-none d-sm-block" style={{ width: "100%", fontSize: "12px" }}>
                <ul className="list-group list-group-flush">
                    {/* danh mục */}
                    <li className="list-group-item">
                        <h4 className='fw-semibold' style={{ fontSize: "16px"}}>Danh mục sản phẩm</h4>
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
                                <Star st='5' />
                                <span> từ 5 sao</span>
                            </li>
                            <li className={`mt-3 ${selectedRating === 4 ? 'fw-bold' : ''}`} 
                                onClick={() => handleRatingChange(4)}
                                style={{ cursor: 'pointer' }}
                            >
                                <Star st='4' />
                                <span> từ 4 sao</span>
                            </li>
                            <li className={`mt-3 ${selectedRating === 3 ? 'fw-bold' : ''}`} 
                                onClick={() => handleRatingChange(3)}
                                style={{ cursor: 'pointer' }}
                            >
                                <Star st='3' />
                                <span> từ 3 sao</span>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </>
    ;
}


export default ListL
