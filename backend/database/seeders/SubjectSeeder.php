<?php

namespace Database\Seeders;

use App\Models\Subject; // Не забудьте импортировать модель Subject
use Illuminate\Database\Seeder;

class SubjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $subjects = [
            'Математика',
            'Русский язык',
            'Казахский язык',
            'Литература',
            'История',
            'География',
            'Биология',
            'Физика',
            'Химия',
            'Информатика',
            'Английский язык',
        ];

        foreach ($subjects as $subject) {
            Subject::create([
                'name' => $subject,  // Предполагается, что в таблице есть колонка name
            ]);
        }
    }
}
