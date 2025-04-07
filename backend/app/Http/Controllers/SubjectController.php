<?php
namespace App\Http\Controllers;

use App\Models\Subject;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class SubjectController extends Controller
{
    public function index()
    {
        $subjects = Subject::all()->map(function($subject){
            return [
                "id"=>$subject->id,
                "name"=>$subject->name,
            ];
        });  
        return response()->json($subjects);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:subjects,name',
        ]);

        $subject = Subject::create([
            'name' => $request->name,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Subject created successfully!',
            'data' => $subject
        ], 201);
    }

    public function show($id)
    {
        $subject = Subject::findOrFail($id); 

        return response()->json([
            'status' => 'success',
            'data' => $subject
        ]);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:subjects,name,' . $id,
        ]);

        $subject = Subject::findOrFail($id);  
        $subject->update([
            'name' => $request->name,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Subject updated successfully!',
            'data' => $subject
        ]);
    }

    public function destroy($id)
    {
        $subject = Subject::findOrFail($id);
        $subject->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Subject deleted successfully!'
        ]);
    }
}
