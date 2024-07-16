import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import './ListUser.css';
import AddUserForm from './AddUser';
import EditUserForm from './EditUser';

Modal.setAppElement('#root');

const customModalStyles = {
  content: {
    display: 'flex',
    justifyContent: 'center',
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '400px',
    height: '750px',
    padding: '20px',
    borderRadius: '20px',
    boxShadow: '0 5px 15px rgba(0,0,0,.5)',
    backgroundColor: 'red',
    border: '2px solid black'
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
};

const imageModalStyles = {
  content: {
    display: 'flex',
    justifyContent: 'center',
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '500px',
    height: '500px',
    padding: '20px',
    borderRadius: '20px',
    boxShadow: '0 5px 15px rgba(0,0,0,.5)',
    backgroundColor: 'white',
    border: '2px solid black'
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
};

const ListUser = () => {
  const [users, setUsers] = useState([]);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [editUserId, setEditUserId] = useState(null);
  const [isImageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');

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

  const openAddModal = () => {
    setAddModalOpen(true);
  };

  const closeAddModal = () => {
    setAddModalOpen(false);
  };

  const openEditModal = (id) => {
    setEditUserId(id);
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setEditUserId(null);
  };

  const openImageModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setImageModalOpen(true);
  };

  const closeImageModal = () => {
    setImageModalOpen(false);
    setSelectedImage('');
  };

  const updateUsers = async () => {
    await fetchUsers();
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/records/${id}`);
      setUsers(users.filter(user => user._id !== id));
    } catch (err) {
      console.error('Error deleting user:', err.response ? err.response.data : err.message);
    }
  };

  return (
    <div className="main-container">
      <h1 className="header">ALL USER INFORMATION DATABASE</h1>
      <button className="add-button" onClick={openAddModal}>Add User</button>
      <table className="table">
        <thead className="table-head">
          <tr className="table-row">
            <th className="table-header">Name</th>
            <th className="table-header">Motto</th>
            <th className="table-header">Image</th>
            <th className="table-header">Date</th>
            <th className="table-header">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr className="table-row" key={user._id}>
              <td className="table-cell">{user.name}</td>
              <td className="table-motto-cell">{user.motto}</td>
              <td className="table-img-cell">
                <img 
                  className="image" 
                  src={`http://localhost:5000${user.image}`} 
                  alt={user.name} 
                  onClick={() => openImageModal(`http://localhost:5000${user.image}`)} 
                />
              </td>
              <td className="table-cell">{new Date(user.date).toLocaleDateString()}</td>
              <td className="table-cell">
                <button className="action-button" onClick={() => openEditModal(user._id)}>Edit</button>
                <button className="action-button delete" onClick={() => handleDelete(user._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add User Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onRequestClose={closeAddModal}
        contentLabel="Add User Modal"
        style={customModalStyles}
      >
        <AddUserForm updateUsers={updateUsers} closeModal={closeAddModal} />
      </Modal>

      {/* Edit User Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onRequestClose={closeEditModal}
        contentLabel="Edit User Modal"
        style={customModalStyles}
      >
        {editUserId && <EditUserForm userId={editUserId} closeModal={closeEditModal} updateUsers={updateUsers} />}
      </Modal>

      {/* Image Modal */}
      <Modal
        isOpen={isImageModalOpen}
        onRequestClose={closeImageModal}
        contentLabel="Image Modal"
        style={imageModalStyles}
      >
        <img src={selectedImage} alt="User" style={{ maxWidth: '100%', maxHeight: '100%' }} />
      </Modal>
    </div>
  );
};

export default ListUser;
