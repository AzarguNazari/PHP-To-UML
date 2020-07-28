<?php
    include("./includes/htmlMeta.php");
?>
        <title>UML Generator</title>
        <link rel="stylesheet" href="assets/css/mainPage.css">
    </head>
    
    <body class="scroll main-bg">
        
        <?php 
            include("includes/header.php");
        ?>
       

        <main id="main"  style="min-height: 650px;">
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
