<?php
    class Manager extends Person{
        private $position;
        private $employees;
        public function checkEmployeesWork(){
            for($x = 0; $x < count($employees); $x++){
                if($employees[x].jobDone() == true){
                    echo "Yes its finished";
                }
            }
        }
        public function attendence(){
            for($x = 0; $x < count($employees); $x++){
                if($employees[x].isPresent() == true){
                    echo "presente";
                }
                else{
                    echo "Apsent";
                }
            }
        }
        
    }
?>