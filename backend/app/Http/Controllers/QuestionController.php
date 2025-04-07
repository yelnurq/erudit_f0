<?php
namespace App\Http\Controllers;

use App\Models\ClassModel;
use App\Models\Subject;
use App\Models\Question;
use Illuminate\Http\Request;

class QuestionController extends Controller
{
    public function index()
    {
        $classes = ClassModel::all()->map(function($class){
            return [
                    "id"=>$class->id,
                    "name"=>$class->name,
            ];
        });
        $subjects = Subject::all()->map(function($subject){
            return [
                "id"=>$subject->id,
                "name"=>$subject->name,
            ];
        });
        return response()->json([
            "classes"=>$classes,
            "subjects"=>$subjects,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'question' => 'required|string',
            'correct_answer' => 'required|string',
            'wrong_answer_1' => 'required|string',
            'wrong_answer_2' => 'required|string',
            'wrong_answer_3' => 'required|string',
        ]);

        $question = Question::create([
            'question' => $request->question,
            'correct_answer' => $request->correct_answer,
            'wrong_answer_1' => $request->wrong_answer_1,
            'wrong_answer_2' => $request->wrong_answer_2,
            'wrong_answer_3' => $request->wrong_answer_3,
            'class_id' => $request->class_id,
            'subject_id' => $request->subject_id,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Question added successfully!',
            'data' => $question,  
        ], 201);    }
}
