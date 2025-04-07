<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ClassModel extends Model
{
    use HasFactory;
    protected $fillable = ['name'];
    protected $table = 'class_models';

    public function questions()
    {
        return $this->hasMany(Question::class);
    }
}
