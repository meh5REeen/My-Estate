import React from 'react'
import {BrowserRouter,Routes,Route} from 'react-router-dom';
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Profile from "./pages/Profile.jsx";
import SignUp from "./pages/SignUp.jsx";
import SignIn from "./pages/SignIn.jsx";
import Header from './Components/Header.jsx';
import CreateListing from './pages/createListing.jsx';
import PrivateRoute from './Components/PrivateRoute.jsx';
import UpdateListing from './pages/UpdateListing.jsx';
import Listing from './pages/Listing.jsx';
import Search from './pages/Search.jsx';
export default function App() {
  return (
    
    <BrowserRouter>
    <Header/>
    <Routes>
        <Route path ="/" element = {<Home/>}/>
        <Route path ="/sign-up" element = {<SignUp/>}/>
        <Route path ="/sign-in" element = {<SignIn/>}/>
        <Route path ="/about" element = {<About/>}/>
        <Route path ="/listing/:listingId" element = {<Listing/>}/>
        <Route path ="/search" element = {<Search/>}/>

        <Route element={<PrivateRoute/>}>
        <Route path ="/profile" element = {<Profile/>}/>
        <Route path ="/createlisting" element = {<CreateListing/>}/>
        <Route path ="/updatelisting/:listingid" element = {<UpdateListing/>}/>

        </Route>
    </Routes>
    </BrowserRouter>
    
  )
}
