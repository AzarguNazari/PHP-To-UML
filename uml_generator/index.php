<?php 
    session_start();
    
    $totalFiles = array();
    if (isset($_FILES['upload']['name'])) {
        $total = count($_FILES['upload']['name']);
        for ($i = 0; $i < $total; $i++) {
            array_push($totalFiles, $_FILES['upload']['tmp_name'][$i]);
        }
    }
?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="A tool for drawing sassy UML diagrams based on syntax. Provides instant feedback and has a customizable styling.">
    <title>PHP UML Generator</title>
    <link rel="stylesheet" href="codemirror/codemirror.css">
    <link rel="stylesheet" href="codemirror/solarized.nomnoml.css">
    <link rel="stylesheet" href="nomnoml.css">
    <link rel="shortcut icon" href="favicon.png">
    <style>
    .CodeMirror-sizer{display: none;}
    </style>
</head>
<body onload="javascript:nomnoml.discardCurrentGraph()">
	<div class="wrap">

		<canvas id="canvas"></canvas>
                
		<textarea id="textarea" spellcheck="false"></textarea>
		<div id="linenumbers"></div>
		<div id="canvas-panner"></div>

                <!-- the introduction side --->
		<div id="about" class="sidebar">
			<div class="content">
				<p>Hello, this is PHP 5.0 UML generator, my senior project at FCIT (Faculty of Computing and Information Technology)
                                <p>Created by <a href="mailto:nazariazargulazargul@gmail.com"><b>Hazar Gul Nazari</b></a></p>
				<hr>
                                
                                <div style="text-align: center; color: #222">
                                    <h2>Project Contributors</h2>
                                    <img src="../resume/medesaturated.jpg" width="50%" style="border-radius: 50%">
                                    <p><b>Hazar Gul</b></p>
                                    <p>Undergradate Student in King Abdulaziz University and this senior project is developed by Hazargul Nazari</p>
                                    <img src="../resume/drfathydesaturated.png" width="50%" style="border-radius: 50%">
                                    <p><b>Prof. Fathy Eassa</b></p>
                                    <p>Professor Fathy Eassa is the main supervisor for this senior project</p>
                                    <img src="../resume/drkamaldesaturated.png" width="50%" style="border-radius: 50%">
                                    <p><b>Prof. Kamal Jambi</b></p>
                                    <p>Professor Jambi is the co-supervisor for this senior project</p>
                                </div>
                                
                                <h2>Interaction</h2>
				<p>The canvas can be panned and zoomed by dragging and scrolling in the right hand third of the canvas.
				</p>
				<p>Downloaded image files will be given the filename in the <tt>#title</tt> directive.
				</p>

				<hr>
			</div>
			<div class="logo-background"></div>
		</div>

		<div id="linemarker"></div>

		<div class="tools">
			<a class="logo" href="javascript:void(0)" onclick="nomnoml.toggleSidebar('about')" title="About nomnoml"><h1>UML Generator</h1> &nbsp;</a>
			<a href="javascript:void(0)" onclick="nomnoml.toggleSidebar('about')" title="About PHP 5.0 UML Generator">
				<img src="img/info-large.png">
			</a>
			<a id="savebutton" href="javascript:void(0)" download="nomnoml.png" title="Download snapshot of this diagram">
				<img src="img/camera.png">
			</a>
			<a id="linkbutton" href="javascript:void(0)" target="_blank" title="Shareable link to this diagram">
				<img src="img/link.png">
			</a>
			<span id="tooltip"></span>
			<span id="storage-status">
				View mode, changes are not saved.
				<a href="javascript:nomnoml.saveViewModeToStorage()"
				   title="Save this diagram to localStorage">save</a>
				<a href="javascript:nomnoml.exitViewMode()"
				   title="Discard this diagram">close</a>
			</span>

			<div class="canvas-tools" id="canvas-tools">
				<a href="javascript:nomnoml.magnifyViewport(2)" title="Zoom in">
					<img src="img/plus.png">
				</a>
				<a href="javascript:nomnoml.resetViewport()" title="Reset zoom and panning">
					<img src="img/equals.png">
				</a>
				<a href="javascript:nomnoml.magnifyViewport(-2)" title="Zoom out">
					<img src="img/minus.png">
				</a>
			</div>
		</div>
	</div>
 
    <?php
        
    echo '<script type="text/vnd.nomnoml.class" id="defaultGraph">';
    
        require './php/tokenparser.php';
        
        $p = new StructureTokenparserGenerator();
        $allUML = $p->createStructure($totalFiles);
    
        
        foreach($allUML as $uml){
            if($uml instanceof ClassInformation){
                
                // getting class Name
                $className = $uml->__get("name");
                
                // adding class
                echo "[" . $className;
                
                 // adding varibles
                $classAttributes = $uml->__get("attributes");
                $length = count($classAttributes);
                
                if($length > 0){
                    echo "|";
                    for($x = 0; $x < $length - 1; $x++){
                        $attribute = $classAttributes[$x];
                        printModifier($attribute->__get("modifier"));  // for printing the modfiers
                        echo $attribute->__get("name") . ";";
                    }
                    $attribute = $classAttributes[$length - 1];
                    echo $attribute->__get("name");
                }
                
                // adding functions
                $clasFunctions = $uml->__get("functions");
                printFunction($clasFunctions);
                
                
                $extends = $uml->__get("extends");
                
                // Connecting the extends 
                if(!is_null($extends)){
                   echo "[" . $className . "]-:>[" . $extends->__get("name") . "]\n";   
                }
                
                // Connecting the Implements
                $implements = $uml->__get("implements");
                
                foreach($implements as $interface){      
                    echo "[" . $className . "]--:>[<abstract><" . $interface->__get("name") . ">]\n";  
                }

                
            }
            else if($uml instanceof InterfaceInformation){
                
                $interfaceName = $uml->__get("name");
                echo "[<abstract><" . $interfaceName . ">"; 
                 // adding functions
                $interfaceFunctions = $uml->__get("functions");
                printFunction($interfaceFunctions);
                
       
        }
            
        
            
        
        }
        
        /**
        * This method is for printing the Methods (Functions) of a class of interface 
        * @param type $functions all the functions to be printed
        */
       function printFunction($functions){

           // Total number of functions
           $funcLength = count($functions);
           
            if($funcLength == 0){
                echo "]\n";
            }
            else{
                echo "|";
                
                // Loop through length - 1
                for($x = 0; $x < $funcLength - 1; $x++){

                    $function = $functions[$x];

                    // Print the modifer of the function (+,-,#)
                    printModifier($function->__get("modifier"));    // for printing the modfiers

                    // Print the function name with all the parmbers
                    echo $function->__get("name") . "(";
                    
                    if(count($function->__get("params")) === 0){
                        echo ");";
                    }
                    else{
                         // Total number of parambers
                        printParambers($function->__get("params"));
                        echo ";";
                    }
                }

                // The remaining last function to be closed 
                $function = $functions[$funcLength - 1];

                // Print the modifer of the function
                printModifier($function->__get("modifier"));    // for printing the modfiers
                echo $function->__get("name") . "(";
                if(count($function->__get("params")) === 0){
                    echo ")";
                }
                else{
                     // Total number of parambers
                    printParambers($function->__get("params"));
                   
                }
                
                
                echo "]\n";
            }
           
       }
        
        
        /**
         * This method is for printing the parameters of a method(s)
         * @param type $params total number of parameters to be printed
         */
        function printParambers($params){
            $parLength = count($params);
            if($parLength == 0){
                echo ")";
            }
            else{
                for($parCounter = 0; $parCounter < $parLength - 1; $parCounter++){
                    $par = $params[$parCounter];
                    echo $par->__get("type") . " " . $par->__get("name") . ",";
                }
                $par = $params[$parLength - 1];
                echo $par->__get("type") . " " . $par->__get("name") . ")";
            }
        }
        
        
        /**
         * This method is used for printing the modifiers (Public, Private or Protected)
         * @param type $modifer the medifer 
         */
        function printModifier($modifer){
            if($modifer === "public"){
                echo "+ ";
            }
            else if($modifer === "private"){
                echo "- ";
            }
            else{
                echo "# ";
            }
        }
        
        
    echo '</script>'; ?>

	<script src="lib/zepto.min.js"></script>
	<script src="lib/lodash.min.js"></script>
	<script src="lib/dagre.min.js"></script>
	<script src="skanaar.canvas.js"></script>
	<script src="skanaar.svg.js"></script>
	<script src="codemirror/codemirror-compressed.js"></script>
	<script src="codemirror/nomnoml.codemirror-mode.js"></script>
	<script src="skanaar.util.js"></script>
	<script src="skanaar.vector.js"></script>
	<script src="nomnoml.jison.js"></script>
	<script src="nomnoml.parser.js"></script>
	<script src="nomnoml.visuals.js"></script>
	<script src="nomnoml.layouter.js"></script>
	<script src="nomnoml.renderer.js"></script>
	<script src="nomnoml.js"></script>
	<script src="nomnoml.app.js"></script>

</body>
</html>