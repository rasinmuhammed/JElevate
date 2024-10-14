import React, { useState, useEffect } from 'react'; 
import { Container, Navbar, Nav, Button, Card, Image } from 'react-bootstrap';
import axios from 'axios';
import Cookies from 'js-cookie';
import logowhite from '../../images/logowhite.png';
import AddCoursePage from './AddCoursePage';
import LearningBucket from './LearningBucket';
import SkillsDisplay from './SkillsDisplay';
import CertificationsPage from './CertificationsPage';
import ChangePassword from '../ChangePassword'; 
import GamificationProgress from '../AdminComponents/GamificationProgress';
import { Chart, CategoryScale, LinearScale, LineElement, PointElement, LineController, Tooltip, Legend } from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';

// Register Chart.js components
Chart.register(CategoryScale, LinearScale, LineElement, PointElement, LineController, Tooltip, Legend);

const EmployeeDashboard = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [user, setUser] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [courseCompletionData, setCourseCompletionData] = useState({});
  const [skillData, setSkillData] = useState({});
  const [pointsData, setPointsData] = useState({});
  const [courseTypeData, setCourseTypeData] = useState({});
  const [completionRate, setCompletionRate] = useState(0);

  useEffect(() => {
    fetchAvailableCourses();
    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (user && user.employeeID) {
      fetchRecommendations();
      fetchStatistics();
    }
  }, [user]);

  const fetchAvailableCourses = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/admin/courses');
      setAvailableCourses(response.data);
    } catch (error) {
      console.error('Error fetching available courses:', error);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/user/profile', {
        headers: { Authorization: `Bearer ${Cookies.get('token')}` },
      });
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const fetchRecommendations = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/user/recommendations/${user.employeeID}`, {
        headers: { Authorization: `Bearer ${Cookies.get('token')}` },
      });
      setRecommendations(response.data);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/user/statistics/${user.employeeID}`, {
        headers: { Authorization: `Bearer ${Cookies.get('token')}` },
      });
      setCourseCompletionData(response.data.courseCompletion);
      setSkillData(response.data.skillDistribution);
      setPointsData(response.data.pointsOverTime);
      setCourseTypeData(response.data.courseTypeDistribution);
      setCompletionRate(response.data.completionRate);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  const handleLogout = () => {
    Cookies.remove('token');
    window.location.href = '/login';
  };

  const toggleSidebar = () => setSidebarExpanded(!sidebarExpanded);

  const addToLearningBucket = async (courseId) => {
    try {
      await axios.post(
        'http://localhost:3000/api/user/add-course',
        { courseId },
        { headers: { Authorization: `Bearer ${Cookies.get('token')}` } }
      );
      alert('Course added to your learning bucket successfully!');
    } catch (error) {
      console.error('Error adding course to learning bucket:', error);
      alert('Failed to add course. Please try again.');
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div
        style={{
          width: sidebarExpanded ? '250px' : '60px',
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          transition: 'width 0.3s',
          background: 'linear-gradient(180deg, #350ca3, #6d259f, #f05e95)',
          padding: sidebarExpanded ? '20px' : '10px',
          overflow: 'hidden',
          height: '100vh',
        }}
      >
        <Button
          variant="outline-light"
          onClick={toggleSidebar}
          style={{ marginBottom: '20px', width: '100%' }}
        >
          {sidebarExpanded ? 'Menu' : <i className="fa-solid fa-bars"></i>}
        </Button>
        <Nav className="flex-column">
          <Nav.Link onClick={() => handlePageChange('dashboard')} style={{ color: 'white' }}>
            {sidebarExpanded ? 'Dashboard' : <i className="fa-solid fa-chart-line"></i>}
          </Nav.Link>
          <Nav.Link onClick={() => handlePageChange('addCourse')} style={{ color: 'white' }}>
            {sidebarExpanded ? 'Add to Learning' : <i className="fa-solid fa-plus-circle"></i>}
          </Nav.Link>
          <Nav.Link onClick={() => handlePageChange('learningBucket')} style={{ color: 'white' }}>
            {sidebarExpanded ? 'Learning Bucket' : <i className="fa-solid fa-book"></i>}
          </Nav.Link>
          <Nav.Link onClick={() => handlePageChange('skills')} style={{ color: 'white' }}>
            {sidebarExpanded ? 'Skills' : <i className="fa-solid fa-star"></i>}
          </Nav.Link>
          <Nav.Link onClick={() => handlePageChange('certifications')} style={{ color: 'white' }}>
            {sidebarExpanded ? 'Certifications' : <i className="fa-solid fa-certificate"></i>}
          </Nav.Link>
          <Nav.Link onClick={() => handlePageChange('changePassword')} style={{ color: 'white' }}>
            {sidebarExpanded ? 'Change Password' : <i className="fa-solid fa-lock"></i>}
          </Nav.Link>
          {sidebarExpanded && (
            <div style={{ marginTop: '30px', color: 'white' }}>
              <h6>Gamification</h6>
              <GamificationProgress points={user ? user.points : 0} />
            </div>
          )}
        </Nav>
      </div>

      <div style={{ marginLeft: sidebarExpanded ? '250px' : '60px', flex: 1, overflowY: 'auto' }}>
        <Navbar expand="lg" style={{ background: '#25195f' }}>
          <Container>
            <Navbar.Brand href="#" style={{ color: 'white' }}>
              <img src={logowhite} alt="J Elevate Logo" className="dashboard-logo" />
            </Navbar.Brand>
            <Nav className="ml-auto">
              <Button variant="outline-light" onClick={handleLogout}>
                Logout
              </Button>
            </Nav>
          </Container>
        </Navbar>

        <Container className="dashboard-container mt-4" style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '8px', padding: '20px' }}>
          {user && (
            <Card className="mb-4" style={{ display: 'flex', flexDirection: 'row', padding: '15px', border: '1px solid #ddd', borderRadius: '10px', alignItems: 'center' }}>
              <Image
                src={`https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}`}
                roundedCircle
                style={{ width: '60px', height: '60px', marginRight: '15px' }}
                alt="User Thumbnail"
              />
              <div>
                <Card.Title style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
                  {user.firstName} {user.lastName}
                </Card.Title>
                <Card.Text style={{ marginBottom: '5px' }}>
                  <strong>Employee ID:</strong> {user.employeeID} <br />
                  <strong>Department:</strong> {user.department} <br />
                  <strong>Designation:</strong> {user.designation} <br />
                  <strong>Points:</strong> {user.points} <br />
                  <strong>Level:</strong> {getLevel(user.points)}
                </Card.Text>
              </div>
            </Card>
          )}

          {currentPage === 'dashboard' && (
            <div>
              <h2>Dashboard</h2>

              
             
              {/* Statistics Section */}
            
              <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
    {/* Container for Course Completion and Points Over Time */}
    <div style={{ width: '48%', marginBottom: '20px' }}>
        <h5>Course Completion Over Time</h5>
        <Line data={{
            labels: courseCompletionData.labels || [],
            datasets: [{
                label: 'Courses Completed',
                data: courseCompletionData.data || [],
                borderColor: 'rgba(75,192,192,1)',
                backgroundColor: 'rgba(75,192,192,0.2)',
                fill: true,
            }]
        }} />
    </div>

    <div style={{ width: '48%', marginBottom: '20px' }}>
        <h5>Points Over Time</h5>
        <Line data={{
            labels: pointsData.labels || [],
            datasets: [{
                label: 'Points Earned',
                data: pointsData.data || [],
                borderColor: 'rgba(153,102,255,1)',
                backgroundColor: 'rgba(153,102,255,0.2)',
                fill: true,
            }]
        }} />
    </div>

    {/* Skill Distribution Pie Chart */}
    <div style={{ width: '80%', height: '400px',  marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
  <h2>Skill Distribution</h2>
  <Pie data={{
      labels: skillData.labels || [],
      datasets: [{
          data: skillData.data || [],
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
      }]
  }} />
</div>

</div>
            </div>
          )}

          {currentPage === 'addCourse' && <AddCoursePage availableCourses={availableCourses} addToLearningBucket={addToLearningBucket} />}
          {currentPage === 'learningBucket' && <LearningBucket />}
          {currentPage === 'skills' && <SkillsDisplay />}
          {currentPage === 'certifications' && <CertificationsPage />}
          {currentPage === 'changePassword' && <ChangePassword />}
        </Container>
      </div>
    </div>
  );
};

const getLevel = (points) => {
  if (points < 250) return 'Beginner';
  if (points < 500) return 'Intermediate';
  if (points < 750) return 'Advanced';
  return 'Expert';
};

export default EmployeeDashboard;
