<?php

namespace App\Http\Controllers;

use App\Models\CartItem;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        $user = auth()->user();
        $cartItems = $user->cartItems()->with('product')->get();

        if ($cartItems->isEmpty()) {
            return response()->json([
                'message' => 'Your cart is empty.',
            ], 400);
        }

        foreach ($cartItems as $cartItem) {
            if ($cartItem->product->stock_quantity < $cartItem->quantity) {
                return response()->json([
                    'message' => "Insufficient stock for {$cartItem->product->name}.",
                ], 400);
            }
        }

        DB::beginTransaction();

        try {
            $totalAmount = $cartItems->sum(function ($item) {
                return $item->quantity * $item->product->price;
            });

            $order = Order::create([
                'user_id' => $user->id,
                'total_amount' => $totalAmount,
                'status' => 'completed',
            ]);

            foreach ($cartItems as $cartItem) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $cartItem->product_id,
                    'quantity' => $cartItem->quantity,
                    'price' => $cartItem->product->price,
                ]);

                $cartItem->product->decrement('stock_quantity', $cartItem->quantity);
            }

            $user->cartItems()->delete();

            DB::commit();

            return response()->json([
                'message' => 'Order placed successfully.',
                'order' => $order->load('orderItems.product'),
            ]);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'message' => 'Failed to place order. Please try again.',
            ], 500);
        }
    }
}
