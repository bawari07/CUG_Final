import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ForgetPassword.css';

function ResetPasswordPage() {
  const [userId, setUserId] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/reset-password', { email: userId });
      alert(response.data);
    } catch (error) {
      alert('*Error sending password reset email.');
      console.error(error);
    }
  };

  const handleBackToLogin = () => {
    navigate('/', { replace: true });
  };

  return (
    <div className="reset-password-page-container">
      <div className="reset-password-left-panel">
        <div className="reset-password-illustration"></div>
      </div>
      <div className="reset-password-right-panel">
        <div className="reset-password-form-container">
        <img src={`${process.env.PUBLIC_URL}/Assests/logo.webp`} alt="Logo" className="reset_logo" />
          <h2 className="reset_h201">Reset Your Password?</h2>
          <p className="reset_p01">Enter your email or phone number to reset your password</p>
          <form className="reset_form1" onSubmit={handleSubmit}>
            <label className="lebel1">
              <input
                className="reset_input01"
                type="email"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                required
                placeholder="Phone Number / Email Address"
              />
            </label>
            <button type="submit" className='reset-button'>Reset</button>
          </form>
          <button className="back-to-login-button" onClick={handleBackToLogin}>
            Back to Log in
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResetPasswordPage;
