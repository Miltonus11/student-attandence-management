<?php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method Not Allowed"]);
    exit();
}

// Use POST form data
$subject_id = $_POST['subject_id'] ?? null;
$subject_code = $_POST['subject_code'] ?? null;
$subject_name = $_POST['subject_name'] ?? null;

require_once('../../../db/conn.php');

try {
    if (!$subject_id || !$subject_code || !$subject_name) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Missing required fields"]);
        exit();
    }

    $sql = "UPDATE tbl_subjects SET subject_code = :subject_code, subject_name = :subject_name WHERE subject_id = :subject_id";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':subject_code', $subject_code);
    $stmt->bindParam(':subject_name', $subject_name);
    $stmt->bindParam(':subject_id', $subject_id);
    $stmt->execute();

    echo json_encode(["success" => true, "message" => "Subject updated successfully"]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
}
?>