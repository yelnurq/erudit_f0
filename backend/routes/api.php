<?php

use App\Http\Controllers\QuestionController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\SubjectController;
use App\Http\Controllers\ClassModelController;
use App\Http\Controllers\DiplomController;
use App\Http\Controllers\QuizController;
use App\Http\Controllers\ScoreController;
use App\Http\Controllers\UserController;
use App\Http\Middleware\TokenAdminCheck;
use App\Http\Middleware\TokenCheck;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Аутентификация для юзера
Route::post("/login", [AuthController::class, "login"]);
Route::post("/register", [AuthController::class, "register"]);
Route::post("/logout", [AuthController::class, "logout"])->middleware(TokenCheck::class);

// Аутентификация для админа
Route::post("/admin/login", [AdminController::class, "login"]);
Route::post("/admin/register", [AdminController::class, "register"]);


// Админ панель 
Route::prefix('admin')->middleware(TokenAdminCheck::class)->group(function () {
    // Все пользователи
    Route::get('/allusers', [AdminController::class, 'allusers']);

    // Выход для админа
    Route::post("/logout", [AdminController::class, "logout"]);

    // CRUD для Subjects
    Route::get('/subjects', [SubjectController::class, 'index']);
    // Route::post('/subjects', [SubjectController::class, 'store']);
    // Route::get('/subjects/{id}', [SubjectController::class, 'show']);
    // Route::put('/subjects/{id}', [SubjectController::class, 'update']);
    // Route::delete('/subjects/{id}', [SubjectController::class, 'destroy']);

    // CRUD для ClassModel
    Route::get('/classes', [ClassModelController::class, 'index']);
    // Route::post('/classes', [ClassModelController::class, 'store']);
    // Route::get('/classes/{id}', [ClassModelController::class, 'show']);
    // Route::put('/classes/{id}', [ClassModelController::class, 'update']);
    // Route::delete('/classes/{id}', [ClassModelController::class, 'destroy']);

    // Получить список классов и предметов
    Route::get('/questions', [QuestionController::class, 'index']);  

    // Добавить новый вопрос
    Route::post('/questions', [QuestionController::class, 'store']); 

    // Получить список вопросов из выбранных классов и предметов
    Route::get('/quiz', [QuizController::class, 'getQuestions']);

    // CRUD для Questions
    Route::delete('questions/{id}', [QuizController::class, 'deleteQuestion']);
    Route::put('questions/{id}', [QuizController::class, 'updateQuestion']);

    // Пользователи которые участвовали
    Route::get('/scorers', [ScoreController::class, 'getScorers']);
    
    Route::get('/scorers-count', [ScoreController::class, 'getScorersCount']);
    
    // Топ участников
    Route::get('/top-scorers', [ScoreController::class, 'getTopScorers']);
});



Route::post('/generate-diploma', [DiplomController::class, 'generateDiploma']);

// User панель
Route::middleware(TokenCheck::class)->group(function(){
    Route::get('user-scores', [QuizController::class, 'getUserScores']);
    
    Route::get('/subjects', [SubjectController::class, 'index']);
    Route::get('/top-scorers', [ScoreController::class, 'getTopScorers']);
    
    Route::get('/classes', [ClassModelController::class, 'index']);
    
    Route::post('/quiz/submit', [QuizController::class, 'submitAnswers']);
    Route::get('/quiz/random', [QuizController::class, 'getRandomQuestions']);

    Route::get('/userscores', [ScoreController::class, 'getScoresForUser']);
    Route::get('/userscores/all', [ScoreController::class, 'getAllScoresForUser']);
    
    Route::get('/user', [UserController::class, "getUser"]);
    Route::put('/user/update', [UserController::class, "update"]);
    Route::put('/user/change-password', [UserController::class, "changePassword"]);

    Route::get("/class-subjects", [ClassModelController::class, "ClassAndSubject"]);
    Route::post('/validate-token', [AuthController::class, 'validateToken']);

});

Route::get('/check-document-number', [ScoreController::class, 'checkDocumentNumber']);

Route::get('/subjects', [SubjectController::class, 'index']);
Route::get('/top-scorers', [ScoreController::class, 'getTopScorers']);
Route::get('/top-scorers-overall', [ScoreController::class, 'getTotalScoreForUsers']);
