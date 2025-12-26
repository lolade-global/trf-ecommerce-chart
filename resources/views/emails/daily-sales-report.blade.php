<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { background-color: #10b981; color: white; padding: 20px; text-align: center; }
        .summary { display: flex; justify-content: space-around; margin: 20px 0; }
        .summary-card { background-color: #f9fafb; padding: 20px; text-align: center; border-radius: 8px; flex: 1; margin: 0 10px; }
        .summary-card h3 { margin: 0; color: #6b7280; font-size: 14px; }
        .summary-card p { margin: 10px 0 0; font-size: 24px; font-weight: bold; color: #10b981; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb; }
        th { background-color: #f3f4f6; font-weight: bold; }
        .footer { text-align: center; color: #6b7280; font-size: 14px; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Daily Sales Report</h1>
            <p>{{ now()->format('F j, Y') }}</p>
        </div>

        <div class="summary">
            <div class="summary-card">
                <h3>Total Orders</h3>
                <p>{{ $totalOrders }}</p>
            </div>
            <div class="summary-card">
                <h3>Total Revenue</h3>
                <p>${{ number_format($totalRevenue, 2) }}</p>
            </div>
            <div class="summary-card">
                <h3>Products Sold</h3>
                <p>{{ $productsSold->sum('quantity') }}</p>
            </div>
        </div>

        <h2>Products Sold Today</h2>
        <table>
            <thead>
                <tr>
                    <th>Product Name</th>
                    <th>Quantity</th>
                    <th>Unit Price</th>
                    <th>Subtotal</th>
                </tr>
            </thead>
            <tbody>
                @foreach($productsSold->groupBy('product_name') as $productName => $items)
                    <tr>
                        <td>{{ $productName }}</td>
                        <td>{{ $items->sum('quantity') }}</td>
                        <td>${{ number_format($items->first()['price'], 2) }}</td>
                        <td>${{ number_format($items->sum('subtotal'), 2) }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>

        <div class="footer">
            <p>This is an automated daily report from your E-Commerce System.</p>
        </div>
    </div>
</body>
</html>
