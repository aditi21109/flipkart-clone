import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/Loader/Loader';
import { getOrders } from '../services/orderService';

const STATUS_STYLE = {
  pending:   { bg: 'bg-yellow-100',  text: 'text-yellow-700',  label: 'Order Placed' },
  confirmed: { bg: 'bg-blue-100',    text: 'text-blue-700',    label: 'Confirmed'    },
  shipped:   { bg: 'bg-orange-100',  text: 'text-orange-700',  label: 'Shipped'      },
  delivered: { bg: 'bg-green-100',   text: 'text-green-700',   label: 'Delivered'    },
  cancelled: { bg: 'bg-red-100',     text: 'text-red-600',     label: 'Cancelled'    },
};

export default function OrdersPage() {
  const navigate = useNavigate();
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    getOrders()
      .then((res) => setOrders(res.data.orders))
      .catch(() => setError('Failed to load orders.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="min-h-screen bg-flipbg"><Loader /></div>;

  return (
    <div className="min-h-screen bg-flipbg py-6">
      <div className="max-w-3xl mx-auto px-4">

        <h1 className="text-xl font-semibold text-gray-800 mb-4">My Orders</h1>

        {/* Error */}
        {error && (
          <div className="bg-white rounded shadow-sm p-8 text-center text-red-500">
            {error}
          </div>
        )}

        {/* Empty state */}
        {!error && orders.length === 0 && (
          <div className="bg-white rounded shadow-sm flex flex-col items-center justify-center py-20 gap-4">
            <div className="text-6xl">📦</div>
            <h2 className="text-lg font-semibold text-gray-700">No orders yet!</h2>
            <p className="text-flipgray text-sm">You haven't placed any orders yet.</p>
            <button
              className="mt-2 bg-flipblue text-white font-semibold px-8 py-2.5 rounded hover:bg-blue-700 transition-colors"
              onClick={() => navigate('/')}
            >
              Start Shopping
            </button>
          </div>
        )}

        {/* Order list */}
        {!error && orders.length > 0 && (
          <div className="flex flex-col gap-3">
            {orders.map((order) => {
              const s = STATUS_STYLE[order.status] || STATUS_STYLE.pending;
              return (
                <div
                  key={order.id}
                  className="bg-white rounded shadow-sm border border-gray-100 p-5 cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => navigate(`/order/${order.id}`)}
                >
                  <div className="flex items-center justify-between flex-wrap gap-3">

                    {/* Left — order meta */}
                    <div className="flex flex-col gap-1">
                      <p className="text-xs text-flipgray uppercase tracking-wide font-medium">
                        Order ID
                      </p>
                      <p className="text-sm font-semibold text-gray-800">#{order.id}</p>
                    </div>

                    <div className="flex flex-col gap-1">
                      <p className="text-xs text-flipgray uppercase tracking-wide font-medium">
                        Date
                      </p>
                      <p className="text-sm text-gray-700">
                        {new Date(order.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'short', year: 'numeric',
                        })}
                      </p>
                    </div>

                    <div className="flex flex-col gap-1">
                      <p className="text-xs text-flipgray uppercase tracking-wide font-medium">
                        Total
                      </p>
                      <p className="text-sm font-semibold text-gray-800">
                        ₹{parseFloat(order.total_amount).toLocaleString('en-IN')}
                      </p>
                    </div>

                    <div className="flex flex-col gap-1">
                      <p className="text-xs text-flipgray uppercase tracking-wide font-medium">
                        Deliver to
                      </p>
                      <p className="text-sm text-gray-700">
                        {order.shipping_city} – {order.shipping_pincode}
                      </p>
                    </div>

                    {/* Status badge */}
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${s.bg} ${s.text}`}>
                      {s.label}
                    </span>

                    <span className="text-flipblue text-sm font-medium ml-auto">
                      View details →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
