import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signInFailure,clearError ,signInStart, signInSuccess } from '../redux/user/userSlice';
import OAuth from '../Components/OAuth';
import { useEffect } from 'react';
export default function SignIn() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector(state => state.user);

  const [data, setData] = useState({});

  const handleChange = (e) => {
  if (!e.target.id) return;
  setData(prev => ({
    ...prev,
    [e.target.id]: e.target.value,
  }));
};

  useEffect(() => {
  dispatch(clearError());
}, [dispatch]);


  const handleSubmit = async e => {
    e.preventDefault();
    dispatch(signInStart());

    try {
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        credentials: "include"
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || 'Server error');
      }

      const result = await res.json();
      localStorage.setItem('access_token', result.access_token);
      console.log("tokee",result.access_token);
      if (result.success === false) {
        const msg = typeof result.message === 'string'
          ? result.message
          : JSON.stringify(result.message);
        dispatch(signInFailure(msg));
        return;
      }

      dispatch(signInSuccess(result));
      navigate('/');
    } catch (err) {
      dispatch(signInFailure(err.message || 'Something went wrong'));
    }
  };

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-9'>Sign In</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input
          onChange={handleChange}
          type='email'
          placeholder='Email'
          className='border p-3 rounded-lg'
          id='email'
        />
        <input
          onChange={handleChange}
          type='password'
          placeholder='Password'
          className='border p-3 rounded-lg'
          id='password'
        />
        <button
          disabled={loading}
          className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
        >
          {loading ? 'Loading...' : 'Sign In'}
        </button>
        <OAuth />
      </form>

      <div className='flex gap-2 mt-5'>
        <p>Don't have an Account?</p>
        <Link to='/sign-up'>
          <span className='text-blue-700'>Sign Up</span>
        </Link>
      </div>

      {error && (
        <p className='text-red-500 mt-5'>
          {typeof error === 'string' ? error : JSON.stringify(error)}
        </p>
      )}
    </div>
  );
}
