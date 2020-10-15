<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\City;
use App\Models\State;
class Property extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'email',
        'state_id',
        'city_id',
        'status',
        'street',
        'complment',
        'neighborhood',
        'number'
    ];
    public static $statusTitle = [
        '00' => 'Não contratado',
        '01' => 'Contratado'
    ];
    protected $appends  = ['statusFormatted'];
    public function city()
    {
       return $this->belongsTo(City::class, 'city_id');
    }
    public function getStatusFormattedAttribute()
    {
        return self::$statusTitle[$this->status];
    }
    public function state()
    {
       return $this->belongsTo(State::class, 'state_id');
    }
    public function getStatusTitle()
    {
        return $this->statusTitle[$this->status];
    }
    /**
     * The attributes that should be mutated to dates.
     *
     * @var array
     */
    protected $dates = [
        'deleted_at'
    ];

}
