<?php

namespace App\Services;

use App\Jobs\SendLowStockNotification;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class CartService
{
    public function addToCart($user, int $productId, int $quantity)
    {
        $product = Product::findOrFail($productId);

        if ($product->stock_quantity < $quantity) {
            throw new \Exception('Insufficient stock available.');
        }

        $cartItem = CartItem::firstOrCreate(
            [
                'user_id' => $user->id,
                'product_id' => $productId,
            ],
            [
                'quantity' => 0,
            ]
        );

        $cartItem->increment('quantity', $quantity);

        $cartItem->refresh()->load('product');

        if ($cartItem->quantity > $product->stock_quantity) {
            $cartItem->quantity = $product->stock_quantity;
            $cartItem->save();
        }

        if (method_exists($product, 'isLowStock') && $product->isLowStock()) {
            SendLowStockNotification::dispatch($product);
        }

        return $cartItem;
    }

    public function updateCartItem($user, CartItem $cartItem, int $quantity)
    {
        $product = $cartItem->product;

        if ($product->stock_quantity < $quantity) {
            throw new \Exception('Insufficient stock available.');
        }

        $cartItem->update(['quantity' => $quantity]);

        if (method_exists($product, 'isLowStock') && $product->isLowStock()) {
            SendLowStockNotification::dispatch($product);
        }

        return $cartItem->load('product');
    }

    public function removeCartItem($user, CartItem $cartItem)
    {
        $cartItem->delete();
    }

    public function clearCart($user)
    {
        $user->cartItems()->delete();
    }
}
