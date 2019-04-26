<?php

session_start();
include("function.php");

$account;
$error = false;

if (isset($_POST['login'])) {
    $email = test_input($_POST['email']);
    $password = test_input($_POST['password']);
    
    $query="select * from user where email='$email' and password='$password'";
    
    $result = query($query);
    
    if(mysqli_num_rows($result)>0){
        $_SESSION['email'] = $email;
        $_SESSION['pass'] = $password;
        header("Location: profile.php");
        exit;
    }
    else {
        $_SESSION['error'] = "not exit";
        header("Location: ../index.php");
        exit;
    }
} 
else if (isset($_POST['register'])) {

    $email    = test_input($_POST['email']);
    $password = test_input($_POST['password']);
    $fname    = test_input($_POST['fname']);
    $lname    = test_input($_POST['lname']);

    $query="select * from user where email='$email' and password='$password'";
    
    $result = query($query);
    
    if(mysqli_num_rows($result) == 0){
        $_SESSION['error'] = "exist";
        header("Location: ../profile.php");
        exit;
    }   
    else {
        $account = "insert into user (email,password,fname,lname)"
                . "values('$email','$password','$fname','$lname')";
        $result= query($account);
        
        if (mysqli_num_rows($result) > 0) {
            $_SESSION['email'] = $email;
            $_SESSION['pass'] = $password;
            header("Location: profile.php");
            exit;
        } else {
            $_SESSION['error'] = "noInsert";
            header("Location: ../index.php");
            exit;
        }
    }
}
