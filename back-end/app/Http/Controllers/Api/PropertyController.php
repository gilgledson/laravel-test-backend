<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
class PropertyController extends Controller
{
    public function index()
    {
        $property = [];
        return response()->json(datatables()->of($enderecos)->toJson(),200);
    }
}
