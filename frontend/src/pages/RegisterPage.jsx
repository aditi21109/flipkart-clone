import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register as registerApi } from '../services/authService';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const { login }  = useAuth();
  const navigate   = useNavigate();

  const [form, setForm]       = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return; }
    if (form.password.length < 6)       { setError('Password must be at least 6 characters.'); return; }

    setLoading(true);
    try {
      const res = await registerApi({ name: form.name, email: form.email, password: form.password });
      login(res.data.token, res.data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const fields = [
    { label: 'Full Name',         name: 'name',     type: 'text',     placeholder: 'Jason' },
    { label: 'Email',             name: 'email',    type: 'email',    placeholder: 'you@example.com' },
    { label: 'Password',          name: 'password', type: 'password', placeholder: 'Min 6 characters' },
    { label: 'Confirm Password',  name: 'confirm',  type: 'password', placeholder: 'Repeat password' },
  ];

  return (
    <div className="min-h-screen bg-flipbg flex">

      {/* Left promo panel */}
      <div className="hidden lg:flex flex-col justify-center bg-flipblue text-white w-2/5 px-14 pb-16">
        <h1 className="text-3xl font-light leading-snug mb-4">
          Looks like you're<br />
          <span className="font-bold">new here!</span>
        </h1>
        <p className="text-blue-200 text-sm">Sign up to get started with the best deals.</p>
      </div>

      {/* Form panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="bg-white w-full max-w-sm rounded shadow-md p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Create Account</h2>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded mb-4 border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {fields.map(({ label, name, type, placeholder }) => (
              <div key={name} className="flex flex-col gap-1">
                <label className="text-sm text-gray-600 font-medium">{label}</label>
                <input
                  type={type}
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  required
                  placeholder={placeholder}
                  className="border border-gray-300 rounded px-3 py-2.5 text-sm outline-none focus:border-flipblue transition-colors"
                />
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              className="bg-fliporange text-white font-bold py-3 rounded text-sm hover:bg-orange-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed mt-1"
            >
              {loading ? 'Creating account…' : 'Register'}
            </button>
          </form>

          <p className="text-center text-sm text-flipblue font-medium mt-5">
            <Link to="/login" className="hover:underline">Existing user? Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
