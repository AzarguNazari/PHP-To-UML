<?php
  abstract class Person implements Work, Engine{
      private $carName;
      public $type;
      protected $price;
      public function __construct($carName, $type, $price){
          $this->carName = $carName;
          $this->type = $type;
          $this->price = $price;
      }
      public function __get($var){
            switch($var){
                case "name" : return $carName;
                case "type" : return $type;
                case "price" : return $price;
                default: return "Please write correctly";
            }
        }
      public function work(){
          echo "work";
      }
      public function positoin(){
          echo "position";
      }
      public function assignTast(string $task){
          echo "your task is " . $task;
      }
  }
  
  class Manager extends Person{
      public function __construct($carName, $type, $price){
          parent::__construct($carName, $type, $type);
      }
      function working(){
          
      }
  }
  
  interface Work{
      public function work();
      public function positoin();
      public function assignTast($task);
  }
  
  class Circle {

    public $radius;

    function setRadius($radius) {
        $this->radius = $radius;
    }

    function area() {
        return $this->radius * $this->radius * M_PI;
    }
}

$c = new Circle();
$c->setRadius(5);

echo $c->area(), "\n";

class Base {
    
    public $name = "Base";
    protected $id = 6124;
    private $is_defined = "yes"; 

}

class Derived extends Base implements Engine{

    public function info() {
        echo "This is Derived class\n";
        echo "Members inherited: \n";

        echo $this->name . "\n";
        echo $this->id . "\n";
        echo $this->is_defined . "\n";
    }
}

class SysInfo extends Person implements Engine, Work{

    private function get_date() {
        return date("Y/m/d");
    }

    private function get_version() {
        return phpversion();
    }

    public function getInfo() {

        $date = $this->get_date();
        $version = $this->get_version();

        echo "The date is: $date\n";
        echo "The PHP version is: $version\n";
    }
}

class Sum {
    public function getSum($x, $y) {
        return $x + $y;
    }
}

class Song {

    function __construct() {
        echo "Song object is created \n";
    }
}



abstract class Animal extends Being implements  Engine{

    protected $age;

    public function __construct($age) {
        $this->age = $age;
    }

    protected function setAge($age) {
        $this->age = $age;
    }

    public function getAge() {
        return $this->age;
    }
}

class Cat extends Animal {

    private $name;

    public function __construct($name, $age) {
        $this->name = $name;
        parent::__construct($age);
    }

    public function getName() {
    
        return $this->name;
    }
}

$cat = new Cat("Cici", 4);
$cat->isAlive();
echo $cat->getName() . " is " .  $cat->getAge() . " years old\n";
$cat->kill();
$cat->isAlive();