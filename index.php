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
            
            #gear {
               position: absolute; 
               z-index: 1000; 
               top: 0; 
               left: 0; 
               background-color: white; 
               background-color: #FDF6E3;
               background-image: url(assets/media/images/gears.gif);
               background-size: 30%;
               background-position: center center;
               background-repeat: no-repeat;
               display: none;
            }
            
            td {
                font-weight: bold;
            }
            
            .main-bg{
                background-color: #FDF6E3;
                color: #222;
            }
        </style>
    </head>
    
    <body class="scroll main-bg">
        
        <?php 
            include("includes/header.php");
        ?>
       

        <main id="main" class="">
            <section class="main-bg">
        </section>
          
            <div class="container text-center">
                    <table class="table table-dark table-bg mt-2 round">
                        <tr>
                            <td colspan="3">
                                <p><b>Note: </b> For now, we only support PHP source code</p>
                            </td>
                        </tr>
                        <tr>
                            <th class="h3">Language</th>
                            <th class="h3">UML Generator Avaiabile</th>
                            <th class="h3">Upload</th>
                        </tr>
                        <tr>
                            <td>PHP</td>
                            <td>Yes</td>
                            <td class="text-left">
                                <form class="md-form form-signin" action="uml_generator/index.php" method="post" enctype="multipart/form-data" id="umlUpload">
                                    <input name="upload[]" type="file" multiple="multiple" id="phpfile" accept=".php"/>
                                    <input type="button" class="btn btn-lg btn-success mt-2" value="Upload" id="submitButton">
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

        <div id="gear"></div>
        
        
        <?php include_once 'includes/footer.php'; ?>
        
        <script>
            $(document).ready(function(){
                $(".btn").data("toggle", "toggle");
                
                
               var gear = $("#gear").width($("body").width()).height($("body").height());
               
               $("#submitButton").click(function(){
                   if($("#phpfile").get(0).files.length === 0){
                      alert("Please upload at least one PHP file");
                   }
                   else{
                       gear.css("display", "block");
                       setTimeout(function(){
                           $("#umlUpload").submit();
                       }, 2000);
                       
                   }
               });
                
            });    
         
        
        </script>
            
        
    </body>
</html>
