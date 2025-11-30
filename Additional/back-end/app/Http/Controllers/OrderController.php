<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    /**
     * Get all orders for the authenticated user
     */
    public function index(Request $request)
    {
        $orders = Order::where('user_id', $request->user()->id)
            ->with('bill')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'orders' => $orders
        ]);
    }

    /**
     * Create a new order
     */
    public function store(Request $request)
    {
        $request->validate([
            'items' => 'required|array',
            'subtotal' => 'required|numeric',
            'shipping' => 'required|numeric',
            'tax' => 'required|numeric',
            'total' => 'required|numeric',
            'shippingInfo.fullName' => 'required|string',
            'shippingInfo.email' => 'required|email',
            'shippingInfo.phone' => 'required|string',
            'shippingInfo.address' => 'required|string',
            'shippingInfo.city' => 'required|string',
            'shippingInfo.state' => 'required|string',
            'shippingInfo.zipCode' => 'required|string',
            'paymentInfo.method' => 'required|string',
        ]);

        // Generate unique order ID
        $orderId = 'ORD-' . date('Y') . '-' . strtoupper(Str::random(6));

        // Calculate estimated arrival (5-7 business days from now)
        $estimatedArrival = now()->addDays(rand(5, 7));
        
        // Generate tracking number
        $trackingNumber = 'TRK' . strtoupper(Str::random(12));

        $order = Order::create([
            'user_id' => $request->user()->id,
            'order_id' => $orderId,
            'items' => json_encode($request->items),
            'subtotal' => $request->subtotal,
            'shipping' => $request->shipping,
            'tax' => $request->tax,
            'total_amount' => $request->total,
            'status' => 'pending',
            'shipping_name' => $request->shippingInfo['fullName'],
            'shipping_email' => $request->shippingInfo['email'],
            'shipping_phone' => $request->shippingInfo['phone'],
            'shipping_address' => $request->shippingInfo['address'],
            'shipping_city' => $request->shippingInfo['city'],
            'shipping_state' => $request->shippingInfo['state'],
            'shipping_zip' => $request->shippingInfo['zipCode'],
            'payment_method' => $request->paymentInfo['method'],
            'estimated_arrival' => $estimatedArrival,
            'tracking_number' => $trackingNumber,
        ]);

        // Generate bill
        $billNumber = 'BILL-' . date('Y') . '-' . strtoupper(Str::random(8));
        
        $bill = \App\Models\Bill::create([
            'user_id' => $request->user()->id,
            'order_id' => $order->id,
            'bill_number' => $billNumber,
            'subtotal' => $request->subtotal,
            'shipping_fee' => $request->shipping,
            'tax_amount' => $request->tax,
            'total_amount' => $request->total,
            'payment_method' => $request->paymentInfo['method'],
            'payment_status' => 'paid',
            'billing_date' => now(),
        ]);

        return response()->json([
            'message' => 'Order placed successfully',
            'order_id' => $orderId,
            'order' => $order->load('bill'),
            'bill' => $bill,
            'estimated_arrival' => $estimatedArrival->format('Y-m-d'),
            'tracking_number' => $trackingNumber,
        ], 201);
    }

    /**
     * Get a specific order
     */
    public function show(Request $request, $id)
    {
        $order = Order::where('user_id', $request->user()->id)
            ->where('id', $id)
            ->with('bill')
            ->firstOrFail();

        return response()->json([
            'order' => $order
        ]);
    }
}
