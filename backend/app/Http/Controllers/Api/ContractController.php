<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ContractStoreRequest;
use App\Models\Contract;

class ContractController extends Controller
{
   public function index()
   {
    $contract = Contract::all();
    return response()->json(
        datatables()->of($contract)
        ->addColumn('address_formated', function(Contract $contract){
            $property = $contract->property;
            return $property->street.', '.$property->number.' - '.$property->neighborhood.', '.$property->city->name.' - '.$property->state->abbr;
         })
        ->toJson(),200);
   }
   public function show($id)
   {
        $contract = Contract::find($id);
        if($contract){
            $property = $contract->property;
            $contract['property_address'] = $property->street.', '.$property->number.' - '.$property->neighborhood.', '.$property->city->name.' - '.$property->state->abbr;
            return response()->json(['success' => $contract], 200);
        }else{
            return response()->json(['error' => 'Contrato não encontrado'], 404);
        }
   }
   public function update($id, ContractStoreRequest $request)
   {
    try {
        $contract  = Contract::find($request->id);
        if($contract){
          $contract->fill($request->all());
          $contract->save();
          return response()->json(['success' => 'Contrato cadastrado com sucesso !'], 200);
        }else{
          return response()->json(['error' => 'Contrato não encontrado'], 404);
        }
    } catch (\Exception $e) {
          return response()->json(['error' => $e->getMessage()], 500);
    }
   }
   public function destroy($id)
    {
        $contract = Contract::find($id);

        if($contract){
            try {
                $contract->delete();
                return response()->json(['success'  => 'Contrato excluído com sucesso'], 200);
            }catch (\Exception $exception){
                return response()->json(['error' => $exception->getMessage()], 409);
            }
        }

        return response()->json(['error' => 'Imóvel não encontrado'], 404);
    }
   public function store(ContractStoreRequest $request)
   {
      try {
          $contract  = Contract::create($request->all());
          if($contract){
            return response()->json(['success' => 'Contrato cadastrado com sucesso !'], 200);
          }else{
            return response()->json(['error' => 'Ocorrecu um erro ao tentar cadastrar o contrato'], 500);
          }
      } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
      }
   }
}
