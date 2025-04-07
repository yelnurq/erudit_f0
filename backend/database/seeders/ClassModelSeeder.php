<?php

namespace Database\Seeders;

use App\Models\ClassModel;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ClassModelSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Цикл для создания записей с номерами классов от 4 до 9
        for ($i = 4; $i <= 9; $i++) {
            ClassModel::create([
                'name' => $i,
            ]);
        }
    }
}
