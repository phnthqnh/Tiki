// src/api/user.js
import axiosClient from "./axios";

const profileApi = {
    getProfile(un) {
        const url = `/profile/${un}/`;  // Đảm bảo có dấu `/` ở cuối đường dẫn
        return axiosClient.get(url);
    },
    updateProfile(un, username, email) {
        const url = `/profile/${un}/update/`; // Đảm bảo có dấu `/` ở cuối đường dẫn
        const data = {
            username: username,
            email: email,
        };
        return axiosClient.put(url, data).then(response => response);
    },
    changePassword(un, oldPassword, newPassword) {
        const url = `/profile/${un}/change_password/`; 
        const data = {
            old_password: oldPassword,
            new_password: newPassword,
        };
        // return axiosClient.put(url, data).then(response => response);
        // Lấy token từ localStorage
        const token = localStorage.getItem('access_token');

        // Kiểm tra nếu token tồn tại, thì thêm nó vào header
        if (!token) {
            console.error("Không tìm thấy token trong localStorage");
            return;
        }

        return axiosClient.put(url, data, {
            headers: {
                Authorization: `Bearer ${token}` // Thêm Authorization header với Bearer token
            }
        }).then(response => response);
    }
};

export default profileApi;
