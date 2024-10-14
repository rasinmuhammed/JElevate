import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import logowhite from '../images/logowhite.png'; 
import { useNavigate } from 'react-router-dom';
import '../components/style.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post(`http://localhost:3000/api/auth/login`, {
        email,
        password,
      });

      // Set cookie with token
      console.log(res.data.token);
      Cookies.set('token', res.data.token, {
        secure: true,
        sameSite: 'Strict',
        expires: 1,
      });

      // Navigate based on the role received from the server
      if (res.data.role === 'employee') {
        navigate('/employee-dashboard');
        localStorage.setItem("id", res.data.id);
      } else if (res.data.role === 'admin') {
        navigate('/admin-dashboard');
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError('Invalid email or password. Please try again.');
      } else {
        setError('An error occurred. Please try again later.');
        console.error(err);
      }
    }
  };

  return (
    <div className="login-container">
      <img src={logowhite} alt="J Elevate Logo" className="logo" />
      <div className="login-container-2">
        <p className="tagline">Cultivating Skills, Building Futures.</p>
        <div className="login-form">
          {error && <p className="error">{error}</p>}
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
