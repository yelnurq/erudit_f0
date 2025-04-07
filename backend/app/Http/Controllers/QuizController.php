<?php
namespace App\Http\Controllers;

use App\Models\ClassModel;
use App\Models\Question;
use App\Models\Score;
use App\Models\Subject;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Intervention\Image\Laravel\Facades\Image;

class QuizController extends Controller
{
    public function getQuestions(Request $request)
    {
        $request->validate([
            'class_id' => 'required|exists:class_models,id',
            'subject_id' => 'required|exists:subjects,id',
            'page' => 'nullable|integer|min:1', 
            'per_page' => 'nullable|integer|min:1', 
        ]);

        $page = $request->input('page', 1);
        $perPage = $request->input('per_page', 20);

        $questions = Question::where('class_id', $request->class_id)
                             ->where('subject_id', $request->subject_id)
                             ->paginate($perPage, ['*'], 'page', $page);

        return response()->json([
            'status' => 'success',
            'questions' => $questions->items(), 
            'total' => $questions->total(), 
            'current_page' => $questions->currentPage(), 
            'last_page' => $questions->lastPage(),
            'per_page' => $questions->perPage(), 
        ]);
    }
    
    public function getRandomQuestions(Request $request)
    {
        $request->validate([
            'class_id' => 'required|exists:class_models,id',
            'subject_id' => 'required|exists:subjects,id',
        ]);
    
        $questions = Question::where('class_id', $request->class_id)
                             ->where('subject_id', $request->subject_id)
                             ->inRandomOrder()  
                             ->take(5)         
                             ->get();
    
        Log::info("Retrieved " . count($questions) . " random questions");
    
        return response()->json([
            'status' => 'success',
            'questions' => $questions,
        ]);
    }
    

    public function deleteQuestion($id)
    {
        $question = Question::find($id);

        if (!$question) {
            return response()->json([
                'status' => 'error',
                'message' => 'Question not found',
            ], 404);
        }

        $question->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Question deleted successfully',
        ]);
    }

    public function updateQuestion(Request $request, $id)
    {
        $request->validate([
            'question' => 'required|string',
            'correct_answer' => 'required|string',  
            'wrong_answer_1' => 'required|string',
            'wrong_answer_2' => 'required|string',
            'wrong_answer_3' => 'required|string',
        ]);
    
        $question = Question::find($id);
    
        if (!$question) {
            return response()->json([
                'status' => 'error',
                'message' => 'Question not found',
            ], 404);
        }
    
        $question->update([
            'question' => $request->question,
            'correct_answer' => $request->correct_answer,
            'wrong_answer_1' => $request->wrong_answer_1,
            'wrong_answer_2' => $request->wrong_answer_2,
            'wrong_answer_3' => $request->wrong_answer_3,
        ]);
    
        return response()->json([
            'status' => 'success',
            'message' => 'Question updated successfully',
            'question' => $question,
        ]);
    }
    

public function getUserScores(Request $request)
{
    $userId = Auth::id();  

    $scores = Score::where('user_id', $userId)->get();

    return response()->json([
        'status' => 'success',
        'scores' => $scores,
    ]);
}
public function submitAnswers(Request $request)
{
    Log::info('submitAnswers called', ['user_id' => auth()->id()]);

    try {
        $validated = $request->validate([
            'answers' => 'required|array',
            'class_id' => 'required|integer',
            'subject_id' => 'required|integer|exists:subjects,id',
        ]);

        $user = auth()->user();
        if (!$user) {
            Log::error('User not authenticated');
            return response()->json(['error' => 'User not authenticated'], 401);
        }

        $answers = $request->input('answers');
        $classId = $request->input('class_id');
        $subjectId = $request->input('subject_id');

        $calculatedScore = 0;

        foreach ($answers as $answer) {
            $questionId = $answer['question_id'];
            $userAnswer = $answer['answer'];

            $question = Question::find($questionId);

            if (!$question) {
                Log::warning('Question not found', ['question_id' => $questionId]);
                continue;
            }

            if ($question->correct_answer == $userAnswer) {
                $calculatedScore++;
            }
        }

        $documentNumber = str_pad(random_int(10000000, 99999999), 8, '0', STR_PAD_LEFT);

        $score = new Score();
        $score->user_id = $user->id;
        $score->class_id = $classId;
        $score->subject_id = $subjectId;
        $score->score = $calculatedScore;
        $score->document_number = $documentNumber;
        $score->save();

        Log::info('Score saved', ['user_id' => $user->id, 'score' => $calculatedScore]);

        $diplomaBase64 = $this->generateDiploma($user, $calculatedScore, $classId, $subjectId);

        return response()->json([
            'message' => 'Your score has been saved successfully and your diploma is ready.',
            'score' => $calculatedScore,
            'diploma_base64' => $diplomaBase64,
            'document_number' => $documentNumber
        ]);
    } catch (\Exception $e) {
        Log::error('Error in submitAnswers', ['error' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
        return response()->json(['error' => 'Internal Server Error'], 500);
    }
}

public function generateDiploma($user, $score, $classId, $subjectId)
{
    try {
        Log::info('generateDiploma called', ['user_id' => $user->id]);

        $class = ClassModel::find($classId);
        $subject = Subject::find($subjectId);

        if (!$class || !$subject) {
            Log::error('Class or Subject not found', ['class_id' => $classId, 'subject_id' => $subjectId]);
            return null;
        }

        $className = $class->name;
        $subjectName = $subject->name;

        $templatePath = public_path('images/diploma_template.jpg');
        $fontPath = public_path('fonts/Liter-Regular.ttf');

        if (!file_exists($templatePath)) {
            Log::error('Diploma template not found', ['path' => $templatePath]);
            return null;
        }

        if (!file_exists($fontPath)) {
            Log::error('Font file not found', ['path' => $fontPath]);
            return null;
        }

        $image = imagecreatefromjpeg($templatePath);
        $black = imagecolorallocate($image, 0, 0, 0);

        imagettftext($image, 50, 0, 400, 400, $black, $fontPath, 'Поздравляем, ' . $user->username . '!');
        imagettftext($image, 40, 0, 500, 500, $black, $fontPath, 'Вы успешно завершили олимпиаду');
        imagettftext($image, 40, 0, 300, 600, $black, $fontPath, 'Класс: ' . $className);
        imagettftext($image, 40, 0, 300, 700, $black, $fontPath, 'Предмет: ' . $subjectName);
        imagettftext($image, 40, 0, 300, 800, $black, $fontPath, 'Ваш результат: ' . $score . ' баллов');

        ob_start();
        imagepng($image);
        $imageData = ob_get_contents();
        ob_end_clean();

        imagedestroy($image);

        $base64Image = base64_encode($imageData);
        Log::info('Diploma generated successfully');

        return 'data:image/png;base64,' . $base64Image;
    } catch (\Exception $e) {
        Log::error('Error in generateDiploma', ['error' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
        return null;
    }
}


}
