<?php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(["message" => "Method Not Allowed"]);
    exit();
}

require_once('../../../db/conn.php');

try {
    // Fetch students that are not assigned to any class (class_id IS NULL or 0)
    $sql = "SELECT student_id, student_number, first_name, last_name, year_level 
            FROM tbl_students WHERE class_id IS NULL OR class_id = 0 
            ORDER BY last_name ASC, first_name ASC";
            
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $students = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "students" => $students
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Error: " . $e->getMessage()
    ]);
}
?>