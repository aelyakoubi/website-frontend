// frontend/src/FrontLogin/AuthUtils.js

export const handleLogin = async (identifier, password, onClose, navigate) => {
  try {
    console.log("Logging in with identifier:", identifier);
    const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ identifier, password }),
    });

    if (response.ok) {
      const { token } = await response.json();
      if (token) {
        localStorage.setItem('token', token);
        onClose(); // Close the modal on successful login
        navigate('/'); // Navigate to the homepage or another desired page
      } else {
        throw new Error("Invalid identifier or password");
      }
    } else {
      const errorData = await response.json();
      throw new Error(errorData.message || "Invalid identifier or password");
    }
  } catch (error) {
    console.error("Login failed:", error.message);
    alert(error.message); // Replace with better UI feedback mechanism in the future
  }
};

// handleSignUp function
export const handleSignUp = async (name, email, username, password, imageFile, navigate) => {
  try {
    // Create a FormData object to send both file and text data
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('username', username);
    formData.append('password', password);  // Ensure password is appended
    if (imageFile) {
      formData.append('image', imageFile);  // Append the image file if present
    }

    const response = await fetch(`${import.meta.env.VITE_API_URL}/users/signup`, {
      method: "POST",
      body: formData,  // Send formData, not JSON
    });

    if (response.ok) {
      const data = await response.json();
      console.log("Sign-up successful", data);
      navigate('/'); // Redirect after successful signup
    } else {
      const errorData = await response.json();
      console.error("Sign-up failed:", errorData);
      alert(errorData.message || "Sign-up failed. Please try again.");  // Display error message
    }
  } catch (error) {
    console.error("Sign-up error:", error);
    alert("An error occurred during sign-up. Please try again.");
  }
};

// isAuthenticated function remains the same
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token;
};
