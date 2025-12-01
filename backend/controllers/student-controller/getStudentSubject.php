<?php
    header('Content-Type: application/json');

    if($_SERVER['REQUEST_METHOD'] !== 'GET'){
        http_response_code(405);
        echo json_encode([
            "message" => "Method Not Allowed"
        ]);
        exit();
    }

    

    $user_id = (int) $_GET['user_id'];

    if (!isset($user_id)) {
    http_response_code(400);
    echo json_encode(["message" => "Missing student_id"]);
    exit();
    }

    require_once('../../db/conn.php');

    try {
        $sql = "
            SELECT 
                s.student_id,
                s.user_id,
                s.first_name,
                s.last_name,
                c.class_id,
                c.class_name,
                sub.subject_id,
                sub.subject_name
            FROM tbl_users u
            LEFT JOIN tbl_students s ON s.user_id = u.user_id
            LEFT JOIN tbl_class c ON s.class_id = c.class_id
            LEFT JOIN tbl_subjects sub ON c.subject_id = sub.subject_id
            WHERE u.user_id = ? ";

        $stmt = $conn->prepare($sql);
        $stmt->execute([$user_id]);
        $data = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$data) {
            http_response_code(404);
            echo json_encode(["message" => "Student not found"]);
            exit();
        }

        echo json_encode(["success" => true, "data" => $data]);
        
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["message" => "Server error: " . $e->getMessage()]);
    }

    
?>