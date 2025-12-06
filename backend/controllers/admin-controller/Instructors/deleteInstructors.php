<?php
header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];
if ($method !== 'POST' && $method !== 'DELETE') {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Method Not Allowed"]);
    exit();
}

require_once('../../../db/conn.php');

if ($method === 'DELETE') {
    parse_str(file_get_contents('php://input'), $deleteData);
    $instructor_id = isset($deleteData['id']) && $deleteData['id'] !== '' ? trim($deleteData['id']) : (isset($deleteData['instructor_id']) ? trim($deleteData['instructor_id']) : null);
} else {
    $instructor_id = isset($_POST['id']) && $_POST['id'] !== '' ? trim($_POST['id']) : (isset($_POST['instructor_id']) ? trim($_POST['instructor_id']) : null);
}

if (empty($instructor_id)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Missing instructor id"]);
    exit();
}

try {
    $conn->beginTransaction();

    // Fetch instructor
    $stmt = $conn->prepare("SELECT * FROM tbl_instructors WHERE instructor_id = :instructor_id");
    $stmt->execute([':instructor_id' => $instructor_id]);
    $instructor = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$instructor) {
        http_response_code(404);
        echo json_encode(["status" => "error", "message" => "Instructor not found"]);
        exit();
    }

    $archiveSql = "INSERT INTO tbl_instructors_archive (instructor_id, user_id, instructor_number, first_name, last_name, class_id, subject_id, archived_at) 
                   VALUES (:instructor_id, :user_id, :instructor_number, :first_name, :last_name, :class_id, :subject_id, NOW())";

    $archive_ok = false;
    $archive_error = null;
    try {
        $archiveStmt = $conn->prepare($archiveSql);
        $archiveStmt->execute([
            ':instructor_id' => $instructor['instructor_id'] ?? $instructor_id,
            ':user_id' => $instructor['user_id'] ?? null,
            ':instructor_number' => $instructor['instructor_number'] ?? null,
            ':first_name' => $instructor['first_name'] ?? null,
            ':last_name' => $instructor['last_name'] ?? null,
            ':class_id' => $instructor['class_id'] ?? null,
            ':subject_id' => $instructor['subject_id'] ?? null
        ]);
        $archive_ok = true;
    } catch (PDOException $e) {
        $archive_error = $e->getMessage();
        error_log('Archive failed for instructor_id ' . $instructor_id . ': ' . $archive_error);
    }

    // Delete from the main table
    $deleteStmt = $conn->prepare("DELETE FROM tbl_instructors WHERE instructor_id = :instructor_id");
    $deleteStmt->execute([':instructor_id' => $instructor_id]);

    $conn->commit();

    if ($archive_ok) {
        echo json_encode([
            "status" => "success",
            "message" => "Instructor archived and deleted successfully"
        ]);
    } else {
        echo json_encode([
            "status" => "success",
            "message" => "Instructor deleted (archive failed)",
            "note" => "archive_failed",
            "archive_error" => $archive_error
        ]);
    }
    exit();

} catch (PDOException $e) {
    if ($conn->inTransaction()) $conn->rollBack();
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    exit();
}

?>