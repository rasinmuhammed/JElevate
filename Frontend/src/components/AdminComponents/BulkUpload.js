import React, { useState } from 'react';
import { Button, Container, Row, Col, Card, Alert, Spinner } from 'react-bootstrap';
import CSVReader from 'react-csv-reader';
import axios from 'axios';
import { saveAs } from 'file-saver';

const BulkUpload = () => {
  const [csvData, setCsvData] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleFileUpload = (data) => {
    console.log('File uploaded:', data); // Log uploaded file data

    if (!data || data.length === 0) {
      setError('The CSV file is empty or invalid.');
      console.error('Uploaded data is empty or invalid.'); // Log error
      return;
    }

    const formattedData = data.map((row) => row.map((cell) => cell.trim()));
    console.log('Formatted data:', formattedData); // Log formatted data

    const dataWithoutHeader = formattedData
      .slice(1)
      .filter((row) => row.length > 0 && row.some((cell) => cell));

    if (dataWithoutHeader.length === 0) {
      setError('No valid data found in the CSV.');
      console.error('No valid data found in the CSV.'); // Log error
      return; // Exit early if no valid data
    }

    setCsvData(dataWithoutHeader);
    setError(''); // Clear error if data is valid
    console.log('CSV data set:', dataWithoutHeader); // Log updated csvData
  };

  const handleSubmit = async () => {
    if (!csvData || csvData.length === 0) {
      setError('Please upload a valid CSV file.');
      console.error('No CSV data to submit.'); // Log error
      return;
    }

    setIsSubmitting(true);
    console.log('Starting employee data submission...'); // Log submission start
    setSuccess(''); // Clear previous success message

    const uniqueEmployees = {};
    const employeeCredentials = [];

    for (let row of csvData) {
      const [firstName, lastName, department, designation] = row;

      console.log('Processing row:', row); // Log each row being processed

      if (!firstName || !lastName) {
        setError('First Name and Last Name cannot be empty.');
        console.error('First Name or Last Name is empty:', row); // Log empty fields
        setIsSubmitting(false);
        return;
      }

      const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@company.com`;
      console.log('Generated email:', email); // Log generated email

      if (!uniqueEmployees[email]) {
        uniqueEmployees[email] = true; // Ensure unique email
        const employeeID = `EMP${Date.now()}${Math.floor(Math.random() * 100)}`; // Generate unique ID
        const password = Math.random().toString(36).slice(-8); // Generate random password

        const newEmployee = {
          firstName,
          lastName,
          email,
          password,
          employeeID,
          department,
          designation,
        };

        employeeCredentials.push(newEmployee);
        console.log('New employee added:', newEmployee); 
      } else {
        console.warn('Duplicate email found, skipping:', email); 
      }
    }

    console.log('Employee credentials prepared for submission:', employeeCredentials); 

    try {
      const res = await axios.post('http://localhost:3000/api/admin/bulk-upload', {
        employees: employeeCredentials,
      });


      if (res.status === 200 || res.status === 201) { 
        setSuccess('Employees successfully uploaded');

        // Prepare CSV content for download
        const csvContent = 'Employee ID,First Name,Last Name,Email,Password,Department,Designation\n' +
          employeeCredentials
            .map((emp) =>
              `${emp.employeeID},${emp.firstName},${emp.lastName},${emp.email},${emp.password},${emp.department},${emp.designation}`
            )
            .join('\n');

       
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        saveAs(blob, `bulk_upload_credentials.csv`); 
        console.log('CSV file saved:', `bulk_upload_credentials.csv`); 
      } else {
        setError('Error uploading employees. Please check the server response.');
        console.error('Unexpected response status:', res.status); 
      }
    } catch (err) {
      console.error('Error uploading employees:', err); 
      setError('Error uploading employees. Please check the console for details.'); 
    } finally {
      setIsSubmitting(false); 
      console.log('Submission process finished.'); 
    }
  };

  return (
    <Container className="mt-7" style={{ maxWidth: '800px' }}> 
      <Row className="justify-content-center">
        <Col md={12}> 
          <Card className="shadow p-4 mb-4"> 
            <Card.Title className="text-center mb-4">Bulk Upload Employees</Card.Title>
            <CSVReader 
              onFileLoaded={handleFileUpload} 
              parserOptions={{ delimiter: ',' }} 
              className="mb-3"
            />
            <Button
              variant="primary"
              onClick={handleSubmit}
              className="w-100"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Uploading...
                </>
              ) : (
                'Upload Employees'
              )}
            </Button>
            {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
            {success && <Alert variant="success" className="mt-3">{success}</Alert>}
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default BulkUpload;
