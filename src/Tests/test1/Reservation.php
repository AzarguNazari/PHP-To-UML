<?php
    class Reservation implements LibraryOnline, LibraryQuickSearch{
		private $reservationID;
		private $bookID;
		private $customerID;
		private $reservationDate;
		private $cancelDate;
		public function getReservationID(){}
		public function getBookID(){}
		public function getCustomerID(){}
		public function getReservationDate(){}
		public function getCancelDate(){}
		public function setReservationDate($date){}
		public function setBookID($bookID){}
		public function setCustomerID($id){}
		public function setCancelDate($date){}
	}
?>

