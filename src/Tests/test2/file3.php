<?php
    class Employee extends Person implements Freelancer{
        private $work;
        private $present;
        public function isPresent(){
           return $this->present; 
        }
        public function setWork($work){
            $this->work = $work;
        }
        public function jobDone(){
            if($this->work == "done"){
                echo "yes";
            }
        }
        public function workFromHome(){
            echo "yes working from home is cool";
        }
        public function workPerHour(){
            echo "working per hour is 40$/hour";
        }
    }
?>