import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Container, Row, Col, Image, Alert } from 'react-bootstrap';
import './AddUser.css';

const AddUser = ({ updateUsers }) => {
  const [name, setName] = useState('');
  const [motto, setMotto] = useState('');
  const [image, setImage] = useState(null);
  const [imgPreview, setImgPreview] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showModal, setShowModal] = useState(true); // State to manage modal visibility

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
      const res = await axios.post('http://localhost:5000/Records', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Record added successfully:', res.data);
      setSuccessMessage('Recorded successfully!');
      setTimeout(() => {
        window.location.reload();
      }, 2000); // Refresh the page after 2 seconds
    } catch (err) {
      console.error('Error adding user:', err);
    }
  };

  const renderImage = () => (
    imgPreview ? (
      <Image src={imgPreview} alt="Preview" fluid />
    ) : (
      <span>No Image</span>
    )
  );

  return (
    showModal && (
      <Container className='modal-container'>
        <button className="close-button" onClick={() => setShowModal(false)}>X</button>
        <h2>ENTER YOUR INFORMATION</h2>
        <Row className='justify-content-md-center'>
          <Col md="auto" className='preview-container'>
            {renderImage()}
          </Col>
        </Row>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formName" className='name-only'>
              <div>
                  <Form.Label>Name:</Form.Label>
              </div>
            <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          </Form.Group>
          <Form.Group controlId="formMotto" className='motto-only'>
              <div>
                  <Form.Label>Motto:</Form.Label>
              </div>
            <Form.Control as="textarea" value={motto} onChange={(e) => setMotto(e.target.value)} required />
          </Form.Group>
          <Form.Group controlId="formImage" className='img-only'>
            <div>
              <Form.Label>Upload your Image here:</Form.Label>
            </div>
            <Form.Control type="file" onChange={handleImageChange} required />
          </Form.Group>
          <Button variant="primary" type="submit" className='buttons-only'>
            Add User
          </Button>
          {successMessage && <Alert variant="success">{successMessage}</Alert>}
        </Form>
      </Container>
    )
  );
};

export default AddUser;