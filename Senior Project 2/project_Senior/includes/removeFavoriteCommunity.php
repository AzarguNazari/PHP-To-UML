<?php
   session_start();
   include_once("function.php");
   
   if(isset($_REQUEST)){
       
       $id = json_decode($_REQUEST['data'], true);
       $userid = test_input($_SESSION['user_id']);
       $result = query("delete from likedcommunity where user_id=$userid and c_id=$id");
       if($result === TRUE){
           json_encode("yes");
       }
       else{
           json_encode("no");
       }
   }