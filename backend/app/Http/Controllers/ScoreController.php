<?php

namespace App\Http\Controllers;

use App\Models\Score;
use Illuminate\Http\Request;

class ScoreController extends Controller
{
    public function getTotalScoreForUsers(Request $request)
    {
        $scorers = Score::selectRaw('user_id, sum(score) as total_score')
                        ->groupBy('user_id')
                        ->orderByDesc('total_score') 
                        ->take(100) 
                        ->get()
                        ->filter(function ($score) {
                            return $score->total_score >= 1;
                        })
                        ->map(function ($score) {
                            return [
                                'user_id' => $score->user_id,
                                'total_score' => $score->total_score,
                                'user' => $score->user, 
                            ];
                        });
    
        return response()->json($scorers);
    }
    
    public function getTopScorers(Request $request)
    {
        $subjectId = $request->query('subject_id'); 
        $perPage = $request->query('per_page', 1); 
        $page = $request->query('page', 20); 
    
        $query = Score::selectRaw('user_id, sum(score) as total_score, count(*) as participation_count, avg(score) as average_score')
                      ->where('score', '>=', 1) 
                      ->groupBy('user_id') 
                      ->with(['user', 'subject']) 
                      ->orderByDesc('total_score'); 
    
        if ($subjectId) {
            $query->where('subject_id', $subjectId);
        }
    
        $topScorers = $query->paginate($perPage);
    
        return response()->json($topScorers); 
    }

    public function getScorersCount()
    {
        $scorersCount = Score::count();
        
        return response()->json(['total_scorers' => $scorersCount]);
    }

    public function getScorers()
    {
        $scorers = Score::with('user', 'classModel', 'subject')
            ->get()
            ->map(function ($score) {
                return [
                    'score' => $score->score,
                    'user' => [
                        'username' => $score->user->username,
                        'lastname' => $score->user->lastname,
                        'firstname' => $score->user->firstname,
                        'thirdname' => $score->user->thirdname,
                        'email' => $score->user->email,
                        'phone' => $score->user->phone,
                        'organization' => $score->user->organization,
                        'created_at' => $score->user->created_at,
                    ],
                    'class' => $score->classModel ? $score->classModel->name : 'Не указано',
                    'subject' => $score->subject ? $score->subject->name : 'Не указано',
                ];
            });
    
        return response()->json($scorers); // Возвращаем данные в JSON формате
    }
    public function getScoresForUser(Request $request)
        {
            $userId = auth()->id(); 

            $scores = Score::with(['classModel', 'subject'])
                ->where('user_id', $userId)
                ->get();

            $result = $scores->map(function ($score) {
                return [
                    'score' => $score->score,
                    'class' => $score->classModel->name, 
                    'subject' => $score->subject->name, 
                    'documentNumber' => $score->document_number,  
                    'date' => $score->created_at->format('d.m.Y'),  
                    ];
            });

            return response()->json($result);
    }
    public function getAllScoresForUser(Request $request)
    {
        $userId = auth()->id(); 
    
        $scores = Score::with(['classModel', 'subject'])
            ->where('user_id', $userId)
            ->orderBy('created_at', 'desc') 
            ->paginate(10); 
    
        $result = $scores->map(function ($score) {
            return [
                'score' => $score->score,
                'class' => $score->classModel->name,  
                'subject' => $score->subject->name, 
                'documentNumber' => $score->document_number,  
                'date' => $score->created_at->format('d.m.Y'), 
            ];
        });
    
        return response()->json([
            'data' => $result,
            'pagination' => [
                'current_page' => $scores->currentPage(),
                'last_page' => $scores->lastPage(),
                'per_page' => $scores->perPage(),
                'total' => $scores->total(),
            ],
        ]);
    }
    
    public function checkDocumentNumber(Request $request)
    {
        $documentNumber = $request->query('document_number'); 

        if (!$documentNumber) {
            return response()->json(['error' => 'Номер документа обязателен'], 400);
        }

        $score = Score::with('user') 
                      ->where('document_number', $documentNumber)
                      ->first();

        if ($score) {
            return response()->json([
                'exists' => true,
                'document_number' => $score->document_number,
                'score' => $score->score,
                'date' => $score->created_at->format('d.m.Y'),
                'class' => $score->classModel ? $score->classModel->name : 'Не указано',
                'subject' => $score->subject ? $score->subject->name : 'Не указано',
                'user' => [
                    'firstname' => $score->user->firstname,
                    'lastname' => $score->user->lastname,
                    'thirdname' => $score->user->thirdname,
                ],
            ]);
        }

        return response()->json(['exists' => false]); 
    }

}


