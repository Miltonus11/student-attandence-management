<?php
header('Content-Type: application/json');

if($_SERVER['REQUEST_METHOD'] !== 'GET'){
    http_response_code(405);
    echo json_encode(["message" => "Method Not Allowed"]);
    exit();
}

require_once('../../../db/conn.php');

if (!isset($_GET['subject_id'])) {
    echo json_encode([
        "success" => false,
        "message" => "No subject ID provided."
    ]);
    exit();
}

$subjectId = intval($_GET['subject_id']);

try {
    $sql = "SELECT * FROM tbl_subjects WHERE subject_id = :id";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':id', $subjectId, PDO::PARAM_INT);
    $stmt->execute();
    $subject = $stmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "subject" => $subject
    ]);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "message" => "Error: " . $e->getMessage()
    ]);
}