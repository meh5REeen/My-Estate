import React, { useState} from 'react'
import {useNavigate} from 'react-router-dom';
import { useSelector } from 'react-redux';
export default function CreateListing() {
    const [files , setFiles] = useState([]);
    const { currentUser } = useSelector((state) => state.user);
    const navigate = useNavigate();
    const CLOUDINARY_URL = import.meta.env.VITE_CLOUDINARY_URL;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: '',
    description: '',
    address: '',
    type: 'rent',
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountedPrice: 50,
    offer: false,
    parking: false,
    furnished: false,
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  console.log(formData);
    console.log(files);



    const handleImageSubmit = async (e) => {
        e.preventDefault();
  if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
    setUploading(true);
    setImageUploadError(false);

    const promises = files.map((file) => storeImage(file));

    Promise.all(promises)
      .then((urls) => {
        setFormData({
          ...formData,
          imageUrls: formData.imageUrls.concat(urls),
        });
        setImageUploadError(false);
        setUploading(false);
      })
      .catch((err) => {
        console.error(err);
        setImageUploadError('Image upload failed (2 mb max per image)');
        setUploading(false);
      });
  } else {
    setImageUploadError('You can only upload 6 images per listing');
    setUploading(false);
  }
};

const storeImage = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

  return fetch(CLOUDINARY_URL, {
    method: 'POST',
    
    body: formData,
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.secure_url) {
        return data.secure_url; // hosted image URL
      } else {
        throw new Error('Upload failed');
      }
    });
};

const handleRemoveImage = (index) => {
    setFormData({
        ...formData,
        imageUrls : formData.imageUrls.filter((_,i) =>i !== index)
})
}

const handleChange = (e) =>{
  if(e.target.id === 'sale' || e.target.id === 'rent')
  {
    setFormData(
      {
        ...formData,type:e.target.id
      }
    )
  }
  if (e.target.id === 'parking'|| e.target.id === 'furnished' ||e.target.id === 'offer')
  {
    setFormData({
      ...formData,
      [e.target.id] : e.target.checked
    })
  }

  if(e.target.type === 'number' || e.target.type === 'text' || e.target.tagName === 'TEXTAREA'){
    setFormData({
      ...formData,
      [e.target.id] : e.target.value
    })
  }
};

const handleSubmit = async (e) => {
  e.preventDefault();
  if(formData.imageUrls.length < 1) return setError("You must upload an image");
  if(+formData.regularPrice < +formData.discountedPrice) return setError("Discounted Price must be less than the regular price");
  const token = localStorage.getItem('access_token');
  try{
    setLoading(true);
    setError(false);
    const res = await fetch('http://localhost:3000/api/listing/create',{
      method : 'POST',
      headers :{
        'Content-Type':'application/json',
        Authorization : `Bearer ${token}`
      },
      body : JSON.stringify({...formData,
        userRef : currentUser._id
      }),


    });
    const data = await res.json();
    setLoading(false);

    if(data.success === false){
      setError(data.message);
    }
    navigate(`/listing/${data._id}`)

  }catch(error){
    setError(error.message);
    setLoading(false);
  }
}
  return (
  <div className="p-3 max-w-4xl mx-auto">
    <h1 className="text-3xl font-semibold text-center my-7">Create A Listing</h1>
    <form  onSubmit = {handleSubmit} className="flex flex-col sm:flex-row gap-4">
      <div className="flex flex-col gap-4 flex-1">
        <input
          type="text"
          placeholder="Name"
          className="border p-3 rounded-lg"
          id="name"
          maxLength="62"
          minLength="10"
          required
          value={formData.name}
          onChange={handleChange}
        />
        <textarea
          placeholder="Description"
          className="border p-3 rounded-lg"
          id="description"
          required
          value={formData.description}
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="Address"
          className="border p-3 rounded-lg"
          id="address"
          required
          value={formData.address}
          onChange={handleChange}
        />

        <div className='flex gap-6 flex-wrap'>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='sale'
                className='w-5'
                onChange={handleChange}
                checked={formData.type === 'sale'}
              />
              <span>Sell</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='rent'
                className='w-5'
                onChange={handleChange}
                checked={formData.type === 'rent'}
              />
              <span>Rent</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='parking'
                className='w-5'
                onChange={handleChange}
                checked={formData.parking}
              />
              <span>Parking spot</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='furnished'
                className='w-5'
                onChange={handleChange}
                checked={formData.furnished}
              />
              <span>Furnished</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='offer'
                className='w-5'
                onChange={handleChange}
                checked={formData.offer}
              />
              <span>Offer</span>
            </div>
          </div>

        <div className="flex flex-wrap gap-6">
          <div className="flex items-center gap-2">
            <input
              className="p-3 border border-gray-300 rounded-lg"
              type="number"
              id="bedrooms"
              min="1"
              max="10"
              required
              onChange={handleChange}
              value={formData.bedrooms}
            />
            <p>Beds</p>
          </div>
          <div className="flex items-center gap-2">
            <input
              className="p-3 border border-gray-300 rounded-lg"
              type="number"
              id="bathrooms"
              min="1"
              max="10"
              required
              onChange={handleChange}
              value={formData.bathrooms}
            />
            <p>Baths</p>
          </div>
          <div className="flex items-center gap-2">
            <input
              className="p-3 border border-gray-300 rounded-lg"
              type="number"
              id="regularPrice"
              min="50"
              max="1000000"
              required
              onChange={handleChange}
              value={formData.regularPrice}
            />
            <div className="flex flex-col items-center">
              <p>Regular Price</p>
              <span className="text-xs">$ /month</span>
            </div>
          </div>
          {formData.offer &&
          <div className="flex items-center gap-2">
            <input
              className="p-3 border border-gray-300 rounded-lg"
              type="number"
              id="discountedPrice"
              min="1"
              max="1000000"
              required
              onChange={handleChange}
              value={formData.discountedPrice}
            />
            <div className="flex flex-col items-center">
              <p>Discounted Price</p>
              <span className="text-xs">$ /month</span>
            </div>
          </div>}
        </div>
      </div>

      <div className="flex flex-col flex-1 gap-4">
        <p className="font-semibold">
          Images:
          <span className="font-normal text-gray-600 ml-2">
            The first image will be the cover (max 6)
          </span>
        </p>
        <div className="flex gap-4">
          <input
            onChange={(e) => setFiles(Array.from(e.target.files))}
            className="p-3 border border-gray-300 rounded-full"
            type="file"
            id="images"
            accept="image/*"
            multiple
          />
          <button
            onClick={handleImageSubmit}
            type="button"
            className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
          >
            {uploading ? "Uploading" : "Upload"}
          </button>
        </div>

        <div className="text-red-700 text-sm">
          <p>{imageUploadError && imageUploadError}</p>

          {formData.imageUrls.length > 0 && (
            <div className="flex flex-col gap-2">
              {formData.imageUrls.map((url, index) => (
                <div
                  key={url}
                  className="flex justify-between p-3 border items-center"
                >
                  <img
                    src={url}
                    alt={`Listing image ${index + 1}`}
                    className="w-20 h-20 object-contain rounded-lg"
                  />
                  <button
                    onClick={() => handleRemoveImage(index)}
                    type="button"
                    className="p-3 text-red-700 rounded-lg uppercase hover:opacity-75"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
        disabled={loading || uploading}
          
          className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading?'Loading':'Create Listing'}
        </button>
        {error && <p className='text-red-700 text-sm'>{error}</p>}
      </div>
    </form>
  </div>
);
}

