<?php

namespace App\Http\Controllers;

use App\Jobs\SendLowStockNotification;
use App\Models\CartItem;
use App\Models\Product;
use App\Services\CartService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CartController extends Controller
{
    protected $cartService;

    public function __construct(CartService $cartService)
    {
        $this->cartService = $cartService;
    }
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

        try {
            $cartItem = $this->cartService->addToCart(auth()->user(), $request->product_id, $request->quantity);

            return response()->json([
                'message' => 'Product added to cart successfully.',
                'cartItem' => $cartItem,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    public function update(Request $request, CartItem $cartItem)
    {
        $this->authorize('update', $cartItem);

        $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        try {
            $updated = $this->cartService->updateCartItem(auth()->user(), $cartItem, $request->quantity);

            return response()->json([
                'message' => 'Cart updated successfully.',
                'cartItem' => $updated,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    public function remove(CartItem $cartItem)
    {
        $this->authorize('delete', $cartItem);

        $this->cartService->removeCartItem(auth()->user(), $cartItem);

        return response()->json([
            'message' => 'Item removed from cart successfully.',
        ]);
    }

    public function clear()
    {
        $this->cartService->clearCart(auth()->user());

        return response()->json([
            'message' => 'Cart cleared successfully.',
        ]);
    }
}
