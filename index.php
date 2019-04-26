<?php
    include("./includes/htmlMeta.php");
?>

<title>Dev Community</title>

<style>
    :root {
        --jumbotron-padding-y: 3rem;
    }

    .jumbotron {
        padding-top: var(--jumbotron-padding-y);
        padding-bottom: var(--jumbotron-padding-y);
        margin-bottom: 0;
        background-color: #fff;
    }
    @media (min-width: 768px) {
        .jumbotron {
            padding-top: calc(var(--jumbotron-padding-y) * 2);
            padding-bottom: calc(var(--jumbotron-padding-y) * 2);
        }
    }

    .jumbotron p:last-child {
        margin-bottom: 0;
    }

    .jumbotron-heading {
        font-weight: 300;
    }

    .jumbotron .container {
        max-width: 40rem;
    }

    .box-shadow { box-shadow: 0 .25rem .75rem rgba(0, 0, 0, .05); }

    p.card-text{
        height: 100px;
        overflow-y: hidden;
    }
    
    .main-bg{
        background-color: #FDF6E3;
        color: #222;
    }
    
    body{
        font-family: 'Lato', sans-serif;
    }

</style>
</head>

<body class="scroll main-bg">

    <?php
        //  The top header part (3 buttons)
         include("./includes/header.php");
    ?>


    <main role="main">
        <section class=" pt-2">
            <?php include("./includes/profileNav.php");
            ?>
        </section>
        <section class="jumbotron text-center text-white" style="background-color: inherit;background-image: url(assets/media/images/mainBG.jpg); background-size: contain; background-repeat:no-repeat; background-position: center center">
            <div class="container" style="height: 200px;">
                <p style="position: relative; top: 240px">
                    <a href="addCommunity.php" class="btn btn-success my-2">Create Community</a>
                    <a href="signin.php" class="btn btn-success my-2">Sign In / Sign Up</a>
                    <a href="uml_generator.php" class="btn btn-success my-2">Genarate Your UML</a>
                </p>
                </div>
               
            </div>
        </section>

        <div class="album py-5">
            <div class="container">
                <form action="<?php echo $_SERVER['PHP_SELF']; ?>" method="get">
                    <div class="row justify-content-md-center mb-2">
                        <div class="col-md-8">
                            <div class="input-group mb-3">
                                <input type="search" class="form-control text-center lead border-secondary" placeholder="Search Community" style="font-size: 25px; outline: 0" id="search" name="search">
                                <input type="submit" value="search" class="btn btn-success">
                            </div>
                        </div>
                    </div>
                </form>
                <div class="row" id="communityList">
                    <?php
                    include_once './includes/function.php';

                    if (isset($_GET["search"])) {
                        $data = test_input($_GET["search"]);
                        $result = query("select * from communities where c_name='$data'");

                        if (count($result) == 0) {
                            echo "<h1 class='text-center'>Sorry! this communicty doesn't exist</h1>";
                        } else {
                            while ($row = $result->fetch_assoc()) {
                                echo printResult($row);
                            }
                        }
                    } else {

                        $result = query("select * from communities limit 8");
                        
                        if (count($result) == 0) {
                            echo "<h1 class='text-center'>Sorry! this communicty doesn't exist</h1>";
                        } else {
                            while ($row = $result->fetch_assoc()) {
                                echo printResult($row);
                            }
                        }
                    }
                    
                    function stars($nubmer){
                        $output = "";
                        for($x = 0; $x < $nubmer; $x++){
                            $output .= '<i class="fas fa-star" style="color: yellow"></i>';
                        }
                        for($x = $nubmer; $x < 5; $x++){
                            $output .= '<i class="fas fa-star" style="color: white"></i>';
                        }
                        return $output;
                    }
                    
                    function printResult($rowRecord){
                        $rank = 0;
                        $result = query("select sum(rank), count(com_id) from ranking where com_id=" . $rowRecord['c_id']);
                        if($result->num_rows > 0){
                            $row = $result->fetch_assoc();
                            $x = (int)($row['sum(rank)']);
                            $y = (int)($row['count(com_id)']);
                            $rank = round($x/(($y === 0)? 1: $y));
                        }
                        
                         return '<div class="col-md-3 communityDoor">
                                    <div class="card mb-4 box-shadow bg-dark text-white community" data-cid="'. $rowRecord['c_id'] .'">
                                        <div class="card-header text-center border-white">
                                            <h3><a class="text-white communityName" href="community.php?id=' . $rowRecord['c_id'] . '">' . $rowRecord["c_name"] . '</a></h3>
                                            <h5>' . stars($rank) . '</h5>
                                        </div>
                                        <div class="card-body">
                                            <p class="card-text communityAbout">' . $rowRecord["c_about"] . '</p>
                                            <div class="d-flex justify-content-between align-items-center">
                                                <a role="button" class="btn btn-block mr-1 btn-outline-success communityChat" href="chat.php?id='.$rowRecord["c_id"].'">Chat Room</a>
                                                <button type="button" class="btn btn-lg border-0" style="background-color: transparent"><i class="fas fa-heart" style="color:white"></i></button>
                                            </div>
                                        </div>
                                    </div>
                                </div>';
                    }
                    ?>
                </div>
            </div>
        </div>

    </main>

<?php include("./includes/footer.php"); ?>
    
    <script>
       $(document).ready(function(){ 
           
           $(".btn").data("toggle", "toggle");
           
           var community = $(".community");
           community.find(".fa-heart").click(function(){
               var communityID = $(this).parents(".community").data("cid");
               var $this = $(this);
                $.post("includes/liking.php", {data: communityID}, function(data){
                    if(data === "yes"){
                        $this.css("color", "red");
                    }
                    else{
                        $this.css("color", "white");
                    }
                    $this.unbind("click");
                });
           });
           
          
       });    
    </script>
    
</body>
</html>
