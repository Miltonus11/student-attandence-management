<?php
    //method handler
    if($_SERVER['REQUEST_METHOD']!== 'POST'){
        http_response_code(403);
        echo json_encode([
            "message" => "Invalid Method"
        ]);
        exit();
    }
    // get data
    $first_name = $_POST['firstname'];
    $middle_initial = $_POST['middle_initial'];
    $last_name = $_POST['lastname'];
    $year_level = $_POST['year_level'];
    // prepare db

    try {
        require_once("../db/conn.php");
    } catch(PDOException $e){

    }
    
?>