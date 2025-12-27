
import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import axios from 'axios';

export default function Cart({ auth, cartItems: initialCartItems, total: initialTotal }) {
    const [cartItems, setCartItems] = useState(initialCartItems);
    const [total, setTotal] = useState(initialTotal);
    const [loading, setLoading] = useState({});
    const [notification, setNotification] = useState(null);
    const [showCheckout, setShowCheckout] = useState(false);
    const [isCheckingOut, setIsCheckingOut] = useState(false);

    const updateQuantity = async (cartItemId, newQuantity) => {
        if (newQuantity < 1) return;

        setLoading(prev => ({ ...prev, [cartItemId]: true }));

        try {
            const response = await axios.put(`/cart/${cartItemId}`, {
                quantity: newQuantity,
            });

            const updatedItem = response.data.cartItem;
            setCartItems(prev =>
                prev.map(item =>
                    item.id === cartItemId ? updatedItem : item
                )
            );

            calculateTotal(
                cartItems.map(item =>
                    item.id === cartItemId ? updatedItem : item
                )
            );
        } catch (error) {
            setNotification({
                type: 'error',
                message: error.response?.data?.message || 'Failed to update quantity',
            });

            setTimeout(() => setNotification(null), 3000);
        } finally {
            setLoading(prev => ({ ...prev, [cartItemId]: false }));
        }
    };

    const removeItem = async (cartItemId) => {
        if (!confirm('Are you sure you want to remove this item?')) return;

        setLoading(prev => ({ ...prev, [cartItemId]: true }));

        try {
            await axios.delete(`/cart/${cartItemId}`);

            const updatedItems = cartItems.filter(item => item.id !== cartItemId);
            setCartItems(updatedItems);
            calculateTotal(updatedItems);

            setNotification({
                type: 'success',
                message: 'Item removed from cart',
            });

            setTimeout(() => setNotification(null), 3000);
        } catch (error) {
            setNotification({
                type: 'error',
                message: 'Failed to remove item',
            });

            setTimeout(() => setNotification(null), 3000);
        } finally {
            setLoading(prev => ({ ...prev, [cartItemId]: false }));
        }
    };

    const calculateTotal = (items) => {
        const newTotal = items.reduce(
            (sum, item) => sum + item.quantity * parseFloat(item.product.price),
            0
        );
        setTotal(newTotal);
    };

    const handleCheckout = async () => {
        setIsCheckingOut(true);

        try {
            const response = await axios.post('/orders');

            setNotification({
                type: 'success',
                message: response.data.message,
            });

            setCartItems([]);
            setTotal(0);
            setShowCheckout(false);

            setTimeout(() => setNotification(null), 5000);
        } catch (error) {
            setNotification({
                type: 'error',
                message: error.response?.data?.message || 'Failed to place order',
            });

            setTimeout(() => setNotification(null), 3000);
        } finally {
            setIsCheckingOut(false);
        }
    };

    const clearCart = async () => {
        if (!confirm('Are you sure you want to clear your entire cart?')) return;

        try {
            await axios.delete('/cart');

            setCartItems([]);
            setTotal(0);

            setNotification({
                type: 'success',
                message: 'Cart cleared successfully',
            });

            setTimeout(() => setNotification(null), 3000);
        } catch (error) {
            setNotification({
                type: 'error',
                message: 'Failed to clear cart',
            });

            setTimeout(() => setNotification(null), 3000);
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Shopping Cart
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
            <Head title="Shopping Cart" />

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

                    {cartItems.length === 0 ? (
                        <div className="bg-white rounded-lg shadow-md p-8 text-center">
                            <div className="text-6xl mb-4">🛒</div>
                            <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                                Your cart is empty
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Start shopping to add items to your cart
                            </p>
                            <Link
                                href="/products"
                                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition"
                            >
                                Browse Products
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2 space-y-4">
                                {cartItems.map((item) => (
                                    <div
                                        key={item.id}
                                        className="bg-white rounded-lg shadow-md p-6"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-4 flex-1">
                                                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                                                    <span className="text-2xl">📦</span>
                                                </div>

                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-lg text-gray-900">
                                                        {item.product.name}
                                                    </h3>
                                                    <p className="text-gray-600">
                                                        ${parseFloat(item.product.price).toFixed(2)} each
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        Available: {item.product.stock_quantity}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center space-x-4">
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        onClick={() =>
                                                            updateQuantity(item.id, item.quantity - 1)
                                                        }
                                                        disabled={
                                                            item.quantity <= 1 || loading[item.id]
                                                        }
                                                        className="w-8 h-8 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        −
                                                    </button>

                                                    <span className="w-12 text-center font-semibold">
                                                        {item.quantity}
                                                    </span>

                                                    <button
                                                        onClick={() =>
                                                            updateQuantity(item.id, item.quantity + 1)
                                                        }
                                                        disabled={
                                                            item.quantity >= item.product.stock_quantity ||
                                                            loading[item.id]
                                                        }
                                                        className="w-8 h-8 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        +
                                                    </button>
                                                </div>

                                                <div className="w-24 text-right font-bold text-lg">
                                                    ${(item.quantity * parseFloat(item.product.price)).toFixed(2)}
                                                </div>

                                                <button
                                                    onClick={() => removeItem(item.id)}
                                                    disabled={loading[item.id]}
                                                    className="text-red-600 hover:text-red-800 disabled:opacity-50"
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="lg:col-span-1">
                                <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
                                    <h3 className="text-xl font-semibold mb-4">Order Summary</h3>

                                    <div className="space-y-3 mb-6">
                                        <div className="flex justify-between text-gray-600">
                                            <span>Subtotal</span>
                                            <span>${total.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-gray-600">
                                            <span>Shipping</span>
                                            <span>Free</span>
                                        </div>
                                        <div className="border-t pt-3 flex justify-between text-xl font-bold">
                                            <span>Total</span>
                                            <span>${total.toFixed(2)}</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => setShowCheckout(true)}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition mb-3"
                                    >
                                        Proceed to Checkout
                                    </button>
                                    <button
                                        onClick={clearCart}
                                        className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg font-semibold transition"
                                    >
                                        Clear Cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {showCheckout && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
                                <h3 className="text-2xl font-bold mb-4">Confirm Order</h3>
                                <p className="text-gray-600 mb-6">
                                    Are you sure you want to place this order for ${total.toFixed(2)}?
                                </p>
                                <div className="flex space-x-4">
                                    <button
                                        onClick={handleCheckout}
                                        disabled={isCheckingOut}
                                        className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold disabled:opacity-50"
                                    >
                                        {isCheckingOut ? 'Processing...' : 'Confirm Order'}
                                    </button>
                                    <button
                                        onClick={() => setShowCheckout(false)}
                                        disabled={isCheckingOut}
                                        className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-lg font-semibold"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
