import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Spinner, Container, Row, Col } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';
import './Leaderboard.css'; 

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/admin/leaderboard');
        setLeaderboard(res.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
        setLoading(false); 
      }
    };

    fetchLeaderboard();
  }, []);

  // Prepare data for Bar Chart
  const barChartData = {
    labels: leaderboard.map(dept => dept.departmentName),
    datasets: [
      {
        label: 'Total Score',
        data: leaderboard.map(dept => dept.totalScore),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4">Department Leaderboard</h2>
      {loading ? (
        <div className="d-flex justify-content-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <>
          <Row>
            <Col>
              <Table bordered hover responsive className="table-striped">
                <thead className="table-dark">
                  <tr>
                    <th>Department</th>
                    <th>Total Score</th>
                    <th>Top Performers</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map(dept => (
                    <tr key={dept.departmentName}>
                      <td>{dept.departmentName}</td>
                      <td>{dept.totalScore}</td>
                      <td>
                        {dept.topPerformers.map((performer, index) => (
                          <div key={index}>
                            {performer.name} ({performer.role}) - {performer.score} pts
                          </div>
                        ))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Col>
          </Row>

          {/* Bar Chart for Department Scores */}
          <Row className="mt-5">
            <Col>
              <Bar
                data={barChartData}
                options={{
                  scales: {
                    y: {
                      beginAtZero: true,
                    },
                  },
                }}
              />
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
};

export default Leaderboard;
