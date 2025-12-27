import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import axios from 'axios';

export default function Products({ auth, products }) {
    const [productsList, setProductsList] = useState(products);
    const [loading, setLoading] = useState({});
    const [notification, setNotification] = useState(null);

    const addToCart = async (productId) => {
        setLoading(prev => ({ ...prev, [productId]: true }));

        try {
            const response = await axios.post('/cart/add', {
                product_id: productId,
                quantity: 1,
            });

            setNotification({
                type: 'success',
                message: response.data.message,
            });

            setTimeout(() => setNotification(null), 3000);
        } catch (error) {
            setNotification({
                type: 'error',
                message: error.response?.data?.message || 'Failed to add to cart',
            });

            setTimeout(() => setNotification(null), 3000);
        } finally {
            setLoading(prev => ({ ...prev, [productId]: false }));
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Products
                    </h2>
                    <Link
                        href="/cart"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                    >
                        View Cart
                    </Link>
                </div>
            }
        >
            <Head title="Products" />

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

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {productsList.map((product) => (
                            <div
                                key={product.id}
                                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition"
                            >
                                <div className="h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                                    <span className="text-4xl">📦</span>
                                </div>

                                <div className="p-4">
                                    <h3 className="font-semibold text-lg text-gray-900 mb-2">
                                        {product.name}
                                    </h3>

                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                        {product.description}
                                    </p>

                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-2xl font-bold text-gray-900">
                                            ${parseFloat(product.price).toFixed(2)}
                                        </span>

                                        <span
                                            className={`text-sm px-2 py-1 rounded ${
                                                product.stock_quantity === 0
                                                    ? 'bg-red-100 text-red-800'
                                                    : product.stock_quantity <= 5
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : 'bg-green-100 text-green-800'
                                            }`}
                                        >
                                            {product.stock_quantity === 0
                                                ? 'Out of Stock'
                                                : product.stock_quantity <= 5
                                                ? `Only ${product.stock_quantity} left`
                                                : `${product.stock_quantity} in stock`}
                                        </span>
                                    </div>

                                    <button
                                        onClick={() => addToCart(product.id)}
                                        disabled={
                                            product.stock_quantity === 0 ||
                                            loading[product.id]
                                        }
                                        className={`w-full py-2 px-4 rounded-lg font-semibold transition ${
                                            product.stock_quantity === 0
                                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                : 'bg-blue-600 hover:bg-blue-700 text-white'
                                        }`}
                                    >
                                        {loading[product.id]
                                            ? 'Adding...'
                                            : product.stock_quantity === 0
                                            ? 'Out of Stock'
                                            : 'Add to Cart'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
