import React from 'react';
import './PasswordStrengthMeter.css';

const PasswordStrengthMeter = ({ password }) => {
  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/\d/.test(password)) strength += 1;
    if (/[@$!%*?&]/.test(password)) strength += 1;
    return strength;
  };

  const strength = calculatePasswordStrength(password);
  const strengthText = ['Weak', 'Fair', 'Good', 'Strong'][strength - 1] || '';
  const strengthClass = ['weak', 'fair', 'good', 'strong'][strength - 1] || '';

  return (
    <div className={`password-strength-meter ${strengthClass}`}>
      <div className="strength-bar" style={{ width: `${(strength / 4) * 100}%` }}></div>
      <span className="strength-text">{strengthText}</span>
    </div>
  );
};

export default PasswordStrengthMeter;
