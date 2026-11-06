<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class StudentMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        if (!Auth::guard('student')->check()) {
            return redirect()->route('login')->with('error', 'Veuillez vous connecter avec votre identifiant étudiant.');
        }

        if (Auth::guard('student')->user()->isBlocked()) {
            Auth::guard('student')->logout();
            return redirect()->route('login')->with('error', 'Votre compte étudiant a été temporairement suspendu.');
        }

        return $next($request);
    }
}
