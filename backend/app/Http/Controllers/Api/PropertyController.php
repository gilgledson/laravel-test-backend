<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Property;
use App\Http\Requests\PropertyStoreRequest;
use App\Models\State;
use App\Models\City;
use Illuminate\Http\Request;

class PropertyController extends Controller
{
    public function index(Request $request)
    {
        $properties = Property::query();

        if($request->city_id != "null" && $request->city_id){
            $properties->where('city_id', $request->city_id);
        }if($request->state_id != "null" && $request->state_id){
            $properties->where('state_id', $request->state_id);
        }

        return response()->json(
            datatables()->of($properties->get())
            ->addColumn('address_formated', function(Property $property){
               return $property->street.', '.$property->number.' - '.$property->neighborhood.', '.$property->city->name.' - '.$property->state->abbr;
            })
            ->toJson(),200);
    }
    public function update($id, PropertyStoreRequest $request)
    {
        try {
            if(isset($request->validator)){
                return response()->json(['error' => $request->validator], 409);
            }
            $property = Property::find($id);
            if($property){
                $property->email        = $request->email;
                $property->state_id     = $request->state_id;
                $property->city_id      = $request->city_id;
                $property->status       = $request->status;
                $property->street       = $request->street;
                $property->complment    = $request->complment;
                $property->neighborhood = $request->neighborhood;
                $property->number       = $request->number;
                if($property->save()){
                    return response()->json(['success' => 'Imóvel atualizado com sucesso !'], 200);
                }else{
                    return response()->json(['error' => 'Erro ao tentar atualizar imóvel !'], 200);
                }
            }else{
                return response()->json(['error' => 'Imóvel não encontrado'], 404);
            }
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
    public function getStates()
    {
        try {
            $states = State::orderBy('abbr')->get();
            return response()->json(['success' => $states], 200);
        } catch (\Exception $e) {

            return response()->json(['error' => $e->getMessage()], 500);
        }

    }
    public function destroy($id)
    {
        $property = Property::find($id);

        if($property){
            try {
                $property->delete();
                return response()->json(['success'  => 'Imóvel excluído com sucesso'], 200);
            }catch (\Exception $exception){
                return response()->json(['error' => $exception->getMessage()], 409);
            }
        }

        return response()->json(['error' => 'Imóvel não encontrado'], 404);
    }
    public function getCities($id)
    {
        try {
            $cities = City::where('state_id', $id)->orderBy('name')->get();
            return response()->json(['success' => $cities], 200);
        } catch (\Exception $e) {

            return response()->json(['error' => $e->getMessage()], 200);
        }

    }
    public function store(PropertyStoreRequest $request)
    {

        try {
            if(isset($request->validator)){
                return response()->json(['error' => $request->validator], 409);
            }
           $property = Property::create($request->all());
           if($property){
                return response()->json(['success' => $property], 201);
           }else{
                return response()->json(['error' => 'Erro ao tentar cadastrar imóvel'], 409);
           }
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
