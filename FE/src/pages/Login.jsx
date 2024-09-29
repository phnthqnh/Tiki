import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import userApi from '../api/user';
import login from '../images/Login.jpg'

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            // Gọi hàm login từ userApi với email và password
            const response = await userApi.login(email, password);

            // Lưu token vào localStorage nếu đăng nhập thành công
            if (response && response.access) {
                localStorage.setItem('access_token', response.access);
                localStorage.setItem('refresh_token', response.refresh);
                localStorage.setItem('username', response.username);
                localStorage.setItem('userID', response.userID);
                localStorage.setItem('total_book', response.total_book);
                localStorage.setItem('is_staff', response.is_staff);
                // kiểm tra xem username đã được lưu vào localStorage hay chưa, kiểm tra bằng console
                // console.log('access_token:', localStorage.getItem('access_token'));
                // console.log('is_staff:', response.is_staff);
                // console.log('is_superuser:', response.is_superuser);

                if (response.is_staff == true) {
                    navigate('/ad');
                    alert('Bạn đã đăng nhập với tư cách là người bán!')
                }
                else {
                    alert('Bạn đã đăng nhập với tư cách là người mua!');
                    navigate('/'); // Chuyển hướng về trang home
                }
            } else {
                throw new Error('Đăng nhập thất bại');
            }
        } catch (error) {
            console.error('Đăng nhập không thành công:', error);

            // Cập nhật thông báo lỗi chi tiết
            if (error.response) {
                setError(error.response.data.detail || 'Đăng nhập không thành công.');
            } else {
                setError('Kiểm tra lại email hoặc password');
            }
        }
    };
    // Hàm điều hướng sang trang đăng ký
    const handleNavigateToRegister = () => {
        navigate('/register');
    };

    return (
        <div className="container box3 border border-primary mt-5" style={{height:"75vh"}}>
            <div className='row'>
                <div className='col-md-4 p-5' style={{marginTop:"12%"}}>
            <h2 style={{textAlign:"center"}}>Đăng Nhập</h2>
            <form onSubmit={handleLogin}>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label fw-bold">Email</label>
                    <input
                        type="email"
                        className="form-control border border-primary border-opacity-25"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label fw-bold">Mật khẩu</label>
                    <input
                        type="password"
                        className="form-control border border-primary border-opacity-25"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <div className="alert alert-danger">{error}</div>}
                <button type="submit" className="btn btn-primary w-100">Đăng Nhập</button>
            </form>
            {/* Nút điều hướng sang trang đăng ký */}
            <div className='mt-3 text-align-left' onClick={handleNavigateToRegister}>Đăng Ký</div>
        </div>
        <div className='col-md-8' style={{ backgroundImage: `url(${login})`, backgroundSize: "cover", height: "70vh" }}>
        </div>
        </div>
        </div>
    );
};

export default Login;