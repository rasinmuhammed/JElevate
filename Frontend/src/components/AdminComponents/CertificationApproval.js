import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const CertificationApproval = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/admin/pending-requests', {
          headers: { Authorization: `Bearer ${Cookies.get('token')}` },
        });
        setRequests(res.data);
      } catch (error) {
        console.error('Error fetching requests:', error);
      }
    };

    fetchRequests();
  }, []);

  const handleApproval = async (requestId, approve) => {
    try {
      await axios.post(
        'http://localhost:3000/api/admin/approve-certification',
        { requestId, approve },
        { headers: { Authorization: `Bearer ${Cookies.get('token')}` } }
      );
      setRequests(prevRequests => prevRequests.filter(req => req._id !== requestId));
    } catch (error) {
      console.error('Error approving/rejecting request:', error);
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-4">Pending Certification Approvals</h3>
      {requests.length > 0 ? (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Certification</th>
              <th>Score</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map(req => (
              <tr key={req._id}>
                <td>{req.employee.name}</td>
                <td>{req.certificationName}</td>
                <td>{req.score}</td>
                <td>
                  <button className="btn btn-success me-2" onClick={() => handleApproval(req._id, true)}>Approve</button>
                  <button className="btn btn-danger" onClick={() => handleApproval(req._id, false)}>Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="text-center mt-5">
          <i className="fas fa-comments fa-3x mb-3" style={{ color: '#6c757d' }}></i>
          <p className="lead">No pending requests at the moment.</p>
          <p className="text-muted">"Great things in business are never done by one person; they’re done by a team of people."</p>
          <p className="text-muted">"Success usually comes to those who are too busy to be looking for it."</p>
          <p className="text-muted">"Opportunities don't happen. You create them."</p>
        </div>
      )}
    </div>
  );
};

export default CertificationApproval;
