<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Property;

class Contract extends Model
{
    protected $fillable = [
        'name',
        'document_type',
        'document',
        'email',
        'property_id'
    ];
    public function property()
    {
      return $this->belongsTo(Property::class, 'property_id');
    }
    protected $dates = [
        'deleted_at'
    ];
}
