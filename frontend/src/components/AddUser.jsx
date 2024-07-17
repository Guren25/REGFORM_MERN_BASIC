import React, { useState } from 'react';
import axios from 'axios';
import './AddUser.css';

const AddUser = ({ updateUsers, closeModal }) => {
  const [name, setName] = useState('');
  const [motto, setMotto] = useState('');
  const [image, setImage] = useState(null);
  const [imgPreview, setImgPreview] = useState('');

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
    formData.append('image', image);

    try {
      const res = await axios.post('http://localhost:5000/records', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('User added successfully:', res.data);
      closeModal();
      updateUsers();
    } catch (err) {
      console.error('Error adding user:', err);
    }
  };

  return (
    <div className='modal-container'>
      <h2>Add User Information</h2>
      <div style={{display: 'flex', justifyContent: 'center'}}>
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
      {imgPreview ? (
        <img src={imgPreview} alt="Preview" 
          style={{ 
          maxHeight: '100%', 
          maxWidth: '100%'
      }} 
      />
      ) : (
          <span>No Image</span>
          )}
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
          <input type="file" onChange={handleImageChange} required />
        </div>
        <div className='buttons-only'>
          <button type="submit">Add User</button>
          <button type="button" onClick={closeModal}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default AddUser;
