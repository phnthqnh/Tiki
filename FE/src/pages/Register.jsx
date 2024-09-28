import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import userApi from '../api/user';
import login from '../images/Login.jpg'

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        // Dữ liệu đăng ký người dùng
        const userData = {
            username: username,
            email: email,
            password: password,
        };

        console.log("heheeee", username, email, password)
        console.log("heheeee", userData)

        try {
            const response = await userApi.register(username, email, password);
            console.log("he", response)
            // Kiểm tra nếu đăng ký thành công
            if (response) {
                alert('Đăng ký thành công!');
                navigate('/login'); // Điều hướng đến trang đăng nhập sau khi đăng ký thành công
            } else {
                setError('Đăng ký không thành công. Vui lòng thử lại!');
            }
        } catch (error) {
            console.error('Lỗi đăng ký:', error.response ? error.response.data : error);
            // Cập nhật thông báo lỗi chi tiết cho từng trường (nếu có)
            if (error.response && error.response.data) {
                const { email, username, password } = error.response.data;
                setError(`Lỗi đăng ký: ${email ? email[0] : ''} ${username ? username[0] : ''} ${password ? password[0] : ''}`);
            } else {
                setError('Có lỗi xảy ra trong quá trình đăng ký!');
            }
        }
        
    };

    // return (
    //     <div>
    //         <h2>Đăng Ký</h2>
    //         <form onSubmit={handleRegister}>
    //             <input
    //                 type="text"
    //                 placeholder="Username"
    //                 value={username}
    //                 onChange={(e) => setUsername(e.target.value)}
    //                 required
    //             />
    //             <input
    //                 type="email"
    //                 placeholder="Email"
    //                 value={email}
    //                 onChange={(e) => setEmail(e.target.value)}
    //                 required
    //             />
    //             <input
    //                 type="password"
    //                 placeholder="Mật khẩu"
    //                 value={password}
    //                 onChange={(e) => setPassword(e.target.value)}
    //                 required
    //             />
    //             <button type="submit">Đăng Ký</button>
    //         </form>
    //         {error && <p>{error}</p>}
    //     </div>
    // );
    return (
        <div className="container box3 border border-primary mt-5" style={{height:"75vh"}}>
            <div className='row'>
                <div className='col-md-4 p-5' style={{marginTop:"12%"}}>
            <h2 style={{textAlign:"center"}}>Đăng Ký</h2>
            <form onSubmit={handleRegister}>
                <div className="mb-3">
                    <label htmlFor="username" className="form-label fw-bold">User name</label>
                    <input
                        type="text"
                        className="form-control border border-primary border-opacity-25"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
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
                <button type="submit" className="btn btn-primary w-100">Đăng Ký</button>
            </form>
        </div>
        <div className='col-md-8' style={{ backgroundImage: `url(${login})`, backgroundSize: "cover", height: "70vh" }}>
        </div>
        </div>
        </div>
    );
};

export default Register;
