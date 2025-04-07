<?php
namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;  // Наследуемся от Authenticatable
use Illuminate\Notifications\Notifiable;

class Admin extends Authenticatable
{
    use Notifiable;

    protected $fillable = ['username', 'password', 'isRole'];

}
