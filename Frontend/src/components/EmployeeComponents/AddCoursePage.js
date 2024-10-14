import React, { useState } from 'react';
import { Row, Col, Card, Button, Form, Badge } from 'react-bootstrap';
import '../style.css'; 

const AddCoursePage = ({ availableCourses, addToLearningBucket }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedCertificateType, setSelectedCertificateType] = useState('');
  const [expandedCourses, setExpandedCourses] = useState({}); 

  // Filter courses based on search term, level, and certificate type
  const filteredCourses = availableCourses.filter(course => {
    const matchesSearchTerm = course.course.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = selectedLevel ? course.level === selectedLevel : true;
    const matchesCertificateType = selectedCertificateType ? course.certificateType === selectedCertificateType : true;
    return matchesSearchTerm && matchesLevel && matchesCertificateType;
  });

  // Handle expand/collapse for skills
  const toggleSkillsVisibility = (courseId) => {
    setExpandedCourses(prevState => ({
      ...prevState,
      [courseId]: !prevState[courseId]
    }));
  };

  // Update search term
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Update selected level
  const handleLevelChange = (e) => {
    setSelectedLevel(e.target.value);
  };

  // Update selected certificate type
  const handleCertificateTypeChange = (e) => {
    setSelectedCertificateType(e.target.value);
  };

  return (
    <div className="add-course-page">
      <h4>Select a Course to Add</h4>

      {/* Filter Controls */}
      <Form className="filter-controls">
        <Form.Group controlId="search">
          <Form.Control
            type="text"
            placeholder="Search by course name"
            value={searchTerm}
            onChange={handleSearchChange}
            className="mb-3"
          />
        </Form.Group>
        
        <Form.Group controlId="level" className="mb-3">
          <Form.Control as="select" value={selectedLevel} onChange={handleLevelChange}>
            <option value="">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="certificateType" className="mb-3">
          <Form.Control as="select" value={selectedCertificateType} onChange={handleCertificateTypeChange}>
            <option value="">All Certificate Types</option>
            <option value="Professional Certificate">Professional Certificate</option>
            <option value="Course">Course</option>
            <option value="Specialization">Specialization</option>
            <option value="Guided Project">Guided Project</option>
          </Form.Control>
        </Form.Group>
      </Form>

      {/* Horizontal Scrollable Row */}
      <div className="course-list">
        <Row className="course-row flex-nowrap">
          {filteredCourses.map((course) => (
            <Col key={course._id} className="course-col">
              <Card className="course-card">
                <Card.Body className="d-flex flex-column">
                  <div className="flex-grow-1">
                    <Card.Title className="course-title">{course.course}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">Partner: {course.partner}</Card.Subtitle>
                    <Card.Text className="course-details">
                      <strong>Rating:</strong> {course.rating}<br />
                      <strong>Level:</strong> {course.level}<br />
                      <strong>Duration:</strong> {course.duration}<br />
                      <strong>Certificate Type:</strong> {course.certificateType}<br />
                    </Card.Text>
                    
                    {/* Display Skills in Badges */}
                    <div className="skills-container">
                      {course.skills.slice(0, expandedCourses[course._id] ? course.skills.length : 3).map(skill => (
                        <Badge pill variant="secondary" key={skill} className="skill-badge">
                          {skill}
                        </Badge>
                      ))}
                      {course.skills.length > 3 && (
                        <Button variant="link" size="sm" className="see-more-btn" onClick={() => toggleSkillsVisibility(course._id)}>
                          {expandedCourses[course._id] ? 'See Less' : 'See More'}
                        </Button>
                      )}
                    </div>
                  </div>
                  <Button variant="primary" className="add-button" onClick={() => addToLearningBucket(course)}>
                    Add to Learning
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default AddCoursePage;
