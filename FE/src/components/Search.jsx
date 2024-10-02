import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { books } from '../../data.json'

function removeAccents(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, 'd').replace(/Đ/g, 'D')
}

function Search(){
    const [query, setQuery] = useState('')
    const [suggestions, setSuggestions] = useState([])
    const navigate = useNavigate()
    const [staff, setIsStaff] = useState(false)

    useEffect(() => {
        const staff = localStorage.getItem('is_staff');
        setIsStaff(staff === 'true'); // Đảm bảo so sánh đúng kiểu
    }, []);

    const handleInputChange = (e) => {
        const value = e.target.value
        setQuery(value)
        if (value) {
            const filteredBooks = books.filter(book =>
                removeAccents(book.name.toLowerCase()).includes(removeAccents(value.toLowerCase()))
            )
            setSuggestions(filteredBooks)
        } else {
            setSuggestions([])
        }
    }

    const handleSearch = (e) => {
        console.log("staff:", staff)
        e.preventDefault()
        // nếu staff = true thì 
        if (staff) navigate(`/ad?q=${query}`)
        else  navigate(`/search?q=${query}`)
    
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            handleSearch(e)
        }
    }

    return <>
        <form className="d-flex w-auto" role="search" id="search-form" onSubmit={handleSearch}>
            <div className="head-none input-group align-items-center" role="group">
                <div className="bg-white pe-1 ps-4 border border-end-0 input-group-text" 
                    id="btnGroupAddon" >
                    <i className="bi bi-search text-secondary" />
                </div>
                <input
                    className="form-control ps-1 border border-start-0 shadow-none"
                    type="search"
                    placeholder="Freeship đến 30K"
                    aria-label="Search"
                    value={query}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    />
                <button 
                    className="btn btn-outline-primary border border-start-0"  
                    type="submit">
                    Tìm Kiếm
                </button>
            </div>
            <div className="d-sm-none input-group align-items-center" role="group">
                <div className="bg-white pe-1 ps-4 border border-end-0 input-group-text" 
                    id="btnGroupAddon" >
                    <i className="bi bi-search text-secondary" />
                </div>
                <input
                    className="form-control ps-1 border border-start-0 shadow-none"
                    type="search"
                    placeholder="Bạn đang tìm kiếm gì"
                    aria-label="Search"
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    />
            </div>
            {suggestions.length > 0 && (
                <ul className="list-group position-absolute top-100 start-0 w-100 mt-1" style={{ zIndex: 1000 }}>
                    {suggestions.map((book, index) => (
                        <li key={index} className="list-group-item">
                            {book.name}
                        </li>
                    ))}
                </ul>
            )}
        </form>
    </>
}

export default Search