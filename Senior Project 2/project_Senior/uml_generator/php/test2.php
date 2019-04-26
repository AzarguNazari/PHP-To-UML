<?php
    abstract class Car implements Engine{
        public $carname;
        public $carNumber;
        public $model;
        public $made;
        public function __construct($cname = "unknown", $cNumber = 0, $c_model = "unknown", $c_made = "china"){
            $this->carname = $cname;
            $this->$carNumber = $cNumber;
            $this->$model = $c_model;
            $this->$made = $c_made;
        }
        private function calculateSpeed(){
            return "fast";
        }
        
        public function __get($var){
            switch($var){
                case "name" : return $carname;
                case "number" : return $carNumber;
                case "model" : return $model;
                case "made" : return $made;
            }
        }
        
        function start(){
            echo "Engine is started";
        }
        function speed(int $speedNumber){
            echo "The speedis $speedNumber";
        }
    }
    
               
    
    interface Engine{
        const maxSpeed = 140;
        const minSpeed = 20;
        function start();
        function speed(int $speedNumber);        
    }