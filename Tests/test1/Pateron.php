<?php 
	 class Patron implements BookDB{
		private $patronID;
		private $name;
		public function __construct($patronID, $name){
			$this->patronID = $patronID;
			$this->name = $name;
		}
		public function getPatronID(){return $patronID;}
		public function getName(){return $name;}
		public function setPatronID($id){$this->patronID = $id;}
		public function setName($name){$this->name = $name;}
		public function search(){
		}
		public function request(){}
		public function payFine(){
			/* something here */
		}
	}
?>