import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { Button, Table, Container, Row, Col, Image, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ListUser.css';

const ListUser = () => {
  const [users, setUsers] = useState([]);
  const [isImageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const history = useHistory();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/records');
      setUsers(res.data);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const openImageModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setImageModalOpen(true);
  };

  const closeImageModal = () => {
    setImageModalOpen(false);
    setSelectedImage('');
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/records/${id}`);
      setUsers(users.filter(user => user._id !== id));
    } catch (err) {
      console.error('Error deleting user:', err.response ? err.response.data : err.message);
    }
  };

  const redirectToAddUser = () => {
    history.push('/add-user');
  };

  const redirectToEditUser = (id) => {
    history.push(`/edit-user/${id}`);
  };

  return (
    <Container className="main">
      <Row className="justify-content-md-center">
        <Col md="auto">
          <h1 className="header">ALL USER INFORMATION DATABASE</h1>
        </Col>
      </Row>
      <Row className="justify-content-md-end mb-3">
        <Col md="auto">
          <Button variant="primary" onClick={redirectToAddUser}>Add Record</Button>
        </Col>
      </Row>
      <Row className="justify-content-md-center">
        <Col md="auto">
          <Table striped bordered hover>
            <thead className="table-head">
              <tr className="table-row">
                <th className="table-header">Image</th>
                <th className="table-header">Name</th>
                <th className="table-header">Motto</th>
                <th className="table-header">Date</th>
                <th className="table-header">Edit</th>
                <th className="table-header">Delete</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr className="table-row" key={user._id}>
                  <td className="table-img-cell">
                    <Image 
                      className="image" 
                      src={`http://localhost:5000${user.image}`} 
                      alt={user.name} 
                      thumbnail 
                      onClick={() => openImageModal(`http://localhost:5000${user.image}`)} 
                    />
                  </td>
                  <td className="table-cell">{user.name}</td>
                  <td className="table-motto-cell">{user.motto}</td>
                  <td className="table-cell">{new Date(user.date).toLocaleDateString()}</td>
                  <td className="table-cell">
                    <Button variant="warning" className="action-btn" onClick={() => redirectToEditUser(user._id)}>Edit</Button>
                  </td>
                  <td className="table-cell">
                    <Button variant="danger" className="action-btn delete" onClick={() => handleDelete(user._id)}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>

      <Modal show={isImageModalOpen} onHide={closeImageModal} centered>
        <Modal.Body className="text-center">
          <Image src={selectedImage} fluid />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeImageModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ListUser;
