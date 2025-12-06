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
    $student_id = isset($deleteData['id']) && $deleteData['id'] !== '' ? trim($deleteData['id']) : (isset($deleteData['student_id']) ? trim($deleteData['student_id']) : null);
} else {
    $student_id = isset($_POST['id']) && $_POST['id'] !== '' ? trim($_POST['id']) : (isset($_POST['student_id']) ? trim($_POST['student_id']) : null);
}

if (empty($student_id)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Missing student id"]);
    exit();
}

try {
    $conn->beginTransaction();

    // Fetch student
    $stmt = $conn->prepare("SELECT * FROM tbl_students WHERE student_id = :student_id");
    $stmt->execute([':student_id' => $student_id]);
    $student = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$student) {
        $conn->rollBack();
        http_response_code(404);
        echo json_encode(["status" => "error", "message" => "Student not found"]);
        exit();
    }

    // Log what we're trying to archive
    error_log("Attempting to archive student: " . json_encode($student));

    $archiveSql = "INSERT INTO tbl_students_archive 
                   (student_id, user_id, student_number, first_name, last_name, year_level, class_id, absent_count, archived_at) 
                   VALUES 
                   (:student_id, :user_id, :student_number, :first_name, :last_name, :year_level, :class_id, :absent_count, NOW())";

    $archive_ok = false;
    $archive_error = null;
    
    try {
        $archiveStmt = $conn->prepare($archiveSql);
        $archiveStmt->execute([ 
            ':student_id' => $student['student_id'] ?? $student_id,
            ':user_id' => $student['user_id'] ?? null,
            ':student_number' => $student['student_number'] ?? null,
            ':first_name' => $student['first_name'] ?? null,
            ':last_name' => $student['last_name'] ?? null,
            ':year_level' => $student['year_level'] ?? null,
            ':class_id' => $student['class_id'] ?? null,
            ':absent_count' => $student['absent_count'] ?? null
        ]);
        $archive_ok = true;
        error_log("Archive successful for student_id: " . $student_id);
        
    } catch (PDOException $e) {
        $archive_error = $e->getMessage();
        error_log('Archive failed for student_id ' . $student_id . ': ' . $archive_error);
    }

    // Delete from the main table
    $deleteStmt = $conn->prepare("DELETE FROM tbl_students WHERE student_id = :student_id");
    $deleteStmt->execute([':student_id' => $student_id]);

    $conn->commit();

    if ($archive_ok) {
        echo json_encode([
            "status" => "success",
            "message" => "Student archived and deleted successfully"
        ]);
    } else {
        echo json_encode([
            "status" => "success",
            "message" => "Student deleted (archive failed)",
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