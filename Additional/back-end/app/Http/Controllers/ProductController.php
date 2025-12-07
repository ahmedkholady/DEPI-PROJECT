<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /**
     * Get all products
     */
    public function index(Request $request)
    {
        $query = Product::query();

        // Filter by category if provided
        if ($request->has('category') && $request->category != 'all') {
            $query->where('category', $request->category);
        }

        // Search by title if provided
        if ($request->has('search')) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        // Sort
        $sort = $request->get('sort', 'latest');
        if ($sort == 'price_asc') {
            $query->orderBy('price', 'asc');
        } elseif ($sort == 'price_desc') {
            $query->orderBy('price', 'desc');
        } elseif ($sort == 'rating') {
            $query->orderBy('rating', 'desc');
        } else {
            $query->orderBy('created_at', 'desc'); // latest
        }

        $products = $query->get();

        return response()->json([
            'products' => $products,
            'count' => $products->count(),
        ]);
    }

    /**
     * Get a single product
     */
    public function show($id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json([
                'message' => 'Product not found',
            ], 404);
        }

        return response()->json([
            'product' => $product,
        ]);
    }

    /**
     * Create a new product (admin only)
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'old_price' => 'nullable|numeric|min:0',
            'rating' => 'nullable|numeric|between:0,5',
            'discount' => 'nullable|string',
            'image_url' => 'nullable|string',
            'description' => 'nullable|string',
            'category' => 'nullable|string',
            'stock' => 'nullable|integer|min:0',
        ]);

        $product = Product::create($validated);

        return response()->json([
            'message' => 'Product created successfully',
            'product' => $product,
        ], 201);
    }

    /**
     * Update a product (admin only)
     */
    public function update(Request $request, $id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json([
                'message' => 'Product not found',
            ], 404);
        }

        $validated = $request->validate([
            'title' => 'nullable|string|max:255',
            'price' => 'nullable|numeric|min:0',
            'old_price' => 'nullable|numeric|min:0',
            'rating' => 'nullable|numeric|between:0,5',
            'discount' => 'nullable|string',
            'image_url' => 'nullable|string',
            'description' => 'nullable|string',
            'category' => 'nullable|string',
            'stock' => 'nullable|integer|min:0',
        ]);

        $product->update($validated);

        return response()->json([
            'message' => 'Product updated successfully',
            'product' => $product,
        ]);
    }

    /**
     * Delete a product (admin only)
     */
    public function destroy($id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json([
                'message' => 'Product not found',
            ], 404);
        }

        $product->delete();

        return response()->json([
            'message' => 'Product deleted successfully',
        ]);
    }
}
