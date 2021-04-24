# PHPtoUML
A tool that helps developers to generate their UML diagram through uploading their PHP code

## How to run it?
- If you have docker-compose, just type `docker-compose up -d` and access it on `localhost`
- If you have locally webserver, just copy it and paste it on /var/www/html then access it on `localhost`

# How it works?
- Open the upload page
- Uload your PHP classes or files
- the generated UML will be shown.

There are are already some some php example files which you can upload them, [Admin.php](https://github.com/AzarguNazari/PHP-To-UML/blob/master/src/Tests/test1/Admin.php), [Librarian.php](https://github.com/AzarguNazari/PHP-To-UML/blob/master/src/Tests/test1/Librarian.php), [Library.php](https://github.com/AzarguNazari/PHP-To-UML/blob/master/src/Tests/test1/Library.php), [LibraryISSN.php](https://github.com/AzarguNazari/PHP-To-UML/blob/master/src/Tests/test1/LibraryISSN.php), [LibraryOnline.php](https://github.com/AzarguNazari/PHP-To-UML/blob/master/src/Tests/test1/LibraryOnline.php), [LibraryQuickSearch.php](https://github.com/AzarguNazari/PHP-To-UML/blob/master/src/Tests/test1/LibraryQuickSearch.php),[Pateron.php](https://github.com/AzarguNazari/PHP-To-UML/blob/master/src/Tests/test1/Pateron.php), [PateronRecord.php](https://github.com/AzarguNazari/PHP-To-UML/blob/master/src/Tests/test1/PateronRecord.php), [Reservation.php](https://github.com/AzarguNazari/PHP-To-UML/blob/master/src/Tests/test1/Reservation.php), [books.php](https://github.com/AzarguNazari/PHP-To-UML/blob/master/src/Tests/test1/books.php), [booksDB.php](https://github.com/AzarguNazari/PHP-To-UML/blob/master/src/Tests/test1/booksDB.php), [payment.php](https://github.com/AzarguNazari/PHP-To-UML/blob/master/src/Tests/test1/payment.php).
![The uploading files page](https://github.com/AzarguNazari/PHPtoUML/blob/master/snapshot/input%20option.png)

# Generating
![Generating](https://github.com/AzarguNazari/PHPtoUML/blob/master/snapshot/geneating.png)

# Outcome
![Generated UML Diagram](https://github.com/AzarguNazari/PHPtoUML/blob/master/snapshot/generatedUML.png)
