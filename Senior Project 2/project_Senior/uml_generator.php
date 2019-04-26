<?php
    include("./includes/htmlMeta.php");
?>
        <title>UML Generator</title>


        <style>


            :root {
                --jumbotron-padding-y: 3rem;
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
            

            .file-field.big-2 .file-path-wrapper .file-path {
                height: 3.5rem;
            }
            
           
        </style>
    </head>

    <body class="scroll main-bg">
        
        <?php 
            include("includes/header.php");
        ?>
       

        <main id="main" class="">
            <section class="main-bg">
            <?php include("./includes/profileNav.php");?>
        </section>
          
            <div class="container text-center">
                    <table class="table table-bg table-dark mt-2 round">
                        <tr>
                            <td colspan="3">
                                <p><b>Note: </b> For now, we only support PHP source code</p>
                            </td>
                        </tr>
                        <tr>
                            <td>Language</td>
                            <td>UML Generator Avaiabile</td>
                            <td>Upload</td>
                        </tr>
                        <tr>
                            <td>PHP</td>
                            <td>Yes</td>
                            <td>
                                <form class="md-form form-signin" action="uml_generator/index.php" method="post" enctype="multipart/form-data">
                                    <input name="upload[]" type="file" multiple="multiple" id="phpfile" accept=".php"/>
                                    <input type="submit" class="btn btn-lg btn-success mt-2" value="Upload">
                                </form>
                            </td>
                        </tr>
                        <tr>
                            <td>Java</td>
                            <td>No</td>
                            <td>
                                <button class="btn btn-danger disabled">Upload</button>
                            </td>
                        </tr>
                        <tr>
                            <td>Python</td>
                            <td>No</td>
                            <td><button class="btn btn-danger disabled">Upload</button></td>
                        </tr>
                        <tr>
                            <td>C++</td>
                            <td>No</td>
                            <td><button class="btn btn-danger disabled">Upload</button></td>
                        </tr>
                    </table>
                    
            
            </div>
            
            
           
        </main>

        <?php include_once 'includes/footer.php'; ?>
        
        <script>
            $(document).ready(function(){
                $(".btn").data("toggle", "toggle");
            });
        </script>
            
        
    </body>
</html>
