import React, { useEffect, useState, useRef } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

// Register all components of Chart.js
Chart.register(...registerables);

const DashboardStatistics = () => {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalCourses: 0,
    averagePoints: 0,
    topEmployees: [],
    employeePointsDistribution: [],
    departmentWisePerformance: [],
  });

  const barChartRef = useRef(null);

  // Fetch statistics from the API
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/statistics');
        setStats(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching statistics:', error);
      }
    };

    fetchStats();
  }, []);

  // Prepare data for employee points distribution chart
  const employeePointsData = {
    labels: stats.employeePointsDistribution.map(item => item.employeeName),
    datasets: [
      {
        label: 'Points Distribution',
        data: stats.employeePointsDistribution.map(item => item.points),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  // Prepare data for department-wise performance chart
  const departmentPerformanceData = {
    labels: stats.departmentWisePerformance.map(item => item.department),
    datasets: [
      {
        label: 'Average Points',
        data: stats.departmentWisePerformance.map(item => item.averagePoints),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
      },
    ],
  };

  // Cleanup the chart instance on unmount
  useEffect(() => {
    return () => {
      if (barChartRef.current) {
        barChartRef.current.destroy();
      }
    };
  }, []);

  return (
    <>
      <Row>
        <Col md={3}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Total Employees</Card.Title>
              <Card.Text>{stats.totalEmployees}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Total Courses</Card.Title>
              <Card.Text>{stats.totalCourses}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Average Points</Card.Title>
              <Card.Text>{stats.averagePoints}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Top Employees</Card.Title>
              <ul>
                {stats.topEmployees.map((emp, index) => (
                  <li key={index}>
                    {emp.name} - {emp.role} ({emp.points} points)
                  </li>
                ))}
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Employee Points Distribution</Card.Title>
              <Bar ref={barChartRef} data={employeePointsData} options={{ responsive: true }} />
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Department Wise Performance</Card.Title>
              <Bar data={departmentPerformanceData} options={{ responsive: true }} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default DashboardStatistics;
