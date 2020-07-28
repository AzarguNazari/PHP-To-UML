<?php
	 interface LibraryQuickSearch{
		public function quickSearchByID();
		public function quickSearchByAuthor();
		public function quickSearchByDate();
		public function quickSearchByText();
		public function getCancelDate();
	}
?>