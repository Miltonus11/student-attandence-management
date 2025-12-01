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
    $subject_code = $_POST["subject_code"];
    $subject_name = $_POST["subject_name"];


    require_once('../../../db/conn.php');

    try{
        if($subject_code && $subject_name) {
            $sql = "SELECT * from tbl_subjects WHERE subject_code = ?";
            $stmt = $conn -> prepare($sql);
            $stmt -> execute([$subject_code]);
            $subject = $stmt->fetch(PDO::FETCH_ASSOC);
            
            //verify if the subject exist through the subject code
            //also check if the given is array
            if ($subject && $subject_code == $subject['subject_code']){
                http_response_code(406);
                echo json_encode([
                    "message" => "Subject  already exists"
                ]);
                exit();
            }
            //double verification
            if ($subject && $subject_name == $subject['subject_name']){
                http_response_code(406);
                echo json_encode([
                    "message" => "Subject  already exists"
                ]);
                exit();
            }
            
            // sql
            $sql = "INSERT INTO tbl_subjects (subject_code, subject_name) 
                    VALUES (:subject_code, :subject_name)";
            // prep
            $stmt = $conn -> prepare($sql);

            // bindParam
            $stmt -> bindParam(':subject_code', $subject_code );
            $stmt -> bindParam(':subject_name', $subject_name );

            //execute
            $stmt -> execute();

            http_response_code(201);
            echo json_encode([
                "success" => true,
                "message" => "Subject Added Succesfully"
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