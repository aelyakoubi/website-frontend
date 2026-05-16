// src/FrontLogin/AuthUtils.js

export const handleLogin = async (identifier, password, onClose, navigate) => {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier, password }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || 'Ongeldige gebruikersnaam of wachtwoord.'
    );
  }

  const { token, user } = await response.json();

  if (!token) {
    throw new Error('Geen token ontvangen van de server.');
  }

  localStorage.setItem('token', token);
  if (user) localStorage.setItem('user', JSON.stringify(user));

  onClose();
  navigate('/');
};

export const handleSignUp = async (
  name,
  email,
  username,
  password,
  imageFile,
  navigate
) => {
  const formData = new FormData();
  formData.append('name', name);
  formData.append('email', email);
  formData.append('username', username);
  formData.append('password', password);
  if (imageFile) formData.append('image', imageFile);

  const response = await fetch(`${import.meta.env.VITE_API_URL}/users/signup`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || 'Registratie mislukt. Probeer het opnieuw.'
    );
  }

  const data = await response.json();

  if (data.token) {
    localStorage.setItem('token', data.token);
  }
  if (data.user) {
    localStorage.setItem('user', JSON.stringify(data.user));
  }

  navigate('/');
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};
