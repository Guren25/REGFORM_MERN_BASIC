import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AddUser.css';

const EditUserForm = ({ userId, closeModal, updateUsers }) => {
  const [name, setName] = useState('');
  const [motto, setMotto] = useState('');
  const [image, setImage] = useState(null);
  const [imgPreview, setImgPreview] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/records/${userId}`);
        setName(res.data.name);
        setMotto(res.data.motto);
        setImage(res.data.image);
        setImgPreview(`http://localhost:5000${res.data.image}`);
      } catch (err) {
        console.error('Error fetching user:', err);
      }
    };

    fetchUser();
  }, [userId]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setImgPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('motto', motto);
    if (image && typeof image !== 'string') {
      formData.append('image', image);
    }

    try {
      const res = await axios.put(`http://localhost:5000/records/${userId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('User updated successfully:', res.data);
      closeModal();
      updateUsers();
    } catch (err) {
      console.error('Error updating user:', err);
    }
  };
  const renderImage = () => (
    imgPreview ? (
   <img
        src={imgPreview}
        alt="Preview"
        style={{
        maxHeight: '100%',
        maxWidth: '100%',
        }}
    />
    ) : (
        <span>No Image</span>
     )
  );
  return (
    <div className='modal-container'>
      <h2>Edit User Information</h2>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{ 
          width: '200px', 
          height: '200px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          marginTop: '2px', 
          marginBottom: '5px',
          border: '1px solid black'
        }}>
        {renderImage()}
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className='name-only'>
          <label>Name:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className='motto-only'>
          <label>Motto:</label>
          <textarea type="text" value={motto} onChange={(e) => setMotto(e.target.value)} required />
        </div>
        <div className='img-only'>
          <label>Image:</label>
          <input type="file" onChange={handleImageChange} />
        </div>
        <div className='buttons-only'>
          <button type="submit">Save Changes</button>
        </div>
      </form>
    </div>
  );
};

export default EditUserForm;
