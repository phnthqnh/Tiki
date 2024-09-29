import axiosClient from "./axios";

const bookApi = {
    // for user
    getAllBook(params) { 
        const url = '/search/';
        return axiosClient.get(url, {params});
    },
    getDetailBook(id) {
        const url = `/book/${id}`;
        return axiosClient.get(url);
    },
    // for admin
    AllBooks(params) {
        const url = '/ad/book/';
        return axiosClient.get(url, {params});
    },
    // deleteBook(id) {
    //     const url = `/book/${id}/delete/`;
    //     return axiosClient.delete(url);
    // },
    // updateBook(id, title, author, price, description) {
    //     const url = `/book/${id}/update/`;
    //     const data = {
    //         title: title,
    //         author: author,
    //         price: price,
    //         description: description,
    //     };
    //     return axiosClient.put(url, data);
    // },
    // addBook(title, author, price, description) {
    //     const url = '/book/add/';
    //     const data = {
    //         title: title,
    //         author: author,
    //         price: price,
    //         description: description,
    //     };
    //     return axiosClient.post(url, data);
    // },
}

export default bookApi;
