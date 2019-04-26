<?php
include_once("./includes/htmlMeta.php");
include_once('./includes/function.php');

if (!isset($_SESSION["user_id"])) {
    $_SESSION['error'] = "mustSignin";
    $_SESSION['direct'] = "chat.php?id=" . test_input($_GET['id']);
    header("Location: signin.php");
}

$fulInfo = getFullInfo($_SESSION['email'], $_SESSION['pass']);
$result = query("select * from communities where c_id=" . test_input($_GET['id']));
$community = mysqli_fetch_row($result);

if (count($community) == 0) {
    exit(header("Location: index.php"));
}
?>

<title><?php echo $community[1]; ?> Chat Room</title>
<link rel="stylesheet" href="assets/css/chat/chat.css" >

<style>
    .main-bg{
        background-color: #FDF6E3;
        color: #222;
    }
</style>

</head>
<body class="scroll">

    <?php
    include("./includes/header.php");
    include("./includes/profileNav.php");
    ?>

    
        <div class="container rounded">
            <div class="card my-2 main-bg">
                <div class="card-header">
                    <div class="row">
                        <div class="col">
                        </div>
                        <div class="col text-center text-success">
                            <a href="../community.php?id=<?php echo $community[0]; ?>" class="h4"><?php echo $community[1]; ?> Community</a>
                        </div>
                        <div class="col">
                        </div>
                    </div>


                </div>
            </div>


            <div id="chat_box container" class="main-bg">

                <section id="chatRoom" style="height: 350px;">
                    <div class="my-3 p-3 bg-white rounded box-shadow" id="allMessage" data-username="<?php echo $fulInfo[2]; ?>" data-cid="<?php echo $community[0]; ?>">
 
                   </div>
                
                </section>
                <div class="input-group input-group-lg mb-3">
                    <textarea type="text" class="form-control scroll main-bg" aria-label="Recipient's username" aria-describedby="basic-addon2" id="message" placeholder='Write Message...' name='message'></textarea>
                    <div class="input-group-append">
                        <button class="btn btn-outline-success" title='Send' onclick='send()'><i class="fas fa-location-arrow"></i></button>
                    </div>
                </div> 


            </div>
        </div>
        <div id="sound"></div>


    <!-- The footer part -->
    <?php include("./includes/footer.php"); ?>

     <script>
        
        var sound = $("#sound");
        var text = $("#message");
        var allMessages = $("#allMessage");
        var isScroll = true;
        
        $(document).ready(function () {
            setInterval(function(){
            $.post("chatApp/chat.php", {data: allMessages.data("cid")}, function (data) {
                scroll();
                data = $.parseJSON(data);
                var message = "";
                for (var x = 0; x < data.length; x++) {
                    message += '<div class="alert main-bg" style="box-shadow: 0 0 1px #222" role="alert">\
                                    <p><strong><a class="text-success" href="profile.php?id=<?php echo $fulInfo[0]; ?>">' + data[x][0] + '</a></strong></p>' + data[x][1] + '\
                                    <p class="text-right time">' + new Date(data[x][2]).toLocaleTimeString() + '</p></div>';
                           
                }
                $("#allMessage").html(message);
            });
            }, 1000);
        });

        function send() {
            if(text.val().trim().length > 0){
                var allData = {name : allMessages.data("username"), message: text.val(), cid: allMessages.data("cid")};
                $.post("chatApp/send.php", {data: allData}, function(a){
                    sound.html(a).hide();
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
</body>
</html>