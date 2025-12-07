<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

$products = App\Models\Product::all();
$images = [
    'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1594783318286-3728b7d8d0ad?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1539571696357-5a69c006ae0f?w=400&h=400&fit=crop',
    'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=400&h=400&fit=crop'
];

foreach ($products as $index => $product) {
    $product->image_url = $images[$index] ?? $images[0];
    $product->save();
}

echo "Images updated successfully!\n";
