import React, { useState } from 'react';
import { api } from '../api/client';

export default function Login({ onAuth, onRegister, admin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setErr(null);
    try {
      const res = await api('/auth/login', { method: 'POST', body: { email, password, admin }, credentials: 'include' });
      onAuth(res.token, res.user);
    } catch (e) {
      setErr(e.message);
    }
  };

  return (
    <form className="card" onSubmit={submit}>
      <h2 className='text-lg font-semibold mb-2'>Login</h2>
      {err && <div className="error">{err}</div>}
      <input placeholder="email" value={email} onChange={e => setEmail(e.target.value)} />
      <input placeholder="password" value={password} type="password" onChange={e => setPassword(e.target.value)} />
      <div className="flex justify-center mt-4">
        <button className="!bg-blue-900" type="submit">Login</button>
      </div>
      <div className='flex justify-center mt-1'>
        <button
          type="button"
          className="text-center text-sm !text-gray-500 !bg-transparent !underline "
          onClick={onRegister}
        >
          First time visiting? Click here to register.
        </button>
      </div>
    </form>
  );
}
