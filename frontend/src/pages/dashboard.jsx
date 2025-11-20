import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import AppointmentForm from './appointmentForm';
import Header from './header';

export default function Dashboard({ token, user, onLogout }) {
  const [appts, setAppts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAppts = async () => {
    try {
      const res = await api('/appointments', { token });
      setAppts(res);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => { fetchAppts(); }, []);

  const deleteAppt = async (id) => {
    // 1) confirmation
    const ok = window.confirm('Delete this appointment? This cannot be undone.');
    if (!ok) return;

    try {
      // 2) optimistic UI: remove locally first (optional)
      const prev = appts;
      setAppts(appts.filter(a => a.id !== id));

      await api(`/appointments/${id}`, {method: 'DELETE', token});
      fetchAppts();
    } catch (error) {
       // 5) rollback on error
      alert('Failed to delete appointment: ' + (error.message || error));
      // If optimistic update used, restore previous state:
      setAppts(prev => prev); // or setAppts(prev)
      // Or simply refetch:
      fetchAppts();
    }
  }

  return (
    <div className="dashboard">
      <Header />
      <div className="text-left mb-8 text-xl pl-4">
        <h2>Welcome, {user.fullName || user.email}</h2>
        {/* <button onClick={onLogout}>Logout</button> */}
      </div>

      <section>
        <h3 className="text-center mb-2 text-xl font-medium underline underline-offset-2">Your Appointments</h3>
        <div className="w-full flex flex-col items-center">
          {loading ? <div>Loading...</div> : (
            appts.length ? 
              <div className='mb-4'>
                <table className="w-full border-separate border-spacing-5 text-center">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Provider</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appts.map(a => (
                      <tr key={a.id}>
                        <td>{new Date(a.appointmentDate).toLocaleString().split(',', 1)}</td>
                        <td>{a.providerName}</td>
                        <td>{a.status}</td>
                        <td>
                          <div className='flex justify-center'>
                            <div className='text-center'>
                              <button className='!bg-transparent cursor-pointer' onClick={() => deleteAppt(a.id)}>
                                <i className='bx bx-trash bx-sm text-red-500'></i>
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div> : <div className='mb-4'>No appointments</div>
          )}
          <AppointmentForm token={token} onCreated={() => fetchAppts()} />
          <div className='mt-8'>
            <button className='!bg-red-500' onClick={onLogout}>Logout</button>
          </div>
        </div>
      </section>
    </div>
  );
}
