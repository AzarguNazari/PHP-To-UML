<?php
   
    include("./includes/htmlMeta.php"); // include the <head> & session_start() part
    include("./includes/function.php"); // adding necesary part for necessary database

    
    // temp variables
    $name = $email = $password = $error = "";
    
    if (isset($_POST['signin'])) {
        
        $result = getFullInfo($_POST['inputEmail'],$_POST['inputPassword']); // To check if the user's account exist or not

        // if exists then store the information into session
        if(count($result) > 0) {
            $_SESSION['user_id'] = $result[0];
            $_SESSION['email']   = $result[1];
            $_SESSION['pass']    = $result[4];
            $_SESSION['username'] = $result[2];
            $_SESSION['image'] = $result[5];
            
            if(isset($_SESSION['error'])){
                switch($_SESSION['error']){
                    case "mustSignin":
                        $directTo = $_SESSION['direct'];
                        unset($_SESSION['direct']);
                        unset($_SESSION['error']);
                        exit(header("Location: $directTo"));
                        break;
                }
                exit(header("Location: profile.php?id=" . $result[0]));
            }
            else{
                 exit(header("Location: profile.php?id=" . $result[0]));
            }
            
        } else {
            // else it's an error that indicates the user doesn't have account or the email or password is wrong
            $error = "1";
        }
    }
    
    if(isset($_POST['signup'])) {

        $name = test_input($_POST['inputUsername']);
        $email = test_input($_POST['inputEmail']);
        $password = test_input($_POST['inputPassword']);

        $result = insert("insert into users (user_name, user_email, user_password) values('$name', '$email','$password')"); // to insert the data recieved from user
        
        //if the data is inserted, store the information into session
        if ($result != 0) {
            $_SESSION['email'] = $email;
            $_SESSION['pass'] = $password;
            $_SESSION['user_id'] = $result;
            exit(header("Location: profile.php?id=$result"));
        } else {
            // otherwise mark it as an error
            $error = "2";
        }
    }
    

?>

        <title>Sign In | Sign Up</title>
        
        
        <style>


            :root {
                --jumbotron-padding-y: 3rem;
            }

            #main {
                padding: 100px 0;
            }

            .form-signin {
                width: 100%;
                max-width: 330px;
                padding: 15px;
                margin: auto;
            }
            .form-signin .checkbox {
                font-weight: 400;
            }
            .form-signin .form-control {
                position: relative;
                box-sizing: border-box;
                height: auto;
                padding: 10px;
                font-size: 16px;
            }
            .form-signin .form-control:focus {
                z-index: 2;
            }
            .form-signin input[type="email"] {
                margin-bottom: -1px;
                border-bottom-right-radius: 0;
                border-bottom-left-radius: 0;
            }
            .form-signin input[type="password"] {
                margin-bottom: 10px;
                border-top-left-radius: 0;
                border-top-right-radius: 0;
            }
            
            .main-bg{
                background-color: #FDF6E3;
                color: #222;
            }
        </style>
    </head>

    <body class="scroll main-bg">

         <?php include("./includes/header.php"); ?>

        <main id="main">

            <?php
            
            # checking the error if the signing has some problem 
            if ($error != "" || isset($_SESSION['error'])) {
                echo ' <div class="row justify-content-center">
                            <div class="col-md-6 col-sm-12">
                                <div class="alert alert-danger text-center" role="alert">';
                if(isset($_SESSION["error"])){
                    echo "Sorry, please signin first";
                }
                else{
                    switch ($error) {
                        case "1":
                            echo "Sorry you have entered the wrong email or password";
                            break;
                        case "2":
                            echo "Sorry we couldn't add your record";
                            break;
                    }
                }
                echo            '</div>
                            </div>
                        </div>';
                
            }
            
            ?>

            <div class="row justify-content-center">
                <div class="col-md-4 col-sm-12">
                    <form class="form-signin" action="<?php echo $_SERVER['PHP_SELF']; ?>" method="post">
                        <h1 class="h3 mb-3 font-weight-normal text-center">Sign In</h1>
                        <label for="inputEmail" class="sr-only">Email address</label>
                        <input type="email" id="inputEmail1" name="inputEmail" class="form-control mb-2" placeholder="Email address" required autofocus>
                        <label for="inputPassword" class="sr-only">Password</label>
                        <input type="password" id="inputPassword" name="inputPassword" class="form-control" placeholder="Password" required>
                        <div class="checkbox mb-3">
                            <label>
                                <input type="checkbox" value="remember-me"> Remember me
                            </label>
                        </div>
                        <button class="btn btn-lg btn-success btn-block" type="submit" name="signin">Sign in</button>
                    </form>
                </div>
                <div class="col-md-4 col-sm-12">
                    <form class="form-signin" action="<?php echo $_SERVER['PHP_SELF']; ?>" method="post">
                        <h1 class="h3 mb-3 font-weight-normal text-center">Sign Up</h1>
                        <label for="inputUsername" class="sr-only">User Name</label>
                        <input type="text" id="inputUsername" name="inputUsername" class="form-control mb-2" placeholder="User Name" required autofocus>
                        <label for="inputEmail" class="sr-only">Email address</label>
                        <input type="email" id="inputEmail2" name="inputEmail" class="form-control mb-2" placeholder="Email address" required>
                        <label for="inputPassword" class="sr-only">Password</label>
                        <input type="password" id="inputPassword" name="inputPassword" class="form-control" placeholder="Password" required>
                        <button class="btn btn-lg btn-success btn-block" type="submit" name="signup">Register</button>
                    </form>
                </div>
            </div>



        </main>
        
        <!-- footer part -->
        <?php include("./includes/footer.php"); ?>
    </body>
</html>
