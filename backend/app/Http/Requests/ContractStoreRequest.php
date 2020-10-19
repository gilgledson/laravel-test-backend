<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

use Illuminate\Http\JsonResponse;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class ContractStoreRequest extends FormRequest
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
            'name'        => 'required',
            'property_id' => 'required',
            'email'       => 'required|email',
            'document_type'   => 'required',
            'document'        => 'required'
        ];
    }
    public function messages()
    {
        return [
            'email.required' => 'O e-mail é um campo obrigatório!',
            'property_id.required' => 'O campo imóvel é obrigatório',
            'name.required' => 'O campo nome é obrigatório',
            'document_type.required' => 'O campo tipo é obrigatorio',
            'email.email' => 'O E-mail informado não é válido',
            'document.required' => 'O campo documento é obrigatório'
        ];
    }
    protected function failedValidation(Validator $validator)
    {

        throw new HttpResponseException(
            response()->json(['error' =>  $validator->errors()->first()], JsonResponse::HTTP_UNPROCESSABLE_ENTITY)
        );
    }

}
