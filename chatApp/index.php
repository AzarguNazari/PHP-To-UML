<?php
session_start();
include_once 'send.php';
include_once '../includes/function.php';
if (!isset($_SESSION['email']) && isset($_SESSION['pass'])) {
    echo "Plase sign in first";
}

$fulInfo = getFullInfo($_SESSION['email'], $_SESSION['pass']);

if (count($fulInfo) == 0) {
    echo "Sorry you can't";
}

$result = query("select * from communities where c_id=" . test_input($_GET['id']));
$community = mysqli_fetch_row($result);
?>

<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <meta name="description" content="Dev Community is an online community for web developers and programmers where they can chat, exchange ideas or to generate UML diagram from PHP source code">
        <meta name="author" content="Azargul Nazari">
        <link rel="icon" href="../assets/media/images/logo.gif">
        <!-- Bootstrap core CSS -->
        <link href="../assets/css/vendor/bootstrap.css" rel="stylesheet">
        <!-- Font Awesome -->
        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.0.13/css/all.css" integrity="sha384-DNOHZ68U8hZfKXOrtjWvjxusGo9WQnrNx2sqG0tfsghAvtVlRW3tvkXWZh58N9jp" crossorigin="anonymous">
        <!-- main configuration -->
        <link rel="stylesheet" href="../assets/css/main.css" >
        <script src="../assets/js/vendor/jquery.js"></script>
        <script src="../assets/js/vendor/bootstrap.js"></script>
        <link rel="stylesheet" href="../assets/css/chat/chat.css" >
    </head>


    <body class="scroll">
        <?php
        include("../includes/header.php");
        include("../includes/profileNav.php");
        ?>


        <div class="container" >
            <div class="card my-2">
                <div class="card-header">
                    <div class="row">
                        <div class="col">
                        </div>
                        <div class="col text-center">
                            <a href="../community.php?id=<?php echo $community[0]; ?>" class="h4"><?php echo $community[1]; ?> Community</a>
                        </div>
                        <div class="col">
                        </div>
                    </div>


                </div>
            </div>


            <div id="chat_box container">

                <section id="chatRoom" style="height: 350px;">
                    <div class="my-3 p-3 bg-white rounded box-shadow" id="allMessage" data-username="<?php echo $fulInfo[0]; ?>">
 
                   </div>
                    
                </section>
                <div class="input-group input-group-lg mb-3">
                    <textarea type="text" class="form-control scroll" aria-label="Recipient's username" aria-describedby="basic-addon2" id="message" placeholder='Write Message...' name='message'></textarea>
                    <div class="input-group-append">
                        <button class="btn btn-outline-secondary" title='Send' onclick='send()'><i class="fas fa-location-arrow"></i></button>
                    </div>
                </div> 


            </div>
        </div>
        <div id="sound"></div>
    </body>

    <script>
        
        var sound = $("#sound");
        var text = $("#message");
        var allMessages = $("#allMessage");
        var isScroll = true;
        
        $(document).ready(function () {
            setInterval(function(){
            
            $.post("chat.php", function (data) {
                scroll();
                data = $.parseJSON(data);
                var message = "";
                for (var x = 0; x < data.length; x++) {
                    console.log(data[x].length);
                    message += '<div class="alert alert-primary" role="alert">\
                                    <p><strong><a href="profile.php?id="' + allMessages.data("username") + '">' + data[x][0] + '</a></strong></p>' + data[x][1] + '\
                                <p class="text-right time">' + new Date(data[x][2]).toLocaleTimeString() + '</p></div>';
                }
                $("#allMessage").html(message);
            });
            }, 1000);
        });

        function send() {
            if(text.val().trim().length > 0){
                var allData = {name : allMessages.data("username"), message: text.val()};
                $.post("send.php", {data: allData}, function(a){
                    sound.html(a);
                });
                text.val("");
            }  
        }

        $("#chatRoom").scroll(function(){
            isScroll = false;
        });

        function scroll(){
            if(isScroll){
                $("#chatRoom").scrollTop($("#chatRoom")[0].scrollHeight);   
            }
        }
    </script>
</html>