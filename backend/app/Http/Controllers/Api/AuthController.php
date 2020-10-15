<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Http\Requests\UserStoreRequest;


class AuthController extends Controller
{

    /**
     * Create a new controller instance.
     *
     * @return void php artisan passport:keys
     */
    public function __construct()
    {
        $this->middleware('auth')->except(['register', 'login']);
    }

    public function register(UserStoreRequest $request)
    {

        try{
            if(isset($request->validator)){
                return response()->json(['error' =>$request->validator], 409);
            }
            $user = User::create([
                'name'      => $request->name,
                'email'     => $request->email,
                'password'  => bcrypt($request->password)
            ]);

            $success['token']   = $user->createToken('authToken')->accessToken;
            $success['user']    = $user;

            return response()->json(['success' => $success], 200);
        }catch (\Exception $exception){
            return response()->json(['error' => $exception->getMessage()], 401);
        }

    }

    public function login(Request $request)
    {

        try {

            $data = $request->validate([
                'email'     => 'email|required',
                'password'  => 'required',
            ]);

            if(!Auth::attempt($data)){
                return response()->json(['error' => 'E-mail/Senha inválido(s)'], 401);
            }

            $success['token']   = Auth::user()->createToken('authToken')->accessToken;
            $success['user']    = Auth::user();

            return response()->json(['success' => $success], 200);
        }catch (\Exception $exception){
            return response()->json(['error' => $exception->getMessage()], 500);
        }

    }

    public function logout() {

        try {
            if(!Auth::user()){
                return response()->json(['error' => 'Usuário não encontrado'], 404);
            }

            $token = Auth::user()->token();
            $token->revoke();

            DB::table('oauth_access_tokens')
                ->where('user_id', Auth::user()->id)
                ->update([
                    'revoked' => true
                ]);

            return response()->json(['success' => 'Deslogado com Sucesso'], 200);
        }catch (\Exception $exception){
            return response()->json(['error' => 'Erro ao Deslogar'], 500);
        }

    }

    public  function user(Request $request)
    {
        try {
            return response()->json(['success' => $request->user()], 200);
        }catch (\Exception $exception){
            return response()->json(['error' => $exception->getMessage()], 401);
        }

    }

}
