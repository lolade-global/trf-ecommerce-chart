<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::orderBy('name')->get();

        return Inertia::render('Products/Index', [
            'products' => $products,
        ]);
    }

    public function show(Product $product)
    {
        return response()->json($product);
    }
}
