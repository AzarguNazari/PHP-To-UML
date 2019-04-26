<?php 
    include_once("./includes/htmlMeta.php");
    include_once('./includes/function.php');
    
    $result = query("select * from communities where c_id=". test_input($_GET['id']));
    $community = mysqli_fetch_row($result);
    
    if(count($community) == 0){
        exit(header("Location: index.php"));
    }
    
    $show = false;
    if(isset($_SESSION['user_id'])){
        $show = true;
    }
    
    unset($_SESSION['c_id']);
?>

        <title><?php echo $community[1]; ?> Community</title>

        <style>

            :root {
                --jumbotron-padding-y: 3rem;
            }

            footer {
                padding-top: 3rem;
                padding-bottom: 3rem;
            }

            footer p {
                margin-bottom: .25rem;
            }

            #stars > i {
                cursor: pointer;
            }
            
            .yellow{
                color: #FFFF33;
            }
            
            .black{
                color: #222;
            }
            
        </style>

    </head>





    <body class="scroll main-bg">

        <?php 
            include("./includes/header.php");
            include("./includes/profileNav.php"); 
        ?>
        
        <div class="container p-4">
            <div class="card">
                <div class="card-header text-center">
                    <div class="row">
                        <div class="col">
                        </div>
                        <div class="col text-center">
                            <a href="" class="h4" id="community" data-id="<?php echo $community[0]; ?>"><?php echo $community[1]; ?> Community</a>
                        </div>
                        <div class="col">
                            <ul class="nav justify-content-end">
                                <li class="nav-item">
                                    <a role="button" class="btn btn-success" href="addCommunity.php"><i class="fas fa-plus"></i>

                                        Add New Community</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="card-body text-muted">
                    <div class="row">
                        <div class="col-sm-4 col-md-3">
                            <div class="container rounded" style="width:200px; height: 200px; text-align: center; text-transform: uppercase; color: white" id="communityName">
                                <h1 style="position: relative; top: 35%"><?php echo $community[1]; ?></h1>
                            </div>
                            
                            <!--<img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRh2PW2G8ZNrF-j1h8sArZ6A9wuQ26uwRs9cR3MsNzrD0B-Y3gAYQ" class="img-fluid img-thumbnail" >-->
                        
                        </div>
                        <div class="col-sm-8 col-md-9">
                            <table class="table ml-2 table-bordered">
                                <tr>
                                    <th scope="row">Name </th>
                                    <td><?php echo $community[1]; ?></td>
                                </tr>
                                <tr>
                                    <th scope="row">Open Source</th>
                                    <td><?php echo $community[6]; ?></td>
                                </tr>
                                <tr>
                                    <th scope="row">Rate </th>
                                    <td>
                                        
                                        <?php
                                            $result = query("select sum(rank), count(com_id) from ranking where com_id=" . $community[0]);
                                            if($result->num_rows > 0){
                                                $row = $result->fetch_assoc();
                                                $x = (int)($row['sum(rank)']);
                                                $y = (int)($row['count(com_id)']);
                                                $stars = round($x/(($y === 0)? 1: $y));
                                                if($show){
                                                    echo '<span id="stars">';
                                                }
                                                else{
                                                    echo '<span>';
                                                }
                                                for($x = 1; $x <= 5; $x++){
                                                    if($x > $stars){
                                                        echo '<i class="fas fa-star black"></i>';
                                                    }
                                                    else{
                                                        echo '<i class="fas fa-star yellow"></i>';
                                                    }
                                                }
                                                echo "</span> ($stars)";
                                            }
                                        ?>
                                    </td>
                                </tr>
                                <tr>
                                    <th scope="row">Source Code Link </th>
                                    <td><?php echo $community[7]; ?></td>
                                </tr>
                                <tr>
                                    <th scope="row">About</th>
                                    <td><?php echo $community[4]; ?></td>
                                </tr>
                                <tr>
                                    <th scope="row">Created By </th>
                                    <td><?php echo $community[3]; ?></td>
                                </tr>

                            </table>
                            <div class="container">
                                <a href="chat.php?id=<?php echo $community[0]; ?>" role="button" class="btn btn-success"><i class="fas fa-sign-in-alt"></i>

                                    Chat Room</a>
             

                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </div>



        <?php include("./includes/footer.php"); ?>
        <script>
            $(document).ready(function () {
                $("#stars > i").mouseover(function(){
                    $(this).css("color", "yellow");
                    $(this).prevAll().css("color", "yellow");
                    $(this).nextAll().css("color", "black");
    
                }).mouseleave(function(){
                  $(this).css("color", "black");
                })
                .click(function(){
                   var rank = $("#stars > i").filter(function(){
                     return $(this).css("color") === "rgb(255, 255, 0)";
                   }).length;
                   var allData = rank + " " + $("#community").data("id");
                   $.post("includes/ranking.php", {data: allData});
                   $("#stars > i").unbind("mouseover mouseleave");
                });
                
                var colors = ["primary", "secondary", "success", "danger", "warning", "info", "dark"];
                $("#communityName").addClass("bg-" + colors[parseInt(Math.random() * 7)]);
            });
        </script>
    </body>
</html>