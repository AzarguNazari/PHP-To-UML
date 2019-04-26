<?php

$con = new mysqli("localhost", "root", "", "chat");

function formatDate($date) {
    return date('g:i a', strtotime($date));
}
$date = "";
if (isset($_POST['data'])) {
    
    $cid = $_POST['data'];
    
    $query = "SELECT * FROM (
          SELECT name, msg, date
          FROM c$cid ORDER BY date 
          DESC LIMIT 20) result 
          ORDER BY date ASC";

    //$query_run   = mysqli_query($con,$query);
    
    echo json_encode(mysqli_fetch_all($con->query($query)));
}

function newMessages($row){
    return strtotime($row) >= $date;
}

    
