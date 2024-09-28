import { Navbar, Container } from 'react-bootstrap'

function Footer() {
    return <>
    <div className='footer mt-4 ' style={{backgroundColor:"white"}}>
        <div className=" p-4 container " >
          <div className=' row'>
          <div className="col-md-3">
            <h5 className="pb-3">
              {" "}
              <b>Hỗ trợ khách hàng</b>{" "}
            </h5>
            <p>
              <span className="gap2">Hotline:</span>
              <strong>1900-6035</strong>
              <br />
              <span className="gap1">(1000 đ/phút, 8-21h kể cả T7, CN)</span>
            </p>
            <p className="gap1">Các câu hỏi thường gặp</p>
            <p className="gap1">Gửi yêu cầu hỗ trợ</p>
            <p className="gap1">Hướng dẫn đặt hàng</p>
            <p className="gap1">Phương thức vận chuyển</p>
            <p className="gap1">Chính sách đổi trả</p>
            <p className="gap1">Hướng dẫn trả góp</p>
            <p className="gap1">Chính sách hàng nhập khẩu</p>
            <p className="gap1">Hỗ trợ khách hàng: hotro@bookshop.vn</p>
            <p className="gap1">Báo lỗi bảo mật: security@bookshop.vn</p>
          </div>
          <div className="col-md-3">
            <h5 className="pb-3">
              {" "}
              <b>Về BookShop</b>{" "}
            </h5>
            <p className="gap1">Giới thiệu BookShop</p>
            <p className="gap1">BookShop Blog</p>
            <p className="gap1">Tuyển dụng</p>
            <p className="gap1">Chính sách bảo mật thanh toán</p>
            <p className="gap1">Chính sách bảo mật thông tin cá nhân</p>
            <p className="gap1">Chính sách giải quyết khiếu nại</p>
            <p className="gap1">Điều khoản sử dụng</p>
            <p className="gap1">Giới thiệu BookShop Xu</p>
            <p className="gap1">Gói hội viên VIP</p>
            <p className="gap1">Tiếp thị liên kết cùng BookShop</p>
            <p className="gap1">Bán hàng doanh nghiệp</p>
            <p className="gap1">Điều kiện vận chuyển</p>
          </div>
          <div className="col-md-3">
            <h5 className="pb-3">
              <b>Hợp tác và liên kết</b>
            </h5>
            <p className="gap1">Quy chế hoạt động Sàn GDTMĐT</p>
            <p className="gap1">Bán hàng cùng BookShop</p>
            <h5 className="pb-2 pt-3">
              <b>Chứng nhận bởi</b>
            </h5>
            <img
              src="https://frontend.tikicdn.com/_desktop-next/static/img/footer/bo-cong-thuong.svg"
              alt=""
            />
          </div>
          <div className="col-md-3">
            <h5 className="pb-3">
              <b>Kết nối với chúng tôi</b>
            </h5>
            <div className="d-flex gap-1">
              <a
                rel="nofollow noreferrer"
                href="https://www.facebook.com/tiki.vn/"
                title="Facebook"
              >
                <img
                  className="img1"
                  src="https://img.icons8.com/?size=512&id=uLWV5A9vXIPu&format=png"
                  alt="Facebook"
                />
              </a>
              <a
                rel="nofollow noreferrer"
                href="https://www.youtube.com/user/TikiVBlog"
                title="Youtube"
              >
                <img
                  className="img1"
                  src="https://img.icons8.com/?size=512&id=QyYjooyvYGgV&format=png"
                  alt="Youtube"
                />
              </a>
              <a
                rel="nofollow noreferrer"
                href="http://zalo.me/589673439383195103"
                title="Zalo"
              >
                <img
                  className="img1"
                  src="https://img.icons8.com/?size=512&id=0m71tmRjlxEe&format=png"
                  alt="Zalo"
                />
              </a>
            </div>
            <h5 className="pb-2 pt-3">
              <b>Tải ứng dụng trên điện thoại</b>
            </h5>
            <div className="d-flex gap-2">
              <img
                src="https://frontend.tikicdn.com/_desktop-next/static/img/footer/qrcode.png"
                width={80}
                height={80}
                alt="tiki-qr"
              />
              <div className="dis1">
                <a
                  rel="nofollow noreferrer"
                  href="https://itunes.apple.com/vn/app/id958100553"
                >
                  <img
                    src="https://frontend.tikicdn.com/_desktop-next/static/img/icons/appstore.png"
                    width={122}
                    height={40}
                    alt="tiki-app-store"
                  />
                </a>
                <a
                  rel="nofollow noreferrer"
                  href="https://play.google.com/store/apps/details?id=vn.tiki.app.tikiandroid"
                >
                  <img
                    src="https://frontend.tikicdn.com/_desktop-next/static/img/icons/playstore.png"
                    width={122}
                    height={40}
                    alt="tiki-google-play"
                  />
                </a>
              </div>
            </div>
          </div>
          </div>
         
          
            <div className='border-bottom border-1'>
            <p className='fw-bold fs-5'>Công ty TNHH BookShop</p>
            <p className='gap1'>Địa chỉ trụ sở: Tòa nhà Viettel, Số 285, Đường Cách Mạng Tháng 8, Phường 12, Quận 10, Thành phố Hồ Chí Minh</p>
            <p className='gap1'>Giấy chứng nhận đăng ký doanh nghiệp số 0309532909 do Sở Kế Hoạch và Đầu Tư Thành phố Hồ Chí Minh cấp lần đầu vào ngày 06/01/2010.</p>
            <p className='gap1'>Hotline :<a href='#'> 1900 6035</a></p>
          </div>
        </div>



      </div>
    </>
}

export default Footer