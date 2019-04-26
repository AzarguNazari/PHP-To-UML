<?php

class ClassInformation
{
    private $properties;

    public function __construct( $name, $attributes = array(), $functions = array(), $implements = array(), $extends = null ) 
    {
        $this->properties = array( 
            'name'          =>  $name,
            'attributes'    =>  $attributes,
            'functions'     =>  $functions,
            'implements'    =>  $implements,
            'extends'       =>  $extends,
        );
    }

    public function __get( $key )
    {
        if ( !array_key_exists( $key, $this->properties ) )
        {
            throw new Exception("Sorry Doesn't exist");
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