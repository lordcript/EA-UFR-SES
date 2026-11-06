<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        if (!Auth::check()) {
            return redirect()->route('login')->with('error', 'Veuillez vous connecter en tant qu\'administrateur.');
        }

        if (Auth::user()->isBlocked()) {
            Auth::logout();
            return redirect()->route('login')->with('error', 'Votre compte administrateur a été bloqué.');
        }

        return $next($request);
    }
}
