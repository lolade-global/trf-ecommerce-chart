<?php

namespace App\Jobs;

use App\Mail\DailySalesReport;
use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class SendDailySalesReport implements ShouldQueue
{
    use Queueable, Dispatchable, InteractsWithQueue, SerializesModels;

    /**
     * Create a new job instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $today = now()->startOfDay();

        $orders = Order::with(['orderItems.product', 'user'])
            ->whereDate('created_at', $today)
            ->where('status', 'completed')
            ->get();

        if ($orders->isEmpty()) {
            return;
        }

        $totalRevenue = $orders->sum('total_amount');
        $totalOrders = $orders->count();

        $productsSold = $orders->flatMap(function ($order) {
            return $order->orderItems->map(function ($item) {
                return [
                    'product_name' => $item->product->name,
                    'quantity' => $item->quantity,
                    'price' => $item->price,
                    'subtotal' => $item->subtotal,
                ];
            });
        });

        $adminEmail = config('app.admin_email', 'admin@example.com');

        Mail::to($adminEmail)->send(
            new DailySalesReport($orders, $totalRevenue, $totalOrders, $productsSold)
        );
    }
}
