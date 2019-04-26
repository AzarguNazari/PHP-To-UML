<?php
    session_start();
    unset($_SESSION['email']);
    unset($_SESSION['pass']);
    unset($_SESSION['user_id']);
    unset($_SESSION['username']);
    unset($_SESSION['image']);
    session_destroy();
    exit(header("Location: index.php"));
    
