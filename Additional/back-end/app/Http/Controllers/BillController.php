<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Bill;

class BillController extends Controller
{
    /**
     * Get all bills for the authenticated user
     */
    public function index(Request $request)
    {
        $bills = Bill::where('user_id', $request->user()->id)
            ->with('order')
            ->orderBy('billing_date', 'desc')
            ->get();

        return response()->json([
            'bills' => $bills
        ]);
    }

    /**
     * Get a specific bill
     */
    public function show(Request $request, $id)
    {
        $bill = Bill::where('user_id', $request->user()->id)
            ->where('id', $id)
            ->with('order')
            ->firstOrFail();

        return response()->json([
            'bill' => $bill
        ]);
    }

    /**
     * Get bill by order ID
     */
    public function getByOrder(Request $request, $orderId)
    {
        $bill = Bill::where('user_id', $request->user()->id)
            ->where('order_id', $orderId)
            ->with('order')
            ->firstOrFail();

        return response()->json([
            'bill' => $bill
        ]);
    }
}
