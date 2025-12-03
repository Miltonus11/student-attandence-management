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
    $input = json_decode(file_get_contents("php://input"),true);
    $subject_id = $input['subject_id'] ?? null;
    $instructor_id = $input['instructor_id'] ??  null;
    // $subject_id = $_POST['subject_id'];
    // $instructor_id = $_POST['instructor_id'];


    require_once('../../../db/conn.php');
    try{
        if(!$subject_id || !$instructor_id){
            http_response_code(406);
            echo json_encode([
                "message" => "Incomplete Fields"
            ]);
            exit();
        }
        $sql = "UPDATE tbl_instructors SET subject_id = :subject_id  WHERE instructor_id = :instructor_id";
        $stmt = $conn -> prepare($sql);
        $stmt ->bindParam(":subject_id", $subject_id);
        $stmt ->bindParam(":instructor_id", $instructor_id);
        $stmt -> execute();

        http_response_code(200);
        echo json_encode([
            "success" => true,
            "message" => "Teacher Assigned Succesfully"
        ]);
        exit();
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "message" => "Error" . $e ->getMessage()
        ]);
    }
?>