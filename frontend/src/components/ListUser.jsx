import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ListUser.css';
import AddUserForm from './AddUser';
import EditUserForm from './EditUser';

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
      const sortedUsers = res.data.sort((a, b) => new Date(b.date) - new Date(a.date));
      setUsers(sortedUsers);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const openAddModal = () => setAddModalOpen(true);
  const closeAddModal = () => setAddModalOpen(false);

  const openEditModal = (id) => {
    setEditUserId(id);
    setEditModalOpen(true);
  };
  const closeEditModal = () => {
    setEditUserId(null);
    setEditModalOpen(false);
  };

  const openImageModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setImageModalOpen(true);
  };
  const closeImageModal = () => {
    setSelectedImage('');
    setImageModalOpen(false);
  };

  const updateUsers = async () => await fetchUsers();

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/records/${id}`);
      setUsers(users.filter((user) => user._id !== id));
    } catch (err) {
      console.error('Error deleting user:', err.response ? err.response.data : err.message);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Record Database</h1>
      <div className="d-flex justify-content-end mb-3"> {/* Added div to align button to the right */}
        <button className="btn btn-primary" onClick={openAddModal}>Add Record</button> {/* Changed text to "Add Record" */}
      </div>
      <table className="table table-bordered">
        <thead className="thead-dark">
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Motto</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>
                <img 
                  className="img-thumbnail" 
                  src={`http://localhost:5000${user.image}`} 
                  alt={user.name} 
                  onClick={() => openImageModal(`http://localhost:5000${user.image}`)} 
                  style={{ cursor: 'pointer', width: '50px', height: '50px' }} 
                />
              </td>
              <td>{user.name}</td>
              <td>{user.motto}</td>
              <td>{new Date(user.date).toLocaleDateString()}</td>
              <td>
                <button className="btn btn-warning btn-sm me-2" onClick={() => openEditModal(user._id)}>Edit</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(user._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Bootstrap Modals */}
      <div className={`modal ${isAddModalOpen ? 'show' : ''}`} style={{ display: isAddModalOpen ? 'block' : 'none' }} tabIndex="-1" role="dialog">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">ADD A RECORD</h5>
              <button type="button" className="close ms-auto" onClick={closeAddModal}>
                <span>&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <AddUserForm updateUsers={updateUsers} closeModal={closeAddModal} />
            </div>
          </div>
        </div>
      </div>

      <div className={`modal ${isEditModalOpen ? 'show' : ''}`} style={{ display: isEditModalOpen ? 'block' : 'none' }} tabIndex="-1" role="dialog">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit Record</h5>
              <button type="button" className="close ms-auto" onClick={closeEditModal}>
                <span>&times;</span>
              </button>
            </div>
            <div className="modal-body">
              {editUserId && <EditUserForm userId={editUserId} closeModal={closeEditModal} updateUsers={updateUsers} />}
            </div>
          </div>
        </div>
      </div>

      <div className={`modal ${isImageModalOpen ? 'show' : ''}`} style={{ display: isImageModalOpen ? 'block' : 'none' }} tabIndex="-1" role="dialog">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-body">
              <img src={selectedImage} alt="User" style={{ maxWidth: '100%', maxHeight: '100%' }} />
              <button type="button" className="close ms-auto" onClick={closeImageModal}>
                <span>&times;</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListUser;