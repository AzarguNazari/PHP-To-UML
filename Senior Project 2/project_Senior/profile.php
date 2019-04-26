<?php
    include("./includes/htmlMeta.php");
    include("./includes/function.php");
    
    $info = array();
    if(isset($_SESSION['email']) && isset($_SESSION['pass'])){
        $info = getInfoById(test_input($_GET['id']));
    }
    else{
        exit(header("Location: signin.php"));
    }
    
    if(count($info) == 0){
        exit(header("Location: signin.php"));
    }
      

?>


        <title><?php echo $info[2]; ?> Profile</title>
        <style>

            :root {
                --jumbotron-padding-y: 3rem;
            }

            #main {
                padding: 50px 0;
                overflow: scroll;
            }
            
            .main-bg{
                background-color: #FDF6E3;
                color: #222;
            }

        </style>
    </head>

    <body class="scroll main-bg">

        <?php include("./includes/header.php"); ?>
        
        <main id="main" style="overflow: hidden">
            
            <div class="container">
                <div class="card-deck mb-3">
                    <div class="card mb-4 box-shadow">
                       
                        <div class="card-header">
                             <ul class="nav justify-content-end">
                            <a class="nav-link btn btn-outline-danger" href="logout.php">Sign Out</a>
                        </ul>
                            <h4 class="my-0 font-weight-normal"><?php echo $info[2]; ?></h4>
                        </div>
                        <div class="card-body">
                            <div class="row">
                                <div class="col-sm-6 col-md-4 p-5">
                                    <img src="<?php echo $info[5];?>" class="img-thumbnail rounded img-fluid" >
                                </div>
                                <div class="col-sm-6 col-md-4">
                                    <h4 class="text-center">Profile</h4>
                                    <p class="lead"><b>Name:</b> <?php echo $info[2]; ?></p>
                                    <p class="lead"><b>Email:</b> <?php echo $info[1]; ?> </p>
                                    <p class="lead"><b>About:</b> <?php echo $info[3]; ?></p>
                                    <a class="btn btn-outline-success" role="button" href="profileEdit.php">Edit Profile</a>
                                </div>
                                <div class="col-sm-6 col-md-4">
                                    <h4 class="text-center">Favorite Communities</h4>
                                    <?php 
                                        
                                        $result = query("select * from likedcommunity where user_id=" . $info[0]);
                                        while ($row = mysqli_fetch_row($result)) {
                                            $r = mysqli_fetch_row(query("select * from communities where c_id=" . $row[1]));
                                            echo printLikedCommunities($r);
                                        }
                                        
                                        function printLikedCommunities($row){
                                            return '<div class="alert alert-success alert-dismissible fade show m-1" role="alert" style="display:inline-block">
                                                    <strong><a href="chat.php?id=' . $row[0] . '">' . $row[1] . '</a></strong>
                                                    <button type="button" class="close" data-dismiss="alert" aria-label="Close" onclick="removeFavorite('.$row[0].')" >
                                                      <span aria-hidden="true" title="Unfavorite ' . $row[1] . '">&times;</span>
                                                    </button>
                                                  </div>';
                                        }
                                    ?>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

        </main>

        <?php include("./includes/footer.php"); ?>
        
        <script>
            $(".btn").addClass("btn-success");
            function removeFavorite(cid){
                $.post("includes/removeFavoriteCommunity.php", {data: cid});
            }
        </script>
    </body>
</html>
