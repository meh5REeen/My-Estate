import React, { useEffect, useState } from 'react';
import {FaSearch} from 'react-icons/fa';
import {Link, useNavigate} from 'react-router-dom';
import {useSelector} from 'react-redux';

export default function Header() {
  const navigate = useNavigate();
  const {currentUser} = useSelector(state => state.user);
  const [searchTerm , setSearchTerm] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('searchTerm',searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  }


  useEffect(()=> {
    const urlParams = new URLSearchParams(window.location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if(searchTermFromUrl){
      setSearchTerm(searchTermFromUrl);
    }
  },[])

  return (
    <header className="bg-slate-200 shadow-md ">
      <div className="max-w-6xl  flex items-center justify-between px-4 py-3 w-full">
        {/* Logo on the left */}
        <Link to="/">
        <h1 className="font-bold text-xl flex flex-wrap">
          
          <span className="text-slate-500">Mehreen</span>
          <span className="text-slate-700">Estate</span>
        </h1>
        </Link>

        {/* Search bar */}
        <form onSubmit={handleSubmit} className=" flex items-center bg-slate-100 p-3 rounded-lg">
          <input
            className ='bg-transparent focus:outline-none w-24 sm:w-64'
            type="text"
            placeholder="Search..."
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <button><FaSearch className= 'text-slate-600'/></button>
        </form>

        {/* Placeholder for right-side menu (optional) */}
        <nav>
          <ul className="flex gap-4 text-sm sm:text-base">
            <Link to="/"><li className="hidden sm:inline text-slate-700 hover:underline">Home</li></Link>
            <Link to="/about"><li className="hidden sm:inline text-slate-700 hover:underline">About</li></Link>

        

                {currentUser ? (
                <Link to="/profile">
                  <img
                    className="rounded-full h-7 w-7 object-cover"
                    src={currentUser.avatar}
                    alt="avatar"
                  />
                </Link>
              ) : (
                <Link to="/sign-in">
                  <li className="text-slate-700 hover:underline">Sign in</li>
                </Link>
                        )}


          </ul>
        </nav>
      </div>
    </header>
  );
}
