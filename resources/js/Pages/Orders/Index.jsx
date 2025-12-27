import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Orders({ auth, orders: initialOrders }) {
    const [orders, setOrders] = useState(initialOrders || []);
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState(null);

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        My Orders
                    </h2>
                    <Link
                        href="/products"
                        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition"
                    >
                        Continue Shopping
                    </Link>
                </div>
            }
        >
            <Head title="My Orders" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {notification && (
                        <div
                            className={`mb-4 p-4 rounded-lg ${
                                notification.type === 'success'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                            }`}
                        >
                            {notification.message}
                        </div>
                    )}

                    {orders.length === 0 ? (
                        <div className="bg-white rounded-lg shadow-md p-8 text-center">
                            <div className="text-6xl mb-4">📋</div>
                            <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                                No orders yet
                            </h3>
                            <p className="text-gray-600 mb-6">
                                You haven't placed any orders yet. Start shopping to create your first order!
                            </p>
                            <Link
                                href="/products"
                                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition"
                            >
                                Browse Products
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {orders.map((order) => (
                                <div
                                    key={order.id}
                                    className="bg-white rounded-lg shadow-md p-6"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-900">
                                                Order #{order.id}
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                {new Date(order.created_at).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </p>
                                        </div>
                                        <span
                                            className={`px-4 py-2 rounded-lg font-semibold text-sm capitalize ${getStatusColor(
                                                order.status
                                            )}`}
                                        >
                                            {order.status}
                                        </span>
                                    </div>

                                    <div className="border-t pt-4 mb-4">
                                        <h4 className="font-semibold text-gray-900 mb-3">
                                            Items ({order.order_items?.length || 0})
                                        </h4>
                                        <div className="space-y-3">
                                            {order.order_items?.map((item) => (
                                                <div
                                                    key={item.id}
                                                    className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                                                >
                                                    <div className="flex items-center space-x-3 flex-1">
                                                        <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                                                            <span className="text-lg">📦</span>
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-gray-900">
                                                                {item.product?.name}
                                                            </p>
                                                            <p className="text-sm text-gray-600">
                                                                ${parseFloat(item.price).toFixed(2)} each
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-sm text-gray-600 mb-1">
                                                            Qty: {item.quantity}
                                                        </p>
                                                        <p className="font-semibold text-gray-900">
                                                            ${(item.quantity * parseFloat(item.price)).toFixed(2)}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="border-t pt-4 flex justify-end">
                                        <div className="text-right">
                                            <p className="text-gray-600 mb-1">Total Amount</p>
                                            <p className="text-2xl font-bold text-gray-900">
                                                ${parseFloat(order.total_amount).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
