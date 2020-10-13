<?php

use Illuminate\Database\Seeder;
use App\User;

class UserTableSeeder extends Seeder
{

    public function run()
    {
        User::create([
            'name' => 'Admin',
            'email' => 'administrator@administrator.com',
            'password' => bcrypt('123456')
        ]);
    }
}