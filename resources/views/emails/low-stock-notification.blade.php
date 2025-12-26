<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #ef4444; color: white; padding: 20px; text-align: center; }
        .content { background-color: #f9fafb; padding: 20px; margin: 20px 0; }
        .product-info { background-color: white; padding: 15px; border-left: 4px solid #ef4444; }
        .footer { text-align: center; color: #6b7280; font-size: 14px; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Low Stock Alert</h1>
        </div>
        <div class="content">
            <p>Hello Admin,</p>
            <p>This is an automated notification to inform you that a product is running low on stock.</p>

            <div class="product-info">
                <h3>{{ $product->name }}</h3>
                <p><strong>Current Stock:</strong> {{ $product->stock_quantity }} units</p>
                <p><strong>Price:</strong> ${{ number_format($product->price, 2) }}</p>
                @if($product->description)
                    <p><strong>Description:</strong> {{ $product->description }}</p>
                @endif
            </div>

            <p>Please consider restocking this item to avoid running out.</p>
        </div>
        <div class="footer">
            <p>This is an automated message from your E-Commerce System.</p>
        </div>
    </div>
</body>
</html>
