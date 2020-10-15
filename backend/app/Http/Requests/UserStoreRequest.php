<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

use Illuminate\Http\JsonResponse;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Validation\ValidationException;
use Illuminate\Http\Exceptions\HttpResponseException;

class UserStoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'email' => 'required|email|unique:users',
            'name' => 'required|string|max:50',
            'password' => 'required|confirmed'
        ];
    }
    public function messages()
    {
        return [
            'email.required' => 'O e-mail é um campo obrigatório!',
            'name.required' => 'O Nome é um campo obrigatório!',
            'password.required' => 'A Senha é um campo obrigatório!',
            'email.unique' => "E-mail já está sendo usado",
            'password.confirmed' => 'Confirmação de senha incorreta!'
        ];
    }
    protected function failedValidation(Validator $validator)
    {
        
        throw new HttpResponseException(
            response()->json(['error' =>  $validator->errors()->first()], JsonResponse::HTTP_UNPROCESSABLE_ENTITY)
        );
    }

}
