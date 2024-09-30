import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { books } from '../data.json'
import Home from './pages/Home.jsx'
import BookDetail from './pages/BookDetail.jsx'
import { CartProvider } from './components/CartContext.jsx'
import Cart from './pages/Cart.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import BuyProducts from './pages/BuyProducts.jsx';
import Order from './pages/Order.jsx';
import MyOrder from './pages/MyOrder.jsx'
import Profile from './pages/Profile.jsx'
import MyOrderDetail from './pages/MyOrderDetail.jsx'
import HomeAdmin from './pages/HomeAdmin.jsx'
import BookAdminDetail from './pages/BookAdminDetail.jsx'
import AddBook from './pages/AddBook.jsx'

const router = createBrowserRouter ([
    {
      path: '/',
      element: <App />,
    },
    {
      path: '/',
      element: <Home />
    },
    {
        path: '/ad',
        element: <HomeAdmin />
      },
    {
        path: '/book/:id',
        element: <BookDetail />
    },
    {
        path: '/search/book/:id',
        element: <BookDetail />
    },
    {
        path: "/cart/:un",
        element: <Cart />
    },
    {
        path: "/search/cart/:un",
        element: <Cart />
    },
    {
        path: "/search/book/:id/cart/:un",
        element: <Cart />
    },
    {
        path: '/book/:id/cart/:un',
        element: <Cart />
    },
    {
        path: "/buy/cart/:un",
        element: <Cart />
    },
    {
        path: "/search",
        element: <Home />
    },
    {
        path: "/login", // Đường dẫn cho trang đăng nhập
        element: <Login />
    },
    {
        path: "/register", // Đường dẫn cho trang đăng nhập
        element: <Register />
    },
    {
        path: "/buy",
        element: <BuyProducts />
    },
    {
        path: "/order",
        element: <Order />
    },
    {
        path: "/myorder",
        element: <MyOrder />
    },
    {
        path: "/profile",
        element: <Profile />
    },
    {
        path: '/myorder/:mvd',
        element: <MyOrderDetail />
    },
    {
        path: '/ad/book/:id/update',
        element: <BookAdminDetail />
    },
    {
        path: '/ad/book/create',
        element: <AddBook />
    },
])

ReactDOM.createRoot(document.getElementById('root')).render( // Tạo root của ứng dụng React và gắn ứng dụng vào phần tử DOM có id="root"
    <React.StrictMode>
        <CartProvider>
            <RouterProvider router={router} />
        </CartProvider>
    </React.StrictMode>
)