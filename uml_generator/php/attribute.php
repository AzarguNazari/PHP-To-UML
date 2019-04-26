<?php

class Attribute
{
    private $properties;

    public function __construct( $name, $modifier = 'public', $type = null ) 
    {
        $this->properties = array( 
            'name'      =>  $name,
            'modifier'  =>  $modifier,
            'type'      =>  $type,
        );
    }

    public function __get( $key )
    {
        if ( !array_key_exists( $key, $this->properties ) )
        {
            throw new Exception("Doesn't Exist");
        }
        return $this->properties[$key];
    }

    public function __set( $key, $val )
    {
        if ( !array_key_exists( $key, $this->properties ) )
        {
            throw new Exception("Doesn't Exist");
        }
        $this->properties[$key] = $val;            
    }
}