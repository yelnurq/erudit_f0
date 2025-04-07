<?php

namespace App\Http\Controllers;

use App\Models\Token;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function Register(Request $request)
    {
        $request->validate([
            "username" => "string|max:255|required|unique:users,username",
            "firstname" => "string|max:255|required",
            "lastname" => "string|max:255|required",
            "thirdname" => "string|max:255|nullable", 
            "email" => "required|email|max:255", 
            "phone" => "nullable|regex:/^[0-9\-\(\)\/\+\s]*$/", 
            "organization" => "nullable|string|max:255", 
            "password" => "min:8|required|confirmed", 
        ]);
        

        $user = User::create([
            "username" => $request->username,
            "firstname" => $request->firstname,
            "lastname" => $request->lastname,
            "thirdname" => $request->thirdname,
            "email" => $request->email,
            "phone" => $request->phone,
            "organization" => $request->organization,
            "password" => Hash::make($request->password),
        ]);

        return response()->json([
            "status"=>"success",
            "user"=>$user,
        ]);
    }
    public function login(Request $request)
    {
        $request->validate(["username", "password"]);

        $user = User::where("username", $request->username)->first();
        if(!$user) {
            return response()->json([
                "status"=>"unsuccess",
                "message"=>"invalid username"
            ]);
        }
        if(!Hash::check($request->password, $user->password)){
            return response()->json([
                "status"=>"unsuccess",
                "message"=>"invalid password"
            ]);
        }

        $token = Str::random(60);
        Token::create([
            "user_id"=>$user->id,
            "token"=>$token,
        ]);

        return response()->json([
            "status"=>"success",
            "token"=>$token,
        ]);

    }
    public function logout(Request $request)
    {
        try {
            $token = $request->bearerToken();
    
            if (!$token) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Token not provided',
                ], 400);
            }
    
            $tokenRecord = Token::where('token', $token)->first();
    
            if (!$tokenRecord) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Invalid token',
                ], 401);
            }
    
            $tokenRecord->delete();
    
            return response()->json([
                'status' => 'success',
                'message' => 'Logout successful',
            ]);
        } catch (\Exception $e) {
            \Log::error('Logout error: ' . $e->getMessage());
    
            return response()->json([
                'status' => 'error',
                'message' => 'An error occurred during logout. Please try again later.',
            ], 500);
        }
    }
    
}
