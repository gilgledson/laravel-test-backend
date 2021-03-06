<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

use Illuminate\Http\JsonResponse;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Validation\ValidationException;
use Illuminate\Http\Exceptions\HttpResponseException;

class PropertyStoreRequest extends FormRequest
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
            'street'   => 'required',
            'city_id'  => 'required',
            'state_id' => 'required',
            'status'   => 'required',
            'email'    => 'required|email',
            'neighborhood'    => 'required'
        ];
    }
    public function messages()
    {
        return [
            'email.required' => 'O e-mail é um campo obrigatório!',
            'street.required' => 'O campo rua é obrigatório',
            'city_id.required' => 'O campo cidade é obrigatório',
            'status.required' => 'O campo status é obrigatorio',
            'email.email' => 'O E-mail informado não é válido',
            'neighborhood.required' => 'O campo bairro é obrigatório'
        ];
    }
    protected function failedValidation(Validator $validator)
    {

        throw new HttpResponseException(
            response()->json(['error' =>  $validator->errors()->first()], JsonResponse::HTTP_UNPROCESSABLE_ENTITY)
        );
    }

}
