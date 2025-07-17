import React, { useEffect } from 'react'
import {useState} from 'react';
import {Link} from 'react-router-dom';
export default function Contact({listing}) {
  const [landlord,setLandlord]=useState(null);
  const token = localStorage.getItem('access_token');
  const [message,setMessage] = useState('');
  const handleChange = (e) =>{
    setMessage(e.target.value)
  }

  useEffect(()=> {

    const fetchlandlord = async () => {
        try{
            const res = await fetch(`http://localhost:3000/api/user/${listing.userRef}`,{
            method:'GET',
            credentials: 'include',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
            }})

            const data = await res.json();
            if(data.success === false){
                console.log(data.message);
                return;
            }
            setLandlord(data);

        }catch(error){
            console.log(error);
        }
    }
     fetchlandlord();


  },[listing.userRef,token]
)
    return (
    <div>
      {landlord && (
        <div className='flex flex-col gap-2'>
            <p className='font-semibold'>Contact<span>{landlord.username}</span> for<span>
                {listing.name.toLowerCase()}
                </span></p>
                <textarea name="message"
                className='w-full border p-3 rounded-lg'
                id="message"
                placeholder='Enter your message:'
                 value={message} onChange={handleChange}>

                 </textarea>
                 <Link
                 to={`mailto:${landlord.email}?Subject=Regarding ${listing.name}&body=${message}`}
                 className='bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95'
                 >
                    Send Message
                 </Link>
        </div>
      )}
    </div>
  )
}
