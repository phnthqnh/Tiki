import React, { createContext, useState, useEffect } from 'react';
import cartApi from '../api/cart';

export const CartContext = createContext()

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([])
    const user = localStorage.getItem('username');
    const [buy, setBuy] = useState([]); // Thêm trạng thái buy

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const username = user; // Đảm bảo rằng `user` có giá trị đúng
                // console.log("Fetching cart for username:", username);
    
                const response = await cartApi.getUserCart(username);
                // console.log("API response:", response);
    
                setCartItems(response.book); // Kiểm tra nếu `response.data.book` tồn tại
            } catch (error) {
                console.error('Failed to fetch cart:', error);
            }
        };
    
        fetchCart();
    }, []);
    // console.log('caritem', cartItems)
    

    const addToCart = async (id, name, price, quantity) => {
        try {
            const username = user; // Sửa lại cho phù hợp với username hiện tại
            const response = await cartApi.addBookToCart(username, id, quantity);

            // Nếu thêm sách vào giỏ hàng thành công, cập nhật lại cartItems
            const newCartItem = response.book;
            setCartItems(prevItems => {
                const exisItem = prevItems.find(item => item.id === id);
                if (exisItem) {
                    return prevItems.map(item =>
                        item.id === id ? { ...item, quantity: item.quantity + parseInt(quantity, 10), total: (item.quantity + parseInt(quantity, 10)) * item.price } : item
                    )
                } else {
                    const total = price * parseInt(quantity, 10);
                    return [...prevItems, { id, name, price, quantity: parseInt(quantity, 10), total }];
                }
            })
        } catch (error) {
            console.error('Failed to add book to cart:', error);
        }
    }

    const removeFromCart = async (id) => {
        try {
            const username = user; // Sửa lại cho phù hợp với username hiện tại
            const response = await cartApi.removeBookFromCart(username, id);

            // Nếu xóa sách khỏi giỏ hàng thành công, cập nhật lại cartItems
            setCartItems(prevItems => prevItems.filter(item => item.id !== id));
        } catch (error) {
            console.error('Failed to remove book from cart:', error);
        }
    }

    

    const updateQuantity = async (id, newQuantity) => {
        try {
            const username = user; // Sửa lại cho phù hợp với username hiện tại
            const response = await cartApi.updateBookQuantity(username, id, newQuantity);

            // Nếu cập nhật số lượng thành công, cập nhật lại cartItems
            setCartItems(prevItems =>
                prevItems.map(item =>
                    item.id === id ? { ...item, quantity: newQuantity, total: newQuantity * item.price } : item
                )
            );
        } catch (error) {
            console.error('Failed to update book quantity:', error);
        }
    }

    // console.log(cartItems.length)
    const addToBuy = (item) => {
        setBuy(prevBuy => [...prevBuy, item]);
    };
    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, buy, addToBuy }}>
            {children}
        </CartContext.Provider>
    )
}
