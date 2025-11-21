import React, { useEffect, useState } from 'react';
import { api } from '../api/client';

export default function AppointmentForm({ token, onCreated }) {
  const [providerName, setProviderName] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [reason, setReason] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  //Debounce for provider search(run 300ms after user stops typing)

  useEffect(() => {
    const delay = setTimeout(async () => {
      if(providerName.trim().length < 1){
        setSuggestions([]);
        return;
      }

      try{
        const res = await api(`/providers?search=${providerName}`, {token});
        setSuggestions(res)
      }catch(err){
        console.error('Provider search error: ', err)
      }
    }, 300);

    return () => clearTimeout(delay);
  }, [providerName, token]);

  const submit = async (e) => {
    e.preventDefault();
    try {
      // dateTime comes from input type datetime-local; convert to ISO
      const iso = new Date(dateTime).toISOString();
      await api('/appointments', { method: 'POST', body: { providerName, dateTime: iso, reason }, token });
      setProviderName(''); setDateTime(''); setReason('');
      onCreated();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <form className="card text-center" onSubmit={submit}>
      <h4>Schedule Appointment</h4>
      <div style={{position: 'relative'}}>
        <input 
          placeholder="Provider name" 
          value={providerName} 
          onChange={e => setProviderName(e.target.value)} 
          autoComplete='off'
        />

        {suggestions.length > 0 && (
          <ul
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              width: '100%',
              background: 'white',
              border: '1px solid #ddd',
              listStyle: 'none',
              margin: 0,
              padding: 0,
              zIndex: 10
            }}
          >
            {suggestions.map((p) => (
              <li
                key={p.id}
                onClick={() => {
                  setProviderName(p.name)
                  setSuggestions([])
                }}
                style={{
                  padding: '8px',
                  cursor: 'pointer'
                }}
              >
                {p.name}
              </li>
            ))}
          </ul>
        )}
      </div>
      
      <input type="datetime-local" value={dateTime} onChange={e => setDateTime(e.target.value)} />
      <textarea placeholder="Reason" value={reason} onChange={e => setReason(e.target.value)} />
      <button className='!bg-blue-900' type="submit">Schedule</button>
    </form>
  );
}
