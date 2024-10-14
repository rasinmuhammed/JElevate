import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Badge, Form } from 'react-bootstrap';
import axios from 'axios';
import GamificationProgress from './GamificationProgress'; 
import '../style.css'; 

const EmployeeProgress = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [departments, setDepartments] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'points', direction: 'descending' });

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/admin/employees');
        setEmployees(response.data);
        setFilteredEmployees(response.data);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    const fetchDepartments = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/admin/departments');
        setDepartments(response.data);
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    };

    fetchEmployees();
    fetchDepartments();
  }, []);

  useEffect(() => {
    const filtered = employees.filter((employee) => {
      const isNameMatch = `${employee.firstName} ${employee.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
      const isDepartmentMatch = selectedDepartment ? employee.department?.name === selectedDepartment : true;
      return isNameMatch && isDepartmentMatch;
    });

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'ascending' ? 1 : -1;
        return 0;
      });
    }

    setFilteredEmployees(filtered);
  }, [searchTerm, selectedDepartment, employees, sortConfig]);

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handleViewDetails = async (employeeId) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/admin/employee/${employeeId}`);
      setSelectedEmployee(response.data);
      setShowModal(true);
    } catch (error) {
      console.error('Error fetching employee details:', error);
      alert('Error fetching employee details');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedEmployee(null);
  };

  const renderCertificationBadge = (type) => {
    switch (type) {
      case 'Course':
        return <Badge bg="primary">Course</Badge>;
      case 'Professional Certificate':
        return <Badge bg="success">Professional Certificate</Badge>;
      case 'Specialization':
        return <Badge bg="warning">Specialization</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="employee-progress-container">
      <h3 className="text-center my-4">Employee Progress Dashboard</h3>

      {/* Search and Filter */}
      <Form.Group controlId="search" className="mb-3">
        <Form.Control
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </Form.Group>

      <Form.Group controlId="departmentFilter" className="mb-3">
        <Form.Control
          as="select"
          value={selectedDepartment}
          onChange={(e) => setSelectedDepartment(e.target.value)}
        >
          <option value="">All Departments</option>
          {departments.map(department => (
            <option key={department._id} value={department.name}>{department.name}</option>
          ))}
        </Form.Control>
      </Form.Group>

      {/* Sortable Table */}
      <div className="table-scroll">
        <Table striped bordered hover responsive className="table-sortable">
          <thead>
            <tr>
              <th>Employee Name</th>
              <th>Department</th>
              <th>Designation</th>
              <th onClick={() => handleSort('points')} style={{ cursor: 'pointer' }}>
                Points {sortConfig.key === 'points' && (sortConfig.direction === 'ascending' ? '▲' : '▼')}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((employee) => (
              <tr key={employee._id}>
                <td>{employee.firstName} {employee.lastName}</td>
                <td>{employee.department?.name}</td>
                <td>{employee.designation}</td>
                <td>{employee.points}</td>
                <td>
                  <Button variant="info" onClick={() => handleViewDetails(employee._id)}>
                    View Details
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Employee Details Modal */}
      <Modal show={showModal} onHide={closeModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{selectedEmployee ? `${selectedEmployee.firstName} ${selectedEmployee.lastName}` : 'Employee Details'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedEmployee ? (
            <div className="employee-details">
              <p><strong>Employee ID:</strong> {selectedEmployee.employeeID}</p>
              <p><strong>Email:</strong> {selectedEmployee.email}</p>
              <p><strong>Designation:</strong> {selectedEmployee.designation}</p>
              <p><strong>Department:</strong> {selectedEmployee.department.name}</p>
              <p><strong>Skills:</strong> {selectedEmployee.skills?.join(', ') || 'No skills available'}</p>
              <p><strong>Points:</strong> {selectedEmployee.points}</p>

              {/* Certifications */}
              <h5>Certifications</h5>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Course Name</th>
                    <th>Certificate Type</th>
                    <th>Completion Date</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedEmployee.courses?.filter(course => ['Course', 'Professional Certificate'].includes(course.type)).map((course, index) => (
                    <tr key={index}>
                      <td>{course.courseId?.course || 'Unknown Course'}</td>
                      <td>{course.courseId?.certificateType}</td>
                      <td>{course.completionDate ? new Date(course.completionDate).toLocaleDateString() : 'Not completed'}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              {/* Specializations */}
              <h5>Specializations</h5>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Specialization</th>
                    <th>Completion Date</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedEmployee.courses?.filter(course => course.courseId?.certificateType === ' Specialization ').map((course, index) => (
                    <tr key={index}>
                      <td>{course.courseId?.course || 'Unknown Specialization'}</td>
                      <td>{course.completionDate ? new Date(course.completionDate).toLocaleDateString() : 'Not completed'}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              {/* Gamification Progress */}
              <GamificationProgress points={selectedEmployee.points} />
            </div>
          ) : (
            <p>Loading employee details...</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default EmployeeProgress;
