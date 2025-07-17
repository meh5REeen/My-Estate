import React, { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import {Link} from "react-router-dom"
import {useNavigate} from "react-router-dom";
import {
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
  signoutUserStart,
  signoutUserFailure,
  signoutUserSuccess
} from '../redux/user/userSlice.js';

export default function Profile() {
  const navigate =  useNavigate();
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(null);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({
    username: currentUser?.username || "",
    email: currentUser?.email || "",
    password: "",
    avatar: currentUser?.avatar || "",
  });
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const dispatch = useDispatch();
  const [showListingError,setShowListingError] = useState(false);
  const [userListings,setUserListings]=useState([]);
  
  
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  const uploadFile = async () => {
    if (!file) return null;

    const fd = new FormData();
    fd.append("file", file);
    fd.append("upload_preset", "unsigned_preset");

    try {
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/dbwz8kuoj/image/upload`,
        fd
      );
      setFormData((prev) => ({
        ...prev,
        avatar: res.data.secure_url,
      }));
      return res.data.secure_url;
    } catch (err) {
      setFileUploadError(true);
      console.error("Upload error:", err);
      return null;
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(updateUserStart());

    try {
      // Upload file first if selected
      let avatarUrl = formData.avatar;
      if (file) {
        avatarUrl = await uploadFile();
      }

      const updateData = {
        username: formData.username,
        email: formData.email,
        ...(formData.password && { password: formData.password }),
        ...(avatarUrl && { avatar: avatarUrl })
      };
      const token = localStorage.getItem('access_token');
     
      const res = await axios.put(`http://localhost:3000/api/user/${currentUser._id}/update`,updateData,
  {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    withCredentials: true,
  }
  );

      if (res.data) {
        dispatch(updateUserSuccess(res.data));
        setUpdateSuccess(true);
        setFile(null);
      }
    } catch (err) {
      dispatch(updateUserFailure(
        err.response?.data?.message || 
        err.message || 
        "Update failed"
      ));


    }};

    const handleSignOut = async() =>{
      try{
        dispatch(signoutUserStart())
        const res = await fetch('http://localhost:3000/api/auth/signout');
        const data =await res.json();
        if(data.success === false){
           dispatch(signoutUserFailure(data.message))
          return
        }
        localStorage.removeItem("access_token");

        dispatch(signoutUserSuccess(data.message))
        navigate("/sign-in")
      }
      catch(error){
          dispatch(signoutUserFailure(error.message))  
      }
    }

    const handleDelete= async ()=>{
        try{
                const token = localStorage.getItem('access_token');

          dispatch(deleteUserStart());
          const res = await fetch(`http://localhost:3000/api/user/${currentUser._id}/delete`,{
            method:'DELETE',
            credentials: 'include',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          });


          const data = await res.json();
          if(data.success === false){
            dispatch(deleteUserFailure(data.message));
            return;
          } 
          localStorage.removeItem('access_token');

          dispatch(deleteUserSuccess(data));
          navigate("/");
        }catch(error){
          dispatch(deleteUserFailure(error.message));
        }
    }
  
    const handleShowListing =async  () =>{
      const token = localStorage.getItem("token");
      try{
        setShowListingError(false);
        const res = await  fetch(`http://localhost:3000/api/user/listings/${currentUser._id}`,{

        method:'GET',
            credentials: 'include',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        }}

          
        )
      

        const data = await res.json();
        if(data.success === false){
          setShowListingError(true);
          return;
        }

        setUserListings(data);

      }catch(error){
        console.log(error); 
        setShowListingError(true);
      }

    }



    const handleDeleteListing = async (id) => {
      const token = localStorage.getItem("token");

      try{
        const res = await fetch(`http://localhost:3000/api/listing/delete/${id}`,{
          method:'DELETE',
            credentials: 'include',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        
        }})
        const data = await res.json();
        if(data.success === false){
          console.log(data.message)
          return;
        }
        setUserListings((prev) =>{
          prev.filter((listing) => listing._id !== id)
        })



      }catch(error){
        console.log(error.message)
      }
    }


  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input
          onChange={handleFileChange}
          type='file'
          ref={fileRef}
          hidden
          accept='image/*'
        />
        <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar || currentUser.avatar||"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQ_Op4Qn7cM-RkGM2MFM0EmODTGSEBCG7ehA6K7AB0Ak6-SmgpMFhQYpQuHjhOddSQlJw&usqp=CAU.png"}
          alt='profile'
          className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2'
        />
        {fileUploadError && (
          <p className='text-red-700 text-center text-sm'>
            Error uploading image (image must be less than 2MB)
          </p>
        )}
        <input
          type='text'
          placeholder='username'
          id='username'
          value={formData.username}
          className='border p-3 rounded-lg'
          onChange={handleChange}
        />
        <input
          type='email'
          placeholder='email'
          id='email'
          value={formData.email}
          className='border p-3 rounded-lg'
          onChange={handleChange}
        />
        <input
          type='password'
          placeholder='password'
          id='password'
          value={formData.password}
          className='border p-3 rounded-lg'
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'
        >
          {loading ? 'Loading...' : 'Update'}
        </button>

        <Link className="bg-green-700 text-white p-3 rounded-lg uppercase text-center
        hover:opacity-95 w-full" to={'/createListing'}>
          Create Listing
        </Link>
      </form>
        
      <div className='flex justify-between mt-5'>
        <span className='text-red-700 cursor-pointer' onClick={handleDelete}>Delete account</span>
        <span className='text-red-700 cursor-pointer' onClick={handleSignOut}>Sign out</span>
      </div>

      {error && <p className='text-red-700 mt-5'>{error.message}</p>}
      {updateSuccess && (
        <p className='text-green-700 mt-5'>Profile updated successfully!</p>
      )}
      <button onClick={handleShowListing} className="text-green-700 mt-5 w-full">Show Listings</button>
     {showListingError && <p className='text-red-700 mt-5'>Error showing Listings</p>}
      {console.log(userListings)}
      {userListings && userListings.length>0 &&
      <div className="flex flex-col gap-4">
        <h1 className="text-center my-7 text-2xl font-semibold "></h1>
      
      {userListings.map((listing)=>(
        <div key = {listing._id} className="border rounded-lg p-3 flex justify-between items-center gap-4">
          <Link to={`/listing/${listing._id}`}>
            <img src={listing.imageUrls[0]} alt = "listing img" className="h-16 w-16 object-contain"/>

          </Link>
          <Link className="text-slate-700 font-semibold flex-1 hover:underline truncate" to={`/listing/${listing._id}`}>
            <p >{listing.name}</p>
          </Link>

          <div className="gap-4 flex flex-col">
            <button onClick={()=>handleDeleteListing(listing._id)} className="text-red-700 uppercase">Delete</button>
            <Link to = {`/updatelisting/${listing._id}`}>
            <button className="text-green-700 uppercase">Edit</button>
            </Link>
          </div>
        </div>
      ))
    }</div>}
      
    
    </div>
  );
};