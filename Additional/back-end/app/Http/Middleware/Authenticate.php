<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;

class Authenticate extends Middleware
{
    /**
     * Get the path the user should be redirected to when they are not authenticated.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return string|null
     */
    protected function redirectTo($request)
    {
        // For API requests, don't redirect - let the parent handle it with JSON response
        if (! $request->expectsJson()) {
            // For web requests, we could redirect but since this is an API, return null
            return null;
        }
        
        return null;
    }
}
