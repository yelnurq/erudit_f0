<?php
namespace App\Http\Controllers;

use App\Models\ClassModel;  
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Subject;

class ClassModelController extends Controller
{
    public function index()
    {
        $classes = ClassModel::all()->map(function($class){
            return [
                    "id"=>$class->id,
                    "name"=>$class->name,
            ];
        });
        return response()->json($classes);
    }   

    public function ClassAndSubject()
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
        
        return response()->json(["classes"=>$classes,"subjects"=> $subjects]);

    }
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $class = ClassModel::create([
            'name' => $request->name,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Class created successfully!',
            'data' => $class
        ], 201);
    }

    public function show($id)
    {
        $class = ClassModel::findOrFail($id); 

        return response()->json([
            'status' => 'success',
            'data' => $class
        ]);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:classes,name,' . $id,
        ]);

        $class = ClassModel::findOrFail($id);
        $class->update([
            'name' => $request->name,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Class updated successfully!',
            'data' => $class
        ]);
    }

    public function destroy($id)
    {
        $class = ClassModel::findOrFail($id);
        $class->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Class deleted successfully!'
        ]);
    }
}
