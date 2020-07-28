<?php

   function printAllFunction($allUML){
       foreach($allUML as $uml){
            if($uml instanceof plPhpClass){
                
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
                    echo "[" . $className . "]-->[" . $interface->__get("name") . "]\n";  
                }

                
            }
            else if($uml instanceof plPhpInterface){
                
                $interfaceName = $uml->__get("name");
                echo "[<abstract><" . $interfaceName . ">"; 
                 // adding functions
                $interfaceFunctions = $uml->__get("functions");
                $funcLength = count($interfaceFunctions);
                
                if($funcLength == 0){
                    echo "]";
                }
                else{
                    echo "|";
                    printFunction($interfaceFunctions);
                    echo "]\n";
                }
                
       
        }
            
        
            
        
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
            $parLength = count($params);            // Number of parameters
            
            // No parameters and should be closed 
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