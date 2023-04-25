const calculatePasswordStrength = (password) => {
  let strength = 0;
  if (password.length >= 4) {
    strength += 20;
  }
  if (password.length >= 6) {
    strength += 20;
  }
  if (/[A-Z]/.test(password)) {
    strength += 20;
  }
  if (/[0-9]/.test(password)) {
    strength += 20;
  }
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    strength += 20;
  }
  return strength;
};

export default calculatePasswordStrength;
