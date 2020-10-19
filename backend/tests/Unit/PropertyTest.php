<?php

namespace Tests\Unit;

use App\Models\State;
use App\Models\City;
use Tests\TestCase;
use App\User;
use Laravel\Passport\Passport;

class PropertyTest extends TestCase
{

    /**
     * A basic unit test example.
     *
     * @return void
     */

    public function testProperty()
    {
        $this->user = Passport::actingAs(
            factory(User::class)->create()
        );
        $state = State::first();
        $city  = City::first();
        $property = [
            'email' => 'teste@teste.com',
            'state_id' =>  $state->id,
            'city_id' =>  $city->id,
            'status' => '01',
            'street' => 'test street',
            'complment' => 'teste complement',
            'neighborhood' => 'neighborhood',
            'number' => '1'
        ];
        $response = $this->json('post','/api/v1/property', $property,
             [
                'Accept' => 'application/json',
                'Content-Type' => 'application/json'
             ]
        );
        $response
            ->assertStatus(201)
            ->assertJson([
                'success' => Array(),
            ]);

    }
}
