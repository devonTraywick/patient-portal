import React, {useState} from 'react';
import { api } from '../api/client'

export default function EditProfile({user, onBack}){
    const [form, setForm] = useState({email: user.email, oldPassword: '', newPassword: '', phone: user.patient.phone, address: user.patient.address});
    const [msg, setMsg] = useState(null);

    const submit = async (e) => {
        e.preventDefault();
        setMsg(null);
        try{
            const updated = await api('/auth/update', {method: 'PUT', body: form});
            setMsg('Account updated.');
            onBack(updated.user);
        }catch(e){
            setMsg(e.message)
        }
    };

    return(
        <div className='flex justify-center'>
            <form className='card' onSubmit={submit}>
                <h2 className='text-lg font-semibold mb-2'>Update Profile</h2>
                {msg && <div className="info">{msg}</div>}
                <input placeholder="Email" disabled={true} value={form.email} />
                <input placeholder="Old Password" type="password" value={form.oldPassword} onChange={e => setForm({ ...form, oldPassword: e.target.value })} />
                <input placeholder="New Password" type="password" value={form.newPassword} onChange={e => setForm({ ...form, newPassword: e.target.value })} />
                <input placeholder="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                <input placeholder="Address" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
                <div className="flex justify-center mt-4">
                    <button className="!bg-blue-900" type="submit">Update</button>
                </div>
                <div className="flex justify-center mt-4">
                    <button type="button" className="text-sm !text-gray-500 !bg-transparent underline" onClick={() => onBack(null)}>
                    {"< "}Back to Dashboard
                    </button>
                </div>
            </form>
        </div>
    )
}