<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TokenAdmin extends Model
{
    protected $guarded =[];
    public function admin()
    {
        return $this->belongsTo(Admin::class);
    }
}
