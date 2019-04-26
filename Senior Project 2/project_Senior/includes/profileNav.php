<?php
    include_once("function.php");
    // if the user is logged in
    if(isset($_SESSION['email']) && isset($_SESSION['pass'])){
        
        // get all the information of the user
        $info = getFullInfo($_SESSION['email'],$_SESSION['pass']);  
        echo '<div class="container mt-1 p-2 mb-1 rounded main-bg" style="box-shadow: 0 0 2px black">
            <div class="row">
                <div class="col">
                    <a href="includes/logout.php" role="button" class="btn btn-danger">Sign Out</a>
                </div>
                <div class="col text-center">

                </div>
                <div class="col">
                    <ul class="nav justify-content-end">
                        <li class="nav-item">
                            <a role="button" class="btn btn-link bg-success text-white" href="profile.php?id='.$info[0] .'">' . $info[2] . '</a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>';
    }
    
?>

