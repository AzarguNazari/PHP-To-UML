<?php
    get_class_vars() ; // get the name of variables of an object
    get_class_methods() ;// get the name of methods
    get_class(); // get the class name of an object
    array_keys($array); // get the keys of array
    array_values($array); // get the values of array
    var_dump($expression); // print object or array
    print_r($ar); // print object
    
    
    
    // to chance object to array
    function object_to_array($obj) {
        $_arr = is_object($obj) ? get_object_vars($obj) : $obj;
        foreach ($_arr as $key => $val) {
                $val = (is_array($val) || is_object($val)) ? object_to_array($val) : $val;
                $arr[$key] = $val;
        }
        return $arr;
    }
