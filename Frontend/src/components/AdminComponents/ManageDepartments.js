import React, { useState, useEffect } from 'react'; 
import { Form, Button, Container, ListGroup, Col, Row, Modal, Card, Alert } from 'react-bootstrap';
import axios from 'axios';
import './ManageDepartments.css'; 

const ManageDepartments = () => {
  const [departments, setDepartments] = useState([]);
  const [newDept, setNewDept] = useState('');
  const [newRole, setNewRole] = useState('');
  const [selectedDept, setSelectedDept] = useState(null);
  const [editDeptName, setEditDeptName] = useState('');
  const [editingRoleIndex, setEditingRoleIndex] = useState(null);
  const [editRoleTitle, setEditRoleTitle] = useState('');
  const [editRoleLevel, setEditRoleLevel] = useState('');
  
  const [showEditDeptModal, setShowEditDeptModal] = useState(false);
  const [showEditRoleModal, setShowEditRoleModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/admin/departments');
        setDepartments(res.data);
      } catch (error) {
        setErrorMessage('Error fetching departments.');
      }
    };
    fetchDepartments();
  }, []);

  const handleAddDepartment = async () => {
    if (!newDept) return;

    try {
      const res = await axios.post('http://localhost:3000/api/admin/add-department', { name: newDept });
      setDepartments([...departments, res.data]);
      setNewDept('');
    } catch (err) {
      setErrorMessage('Error adding department.');
    }
  };

  const handleAddRole = async () => {
    if (!newRole || !selectedDept) return;

    try {
      await axios.post('http://localhost:3000/api/admin/add-role', { departmentId: selectedDept._id, role: newRole });
      const updatedDept = { ...selectedDept, roles: [...selectedDept.roles, { title: newRole, level: 'Junior' }] };
      setDepartments(departments.map(dept => dept._id === updatedDept._id ? updatedDept : dept));
      setNewRole('');
    } catch (err) {
      setErrorMessage('Error adding role.');
    }
  };

  const handleEditDepartment = async () => {
    if (!editDeptName || !selectedDept) return;

    try {
      const res = await axios.put(`http://localhost:3000/api/admin/edit-department/${selectedDept._id}`, { name: editDeptName });
      setDepartments(departments.map(dept => dept._id === res.data._id ? res.data : dept));
      setEditDeptName('');
      setShowEditDeptModal(false);
    } catch (err) {
      setErrorMessage('Error editing department.');
    }
  };

  const handleEditRole = async () => {
    if (editingRoleIndex === null || !editRoleTitle || !editRoleLevel) return;

    try {
      await axios.put(`http://localhost:3000/api/admin/edit-role/${selectedDept._id}/${editingRoleIndex}`, { title: editRoleTitle, level: editRoleLevel });
      const updatedRoles = selectedDept.roles.map((role, index) => index === editingRoleIndex ? { title: editRoleTitle, level: editRoleLevel } : role);
      const updatedDept = { ...selectedDept, roles: updatedRoles };
      setDepartments(departments.map(dept => dept._id === updatedDept._id ? updatedDept : dept));
      setEditingRoleIndex(null);
      setEditRoleTitle('');
      setEditRoleLevel('');
      setShowEditRoleModal(false);
    } catch (err) {
      setErrorMessage('Error editing role.');
    }
  };

  const sortRoles = (roles) => {
    const roleOrder = { 'Senior': 3, 'Mid-Level': 2, 'Junior': 1 };
    return roles.sort((a, b) => (roleOrder[a.level] || 0) - (roleOrder[b.level] || 0));
  };

  return (
    <Container className="my-4">
      <h4 className="text-center mb-4">Manage Departments and Roles</h4>

      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

      <Row className="my-3">
        <Col md={6}>
          <Form.Control 
            type="text" 
            placeholder="New Department"
            value={newDept}
            onChange={(e) => setNewDept(e.target.value)} 
          />
        </Col>
        <Col md={2}>
          <Button className="gradient-button" onClick={handleAddDepartment}>
            Add Department
          </Button>
        </Col>
      </Row>

      <h5>Select a Department</h5>
      <Form.Control 
        as="select" 
        onChange={(e) => {
          const dept = departments.find(d => d._id === e.target.value);
          setSelectedDept(dept);
          setEditDeptName(dept ? dept.name : '');
        }}
      >
        <option value="">-- Select Department --</option>
        {departments.map(dept => (
          <option key={dept._id} value={dept._id}>{dept.name}</option>
        ))}
      </Form.Control>

      {selectedDept && (
        <Card className="mt-4 p-3">
          <Card.Header as="h5">{selectedDept.name}</Card.Header>
          <Card.Body>
            <Button className="gradient-button mb-3" onClick={() => setShowEditDeptModal(true)}>
              Edit {selectedDept.name}
            </Button>

            <h5>Roles in {selectedDept.name}</h5>
            <div style={{ maxHeight: '200px', overflowY: 'scroll' }}>
              <ListGroup>
                {sortRoles(selectedDept.roles).map((role, index) => (
                  <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                    <span>{role.title} - {role.level}</span>
                    <Button variant="link" onClick={() => {
                      setEditingRoleIndex(index);
                      setEditRoleTitle(role.title);
                      setEditRoleLevel(role.level);
                      setShowEditRoleModal(true);
                    }}>
                      <i className="fa-regular fa-pen-to-square"></i>
                    </Button>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </div>

            <Row className="mt-3">
              <Col md={6}>
                <Form.Control 
                  type="text" 
                  placeholder="New Role"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)} 
                />
              </Col>
              <Col md={2}>
                <Button className="gradient-button" onClick={handleAddRole}>
                  Add Role
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}

      {/* Edit Department Modal */}
      <Modal show={showEditDeptModal} onHide={() => setShowEditDeptModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Department</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control 
            type="text" 
            placeholder="Edit Department Name"
            value={editDeptName}
            onChange={(e) => setEditDeptName(e.target.value)} 
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditDeptModal(false)}>
            Close
          </Button>
          <Button className="gradient-button" onClick={handleEditDepartment}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Role Modal */}
      <Modal show={showEditRoleModal} onHide={() => setShowEditRoleModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Role</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={6}>
              <Form.Control 
                type="text" 
                placeholder="Role Title"
                value={editRoleTitle}
                onChange={(e) => setEditRoleTitle(e.target.value)} 
              />
            </Col>
            <Col md={6}>
              <Form.Control 
                type="text" 
                placeholder="Role Level"
                value={editRoleLevel}
                onChange={(e) => setEditRoleLevel(e.target.value)} 
              />
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditRoleModal(false)}>
            Close
          </Button>
          <Button className="gradient-button" onClick={handleEditRole}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ManageDepartments;
