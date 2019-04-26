<?php
   class Books extends Patron implements LibraryQuickSearch, LibraryOnline, LibraryISSN{
		private $bookID;
		private $bookTitle;
		private $author;
		private $ISBN;
		private $publishYear;
		private $category;
		public function __construct($bid, $title, $uthor, $isbn, $pubYear, $categry){
			$this->bookID = $bid;
			$this->bookTitle = $title;
			$this->author = $author;
			$this->ISBN = $isbn;
			$this->publishYear = $bid;
			$this->categry = $categry;
		}
		public function getBookID(){return $bookID;}
		public function getBookTitle(){return $bookTitle;}
		public function getISBN(){return $ISBN;}
		public function getPublishYear(){return $$publishYear;}
		public function getCategory(){return $categry;}
		public function __construct($bid, $title, $uthor, $isbn, $pubYear, $categry){
			$this->bookID = $bid;
			$this->bookTitle = $title;
			$this->author = $author;
			$this->ISBN = $isbn;
			$this->publishYear = $bid;
			$this->categry = $categry;
		}
		public function setBookID($bid){
			$this->bookID = $bid;
		}
		public function setBookTitle($title){	
			$this->bookTitle = $title;
		}
		public function setAuthor($author){	
			$this->author = $author;
		}
		public function setISBN($isbn){
			$this->ISBN = $isbn;
		}
		public function setPublishYear($publishYear){	
			$this->publishYear = $publishYear;
		}
		public function setCateogry($cateogry){	
			$this->cateogry = $cateogry;
		}
	}
?>

