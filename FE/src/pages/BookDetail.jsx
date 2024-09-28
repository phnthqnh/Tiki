import Footer from '../components/Footer'
import BookDetail1 from '../components/BookDetail1'
import BookDetail2 from '../components/BookDetail2'
import BookDetail3 from '../components/BookDetail3'
import BookDetail4 from '../components/BookDetail4'
import Header from '../components/Header'


function BookDetail() {
    return <>
        <Header />
        <div className="container mx-15 mb-5">
            <div className="row d-flex">
                <div className="order-sm-0 order-0 col-sm-4 col-12">
                <BookDetail1 />
                </div>
                <div className="order-sm-1 order-2 col-sm-5 col-12">
                <BookDetail2 />
                <BookDetail3 />
                </div>
                <div className="order-sm-2 order-1 col-sm-3 col-12">
                <BookDetail4 />
                </div>
            </div>
            </div>
        <Footer/> 
    </>
}

export default BookDetail