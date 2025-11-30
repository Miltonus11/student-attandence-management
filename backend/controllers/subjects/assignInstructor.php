<?php
// Assign Instructor to subject
    header('Content-Type: application/json');

    if($_SERVER['REQUEST_METHOD'] !== 'PUT'){
        http_response_code(405);
        echo json_encode([
            "message" => "Method Not Allowed"
        ]);
        exit();
    }

    //get update input
    $selected_class = $_POST['class_id'];
    $selected_instructor = $_POST['instructor_id'];

    require_once('../../db/conn.php');
    try{
        
    } catch (PDOException $e) {

    }



?>