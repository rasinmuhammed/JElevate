import React, { useState, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { saveAs } from 'file-saver'; 

const AddEmployee = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [department, setDepartment] = useState('');
  const [designation, setDesignation] = useState('');
  const [departments, setDepartments] = useState([]); 
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/admin/departments'); 
        setDepartments(response.data); 
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    };

    fetchDepartments();
  }, []);

  const generateUniqueEmail = (first, last) => {
    return `${first.toLowerCase()}.${last.toLowerCase()}@company.com`;
  };

  const generateRandomPassword = () => {
    return Math.random().toString(36).slice(-8); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const employeeID = `EMP${Date.now()}${Math.floor(Math.random() * 100)}`; // Generate a unique employee ID
    const employeeEmail = generateUniqueEmail(firstName, lastName);
    const employeePassword = generateRandomPassword();

    const newEmployee = {
      firstName,
      lastName,
      email: employeeEmail,
      password: employeePassword, 
      employeeID,
      department,
      designation,
    };

    try {
      const response = await axios.post('http://localhost:3000/api/admin/add', newEmployee);
      console.log('Employee added:', response.data);
      
      const csvContent = [
        'Employee ID,First Name,Last Name,Email,Password,Department,Designation',
        `${employeeID},${firstName},${lastName},${employeeEmail},${employeePassword},${department},${designation}`
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      saveAs(blob, `${employeeID}_credentials.csv`);

      // Reset form fields
      setFirstName('');
      setLastName('');
      setDepartment('');
      setDesignation('');
      alert('Employee added successfully!');
    } catch (error) {
      console.error('Error adding employee:', error);
      alert('Error adding employee: ' + error.response?.data?.message || 'Server error'); 
  }};

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Add New Employee</h2>
      <Form onSubmit={handleSubmit} className="p-4 border rounded shadow">
        <Form.Group controlId="firstName">
          <Form.Label>First Name</Form.Label>
          <Form.Control 
            type="text" 
            value={firstName} 
            onChange={(e) => setFirstName(e.target.value)} 
            required 
            className="mb-3" 
          />
        </Form.Group>
        <Form.Group controlId="lastName">
          <Form.Label>Last Name</Form.Label>
          <Form.Control 
            type="text" 
            value={lastName} 
            onChange={(e) => setLastName(e.target.value)} 
            required 
            className="mb-3" 
          />
        </Form.Group>
        <Form.Group controlId="department">
          <Form.Label>Department</Form.Label>
          <Form.Control 
            as="select" 
            value={department} 
            onChange={(e) => setDepartment(e.target.value)} 
            required 
            className="mb-3"
          >
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept._id} value={dept.name}>{dept.name}</option>
            ))}
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="designation">
          <Form.Label>Designation</Form.Label>
          <Form.Control 
            type="text" 
            value={designation} 
            onChange={(e) => setDesignation(e.target.value)} 
            required 
            className="mb-4" 
          />
        </Form.Group>
        <Button variant="primary" type="submit" className="w-100">
          Add Employee
        </Button>
      </Form>
    </div>
  );
};

export default AddEmployee;
