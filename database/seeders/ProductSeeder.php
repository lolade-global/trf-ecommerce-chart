<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = [
            [
                'name' => 'Wireless Headphones',
                'description' => 'High-quality wireless headphones with noise cancellation',
                'price' => 199.99,
                'stock_quantity' => 50,
            ],
            [
                'name' => 'Smart Watch',
                'description' => 'Fitness tracking smartwatch with heart rate monitor',
                'price' => 299.99,
                'stock_quantity' => 30,
            ],
            [
                'name' => 'Laptop Stand',
                'description' => 'Ergonomic aluminum laptop stand',
                'price' => 49.99,
                'stock_quantity' => 4, // Low stock
            ],
            [
                'name' => 'USB-C Hub',
                'description' => '7-in-1 USB-C hub with HDMI and SD card reader',
                'price' => 39.99,
                'stock_quantity' => 100,
            ],
            [
                'name' => 'Mechanical Keyboard',
                'description' => 'RGB mechanical keyboard with blue switches',
                'price' => 129.99,
                'stock_quantity' => 25,
            ],
            [
                'name' => 'Wireless Mouse',
                'description' => 'Ergonomic wireless mouse with adjustable DPI',
                'price' => 29.99,
                'stock_quantity' => 3, // Low stock
            ],
            [
                'name' => 'Phone Case',
                'description' => 'Shockproof phone case with card holder',
                'price' => 19.99,
                'stock_quantity' => 150,
            ],
            [
                'name' => 'Portable Charger',
                'description' => '20000mAh portable power bank',
                'price' => 34.99,
                'stock_quantity' => 60,
            ],
            [
                'name' => 'Bluetooth Speaker',
                'description' => 'Waterproof Bluetooth speaker with 12-hour battery',
                'price' => 79.99,
                'stock_quantity' => 40,
            ],
            [
                'name' => 'Webcam HD',
                'description' => '1080p HD webcam with built-in microphone',
                'price' => 69.99,
                'stock_quantity' => 2, // Low stock
            ],
            [
                'name' => 'Monitor 27"',
                'description' => '27-inch 4K monitor with HDR support',
                'price' => 399.99,
                'stock_quantity' => 15,
            ],
            [
                'name' => 'Gaming Mouse Pad',
                'description' => 'Large RGB gaming mouse pad',
                'price' => 24.99,
                'stock_quantity' => 80,
            ],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}
