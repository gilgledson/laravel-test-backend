<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::prefix('v1')->group(function(){
    //AuthController - Autenticação do usuário
    Route::namespace('Api')->group(function () { 
        Route::post('/register'                                     , 'AuthController@register'                 )->name('register');
        Route::post('/login'                                        , 'AuthController@login'                    )->name('login');
    });
    
});
