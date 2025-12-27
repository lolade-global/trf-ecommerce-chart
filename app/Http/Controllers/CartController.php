<?php

namespace App\Http\Controllers;

use App\Jobs\SendLowStockNotification;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CartController extends Controller
{
    public function index()
    {
        $cartItems = auth()->user()
            ->cartItems()
            ->with('product')
            ->get();

        $total = $cartItems->sum(function ($item) {
            return $item->quantity * $item->product->price;
        });

        return Inertia::render('Cart/Index', [
            'cartItems' => $cartItems,
            'total' => $total,
        ]);
    }

    public function add(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
        ]);

        $product = Product::findOrFail($request->product_id);

        if ($product->stock_quantity < $request->quantity) {
            return response()->json([
                'message' => 'Insufficient stock available.',
            ], 400);
        }

        $cartItem = CartItem::firstOrCreate(
            [
                'user_id' => auth()->id(),
                'product_id' => $request->product_id,
            ],
            [
                'quantity' => 0,
            ]
        );

        $cartItem->increment('quantity', $request->quantity);

        $cartItem->refresh()->load('product');

        if ($cartItem->quantity > $product->stock_quantity) {
            $cartItem->quantity = $product->stock_quantity;
            $cartItem->save();
        }

        if ($product->isLowStock()) {
            SendLowStockNotification::dispatch($product);
        }

        return response()->json([
            'message' => 'Product added to cart successfully.',
            'cartItem' => $cartItem,
        ]);
    }

    public function update(Request $request, CartItem $cartItem)
    {
        $this->authorize('update', $cartItem);

        $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        $product = $cartItem->product;

        if ($product->stock_quantity < $request->quantity) {
            return response()->json([
                'message' => 'Insufficient stock available.',
            ], 400);
        }

        $cartItem->update(['quantity' => $request->quantity]);

        if ($product->isLowStock()) {
            SendLowStockNotification::dispatch($product);
        }

        return response()->json([
            'message' => 'Cart updated successfully.',
            'cartItem' => $cartItem->load('product'),
        ]);
    }

    public function remove(CartItem $cartItem)
    {
        $this->authorize('delete', $cartItem);

        $cartItem->delete();

        return response()->json([
            'message' => 'Item removed from cart successfully.',
        ]);
    }

    public function clear()
    {
        auth()->user()->cartItems()->delete();

        return response()->json([
            'message' => 'Cart cleared successfully.',
        ]);
    }
}
