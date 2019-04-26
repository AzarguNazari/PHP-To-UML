<?php
    
    // search for community
    if(isset($_POST)){
        include("function.php");
        
        $command = test_input($_POST['command']);
        switch($command){
            
            case "search":
                $data = $_POST['data'];         // securing the data
                $result = query("select * from communities where c_name like '%".$data."' or c_name like '%".$data."%' limit 8");
                echo json_encode(mysqli_fetch_all($result));
                break;
            
            case "load8":
                $result = query("select * from communities limit 8");
                echo json_encode(mysqli_fetch_all($result));
                break;
            
        }
        
        
    }