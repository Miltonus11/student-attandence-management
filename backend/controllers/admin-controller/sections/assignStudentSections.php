<?php
    header('Content-Type: application/json');

    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode(["message" => "Method Not Allowed"]);
        exit();
    }

    $class_id = $_POST['class_id'] ?? null;
    //array of students
    $students = $_POST['students'] ?? null;

    require_once('../../../db/conn.php');
    try{
        if (!$class_id || !$students || !is_array($students)) {
        http_response_code(400);
        echo json_encode(["message" => "Missing class_id or students"]);
        exit();
        }   

        $sql = "UPDATE tbl_students SET class_id = :class_id WHERE student_id = :student_id";
        $stmt = $conn->prepare($sql);

        //for loop for iterating every student
        foreach($students as $student_id){
            $stmt->execute([
                ':class_id' => $class_id,
                ':student_id' => $student_id
            ]);
        }

        http_response_code(200);
        echo json_encode([
            "message" => "Students successfully assigned to class",
            "assigned count" => count($students)
        ]);
    } catch(PDOException $e){
        http_response_code(500);
        echo json_encode(["message" => $e->getMessage()]);
    }
    

?>