import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import profileApi from '../api/profile';
import Header from '../components/Header';
import Footer from '../components/Footer';

function Profile() {
    // Lấy `username` từ localStorage
    const un = localStorage.getItem('username');
    const navigate = useNavigate();

    // Khởi tạo state để lưu thông tin profile
    const [profile, setProfile] = useState({});
    const [isEditing, setIsEditing] = useState(false); // State để theo dõi trạng thái chỉnh sửa
    const [isChangingPassword, setIsChangingPassword] = useState(false); // State để theo dõi trạng thái đổi mật khẩu

    // Khởi tạo state để lưu thông tin cập nhật profile
    const [formData, setFormData] = useState({
        username: '',
        email: '',
    });

    // State cho đổi mật khẩu
    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: ''
    });

    // Hàm xử lý khi nhập liệu vào form cập nhật profile
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Hàm xử lý khi nhập liệu vào form đổi mật khẩu
    const handlePasswordChange = (e) => {
        setPasswordData({
            ...passwordData,
            [e.target.name]: e.target.value
        });
    };

    // Hàm lấy thông tin profile từ backend
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await profileApi.getProfile(un);
                setProfile(data); // Lưu dữ liệu profile vào state
                setFormData({
                    username: data.username,
                    email: data.email,
                });
            } catch (error) {
                console.error('Failed to fetch profile data:', error);
            }
        };

        fetchProfile();
    }, [un]);

    // Hàm xử lý khi submit cập nhật profile
    const handleUpdateProfile = async () => {
        try {
            // Gọi API cập nhật thông tin profile
            const response = await profileApi.updateProfile(un, formData.username, formData.email);
            localStorage.setItem('username', formData.username);
            localStorage.setItem('email', formData.email);
            alert('Cập nhật tài khoản thành công');
            setIsEditing(false); // Đặt lại trạng thái chỉnh sửa sau khi cập nhật thành công
        } catch (error) {
            console.log('Lỗi khi cập nhật thông tin tài khoản:', error);
            alert('Cập nhật tài khoản thất bại');
        }
    };

    // Hàm xử lý khi submit đổi mật khẩu
    const handleChangePassword = async () => {
        try {
            // Gọi API đổi mật khẩu
            const response = await profileApi.changePassword(un, passwordData.oldPassword, passwordData.newPassword);
            alert('Đổi mật khẩu thành công');
            setIsChangingPassword(false); // Đặt lại trạng thái sau khi đổi mật khẩu thành công
        } catch (error) {
            console.log('Lỗi khi đổi mật khẩu:', error);
            alert('Mật khẩu cũ không đúng');
        }
    };

    return (
        <>
            <Header />
            <div className='container'>
                <a onClick={() => navigate(-1)} className="text-secondary">Trang chủ</a>{" "} {" > "} Thông tin tài khoản
            </div>
            <div className="container mt-5" style={{ marginBottom: '250px' }}>
                <h2>Thông tin tài khoản</h2>
                {!isEditing && !isChangingPassword ? (
                    <div className='mt-5'>
                        <p><strong>Username:</strong> {profile.username}</p>
                        <p><strong>Email:</strong> {profile.email}</p>
                        <button className="btn btn-primary mt-4" onClick={() => setIsEditing(true)}>
                            Cập nhật tài khoản
                        </button>
                        <button className="btn btn-danger mt-4 ms-4" onClick={() => setIsChangingPassword(true)}>
                            Đổi mật khẩu
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Form cập nhật tài khoản */}
                        {isEditing && (
                            <div>
                                <div className="form-group mt-3">
                                    <label>Username:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group mt-3">
                                    <label>Email:</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </div>
                                <button className="btn btn-primary mt-4 me-3" onClick={handleUpdateProfile}>
                                    Lưu thay đổi
                                </button>
                                <button className="btn btn-secondary mt-4 ml-2" onClick={() => setIsEditing(false)}>
                                    Hủy
                                </button>
                            </div>
                        )}

                        {/* Form đổi mật khẩu */}
                        {isChangingPassword && (
                            <div>
                                <div className="form-group mt-3">
                                    <label>Mật khẩu cũ:</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        name="oldPassword"
                                        value={passwordData.oldPassword}
                                        onChange={handlePasswordChange}
                                    />
                                </div>
                                <div className="form-group mt-3">
                                    <label>Mật khẩu mới:</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        name="newPassword"
                                        value={passwordData.newPassword}
                                        onChange={handlePasswordChange}
                                    />
                                </div>
                                <button className="btn btn-primary mt-4 me-3" onClick={handleChangePassword}>
                                    Lưu thay đổi
                                </button>
                                <button className="btn btn-secondary mt-4 ml-2" onClick={() => setIsChangingPassword(false)}>
                                    Hủy
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
            <Footer />
        </>
    );
}

export default Profile;
