import { Link } from 'react-router-dom'
import Dong from './Dong'
// import './Book.css'
import React, { useState } from "react";
import bookApi from '../api/book';

function BookAdmin(props) {
    // const propss = props.data
    const [showMenu, setShowMenu] = useState(false);
  
    // Hàm để bật/tắt menu
    const toggleMenu = () => {
        setShowMenu(!showMenu);
    };
    return <>
    {/* <div className="container mt-3"> */}
            <tr className='text-center'>
                <th className="align-middle" scope="row">{props.data.id}</th>
                <td className="align-middle"><img src={props.data.image} style={{maxWidth:"50px"}}></img></td>
                <td className="align-middle">{props.data.name}</td>
                <td className="align-middle">{props.data.author ? 
                (props.data.author) : ("N/A")}</td>
                <td className="align-middle"><Dong val={props.data.original_price}/></td>
                <td className="align-middle"><Dong val={props.data.price}/></td>
                <td className="align-middle">{props.data.quantity_sold}</td>
                <td className="align-middle">{props.data.quantity_in_stock}</td>
                <td className="align-middle" style={{textAlign:"center"}} ><button onClick={toggleMenu} className="btn btn-danger">Cập nhật</button>
                {showMenu && (
                  <div className="list-group border-bottom">
                    <Link
                    className="list-group-item list-group-item-action fw-bold" to={`/ad/book/${props.data.id}/update`} style={{ position:'relative',textAlign:"center" }}  
                  >
                    Sửa thông tin
                  </Link>
                  <button onClick={() => alert("Thông tin đã được xóa")} className="list-group-item list-group-item-action fw-bold">Xóa thông tin</button>
                  </div>
                )}
                </td>
              </tr>
        {/* <Link className='btn btn-primary mt-3' to="/addbooks" style={{marginLeft:"90%"}}>Thêm sách</Link> */}
        {/* </div> */}
    </>
}


export default BookAdmin
