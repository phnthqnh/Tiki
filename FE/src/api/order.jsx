// src/api/cart.js
import axiosClient from "./axios";

const orderApi = {
    getUserOrder(mvd) {
        const url = `/myorder/${mvd}`;
        return axiosClient.get(url);
    },
    // Hàm thêm order
    addOrder(userID, hovaten, sdt, email, tinh, huyen, diachi, books, magiamgia, tongtien) {
        const url = `/myorder/add/`;
        // const response = await axios.post(`/cart/${un}/add/`, 
        const data = {
            user: userID,
            hovaten: hovaten,
            sdt: sdt,
            email: email,
            tinh: tinh,
            huyen: huyen,
            diachi: diachi,
            books: books,
            magiamgia: magiamgia,
            tongtien: tongtien,
        }
        return axiosClient.post(url, data).then(response => response);
    },
    // Hàm hủy đơn hàng
    cancelOrder(mvd) {
        // const response = await axiosClient.delete(`/cart/${un}/remove/`, {
        const url = `/myorder/${mvd}/cancel/`;
        return axiosClient.delete(url).then(response => response);
    },
    getAllOrders(un) {
        const url = `/myorder/${un}/all/`;
        return axiosClient.get(url);
    },
    AdminOrder(params) {
        const url = '/ad/all_order/'
        return axiosClient.get(url, { params});
    },
    updateStatus: async (mvd, status) => {
        const url = `/ad/update_order/${mvd}/`;
        return axiosClient.post(url, {status}).then(response => response);
    },
};

export default orderApi;
