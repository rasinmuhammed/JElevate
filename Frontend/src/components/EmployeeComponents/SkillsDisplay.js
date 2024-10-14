import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Card, ListGroup, Badge, Row, Col, Modal, Button } from 'react-bootstrap';
import './SkillsDisplay.css'; 


const SkillsDisplay = () => {
  const [skills, setSkills] = useState([]);
  const [userSkills, setUserSkills] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentDescription, setCurrentDescription] = useState('');

  useEffect(() => {
    fetchSkills();
    fetchUserSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const token = Cookies.get('token');
      const response = await axios.get('http://localhost:3000/api/user/skillsdep', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSkills(response.data);
    } catch (error) {
      console.error('Error fetching skills:', error);
    }
  };

  const fetchUserSkills = async () => {
    try {
      const token = Cookies.get('token');
      const response = await axios.get('http://localhost:3000/api/user/skills', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserSkills(response.data);
    } catch (error) {
      console.error('Error fetching user skills:', error);
    }
  };

  // Group skills by department
  const groupedSkills = skills.reduce((acc, skill) => {
    const departmentName = skill.departmentName; 
    if (!acc[departmentName]) {
      acc[departmentName] = { skills: [] };
    }
    acc[departmentName].skills.push(skill);
    return acc;
  }, {});

  
  const departmentName = Object.keys(groupedSkills)[0]; 

  const handleShowModal = (description) => {
    setCurrentDescription(description);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentDescription(''); 
  };

  return (
    <Card className="mb-4">
      <Card.Header as="h5">Key Skills for Your Department</Card.Header>
      <ListGroup variant="flush">
        {departmentName && (
          <div className="department-section">
            <Card.Body>
              <Card.Title className="department-title">{departmentName}</Card.Title> 
              <Row>
                <Col md={6}>
                  <h6>Expected Skills:</h6>
                  {groupedSkills[departmentName].skills.length > 0 ? (
                    <ListGroup>
                      {groupedSkills[departmentName].skills.map((skill) => (
                        <ListGroup.Item key={skill._id} className="skill-item d-flex justify-content-between align-items-center">
                          <div>
                            <strong>{skill.name}</strong>
                            <Badge pill bg="secondary" className="ml-2">
                              {skill.level} 
                            </Badge>
                          </div>
                          <button className="btn btn-link" onClick={() => handleShowModal(skill.description)}>
                          <i class="fa-solid fa-eye"></i>
                          </button>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  ) : (
                    <ListGroup.Item>No expected skills available for this department.</ListGroup.Item>
                  )}
                </Col>
                <Col md={6}>
                  <h6>User Skills:</h6>
                  {userSkills.length > 0 ? (
                    <ListGroup>
                      {userSkills.map((userSkill, index) => (
                        <ListGroup.Item key={index} className="user-skill-item">
                          {userSkill} 
                          
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  ) : (
                    <ListGroup.Item>No user skills available.</ListGroup.Item>
                  )}
                </Col>
              </Row>
            </Card.Body>
          </div>
        )}
      </ListGroup>

      {/* Modal for skill description */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Skill Description</Modal.Title>
        </Modal.Header>
        <Modal.Body>{currentDescription}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Card>
  );
};

export default SkillsDisplay;
