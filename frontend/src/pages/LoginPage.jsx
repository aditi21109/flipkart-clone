import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { login as loginApi } from '../services/authService';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login }  = useAuth();
  const navigate   = useNavigate();
  const location   = useLocation();
  const from       = location.state?.from?.pathname || '/';

  const [form, setForm]       = useState({ email: '', password: '' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await loginApi(form);
      login(res.data.token, res.data.user);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-flipbg flex">

      {/* Left panel — blue promo */}
      <div className="hidden lg:flex flex-col justify-center bg-flipblue text-white w-2/5 px-14 pb-16">
        <h1 className="text-3xl font-light leading-snug mb-4">
          Login<br />
          <span className="font-bold">Millions of Products</span><br />
          at your fingertips
        </h1>
        <img
          src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/login_img_c4a81e.png"
          alt="promo"
          className="mt-8 w-48 self-center"
          onError={(e) => { e.target.style.display = 'none'; }}
        />
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="bg-white w-full max-w-sm rounded shadow-md p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Login</h2>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded mb-4 border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-600 font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                autoFocus
                placeholder="Enter email"
                className="border border-gray-300 rounded px-3 py-2.5 text-sm outline-none focus:border-flipblue transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-600 font-medium">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="Enter password"
                className="border border-gray-300 rounded px-3 py-2.5 text-sm outline-none focus:border-flipblue transition-colors"
              />
            </div>

            <p className="text-xs text-flipgray -mt-2">
              By continuing, you agree to Flipkart's Terms of Use and Privacy Policy.
            </p>

            <button
              type="submit"
              disabled={loading}
              className="bg-fliporange text-white font-bold py-3 rounded text-sm hover:bg-orange-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {loading ? 'Logging in…' : 'Login'}
            </button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <hr className="flex-1 border-gray-200" />
            <span className="text-xs text-flipgray">or</span>
            <hr className="flex-1 border-gray-200" />
          </div>

          <p className="text-center text-sm text-flipblue font-medium">
            <Link to="/register" className="hover:underline">New to Flipkart? Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
