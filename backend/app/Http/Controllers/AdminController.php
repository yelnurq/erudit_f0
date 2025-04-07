<?php

namespace App\Http\Controllers;
use App\Models\Admin;
use App\Models\TokenAdmin;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AdminController extends Controller
{
    public function allusers()
    {
        $users = User::all()->map(function($user){
            return [
                "id"=>$user->id,
                "username"=>$user->username,
                "firstname" => $user->firstname,
                "lastname" => $user->lastname,
                "thirdname" => $user->thirdname,
                "email" => $user->email,
                "phone" => $user->phone,
                "organization" => $user->organization,
            ];
        });
        return response()->json($users);
    }
    public function Register(Request $request)
    {
        $request->validate([
            "username" => "string|max:255|required|unique:admins,username",
            "password" => "min:8|required",
            "isRole" => "required|in:moderator,admin",
        ]);

        $admin = Admin::create([
            "username" => $request->username,
            "password" => Hash::make($request->password),
            "isRole" => $request->isRole, 
        ]);


        return response()->json([
            "status" => "success",
            "admin" => $admin,
        ]);
    }


    public function login(Request $request)
    {
        $request->validate(["username", "password"]);

        $admin = Admin::where("username", $request->username)->first();
        if(!$admin) {
            return response()->json([
                "status"=>"unsuccess",
                "message"=>"invalid admin username"
            ]);
        }
        if(!Hash::check($request->password, $admin->password)){
            return response()->json([
                "status"=>"unsuccess",
                "message"=>"invalid password"
            ]);
        }

        $token = Str::random(60);
        TokenAdmin::updateOrCreate(
            ["admin_id"=>$admin->id],
            ["token_admin"=>$token],
        );

        return response()->json([
            "status"=>"success",
            "token_admin"=>$token,
        ]);

    }
    public function logout(Request $request)
    {
        $token = $request->bearerToken();
        TokenAdmin::where("token_admin", $token)->first()->delete();
        
        return response()->json([
            "status"=>"success",
            "message"=>"logout success",
        ]);

    }
}
