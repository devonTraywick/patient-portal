import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import AppointmentForm from './appointmentForm';
import Header from './header';
import EditProfile from './editProfile';

export default function Dashboard({ token, user: initialUser, onLogout, admin }) {
  const [appts, setAppts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editProfile, setEditProfile] = useState(false);
  const [user, setUser] = useState(initialUser);

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
      <Header user={user}/>
      <div className="mb-8 pl-4 flex align-middle">
        <div className='text-left text-xl flex-1 align-middle'>
          <h2>Welcome, {user.fullName || user.email}</h2>
        </div>
        <div className='flex-1 align-middle'>
          <button className='float-right mr-5 !bg-blue-900' 
            hidden={editProfile} 
            onClick={() => setEditProfile(true)}>
              Edit Profile
          </button>
        </div>
      </div>

      <section>
        {editProfile ? (
          <EditProfile
            user={user}
            onBack={(updatedUser) => {
              if (updatedUser) setUser(updatedUser);
              setEditProfile(false);
            }}
          />
        ) : (
          <div>
            {admin ? (<div> <h3 className="text-center mb-2 text-xl font-medium underline underline-offset-2">Your Appointments</h3>
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
            </div> </div>) : (
              <h3>Provider Management</h3>
              
            )}
          </div>
        )}
      </section>
    </div>
  );
}
