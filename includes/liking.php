<?php 
   session_start();
   include_once("function.php");
   
   if(isset($_SESSION['email']) && isset($_SESSION['pass'])){
       if(isset($_REQUEST)){
            $userid = test_input($_SESSION['user_id']);
            $data = json_decode($_REQUEST['data'], true);
            $result = query("insert into likedcommunity values('$userid', '$data')");
            if($result) echo "yes";
            else echo "no";
        }
   }
   
   