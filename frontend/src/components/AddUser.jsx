import React, {useState} from 'react';
import axios from 'axios';
import './AddUser.css';

const AddUser = ({updateUsers}) => {
    const [name, setName] = useState('');
    const [motto, setMotto] = useState('');
    const [filename, setFilename] = useState('Choose File');
    const [preview, setPreview] = useState('')

    const onChange = (e) => {
        const selectedFile = e.target.files[0];
        setFilename(selectedFile);
        setFilename(selectedFile.name)
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('filename', file);
        formData.append('name', name);
        formData.append('motto', motto);

        try {
            const res = await axios.post('http://localhost:5000/Info', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            console.log ('Recorded Successfully');
            updateUsers();
        } catch (err) {
            console.error('Error adding record:', err);
        }
    };
    return (
        <>
            <div className='popup'>
                <h1>REGISTRATION FORM</h1>
            </div>
        </>
    )
};

export default AddUser;