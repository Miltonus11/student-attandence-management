<?php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method Not Allowed"]);
    exit();
}

$subject_id = $_POST['subject_id'] ?? null;
$instructor_id = $_POST['instructor_id'] ?? null;

require_once('../../../db/conn.php');

try {
    if (!$instructor_id) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Missing instructor_id"]);
        exit();
    }

    // Unassign instructor by setting subject_id to NULL
    $sql = "UPDATE tbl_instructors SET subject_id = NULL WHERE instructor_id = :instructor_id";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':instructor_id', $instructor_id);
    $stmt->execute();

    echo json_encode(["success" => true, "message" => "Instructor removed from subject"]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}
?>