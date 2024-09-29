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
}

export default sellerApi;
