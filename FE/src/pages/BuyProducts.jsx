import React, { useState, useEffect,useContext} from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // Import hooks from react-router-dom
// import 'react-toastify/dist/ReactToastify.css';
import './BookDetail.css';
// import { ToastContainer, toast } from 'react-toastify';
import './BuyProducts.css';
import orderApi from '../api/order';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Dong from '../components/Dong'
import { CartContext } from '../components/CartContext' // chứa dữ liệu giỏ hàng như danh sách sản phẩm, các hàm thêm/xóa sản phẩm khỏi giỏ hàng

function BuyProducts() {
    const navigate = useNavigate(); // Use navigate hook to redirect

    const { buy } = useContext(CartContext); // Lấy buy từ context

    // const [totalAmount, setTotalAmount] = useState(0);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');

    // const [buyItem, setBuyItem] = useState(() => {
    //     const savedBuy = localStorage.getItem('buy');
    //     return savedBuy ? JSON.parse(savedBuy) : []; // Ensure it returns an empty array if not found
    // });
//xử lí phí vận chuyển
  const [shippingFee, setShippingFee] = useState(48000);
  const id = localStorage.getItem('userID');


//   useEffect(() => {
//     // Fetch buy items from localStorage when the component mounts
//     const savedBuy = localStorage.getItem('buy');
//     if (savedBuy) {
//       setBuyItem(JSON.parse(savedBuy));
//     }

//     // Clear buy items from localStorage on unmount
//     return () => {
//       localStorage.removeItem('buy');
//     };
//   }, []);

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

  const calculateTotalPrice = () => {
    return buy.reduce((total, item) => total + (item.price * item.quantity), 0);
  };
  console.log('buy', buy)
  const handleOrderSubmit = async (event) => {
    event.preventDefault();
    const form = event.target;

    if (form.checkValidity() === false) {
        event.stopPropagation();
        alert('Vui lòng điền đầy đủ thông tin.');
    } else {
        // Lấy dữ liệu từ form
        try{
            const userID = id; // Giả sử username là user ID
            const hovaten = form.name.value;
            const sdt = form.phone.value;
            const email = form.email.value;
            const tinh = form.inputCity.value;
            const huyen = form.district.value;
            const diachi = form.address.value;
            const magiamgia = form.voucher.value;
            // const tongtien = totalPayment;
            const books = buy.map(item => ({
                id: item.id,
                quantity: item.quantity,
            }));
            const tongtien = (calculateTotalPrice() + shippingFee);

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

            await orderApi.addOrder(userID, hovaten, sdt, email, tinh, huyen, diachi, books, magiamgia, tongtien);

            alert('Đặt đơn thành công');
            navigate(`/myorder/`);
        } catch (error) {
            console.error('Failed to remove items from cart:', error);
            alert('Có lỗi xảy ra trong quá trình đặt hàng.');
        }
    }

    form.classList.add('was-validated');
};

  const handlePaymentMethodChange = (event) => {
    setSelectedPaymentMethod(event.target.value);
  };


  return (
    <div>
      <Header />
      <div className='container'>
        <div className='row'>
          <div className='col-md-12 mt-5'>
            <h2>Thanh Toán</h2>
          </div>
        </div>

        <div className='box3 p-4 mt-3'>
          <div className='row'>
            <h5 className='col-md-6'><p>Sản phẩm</p></h5>
            <div className='col-md-2'><p>Đơn giá</p></div>
            <div className='col-md-2'><p>Số lượng</p></div>
            <div className='col-md-2'><p>Thành tiền</p></div>
          </div>
          {buy.length > 0 ? (
            buy.map((item) => (
              <div key={item.id}>
                <div className='row'>
                  <div className='col-md-6 d-flex'>
                    <img src={item.image} alt={item.name} width="100" />
                    <p>{item.name}</p>
                  </div>
                  <div className='col-md-2'>
                    <p><Dong val={item.price}/></p>
                  </div>
                  <div className='col-md-2'>
                    <p className="m-2">{item.quantity}</p>
                  </div>
                  <div className='col-md-2 d-flex'>
                    <p><Dong val={item.price * item.quantity}/></p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>Không có sản phẩm nào trong giỏ hàng.</p>
          )}
        </div>

        <div className='box3 p-4 mt-2'>
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
              <p><Dong val={shippingFee}/></p>
            </div>
          </div>
        </div>

        <form className="needs-validation mt-3" noValidate onSubmit={handleOrderSubmit}>
                <h4>Thông tin đặt hàng</h4>
                <p className="fw-light text-danger">Bạn cần nhập đầy đủ các trường thông tin có dấu *</p>
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
                    <label htmlFor="address" className="form-label"><h4>Địa chỉ nhận hàng</h4></label>
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
            <div className='box3 mt-3 p-4'>
                <div className='row'>
                  <div className='col-md-6'>
                      <h4>Phương thức thanh toán</h4>
                  </div>
                  <div className='col-md-6'>
                      <div className="input-group mb-3">
                      <select className="form-select" id="inputGroupSelect01" onChange={handlePaymentMethodChange}>
                          <option value="">Thanh toán khi nhận hàng</option>
                      </select>
                      </div>
                  </div>
                </div>
            {buy.map((item) => (
                <div key={item.id}>
                    <div className='row'>
                        <div className='col-md-6'>

                        </div>
                        <div className='col-md-3'>
                            <p>Tổng tiền hàng</p>
                            <p>Phí vận chuyển</p>
                            <p>Tổng thanh toán</p>
                        </div>
                        <div className='col-md-3'>
                            <p><Dong val={calculateTotalPrice()}/></p>
                            <p><Dong val={shippingFee}/></p>
                            <h2><Dong val={calculateTotalPrice() + shippingFee}/></h2>
                            <button
                            type="submit"
                            className="btn btn-primary btn-block Order btn-sm w-50"
                            onClick={() => navigate('/buy')}
                            >
                            Đặt hàng
                          </button>
                        </div>

                    </div>
                </div>
            ))}
            </div>
            </form>
      </div>
      <Footer />
    </div>
  );
}

export default BuyProducts;
