import axiosClient from "./axios";

const sellerApi = {
    // for user
    getAllSeller(params) { 
        const url = '/ad/seller';
        return axiosClient.get(url, {params});
    },
    // getDetailBook(id) {
    //     const url = `/book/${id}`;
    //     return axiosClient.get(url);
    // },
    addSeller: async (name) => {
        const url ='/ad/seller/create';
        const data = {name};
        return axiosClient.post(url, data).then(response => response);
    },
    updateSeller: async (pk, name) => {
        const url = `ad/seller/${pk}/update/`;
        return axiosClient.post(url, {name}).then(response => response);
    },
    deleteSeller: async (pk) => {
        const url = `/ad/seller/${pk}/delete/`;
        return axiosClient.delete(url).then(response => response);
    },
}

export default sellerApi;
