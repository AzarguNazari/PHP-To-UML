<?php
    session_start();
    unset($_SESSION);
    session_destroy();
    exit(header("Location: index.php"));
    
