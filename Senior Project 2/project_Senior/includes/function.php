<?php
    
    /**
     * Description: This method checks the security of data and returns the safe data
     * @param type $data
     * @return type
     */
    function test_input($data) {
        $data = trim($data);
        $data = stripslashes($data);
        $data = htmlspecialchars($data);
        return $data;
    }
    
    
    function query($query){
        $con=mysqli_connect("localhost","root","","sp");        
        return $con->query($query);
    }
    
    function insert($query){
        $con=mysqli_connect("localhost","root","","sp");        
        $con->query($query);
        return $con->insert_id; 
    }
    
    function getFullInfo($email, $password){
        $email = test_input($email);
        $password = test_input($password);
        $result = query("select * from users where BINARY user_email= BINARY '$email' and BINARY user_password= BINARY '$password'");
        return mysqli_fetch_row($result);
    }
    
    function getInfoById($id){
        $id = test_input($id);
        $result = query("select * from users where user_id=$id");
        return mysqli_fetch_row($result);
    }
     