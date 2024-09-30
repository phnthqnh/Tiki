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
    deleteBook(id) {
        const url = `/ad/book/${id}/delete/`;
        return axiosClient.delete(url);
    },
    updateBook(id, formData) {
        const url = `/ad/book/${id}/update/`;
        return axiosClient.post(url, formData);
    },
    addBook(formData) {
        const url = '/ad/book/create';
        return axiosClient.post(url, formData).then(response => response);
    },
}

export default bookApi;
