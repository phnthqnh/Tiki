import axios from 'axios';

const axiosClient = axios.create({
    baseURL: `http://127.0.0.1:8000/`,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

axiosClient.js
axiosClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access');

        // Kiểm tra URL để tránh thêm token cho login hoặc register
        if (token && !config.url.includes('/search/') && !config.url.includes('/book/') 
            && !config.url.includes('/login/') && !config.url.includes('/register/')) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


axiosClient.interceptors.response.use(
    function (response) {
        return response.data;
    },
    function (error) {
        // Xử lý các trường hợp khác
        return Promise.reject(error.response.data);
    }
);

export default axiosClient;

// src/api/axios.js
// import axios from 'axios';

// const axiosClient = axios.create({
//     baseURL: 'http://127.0.0.1:8000/',
//     headers: {
//         'Content-Type': 'application/json',
//     },
//     withCredentials: true, // Để gửi cookie trong các request
// });

// axiosClient.interceptors.response.use(
//     response => response,
//     async error => {
//         const originalRequest = error.config;

//         if (error.response.status === 401 && originalRequest.url === 'http://127.0.0.1:8000/refresh/') {
//             // Thực hiện điều hướng hoặc xử lý khi không thể làm mới token
//             return Promise.reject(error);
//         }

//         if (error.response.status === 401 && !originalRequest._retry) {
//             originalRequest._retry = true;
//             try {
//                 const { data } = await axiosClient.post('/refresh/', {});

//                 // Cập nhật access token và tiếp tục request
//                 axiosClient.defaults.headers['Authorization'] = `Bearer ${data.access}`;
//                 originalRequest.headers['Authorization'] = `Bearer ${data.access}`;
//                 return axiosClient(originalRequest);
//             } catch (e) {
//                 return Promise.reject(e);
//             }
//         }

//         return Promise.reject(error);
//     }
// );

// export default axiosClient;
