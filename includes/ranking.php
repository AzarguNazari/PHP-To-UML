<?php 
   session_start();
   include_once("function.php");
   
   if(isset($_SESSION['email']) && isset($_SESSION['pass'])){
       if(isset($_POST)){
            $userid = test_input($_SESSION['user_id']);
            $data = explode( ' ', test_input($_POST['data']));
            $ranking = $data[0];
            $communityId = $data[1];
            $result = query("select rank from ranking where com_id=$communityId and user_id=$userid");
            if($result->num_rows > 0){
                query("update ranking set rank=$ranking where com_id=$communityId and user_id=$userid");
            }
            else{
                query("insert into ranking values('$communityId', '$userid', '$ranking')");
            }
            
                
        }
   }
   