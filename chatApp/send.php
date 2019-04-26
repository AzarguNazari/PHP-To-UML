<?php
$host = "localhost";
$user = "root";
$pass = "";



function formatDate($date) {
    return date('g:i a', strtotime($date));
}

if (isset($_POST['data'])) {
    
    $data = $_POST['data'];
    $cid = $data['cid'];
    $name = $data['name'];
    $message = $data['message'];
    
    $con=mysqli_connect("localhost","root","","chat");
    $result = $con->query("INSERT INTO c$cid (name,msg) VALUES ('$name','$message')");
    if ($result) {
        $con->close();
        echo json_encode("<audio src = 'chatApp/sound/134332-facebook-chat-sound.mp3' hidden='true' autoplay = 'true' /></audio>");
    }
}


