<?php
    
    // INCLUDE THE <HEAD> WITH SESSION_START
    include("./includes/htmlMeta.php");
    
    // INCLUDE THE FUNCTIONALITIES OR UTILITIES
    include("./includes/function.php");
    
    // FETCH THE INFORMATION OF SESSIONED USER
    $info = getFullInfo($_SESSION['email'], $_SESSION['pass']);
    
    // IF THE PAGE IS ATTEMPTED TO BE OPENED WITHOUT AUTHORIZATION 
    if (count($info) == 0) {
        exit(header("Location: logout.php"));
    }
    
    $error = "";
    
    
    // THE UPDATE PART
    if(isset($_POST['editProfile'])){
        
        $username = test_input($_POST['username']);
        if(strlen(trim($username)) == 0){
            $error = "username";
            goto out;
        }
        
        $email    = test_input($_POST['email']);
        if(!filter_var($email, FILTER_VALIDATE_EMAIL)){
            $error = "email";
            goto out; 
        }
        
        $password = test_input($_POST['password']);
        if(strlen(trim($password)) == 0){
            $error = "password";
            goto out;
        }
        
        $about    = test_input($_POST['about']);
        
        $image    = test_input($_POST["image"]);
        
        
        $result = query("UPDATE users SET user_name='$username', user_email='$email', user_password='$password', user_about='$about', user_image='$image' where user_id=" . $info[0]);
        
        if ($result) {
            $_SESSION['username'] = $username;
            $_SESSION['pass'] = $password;
            $_SESSION['email'] = $email;
            $_SESSION['image'] = $image;
            exit(header("Location: profile.php?id=" . $info[0]));
        }
        else{
            $error = "1";
        }
    }
    out:
    
?>

<title>Profile Edit</title>

<!-- Custom styles for this template -->
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

    .avatar:hover{
        background-color: #222;
        cursor: pointer;
        opacity: 0.7;
    }
</style>
</head>

<body class="scroll main-bg">

<?php include("./includes/header.php"); ?>

    <main id="main" style="overflow: hidden">

        <?php
            
            # checking the error if the signing has some problem 
            if ($error == "1") {
                echo ' <div class="row justify-content-center">
                            <div class="col-md-6 col-sm-12">
                                <div class="alert alert-danger text-center" role="alert">
                                    Sorry, the update is not done
                                </div>
                            </div>
                        </div>';
                
            }
            
            ?>
        
        <div class="container">
            <div class="card-deck mb-3">
                <div class="card mb-4 box-shadow">
                    
                    <?php 
                        if($error != ""){
                            echo '<div class="alert alert-danger" role="alert">';
                            switch($error){
                                case "username":
                                    echo "<b>Error<b>: Please Enter a valide <b><i>username</i></b>";
                                    break;
                                case "email":
                                    echo "<b>Error<b>: Please Enter a valide <b><i>email address</i></b>";
                                    break;
                                case "password":
                                    echo "<b>Error<b>: Please Enter a valide <b><i>password</i></b>";
                                    break;
                            }
                            echo '</div>';
                        }
                       
                    ?>
                    
                        
                    
                    <div class="card-header">
                        <ul class="nav justify-content-end">
                            <a class="nav-link btn btn-outline-danger" href="logout.php">Sign Out</a>
                        </ul>
                        <h4 class="my-0 font-weight-normal"><?php echo $info[2]; ?></h4>
                    </div>
                    <div class="card-body">
                        <form action="<?php echo $_SERVER['PHP_SELF']; ?>" method="post" enctype="multipart/form-data">
                            <div class="row">
                                <div class="col">
                                    <img src="<?php echo $info[5];?>" class="img-thumbnail rounded img-fluid" width="100%" id="imageShow">
                                    <input type="text" value="<?php echo $info[5];?>" hidden name="image" id="image">
                                    <button class="btn btn-block btn-success" type="button" data-toggle="modal" data-target="#changeImage">Change Picture</button>
                                </div>
                                <div class="col">
                                    <h4 class="text-center">Profile</h4>
                                    <div class="form-group">
                                        <label for="username">User Name</label>
                                        <input type="text" class="form-control" id="username" name="username" aria-describedby="emailHelp" value="<?php echo $info[2]; ?>" required>
                                    </div>
                                    <div class="form-group">
                                        <label for="email">Email address</label>
                                        <input type="email" class="form-control" id="email" name="email" aria-describedby="emailHelp" value="<?php echo $info[1]; ?>" required>
                                    </div>
                                    <div class="form-group">
                                        <label for="password">Password</label>
                                        <div class="input-group">
                                            <input type="password" id="password" name="password" class="form-control" aria-label="Amount (to the nearest dollar)" value="<?php echo $info[4]; ?>" required>
                                            <div class="input-group-append">
                                                <span class="input-group-text btn" onclick="showPassword()"><i class="fas fa-eye" id="eye"></i></span>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="form-group">
                                        <label for="about">About</label>
                                        <textarea type="email" class="form-control" id="about" name="about" aria-describedby="emailHelp"><?php echo $info[3]; ?></textarea>
                                    </div>
                                    <button type="submit" class="btn btn-outline-success" name="editProfile">Save</button>
                                </div>


                                <div class="col">
                                </div>

                            </div>
                        </form>
                    </div>
                </div>
            </div>
            
    </main>
    
     <!-- Modal -->
    <div class="modal fade" id="changeImage" tabindex="-1" role="dialog" aria-labelledby="exampleModalLongTitle" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLongTitle">Choose Your Profile Pic</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
             <div class="row">
            <?php 
                $dir = "assets/media/images/avaters/";
                if (is_dir($dir)){
                    if ($dh = opendir($dir)){
                      while (($file = readdir($dh)) !== false){
                        if(is_file($dir . $file)){
                            echo '<div data-dismiss="modal" class="col col-sm-4 col-md-3 hoverable mt-1 mb-1" aria-label="Close">
                                <img class="img img-fluid img-thumbnail avatar" src="' . $dir . $file . '">
                             </div>';
                        }
                      }
                      closedir($dh);
                    }
                }
            ?>
        </div>
          </div>
        </div>
      </div>
    </div>

<?php include("./includes/footer.php"); ?>

    <script>
        function showPassword() {
            var password = $("#password");
            if (password.attr("type") === "password") {
                password.attr("type", "text");
                $("#eye").removeClass("fa-eye").addClass("fa-eye-slash");
            } else {
                password.attr("type", "password");
                $("#eye").removeClass("fa-eye-slash").addClass("fa-eye");
            }
        }
        
        $(".avatar").click(function(){
            var src = $(this).attr("src");
            $("#imageShow").attr("src", src);
            $("#image").val(src);
           
        });
    </script>
</body>
</html>

