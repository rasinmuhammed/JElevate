// src/components/AddCertification.js
import React, { useState } from 'react';
import { TextField, Button, Typography, Paper } from '@mui/material';
import axios from 'axios';

const AddCertification = () => {
  const [certificationName, setCertificationName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:3000/api/employee/add-certification', {
        name: certificationName,
        description
      });
      if (res.status === 200) {
        alert('Certification request submitted for approval');
      }
    } catch (err) {
      alert('Error submitting certification request');
    }
  };

  return (
    <Paper style={{ padding: '20px', marginTop: '20px' }}>
      <Typography variant="h6">Request New Certification</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Certification Name"
          value={certificationName}
          onChange={(e) => setCertificationName(e.target.value)}
          fullWidth
          style={{ marginBottom: '20px' }}
        />
        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          multiline
          rows={3}
          style={{ marginBottom: '20px' }}
        />
        <Button variant="contained" color="primary" type="submit">
          Submit Certification Request
        </Button>
      </form>
    </Paper>
  );
};

export default AddCertification;
