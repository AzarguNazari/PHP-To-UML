<?php
    include_once("./includes/htmlMeta.php");    // head of page
    include_once("./includes/function.php");    // import functions
/*
if(!(isset($_SESSION['email']) || isset($_SESSION['pass']))){ // if user is not signed in
    $_SESSION['r_from_page'] = "addCommunity"; // to bring back the page after signing in
    exit(header("Location: signin.php"));
}*/

$error = "";
    
    // to register a new community
if (isset($_POST['communityRegister'])) { 
    
    #Community's information for signing up
    $c_name = test_input($_POST['cname']);
    $c_catagory = test_input($_POST['catagory']);
    $c_about = test_input($_POST['about']);
    $c_opensource = test_input($_POST['opensource']);
    $c_link = test_input($_POST['clink']);
    
    // fetching the username (creator of community)
    
    $c_creator = test_input($_SESSION['username']);
    $c_image = $_FILES['image']['tmp_name'];
    
    $con = mysqli_connect("localhost","root","","sp");
    $result = $con->query("insert into communities (c_creator, c_name, c_catagory, c_about, c_opensource, c_link) values('$c_creator', '$c_name', '$c_catagory','$c_about', '$c_opensource', '$c_link')");
    
    #if the community is inserted successfully
    if ($result) {
        echo 'yes';
        $id = $con->insert_id;
        $con = new mysqli("localhost", "root", "", "chat");
        $result = $con->query("create table c" . $id . " (id int(11) primary key,name varchar(255), msg varchar(255), date timestamp )");
        if($result){
            $con->close();
            exit(header("Location: chat.php?id=c" . $id));
        }
        else{
            $error = "1";
        }
    } else {
        $error = "1";
    }
}
?>

<title>Add Community</title>
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
    .main-bg{
                background-color: #FDF6E3;
                color: #222;
            }
</style>

</head>





<body class="scroll main-bg">

<?php include_once("./includes/header.php"); ?>

    <?php
            
            # checking the error if the signing has some problem 
            if ($error === "1") {
                echo ' <div class="row justify-content-center mt-2">
                            <div class="col-md-6 col-sm-12">
                                <div class="alert alert-danger text-center" role="alert">
                                   <strong><i class="fas fa-exclamation-circle"></i></strong> Sorry there is some problem in database
                                </div>
                            </div>
                        </div>';
            }
            ?>
    <?php include_once("./includes/profileNav.php"); ?>

    <div class="container p-4">
        <div class="card">
            <div class="card-header text-center">
                <div class="row justify-content-md-center">
                    <div class="col text-center">
                        <h4>Add New Community</h4>
                    </div>
                </div>
            </div>
            <div class="card-body text-muted">
                <form action="<?php echo $_SERVER['PHP_SELF']; ?>" method="post" enctype="multipart/form-data">
                    <div class="row justify-content-md-center">
                        <div class="col"></div>
                        <div class="col-sm-12 col-md-8">
                            <div class="form-group">
                                <label for="username">Community Name</label>
                                <input type="text" class="form-control" id="cname" name="cname" aria-describedby="community Name" placeholder="Java, jQuery,..">
<!--                                <label class="text-danger d-none" id="communityNameError"><p><b>Hello world</b></p></label>-->
                            </div>
                            <div class="form-group">
                                <label for="ctype">Catagory</label>
                                <select name="catagory" class="form-control" id="ctype">
                                    <option values="language">Language</option>
                                    <option values="library">Library</option>
                                </select>
                            </div>

                            <div class="form-group">
                                <label for="about">About</label>
                                <textarea type="email" class="form-control" id="about" name="about" aria-describedby="emailHelp"></textarea>
                            </div>
                            
                            <div class="form-check">
                                <span class="h5">Is Open source? 
                               <div class="custom-control custom-radio custom-control-inline">
                                    <input type="radio" id="yes" name="opensource" value="yes" class="custom-control-input">
                                    <label class="custom-control-label head" for="yes">Yes</label>
                                    </div>
                                    <div class="custom-control custom-radio custom-control-inline">
                                    <input type="radio" id="no" name="opensource" value="no" class="custom-control-input">
                                    <label class="custom-control-label" for="no">No</label>
                                </div>
                                    </span>
                            </div>
                            <div class="form-group mt-2" style="display: none;" id="openSource">
                                <label for="username">Open Source Link</label>
                                <input type="text" class="form-control" id="clink" name="clink" aria-describedby="open source link" placeholder="https://github.com/jquery/jquery">
                            </div>
                            <div class="custom-file mt-1">
                                <input type="file" name="image" class="custom-file-input" id="image">
                                <label class="custom-file-label" for="validatedCustomFile">Choose community image or logo</label>
                            </div>

                            <div class="container mt-1 text-center">
                                <button type="submit" class="btn btn-success p-3" name="communityRegister"><i class="fas fa-plus"></i> Register</button>
                            </div>

                        </div>
                        <div class="col"></div>
                    </div>
                  
                </form>
            </div>
        </div>
    </div>



<?php include("./includes/footer.php"); ?>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/rateYo/2.3.2/jquery.rateyo.min.js"></script>
    <script>
        $(document).ready(function () {

            $.each($(".rateYo"), function () {
                $(this).rateYo({
                    rating: 4.5
                });
            });
            
            $('input[type=radio][name=opensource]').change(function() {
                if (this.value == 'yes') {
                    $("#openSource").show(300);
                }
                else{
                    $("#openSource").hide(300);
                }
            });
        });
        
    </script>
</body>
</html>