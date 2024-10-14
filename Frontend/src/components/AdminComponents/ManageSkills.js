import React, { useState, useEffect } from 'react';
import { Form, Button, Container, ListGroup, Col, Row, Modal } from 'react-bootstrap';
import axios from 'axios';

const ManageSkills = () => {
  const [skills, setSkills] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [newSkill, setNewSkill] = useState('');
  const [selectedDept, setSelectedDept] = useState(null);
  const [newSkillDescription, setNewSkillDescription] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState('Beginner');
  const [showEditSkillModal, setShowEditSkillModal] = useState(false);
  const [editSkill, setEditSkill] = useState({});
  const [editingSkillIndex, setEditingSkillIndex] = useState(null);
  
  useEffect(() => {
    const fetchSkills = async () => {
      const res = await axios.get('http://localhost:3000/api/admin/skills');
      setSkills(res.data);
    };
    const fetchDepartments = async () => {
      const res = await axios.get('http://localhost:3000/api/admin/departments');
      setDepartments(res.data);
    };
    fetchSkills();
    fetchDepartments();
  }, []);

  const handleAddSkill = async () => {
    if (!newSkill || !selectedDept || !newSkillLevel) return;

    try {
      const res = await axios.post('http://localhost:3000/api/admin/skills', {
        name: newSkill,
        description: newSkillDescription,
        department: selectedDept._id,
        level: newSkillLevel,
      });
      setSkills([...skills, res.data]);
      setNewSkill('');
      setNewSkillDescription('');
      setNewSkillLevel('Beginner');
    } catch (err) {
      console.error('Error adding skill', err);
    }
  };

  const handleEditSkill = async () => {
    if (editingSkillIndex === null || !editSkill.name) return;

    try {
      await axios.put(`http://localhost:3000/api/admin/skills/${skills[editingSkillIndex]._id}`, {
        name: editSkill.name,
        description: editSkill.description,
        department: editSkill.department,
        level: editSkill.level,
      });
      const updatedSkills = skills.map((skill, index) => index === editingSkillIndex ? editSkill : skill);
      setSkills(updatedSkills);
      setEditingSkillIndex(null);
      setEditSkill({});
      setShowEditSkillModal(false); 
    } catch (err) {
      console.error('Error editing skill', err);
    }
  };

  return (
    <Container>
      <h4>Set Key Skills for Departments</h4>
      
      <Row className="my-3">
        <Col md={6}>
          <Form.Control 
            type="text" 
            placeholder="New Skill"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)} 
          />
        </Col>
        <Col md={6}>
          <Form.Control 
            type="text"
            placeholder="Skill Description"
            value={newSkillDescription}
            onChange={(e) => setNewSkillDescription(e.target.value)} 
          />
        </Col>
        <Col md={4}>
          <Form.Control 
            as="select" 
            onChange={(e) => setSelectedDept(departments.find(d => d._id === e.target.value))}
            defaultValue=""
          >
            <option value="">-- Select Department --</option>
            {departments.map(dept => (
              <option key={dept._id} value={dept._id}>{dept.name}</option>
            ))}
          </Form.Control>
        </Col>
        <Col md={4}>
          <Form.Control 
            as="select" 
            value={newSkillLevel}
            onChange={(e) => setNewSkillLevel(e.target.value)}
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </Form.Control>
        </Col>
        <Col md={2}>
          <Button variant="primary" onClick={handleAddSkill}>
            Add Skill
          </Button>
        </Col>
      </Row>

      {selectedDept && (
        <div>
          <h5>Skills in {selectedDept.name}</h5>
          <ListGroup>
            {skills.filter(skill => skill.department._id === selectedDept._id).map((skill, index) => (
              <ListGroup.Item key={skill._id} className="d-flex justify-content-between align-items-center">
                <span>{skill.name}</span>
                <Button variant="link" onClick={() => {
                  setEditingSkillIndex(index);
                  setEditSkill(skill);
                  setShowEditSkillModal(true);
                }}>
                  <i className="fa-regular fa-pen-to-square"></i>
                </Button>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>
      )}

      {/* Edit Skill Modal */}
      <Modal show={showEditSkillModal} onHide={() => setShowEditSkillModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Skill</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control 
            type="text" 
            placeholder="Skill"
            value={editSkill.name}
            onChange={(e) => setEditSkill({ ...editSkill, name: e.target.value })} 
          />
          <Form.Control 
            type="text" 
            placeholder="Skill Description"
            value={editSkill.description}
            onChange={(e) => setEditSkill({ ...editSkill, description: e.target.value })} 
          />
          <Form.Control 
            as="select" 
            value={editSkill.level}
            onChange={(e) => setEditSkill({ ...editSkill, level: e.target.value })}
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </Form.Control>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditSkillModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleEditSkill}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ManageSkills;
