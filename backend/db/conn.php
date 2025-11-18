<?php
    //variables
    $host="localhost";
    $dbname="db_studentattendance";
    $username="root"; 
    $password="";
    //connection
    try{
        $conn=new PDO("mysql:host=$host;dbname=$dbname",$username,$password);
        //set the PDO error mode to exception
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        //echo "Connected successfully";
    }
    catch(PDOException $e){
        http_response_code(500);
        echo json_encode(["message"=>"Connection failed: " . $e->getMessage()]);
        exit();
    }
?>