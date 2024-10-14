import React, { useState } from 'react';
import { Container, Navbar, Nav, Button, Modal, Spinner } from 'react-bootstrap';
import CertificationApproval from './CertificationApproval';
import Leaderboard from './Leaderboard';
import Cookies from 'js-cookie';
import BulkUpload from './BulkUpload';
import EmployeeProgress from './EmployeeProgress';
import ManageDepartments from './ManageDepartments';
import AddEmployee from './AddEmployee';
import CourseManagement from './CourseManagement';
import ManageSkills from './ManageSkills';
import logowhite from '../../images/logowhite.png';
import DashboardStatistics from './DashboardStatistics';

const AdminDashboard = () => {
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [activeComponent, setActiveComponent] = useState('dashboard');
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    Cookies.remove('token');
    window.location.href = '/login';
  };

  const toggleSidebar = () => setSidebarExpanded(!sidebarExpanded);

  const handleBulkUploadModalOpen = () => {
    setShowBulkUploadModal(true);
  };

  const handleBulkUploadModalClose = () => {
    setShowBulkUploadModal(false);
    setLoading(false); 
  };

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: 'white' }}>
      {/* Sidebar */}
      <div style={{
        width: sidebarExpanded ? '250px' : '60px',
        transition: 'width 0.3s',
        background: 'linear-gradient(180deg, #350ca3, #6d259f, #f05e95)',
        padding: sidebarExpanded ? '20px' : '10px',
        overflow: 'hidden',
        position: 'fixed', 
        height: '100vh', 
        zIndex: 1, 
      }}>
        <Button
          variant="outline-light"
          onClick={toggleSidebar}
          style={{ marginBottom: '20px', width: '100%' }}
        >
          {sidebarExpanded ? 'Menu' : <i className="fa-solid fa-bars"></i>}
        </Button>
        <Nav className="flex-column">
          <Nav.Link onClick={handleBulkUploadModalOpen} style={{ color: 'white' }}>
            {sidebarExpanded ? 'Bulk Upload Employees' : <i className="fa-solid fa-upload"></i>}
          </Nav.Link>
          <Nav.Link onClick={() => setActiveComponent('certification')} style={{ color: 'white' }}>
            {sidebarExpanded ? 'Certification Approval' : <i className="fa-solid fa-certificate"></i>}
          </Nav.Link>
          <Nav.Link onClick={() => setActiveComponent('add-employee')} style={{ color: 'white' }}>
            {sidebarExpanded ? 'Add Employee' : <i className="fa-solid fa-user-plus"></i>}
          </Nav.Link>
          <Nav.Link onClick={() => setActiveComponent('employee-progress')} style={{ color: 'white' }}>
            {sidebarExpanded ? 'Employee Progress' : <i className="fa-solid fa-users"></i>}
          </Nav.Link>
          <Nav.Link onClick={() => setActiveComponent('manage-departments')} style={{ color: 'white' }}>
            {sidebarExpanded ? 'Manage Departments' : <i className="fa-solid fa-sitemap"></i>}
          </Nav.Link>
          <Nav.Link onClick={() => setActiveComponent('course-management')} style={{ color: 'white' }}>
            {sidebarExpanded ? 'Course Management' : <i className="fa-solid fa-book-open"></i>}
          </Nav.Link>
          <Nav.Link onClick={() => setActiveComponent('manage-skills')} style={{ color: 'white' }}>
            {sidebarExpanded ? 'Manage Skills' : <i className="fa-solid fa-cogs"></i>}
          </Nav.Link>
          <Nav.Link onClick={() => setActiveComponent('leaderboard')} style={{ color: 'white' }}>
            {sidebarExpanded ? 'Leaderboard' : <i className="fa-solid fa-trophy"></i>}
          </Nav.Link>
        </Nav>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, marginLeft: sidebarExpanded ? '250px' : '60px', overflowY: 'auto', height: '100vh' }}>
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
          {/* Render Active Component */}
          {activeComponent === 'dashboard' && <DashboardStatistics />} {/* Dashboard component set as default */}
          {activeComponent === 'add-employee' && <AddEmployee />}
          {activeComponent === 'employee-progress' && <EmployeeProgress />}
          {activeComponent === 'manage-departments' && <ManageDepartments />}
          {activeComponent === 'manage-skills' && <ManageSkills />}
          {activeComponent === 'certification' && <CertificationApproval />}
          {activeComponent === 'leaderboard' && <Leaderboard />}
          {activeComponent === 'course-management' && <CourseManagement />}
        </Container>
      </div>

      {/* Bulk Upload Modal */}
      <Modal show={showBulkUploadModal} onHide={handleBulkUploadModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Bulk Upload Employees</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loading ? <Spinner animation="border" /> : <BulkUpload setLoading={setLoading} />}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleBulkUploadModalClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
