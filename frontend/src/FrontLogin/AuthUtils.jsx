// frontend/src/FrontLogin/AuthUtils.js

import { useNavigate } from 'react-router-dom';

// Login function modified to accept either email or username as 'identifier'
export const handleLogin = async (identifier, password, onClose) => {
  try {
    console.log("Logging in with identifier:", identifier); // identifier can be either email or username
    console.log("Logging in with password:", password);

  


    const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ identifier, password }), // Passing either email or username as identifier
    });

    if (response.ok) {
      const { token } = await response.json(); // Assuming your server returns the token in the response

      if (token) {
        localStorage.setItem('token', token); // Store token in localStorage
        onClose(); // Close the modal after successful login
      } else {
        throw new Error("Invalid identifier or password");
      }
    } else {
      throw new Error("Invalid identifier or password");
    }
  } catch (error) {
    console.error("Login failed:", error);
    // Handle login failure, such as displaying error messages
  }
};

// Sign-up function now includes name, email, username, and password
export const handleSignUp = async (name, email, username, password, imageFile, navigate) => {
  try {
    console.log("Signing up with name:", name);
    console.log("Signing up with email:", email);
    console.log("Signing up with username:", username);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('username', username);
    formData.append('password', password);
    if (imageFile) {
      formData.append('image', imageFile);
    }

    const response = await fetch(`${import.meta.env.VITE_API_URL}/users/signup`, {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      console.log("Sign-up successful", data);
      navigate('/'); // Redirect after successful signup
    } else {
      const errorData = await response.json();
      console.error("Sign-up failed:", errorData.errors || errorData);
    }
  } catch (error) {
    console.error("Sign-up error:", error);
  }
};

// isAuthenticated function remains the same
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token;
};
