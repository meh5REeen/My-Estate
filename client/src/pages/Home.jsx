import React, { useEffect, useState } from 'react'
import {Link} from 'react-router-dom';
import {Swiper,SwiperSlide} from 'swiper/react';
import 'swiper/css/bundle';
import SwiperCore from 'swiper';
import {Navigation} from 'swiper/modules';
import Card from '../Components/Card';
export default function Home() {
  const [offerListings , setOfferListings] = useState([]);
  const [saleListings,setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  SwiperCore.use({Navigation})
  console.log(saleListings);
  console.log(offerListings);
  console.log(rentListings);
  const token = localStorage.getItem('access_token')
  useEffect(() => {
    const fetchOfferListings = async () => {
      try{
        const res= await fetch('http://localhost:3000/api/listing/get?offer=true&limit=4',{
          ethod:'GET',
            credentials: 'include',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        
        }
        }
      )
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
      }catch(error){
        console.log(error)
      }
    }

      const fetchRentListings= async () => {
        try{
        const res= await fetch('http://localhost:3000/api/listing/get?type=rent&limit=4',{
          ethod:'GET',
            credentials: 'include',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        
        }
        }
      )
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      }catch(error){
        console.log(error)
      }
      }

      const fetchSaleListings = async () => {
try{
        const res= await fetch('http://localhost:3000/api/listing/get?type=sale&limit=4',{
          ethod:'GET',
            credentials: 'include',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        
        }
        }
      )
        const data = await res.json();
        setSaleListings(data);
    
      }catch(error){
        console.log(error)
      }
      }
      fetchOfferListings();
  },[]);



  return (
    <div>
      {/* top */}
      <div className='flex flex-col gap-6 p-28 px-3 max-w-6-xl'>
        <h1 className='text-slate-700 font-bold text-3xl lg:text-6xl '>
          Find your next<span className='text-slate-500'>perfect</span>
          <br/>
          place with ease
        </h1>
      </div>
      <div className='text-gray-400 text-xs sm:text-sm'>
          Mehreen's Estate is the best place to find your next perfect place to live
        <br/>
        we have a wide range of properties for you to choose form

      </div>
        <Link to='/search'
        className='text-xs sm:text-sm 
        ext-blue-800 font-bold hover:underline'>
          Let's get started
      </Link>
      {/* swiper */}

    <Swiper navigation>
      {
        offerListings && offerListings.length > 0 &&
        offerListings.map((listing) => (
          <SwiperSlide >
              <div style={{background:`url(${listing.imageUrls[0]}) center no-repeat `,backgroundSize:"cover"}}
              className='h-[500px] ' key={listing._id}>
              
              </div>
          </SwiperSlide>
        ))
      }
      </Swiper>
      {/* listing results */}

      <div className='max-w-6xl mx-auto p-3 flex flex-col
      gap-8 my-10'>
        {
          offerListings && offerListings.length > 0 && (
            <div className=''>
                  <div className=''>
                    <h2 className='text-2xl font-semibold text-slate-600'>Recent offers</h2>
                    <Link
                    className='text-sm text-blue-800 hover:underline'
                    to={'/search?offer=true'}
                    >
                      Show more offers
                    </Link>

              </div>
              <div className='flex flex-wrap gap-4'>
                    {
                      offerListings.map((listing) => (
                        <Card key = {listing._id} listing={listing}/>
                      ))
                    }
              </div>  
              </div>

          )
        }

        {
          rentListings && rentListings.length > 0 && (
            <div className=''>
                  <div className=''>
                    <h2 className='text-2xl font-semibold text-slate-600'>Recent places for Rent</h2>
                    <Link
                    className='text-sm text-blue-800 hover:underline'
                    to={'/search?type=rent'}
                    >
                      Show more places for Rent
                    </Link>

              </div>
              <div className='flex flex-wrap gap-4'>
                    {
                      rentListings.map((listing) => (
                        <Card key = {listing._id} listing={listing}/>
                      ))
                    }
              </div>  

              </div>
              
          )
        }
        {
          saleListings && saleListings.length > 0 && (
            <div className=''>
                  <div className=''>
                    <h2 className='text-2xl font-semibold text-slate-600'>Recent Places for Sale</h2>
                    <Link
                    className='text-sm text-blue-800 hover:underline'
                    to={'/search?type=sale'}
                    >
                      Show more places for sale
                    </Link>

              </div>
              <div className='flex flex-wrap gap-4'>
                    {
                      saleListings.map((listing) => (
                        <Card key = {listing._id} listing={listing}/>
                      ))
                    }
              </div>  
              </div>
              
          )
        }
      </div>
    </div>
  )
}
