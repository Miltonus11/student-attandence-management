<?php

header('Content-Type: application/json');

    if($_SERVER['REQUEST_METHOD'] !== 'POST'){
        http_response_code(405);
        echo json_encode([
            "message" => "Method Not Allowed"
        ]);
        exit();
    };

    //create a class
    $class_name = $_POST["class_name"];

    require_once('../../../db/conn.php');

    try{
        if($class_name) {
            $sql = "SELECT * from tbl_class WHERE class_name = ?";
            $stmt = $conn -> prepare($sql);
            $stmt -> execute([$class_name]);
            $class = $stmt->fetch(PDO::FETCH_ASSOC);

            if($class_name == $class['class_name']){
                http_response_code(406);
                echo json_encode([
                    "message" => "class name already exists"
                ]);
                exit();
            }
            
            // sql
            $sql = "INSERT INTO tbl_class (class_name) 
                    VALUES (:class_name)";
            // prep
            $stmt = $conn -> prepare($sql);

            // bindParam
            $stmt -> bindParam(':class_name', $class_name );

            //execute
            $stmt -> execute();

            $class_id = $conn -> lastInsertId();

            http_response_code(201);
            echo json_encode([
                "message" => "Section Added Succesfully",
                "class_id" => $class_id
            ]);
            exit();
        } else {
            http_response_code(403);
            echo json_encode([
                "message" => "Error adding a sections"
            ]);
            exit();
        }
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode([
            "message" => "error" . $e -> getMessage()
        ]);
    }
?>