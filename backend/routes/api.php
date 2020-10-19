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
    Route::middleware('auth:api')->group(function() {
        /* AUTH ROUTES */
        Route::namespace('Api')->group(function () { // Controllers Within The "App\Http\Controllers\Api" Namespace
            Route::get('logout'                                     ,'AuthController@logout'                    )->name('logout');
            Route::get('user/me'                                    ,'AuthController@user'                      )->name('user.me');
            Route::get('states/all'                                ,'PropertyController@getStates'                      )->name('user.me');
            Route::get('cities/{id}'                               ,'PropertyController@getCities'                      )->name('user.me');

            Route::resource('property', 'PropertyController');
            Route::resource('contract', 'ContractController');
        });
    });

});
