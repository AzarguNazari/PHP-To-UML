<?php

class InterfaceInformation
{
    private $properties;

    public function __construct( $name, $functions = array(), $extends = null ) 
    {
        $this->properties = array( 
            'name'      =>  $name,
            'functions' =>  $functions,
            'extends'   =>  $extends,
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