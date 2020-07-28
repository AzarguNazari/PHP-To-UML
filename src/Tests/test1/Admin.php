<?php
	 class Admin{
		private $adminID;
		private $salary;
		private $contact;
		public function __construct($id, $salary, $contact){
			$this->adminID = $id;
		    $this->salary = $salary;
		    $this->contact = $contact;
		}
		public function getID(){
			return $adminID;
		}
		public function getSalary(){
			return $this->salary;
		}
		public function getContract(){
			return $contact;
		}
		public function setID($id){
			$this->adminID = $id;
		}
		public function setSalary($salary){
			$this->salary = $salary;
		}
		public function setContract($contract){
			$this->contract = $contract;
		}
	}
?>

