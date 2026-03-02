import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function ViewUsers() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      const res = await axios.get('http://localhost:5000/api/superadmin/admins', {
        headers: user ? { Authorization: `Bearer ${user.token}` } : {},
      });
      setAdmins(res.data.admins || []);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load admins');
      toast.error('Error loading admins');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const toggleActive = async (id, active) => {
    if (!window.confirm(`Are you sure you want to ${active ? 'block' : 'unblock'} this admin?`)) {
      return;
    }
    try {
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      const url = `http://localhost:5000/api/superadmin/admins/${id}/${active ? 'block' : 'unblock'}`;
      await axios.put(url, {}, { headers: user ? { Authorization: `Bearer ${user.token}` } : {} });
      toast.success(`Admin ${active ? 'blocked' : 'unblocked'} successfully`);
      fetchAdmins();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Action failed');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Administrators</h2>
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : error ? (
        <p className="text-center text-danger">{error}</p>
      ) : admins.length === 0 ? (
        <p className="text-center">No admins found.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((adm, idx) => (
                <tr key={adm._id}>
                  <td>{idx + 1}</td>
                  <td>{adm.firstName} {adm.lastName}</td>
                  <td>{adm.email}</td>
                  <td>{adm.phone || '-'}</td>
                  <td>
                    <span className={
                      `badge bg-${adm.isActive ? 'success' : 'danger'}`
                    }>
                      {adm.isActive ? 'Active' : 'Blocked'}
                    </span>
                  </td>
                  <td>
                    <button
                      className={`btn btn-sm ${adm.isActive ? 'btn-danger' : 'btn-success'}`}
                      onClick={() => toggleActive(adm._id, adm.isActive)}
                    >
                      {adm.isActive ? 'Block' : 'Unblock'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
