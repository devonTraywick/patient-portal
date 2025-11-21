import React, { useState } from 'react';
import { api } from '../api/client';

export default function Register({onBack}) {
  const [form, setForm] = useState({ email: '', password: '', fullName: '', dob: '', phone: '', address: '' });
  const [msg, setMsg] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setMsg(null);
    try {
      await api('/auth/register', { method: 'POST', body: form });
      setMsg('Account created — please login.');
      onBack();
    } catch (e) {
      setMsg(e.message);
    }
  };

  return (
    <form className="card" onSubmit={submit}>
      <h2 className='text-lg font-semibold mb-2'>Register</h2>
      {msg && <div className="info">{msg}</div>}
      <input placeholder="Full name" value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} />
      <input placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
      <input placeholder="Password" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
      <input placeholder="DOB (YYYY-MM-DD)" value={form.dob} onChange={e => setForm({ ...form, dob: e.target.value })} />
      <input placeholder="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
      <input placeholder="Address" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
      <div className="flex justify-center mt-4">
        <button className="!bg-blue-900" type="submit">Register</button>
      </div>
      <div className="flex justify-center mt-4">
        <button type="button" className="text-sm !text-gray-500 !bg-transparent underline" onClick={onBack}>
          {"< "}Back to login
        </button>
      </div>
    </form>
  );
}
