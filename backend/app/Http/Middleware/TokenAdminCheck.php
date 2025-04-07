<?php
namespace App\Http\Middleware;

use App\Models\TokenAdmin;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class TokenAdminCheck
{
    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->bearerToken(); 
        if (!$token || !TokenAdmin::where("token_admin", $token)->exists()) {
            return response()->json([
                "msg" => "Admin not authorized",
            ], 401);  
        }

        $admin = TokenAdmin::where("token_admin", $token)->first()->admin;  
        Auth::login($admin);  
        return $next($request);  
    }
}
