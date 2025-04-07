<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('questions', function (Blueprint $table) {
            $table->id();
            $table->text('question');  // Вопрос с типом text для большего объема текста
            $table->text('correct_answer');  // Правильный ответ с типом text
            $table->text('wrong_answer_1');  // Ложный ответ 1 с типом text
            $table->text('wrong_answer_2');  // Ложный ответ 2 с типом text
            $table->text('wrong_answer_3');  // Ложный ответ 3 с типом text
            $table->foreignId('class_id')->constrained('class_models');  // Внешний ключ на таблицу 'class_models'
            $table->foreignId('subject_id')->constrained('subjects');  // Предмет
            $table->timestamps();
        });
        
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('questions');
    }
};
