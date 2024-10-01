import axiosClient from "./axios";

const categoryApi = {
    getAllCategory(params) { 
        const url = '/ad/categories';
        return axiosClient.get(url, {params});
    },
    addCategory: async (name) => {
        const url ='/ad/add_category';
        const data = {name};
        return axiosClient.post(url, data).then(response => response);
    },
    updateCategory: async (pk, name) => {
        const url = `ad/update_category/${pk}/`;
        return axiosClient.post(url, {name}).then(response => response);
    },
    deleteCategory: async (pk) => {
        const url = `ad/delete_category/${pk}/`;
        return axiosClient.delete(url).then(response => response);
    },
}

export default categoryApi;