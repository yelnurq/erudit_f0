<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth as FacadesAuth;

class UserController extends Controller
{
    public function getUser()
    {
        $user = FacadesAuth::user();  
        return response()->json([
            "id"=>$user->id,
            "username"=>$user->username,
            "firstname" => $user->firstname,
            "lastname" => $user->lastname,
            "thirdname" => $user->thirdname,
            "email" => $user->email,
            "phone" => $user->phone,
            "organization" => $user->organization,
        ]);
    }

    public function update(Request $request)
    {
        $user = FacadesAuth::user(); 

        $validatedData = $request->validate([
            'firstname' => 'required|string|max:255',
            'lastname' => 'required|string|max:255',
            'thirdname' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:20',
            'organization' => 'nullable|string|max:255',
        ]);

        $user->firstname = $validatedData['firstname'];
        $user->lastname = $validatedData['lastname'];
        $user->thirdname = $validatedData['thirdname'];
        $user->phone = $validatedData['phone'];
        $user->organization = $validatedData['organization'];
        $user->save(); 

        return response()->json(['message' => 'Данные успешно обновлены!', 'user' => $user]);
    }

    // Обновление пароля пользователя
    public function changePassword(Request $request)
    {
        $user = FacadesAuth::user(); 

        $validatedData = $request->validate([
            'oldPassword' => 'required|string',
            'newPassword' => 'required|string|min:8|confirmed', 
        ]);

        if (!\Illuminate\Support\Facades\Hash::check($validatedData['oldPassword'], $user->password)) {
            return response()->json(['error' => 'Неверный старый пароль'], 400);
        }

        $user->password = \Illuminate\Support\Facades\Hash::make($validatedData['newPassword']); 
        $user->save(); 

        return response()->json(['message' => 'Пароль успешно изменён!']);
    }
}
