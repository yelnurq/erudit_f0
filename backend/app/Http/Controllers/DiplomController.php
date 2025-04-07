<?php

namespace App\Http\Controllers;

use App\Models\ClassModel;
use App\Models\Score;
use App\Models\Subject;
use App\Models\Token;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Laravel\Facades\Image;

class DiplomController extends Controller
{

    public function generateDiploma(Request $request)
    {
        $token = $request->bearerToken();
        $tokenRecord = Token::where("token", $token)->first();
    
        if (!$tokenRecord || !$tokenRecord->user) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid token or user not found.',
            ], 401); 
        }
    
        $user = $tokenRecord->user;  
    
        $scoreRecord = Score::where('user_id', $user->id)
                            ->orderBy('created_at', 'desc')  
                            ->first();
    
        if (!$scoreRecord) {
            return response()->json([
                'status' => 'error',
                'message' => 'No score found for the user.',
            ], 404);
        }
    
        $score = $scoreRecord->score;
    
        $class = ClassModel::find($scoreRecord->class_id);
        if (!$class) {
            return response()->json([
                'status' => 'error',
                'message' => 'Class not found.',
            ], 404);
        }
    
        $subject = Subject::find($scoreRecord->subject_id);
        if (!$subject) {
            return response()->json([
                'status' => 'error',
                'message' => 'Subject not found.',
            ], 404);
        }
    
        $className = $class->name;
        $subjectName = $subject->name;
    
        $template = public_path('images/diploma_template.jpg'); 
    
        $img = Image::read($template);
    
        $fontPath = public_path('fonts/Liter-Regular.ttf'); 
    
        $img->text('Поздравляем, ' . $user->username . '!', 400, 400, function($font) use ($fontPath) {
            $font->file($fontPath); 
            $font->size(50);
            $font->color('#000000');
            $font->align('center');
        });
    
        $img->text('Вы успешно завершили олимпиаду', 500, 500, function($font) use ($fontPath) {
            $font->file($fontPath); 
            $font->size(40);
            $font->color('#000000');
            $font->align('center');
            $font->valign('top');
        });
    
        $img->text('Класс: ' . $className, 300, 600, function($font) use ($fontPath) {
            $font->file($fontPath); 
            $font->size(40);
            $font->color('#000000');
            $font->align('center');
            $font->valign('top');
        });
    
        $img->text('Предмет: ' . $subjectName, 300, 700, function($font) use ($fontPath) {
            $font->file($fontPath); 
            $font->size(40);
            $font->color('#000000');
            $font->align('center');
            $font->valign('top');
        });
    
        $img->text('Ваш результат: ' . $score . ' баллов', 300, 800, function($font) use ($fontPath) {
            $font->file($fontPath);  
            $font->size(40);
            $font->color('#000000');
            $font->align('center');
            $font->valign('top');
        });
    
        $directory = public_path('diplomas/');
        if (!file_exists($directory)) {
            mkdir($directory, 0777, true); 
        }
    
        $fileName = 'diploma_' . time() . '.png';
        $img->save($directory . $fileName);
    
        return response()->download($directory . $fileName);
    }
}