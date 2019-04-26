<?php 
    include_once("./includes/htmlMeta.php");
    include_once('./includes/function.php');
    
    $result = query("select * from communities where c_id=". test_input($_GET['id']));
    $community = mysqli_fetch_row($result);
    
    if(count($community) == 0){
        exit(header("Location: index.php"));
    }
    
    unset($_SESSION['c_id']);
?>

        <title><?php echo $community[1]; ?> Community</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/rateYo/2.3.2/jquery.rateyo.min.css">

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

            .heart {
                color: #ddd;
            }
            .heart:hover {
                color: #dc3545;
            }
            .heart:active{
                border: none;
                outline: none;
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
                            <a href="" class="h4"><?php echo $community[1]; ?> Community</a>
                        </div>
                        <div class="col">
                            <ul class="nav justify-content-end">
                                <li class="nav-item">
                                    <a role="button" class="btn btn-success" href="includes/logout.php"><i class="fas fa-plus"></i>

                                        Add New Community</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="card-body text-muted">
                    <div class="row">
                        <div class="col-sm-12 col-md-3">
                            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRh2PW2G8ZNrF-j1h8sArZ6A9wuQ26uwRs9cR3MsNzrD0B-Y3gAYQ" class="img-fluid img-thumbnail" >
                        </div>
                        <div class="rest">
                            <table class="table ml-2 table-bordered">
                                <tr>
                                    <th scope="row">Name </th>
                                    <td><?php echo $community[1]; ?></td>
                                </tr>
                                <tr>
                                    <th scope="row">Open Source</th>
                                    <td><?php echo $community[7]; ?></td>
                                </tr>
                                <tr>
                                    <th scope="row">Rate </th>
                                    <td><?php echo $community[5]; ?></td>
                                </tr>
                                <tr>
                                    <th scope="row">Source Code Link </th>
                                    <td><?php echo $community[8]; ?></td>
                                </tr>
                                <tr>
                                    <th scope="row">Total Participants </th>
                                    <td><?php echo $community[6]; ?></td>
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

                                    Join</a>
                                <button title="Add To Favorite List" type="button" class="btn btn-lg border-0" style="background-color: transparent"><i class="fas fa-heart heart"></i></button>

                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </div>



        <?php include("./includes/footer.php"); ?>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/rateYo/2.3.2/jquery.rateyo.min.js"></script>
        <script>
            $(document).ready(function () {

                $.each($(".rateYo"), function () {
                    $(this).rateYo({
                        rating: parseFloat($(this).data("rate"))
                    });
                });

            });
        </script>
    </body>
</html>