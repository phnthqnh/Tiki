import { Link } from 'react-router-dom'
import Dong from './Dong'
import Star from './Star'
import './Book.css'

function Book(props) {
    // const propss = props.data
    const dp = Math.round(100-(((props.data.price)/(props.data.original_price))*100))
    return <>
    <div className="card-wrapper border rounded bg-white m-1">
        <Link to={'book/' + props.data.id} className="card text-decoration-none " style={{ width:"100%"}}>
            <div className="card-img-top" style={{ paddingTop: '100%', position: 'relative' }}>
                <img className='d-none d-sm-block rounded-top border border-4 border-secondary' id='bookimg' src={props.data.images[0].large_url} alt={props.data.name} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover'}}/>
                <img className='d-sm-none d-block rounded-top border border-3' id='bookimg' src={props.data.images[0].small_url} alt={props.data.name} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover'}}/>
            </div>
            <div className="mt-1 mb-0 card-body">
                <h5 className="card-title book-title fs-6"> {props.data.name} </h5>
                <div className='d-flex box8'>
                    <div className="col-sm-7 pe-1 border-end" style={{height: '15px'}}>
                        <Star st={props.data.rating_average} />
                    </div>
                    <div className="text-secondary fw-light ps-1" style={{fontSize: "10px"}}>
                        {'Đã bán ' + props.data.quantity_sold}
                    </div>
                </div>
                <div className="mt-4 mb-5">
                    <span className="card-text fw-medium fs-4">
                        <Dong val={props.data.price} />
                    </span>
                    {/* hiển thị dp nếu dp không bằng 0, còn nếu bằng 0 thì không hiển thị */}
                    {dp!== 0 && <span className="ms-1 p-1 border rounded-pill border-0 bg-body-secondary" style={{fontSize: '12px', verticalAlign:'super'}}>-{dp}%</span>}
                    {/* <span className="ms-1 p-1 border rounded-pill border-0 bg-body-secondary" style={{fontSize: '12px', verticalAlign:'super'}}>-{dp}%</span> */}
                </div>
            </div>
            <div id='gia' className="card-footer bg-white text-center text-body-secondary">
                Giao siêu tốc 2h
            </div>
        </Link>
    </div>
    </>
}


export default Book
