// src/api/cart.js
import axiosClient from "./axios";

const cartApi = {
    getUserCart(un) {
        const url = `/cart/${un}`;
        return axiosClient.get(url);
    },
    getTotalCart(un) {
        const url = `/cart/${un}/total/`;
        return axiosClient.get(url);
    },
    // Hàm thêm sách vào giỏ hàng
    addBookToCart(un, bookId, quantity) {
        const url = `/cart/${un}/add/`;
        // const response = await axios.post(`/cart/${un}/add/`, 
        const data = {
            book_id: bookId,
            quantity: quantity,
            };
        return axiosClient.post(url, data).then(response => response);
    },
    // Hàm xóa sách khỏi giỏ hàng
    removeBookFromCart(un, bookId) {
        // const response = await axiosClient.delete(`/cart/${un}/remove/`, {
        const url = `/cart/${un}/remove/`;
        const data= {
                book_id: bookId,
            }
        return axiosClient.post(url, data).then(response => response);
    },
    // Hàm cập nhật số lượng sách trong giỏ hàng
    updateBookQuantity(un, bookId, quantity) {
        const url = `/cart/${un}/update/`;
        // const response = await axios.post(`/cart/${un}/add/`, 
        const data = {
            book_id: bookId,
            quantity: quantity,
            };
        return axiosClient.post(url, data).then(response => response);
    },
};

export default cartApi;
