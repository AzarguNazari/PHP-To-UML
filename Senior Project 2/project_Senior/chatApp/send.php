<?php
$host = "localhost";
$user = "root";
$pass = "";



function formatDate($date) {
    return date('g:i a', strtotime($date));
}

if (isset($_POST['data'])) {
    
    $data = $_POST['data'];
    $db_name = $data['dname'];
    $name = $data['name'];
    $message = $data['message'];
    
    $con = new mysqli($host, $user, $pass, "chat");
    $query_1 = "INSERT INTO chat_info (name,msg) VALUES ('$name','$message')";
    $query_run = mysqli_query($con, $query_1);

    if ($query_run) {
        echo json_encode("<audio src = 'chatApp/sound/134332-facebook-chat-sound.mp3' hidden = 'true' autoplay = 'true' /></audio>");
    }
}


