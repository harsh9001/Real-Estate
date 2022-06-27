import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HomePage from './Pages/HomePage';
import Offer from './Pages/Offer';
import Signin from './Pages/Signin';
import Signup from './Pages/Signup';
import Profile from './Pages/Profile';
import ForgotPassword from './Pages/ForgotPassword';
import PrivateRoute from './Components/PrivateRoute';
import Category from './Pages/Category';
import Sell from './Pages/Sell';
import Item from './Pages/Item';
import Contact from './Pages/Contact';
import EditListing from './Pages/EditListing';

function App() {
  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/category/:categoryName' element={<Category />} />
        <Route path='/editlisting/:listingId' element={<EditListing />} />
        <Route path='/category/:categoryName/:listingId' element={<Item />} />
        <Route path='/contact/:landlordId' element={<Contact />} />
        <Route path='/offer' element={<Offer />} />
        <Route path='/sell' element={<Sell />} />
        <Route path='/profile' element={<PrivateRoute />} >
          <Route path='/profile' element={<Profile />} />
        </Route>
        <Route path='/signin' element={<Signin />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
