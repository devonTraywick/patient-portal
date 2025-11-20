import React, { useEffect, useState } from 'react';
import Login from './pages/login';
import Register from './pages/register';
import Dashboard from './pages/dashboard';
import Header from './pages/header';
import { api } from './api/client';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [showRegister, setShowRegister] = useState(false);

  const onAuth = (t, u) => {
    setToken(t);
    setUser(u);
    localStorage.setItem('token', t);
    localStorage.setItem('user', JSON.stringify(u));
  };

  const logout = async() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);

    const res = await api('/auth/logout', {method: 'POST', credentials: 'include'})
    alert(res.message)
  };

  //Logout due to inactivity
  useEffect(() => {
    if(!token) return; //Only track inactivity when logged in.

    let timeout;
    const INACTIVITY_LIMIT = 5 * 60 * 1000; // 5 minutes

    const resetTimer = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        alert("You were logged out due to inactivity");
        logout();
      }, INACTIVITY_LIMIT);
    };

    //Track user activity
    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    events.forEach(event => window.addEventListener(event, resetTimer));

    resetTimer(); //start timer on mount

    //Cleanup
    return () => {
      clearTimeout(timeout);
      events.forEach(event => window.addEventListener(event, resetTimer));
    };
  }, [token]);

  if (!token) {
    return (
      <div className='h-full w-full'>
        <Header />
        <div className="container">
          <h1 className='text-3xl text-center font-bold mb-4'>Patient Portal</h1>
          <div className="forms p-5">
            {showRegister ? (
              <Register onBack={() => setShowRegister(false)} />
            ) : (
              <Login onAuth={onAuth} onRegister={() => setShowRegister(true)} />
            )}
          </div>
        </div>
      </div>
    );
  }

  return <Dashboard token={token} user={user} onLogout={logout} />;
}
