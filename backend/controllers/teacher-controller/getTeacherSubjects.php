<?php
    session_start();
    header('Content-Type: application/json');

    if($_SERVER['REQUEST_METHOD'] !== 'GET'){
        http_response_code(405);
        echo json_encode([
            "message" => "Method Not Allowed"
        ]);
        exit();
    }

    $teacher_id = $_SESSION['instructor_id'] ?? null;

    if (!$teacher_id) {
        http_response_code(400);
        echo json_encode(["message" => "Missing teacher_id"]);
        exit();
    }
    require_once('../../db/conn.php');
    try{
        $sql = "SELECT 
                t.instructor_id,
                t.first_name AS teacher_name,
                sub.subject_id,
                sub.subject_code,
                sub.subject_name
            FROM tbl_instructors t
            LEFT JOIN tbl_subjects sub ON t.subject_id = sub.subject_id
            WHERE t.instructor_id = :teacher_id";
        $stmt = $conn->prepare($sql);
        $stmt -> bindParam(':teacher_id', $teacher_id);
        $stmt -> execute();

        $results = $stmt -> fetchAll(PDO::FETCH_ASSOC);
        echo json_encode([
            "success" => true,
            "subjects" => $results
        ]);

    } catch(PDOException $e){
        http_response_code(500);
        echo json_encode([
            "message" => $e -> getMessage()
        ]);
    }
?>