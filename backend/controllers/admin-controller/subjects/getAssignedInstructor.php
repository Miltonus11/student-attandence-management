<?php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
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
    $sql = "
        SELECT i.instructor_id, i.first_name, i.last_name
        FROM tbl_instructors i
        LEFT JOIN tbl_subjects s ON i.subject_id = s.subject_id
        WHERE s.subject_id = :subject_id
    ";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':subject_id', $subjectId, PDO::PARAM_INT);
    $stmt->execute();
    $instructors = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "instructors" => $instructors
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Database error: " . $e->getMessage()
    ]);
}
?>
