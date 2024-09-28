import React, { useContext,useState } from 'react';
import { CartContext } from '../components/CartContext';
import { useLocation, useNavigate } from "react-router-dom";
import Dong from '../components/Dong';
import orderApi from '../api/order';

function Order() {
    const { removeFromCart } = useContext(CartContext)
    const navigate = useNavigate();
    const location = useLocation();
    const username = localStorage.getItem('username');
    const id = localStorage.getItem('userID');
    // console.log('userID', id)

    // Nhận sản phẩm đã chọn từ state selectedItems
    const { selectedProducts = [] } = location.state || {};
    // const { selectedItems = [] } = location.state || {};

    // console.log('order', localStorage.getItem("order"))
    // console.log('selectedProducts', selectedProducts)
    // const productIds = selectedProducts.map(product => product.id);
    // console.log('selectedItems', selectedItems)

  //xử lí phí vận chuyển
    const [shippingFee, setShippingFee] = useState(48000);
    const handleShippingOptionChange = (event) => {
        const selectedOption = event.target.value;
        switch (selectedOption) {
        case '0':
            setShippingFee(48000);
            break;
        case '1':
            setShippingFee(32000);
            break;
        case '2':
            setShippingFee(16000);
            break;
        default:
            setShippingFee(30000);
        }
    };
    const totalAmount = selectedProducts.reduce((total, item) => total + item.total, 0);
    const totalPayment = totalAmount + shippingFee;
    console.log('totalPayment', totalPayment)
    console.log('selectedProducts', selectedProducts)
    const books = selectedProducts.map(product => ({
        id: product.id,
        quantity: product.quantity,
    }));
    console.log('books', books)


    const handleOrderSubmit = async (event) => {
        event.preventDefault();
        const form = event.target;
        console.log('selectedProducts 1', selectedProducts)
        console.log('totalPayment 1', totalPayment)
    
        if (form.checkValidity() === false) {
            event.stopPropagation();
            alert('Vui lòng điền đầy đủ thông tin.');
        } else {
            try {
                console.log('selectedProducts 2', selectedProducts)
                // Lấy dữ liệu từ các trường nhập liệu
                const userID = id; // Giả sử username là user ID
                const hovaten = form.name.value;
                const sdt = form.phone.value;
                const email = form.email.value;
                const tinh = form.inputCity.value;
                const huyen = form.district.value;
                const diachi = form.address.value;
                const magiamgia = form.voucher.value;
                const tongtien = totalPayment;

                // Tạo danh sách sách từ selectedProducts
                // const books = selectedProducts.map(product => ({
                //     id: product.id,
                //     quantity: product.quantity,
                // }));
                // console tất cả thông tin lấy từ form
                console.log('userID:', id);
                console.log('hovaten:', hovaten);
                console.log('sdt:', sdt);
                console.log('email:', email);
                console.log('tinh:', tinh);
                console.log('huyen:', huyen);
                console.log('diachi:', diachi);
                console.log('books:', books);
                console.log('magiamgia:', magiamgia);
                console.log('tongtien:', tongtien);

                // Gọi hàm addOrder từ orderApi để thêm đơn hàng mới
                await orderApi.addOrder(userID, hovaten, sdt, email, tinh, huyen, diachi, books, magiamgia, tongtien);

                // Xóa từng sách khỏi giỏ hàng bằng API `removeFromCart`
                selectedProducts.forEach(product => removeFromCart(product.id));
                console.log('selectedProducts', selectedProducts)

                // Thông báo đặt hàng thành công
                alert('Đặt đơn thành công');
                navigate(`/myorder/`);
            } catch (error) {
                console.error('Failed to remove items from cart:', error);
                alert('Không thể xóa các mục đã chọn khỏi giỏ hàng');
            }
        }

        form.classList.add('was-validated');
    };

    return (
        <>
            <div className="container mt-5">
                <button
                    onClick={() => navigate(-1)}
                    className="btn btn-danger Page mb-3"
                    type="submit"
                >
                    Quay lại
                </button>
                <form className="needs-validation mt-2" noValidate onSubmit={handleOrderSubmit}>
                        <h1>Thông tin đặt hàng</h1>
                        <div className='box3 p-4 mt-2 mb-4'>
                        <h4>Danh sách sản phẩm đã chọn:</h4>
                            <div className='row'>
                              <h5 className='col-md-6'><p>Sản phẩm</p></h5>
                              <div className='col-md-2'><p>Đơn giá</p></div>
                              <div className='col-md-2'><p>Số lượng</p></div>
                              <div className='col-md-2'><p>Thành tiền</p></div>
                            </div>
                        {selectedProducts.length > 0 ? (
                              <ul>
                                {selectedProducts.map((product) => (
                                  <li key={product.id}>
                                    <div className='row'>
                                      <div className='col-md-6 d-flex'>
                                        <p>{product.name}</p>
                                      </div>
                                      <div className='col-md-2'>
                                        <p><Dong val={product.price}/></p>
                                      </div>
                                      <div className='col-md-2'>
                                        <p className="m-2">{product.quantity}</p>
                                      </div>
                                      <div className='col-md-2 d-flex'>
                                        <p><Dong val={product.total}/></p>
                                      </div>
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p>Không có sản phẩm nào trong giỏ hàng.</p>
                            )}
                      </div>
                        <div className='row'>
                          <div className='col-md-6'>
                            <div className="form-floating mb-3 text-secondary">
                              Ghi chú cho người bán...
                              <textarea className="form-control" placeholder="Ghi chú cho người bán..." id="note"></textarea>
                            </div>
                          </div>
                          <div className='col-md-4 d-flex'>
                            <p>Đơn vị vận chuyển:</p>
                            <div className="input-group mb-3">
                              <select
                                className="form-select"
                                id="inputGroupSelect01"
                                onChange={handleShippingOptionChange}
                              >
                                <option value="0">Giao siêu tốc 2h</option>
                                <option value="1">Giao nhanh (1-2 ngày)</option>
                                <option value="2">Giao bình thường (3-5 ngày)</option>
                              </select>
                            </div>
                          </div>
                          <div className="col-md-2">
                            <p><Dong val={shippingFee} /></p>
                          </div>
                        </div>
                      
                    <p className="fw-light text-danger">Bạn cần nhập đầy đủ các trường thông tin *</p>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">Họ tên người mua *</label>
                        <input type="text" className="form-control" id="name" placeholder="Nhập họ và tên" required />
                        <div className="invalid-feedback">Vui lòng nhập họ và tên.</div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="phone" className="form-label">Số điện thoại nhận hàng *</label>
                        <input type="text" className="form-control" id="phone" placeholder="Nhập số điện thoại" required />
                        <div className="invalid-feedback">Vui lòng nhập số điện thoại.</div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email nhận hàng *</label>
                        <input type="email" className="form-control" id="email" placeholder="Nhập email" required />
                        <div className="invalid-feedback">Vui lòng nhập email.</div>
                    </div>
                    <div className="mb-3 row">
                        <label htmlFor="address-1" className="form-label"><h4>Địa chỉ nhận hàng</h4></label>
                        <div className="col-sm-4">
                            <label htmlFor="inputCity" className="form-label">Tỉnh/Thành Phố *</label>
                            <select id="inputCity" className="form-select" required>
                                <option value="">Chọn...</option>
                                <option>Đà Nẵng</option>
                                <option>Hà Nội</option>
                                <option>Hải Phòng</option>
                                <option>Hải Dương</option>
                                <option>Hà Nam</option>
                                <option>Nam Định</option>
                                <option>Ninh Bình</option>
                                <option>Thành phố Hồ Chí Minh</option>
                                </select>
                            <div className="invalid-feedback">Vui lòng chọn Tỉnh/Thành Phố.</div>
                        </div>
                        <div className="col-sm-4">
                            <label htmlFor="district" className="form-label">Quận/Huyện *</label>
                            <input type="text" className="form-control" id="district" placeholder="Nhập" required />
                            <div className="invalid-feedback">Vui lòng nhập Quận/Huyện.</div>
                        </div>
                        <div className="col-sm-4">
                            <label htmlFor="address" className="form-label">Địa chỉ cụ thể *</label>
                            <input type="text" className="form-control" id="address" placeholder="Nhập" required />
                            <div className="invalid-feedback">Vui lòng nhập địa chỉ cụ thể.</div>
                        </div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="voucher" className="form-label">Mã giảm giá</label>
                        <input type="text" className="form-control" id="voucher" placeholder="Nhập mã giảm giá" />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="payment" className="form-label">Phương thức thanh toán *</label>
                        <select className="form-select" id="payment" required>
                            <option value="">Lựa chọn...</option>
                            <option value="1">Thanh toán khi nhận hàng</option>
                            
                        </select>
                        <div className="invalid-feedback">Vui lòng chọn phương thức thanh toán.</div>
                    </div>
                  <div className='box3 p-3'>
                    <div className='row'>
                        <div className='col-md-6'>

                        </div>
                        <div className='col-md-3'>
                            <p>Tổng tiền hàng</p>
                            <p>Phí vận chuyển</p>
                            <p>Tổng thanh toán</p>
                        </div>
                        <div className='col-md-3'>
                            <p><Dong val={totalAmount} /></p>
                            <p><Dong val={shippingFee} /></p>
                            <h2><Dong val={totalPayment} /></h2>
                            <button
                            type="submit"
                            className="btn btn-primary btn-block Order btn-sm w-50"
                            // onClick={() => navigate('/')}
                            >
                            Đặt hàng
                          </button>
                        </div>
                      </div>

                    </div>
                
           
                </form>
            </div>
        </>
    );
}

export default Order;
