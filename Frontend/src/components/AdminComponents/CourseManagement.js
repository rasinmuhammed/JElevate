import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Button, Form, Modal, Dropdown } from 'react-bootstrap';
import axios from 'axios';
import './ManageDepartments.css'; 

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [sortedCourses, setSortedCourses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newCourse, setNewCourse] = useState({
    partner: '',
    course: '',
    skills: '',
    rating: '',
    reviewcount: '',
    level: '',
    certificatetype: '',
    duration: '',
    crediteligibility: false,
  });
  const [sortLevel, setSortLevel] = useState('');
  const [expandedCourses, setExpandedCourses] = useState({}); // Track expanded state for skills

  // Fetch courses on component mount
  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/admin/courses'); 
      setCourses(response.data);
      setSortedCourses(response.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCourse((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddCourse = async () => {
    try {
      await axios.post('http://localhost:3000/api/admin/courses', newCourse);
      setShowModal(false);
      fetchCourses(); // Refresh the course list
    } catch (error) {
      console.error("Error adding course:", error);
    }
  };

  const handleSort = (level) => {
    setSortLevel(level);
    const filteredCourses = level ? courses.filter(course => course.level === level) : courses;
    setSortedCourses(filteredCourses);
  };

  const handleDeleteCourse = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/admin/courses/${id}`);
      fetchCourses(); // Refresh the course list
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  const toggleSkillsVisibility = (courseId) => {
    setExpandedCourses(prevState => ({
      ...prevState,
      [courseId]: !prevState[courseId]
    }));
  };

  const renderSkills = (skills) => {
    if (Array.isArray(skills)) {
      return skills.map((skill, index) => (
        <span key={index} className="badge bg-primary me-1">{skill}</span>
      ));
    } else if (typeof skills === 'string') {
      return skills.split(',').map((skill, index) => (
        <span key={index} className="badge bg-primary me-1">{skill.trim()}</span>
      ));
    }
    return null;
  };

  const renderCourses = () => {
    return sortedCourses.map((course) => (
      <Col key={course._id} md={4} className="mb-4">
        <Card className="course-card">
          <Card.Body className="d-flex flex-column">
            <div className="flex-grow-1">
              <Card.Title>{course.course}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">Partner: {course.partner}</Card.Subtitle>
              <Card.Text>
                <strong>Rating:</strong> {course.rating}<br />
                <strong>Level:</strong> {course.level}<br />
                <strong>Duration:</strong> {course.duration}<br />
                <strong>Credit Eligibility:</strong> {course.crediteligibility ? 'Yes' : 'No'}<br />
              </Card.Text>
              <div className="skills-container">
                {renderSkills(course.skills.slice(0, expandedCourses[course._id] ? course.skills.length : 3))}
                {course.skills.length > 3 && (
                  <Button variant="link" size="sm" onClick={() => toggleSkillsVisibility(course._id)}>
                    {expandedCourses[course._id] ? 'See Less' : 'See More'}
                  </Button>
                )}
              </div>
            </div>
            <Button variant="danger" onClick={() => handleDeleteCourse(course._id)}>Delete</Button>
          </Card.Body>
        </Card>
      </Col>
    ));
  };

  return (
    <div className="container mt-4">
      <h2>Course Management</h2>
      <Button variant="primary" onClick={() => setShowModal(true)}>Add New Course</Button>

      <Dropdown className="my-3">
        <Dropdown.Toggle variant="success" id="dropdown-basic">
          Sort by Level
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item onClick={() => handleSort('')}>All Levels</Dropdown.Item>
          <Dropdown.Item onClick={() => handleSort('Beginner')}>Beginner</Dropdown.Item>
          <Dropdown.Item onClick={() => handleSort('Intermediate')}>Intermediate</Dropdown.Item>
          <Dropdown.Item onClick={() => handleSort('Advanced')}>Advanced</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      
      <Row className="course-list">
        {renderCourses()}
      </Row>

      {/* Modal for adding new course */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Course</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formPartner">
              <Form.Label>Partner</Form.Label>
              <Form.Control type="text" name="partner" value={newCourse.partner} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group controlId="formCourse">
              <Form.Label>Course</Form.Label>
              <Form.Control type="text" name="course" value={newCourse.course} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group controlId="formSkills">
              <Form.Label>Skills</Form.Label>
              <Form.Control type="text" name="skills" value={newCourse.skills} onChange={handleInputChange} placeholder="Comma separated values" />
            </Form.Group>
            <Form.Group controlId="formRating">
              <Form.Label>Rating</Form.Label>
              <Form.Control type="number" step="0.1" name="rating" value={newCourse.rating} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group controlId="formReviewCount">
              <Form.Label>Review Count</Form.Label>
              <Form.Control type="number" name="reviewcount" value={newCourse.reviewcount} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group controlId="formLevel">
              <Form.Label>Level</Form.Label>
              <Form.Control type="text" name="level" value={newCourse.level} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group controlId="formCertificateType">
              <Form.Label>Certificate Type</Form.Label>
              <Form.Control type="text" name="certificatetype" value={newCourse.certificatetype} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group controlId="formDuration">
              <Form.Label>Duration</Form.Label>
              <Form.Control type="text" name="duration" value={newCourse.duration} onChange={handleInputChange} />
            </Form.Group>
            <Form.Group controlId="formCreditEligibility">
              <Form.Check type="checkbox" label="Credit Eligibility" name="crediteligibility" checked={newCourse.crediteligibility} onChange={(e) => setNewCourse((prev) => ({ ...prev, crediteligibility: e.target.checked }))} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleAddCourse}>Add Course</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CourseManagement;
