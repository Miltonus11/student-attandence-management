<?php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(["message" => "Method Not Allowed"]);
    exit();
}

$teacher_id = $_GET['teacher_id'] ?? null;

if (!$teacher_id) {
    http_response_code(400);
    echo json_encode(["message" => "Missing teacher_id"]);
    exit();
}

require_once('../../db/conn.php');

try {
    $sql = "SELECT 
            c.class_id,
            c.class_name,
            COUNT(s.student_id) AS student_count
            FROM tbl_instructors t
            LEFT JOIN tbl_subjects sub 
            ON t.subject_id = sub.subject_id
            LEFT JOIN tbl_class c 
            ON c.subject_id = sub.subject_id
            LEFT JOIN tbl_students s 
            ON s.class_id = c.class_id
        WHERE t.instructor_id = :teacher_id
        GROUP BY c.class_id
        ORDER BY c.class_id ASC
    ";

    $stmt = $conn->prepare($sql);
    $stmt->bindParam(":teacher_id", $teacher_id);
    $stmt->execute();

    echo json_encode([
        "success" => true,
        "classes" => $stmt->fetchAll(PDO::FETCH_ASSOC)
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["message" => $e->getMessage()]);
}
