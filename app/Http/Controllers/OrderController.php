<?php

namespace App\Http\Controllers;

use App\Services\OrderService;
use Inertia\Inertia;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    protected $orderService;

    public function __construct(OrderService $orderService)
    {
        $this->orderService = $orderService;
    }

    public function store(Request $request)
    {
        $user = auth()->user();

        try {
            $order = $this->orderService->placeOrder($user);

            return response()->json([
                'message' => 'Order placed successfully.',
                'order' => $order,
            ]);
        } catch (\Exception $e) {
            $status = $e->getMessage() === 'Your cart is empty.' ? 400 : 500;

            return response()->json([
                'message' => $e->getMessage() ?: 'Failed to place order. Please try again.',
            ], $status);
        }
    }

    public function index()
    {
        $orders = auth()->user()
            ->orders()
            ->with('orderItems.product')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Orders/Index', [
            'orders' => $orders,
        ]);
    }
}
