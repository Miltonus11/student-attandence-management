<?php
session_start();
header('Content-Type: application/json');

// Check method
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        "success" => false,
        "message" => "Method Not Allowed"
    ]);
    exit();
}

// TEMPORARY - FOR TESTING ONLY (Remove after testing)
// $_SESSION['instructor_id'] = 1;
// $_SESSION['subject_id'] = 1;
// // END TEMPORARY

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Invalid JSON input"
    ]);
    exit();
}

// Get inputs
$section_id = $input['section_id'] ?? null;
$attendance_date = $input['attendance_date'] ?? null;
$attendance = $input['attendance'] ?? [];

// Validate inputs
if (!$section_id || !$attendance_date || empty($attendance)) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Missing required fields: section_id, attendance_date, or attendance data"
    ]);
    exit();
}

// Get teacher info from session
$teacher_id = $_SESSION['instructor_id'];
$subject_id = $_SESSION['subject_id'];

require_once('../../db/conn.php');

try {
    // Verify teacher has access to this section
    $sqlVerify = "SELECT COUNT(*) as count 
                  FROM tbl_class c
                  WHERE c.class_id = :section_id 
                  AND c.subject_id = :subject_id";
    
    $stmtVerify = $conn->prepare($sqlVerify);
    $stmtVerify->bindParam(':section_id', $section_id, PDO::PARAM_INT);
    $stmtVerify->bindParam(':subject_id', $subject_id, PDO::PARAM_INT);
    $stmtVerify->execute();
    $verify = $stmtVerify->fetch(PDO::FETCH_ASSOC);
    
    if ($verify['count'] == 0) {
        http_response_code(403);
        echo json_encode([
            "success" => false,
            "message" => "Access denied. This section is not assigned to you."
        ]);
        exit();
    }
    
    // Begin transaction
    $conn->beginTransaction();
    
    $saved_count = 0;
    $updated_count = 0;
    
    // Prepare insert/update statement
    // Table: attendance_id, student_id, class_id, subject_id, date, status
    $sql = "INSERT INTO tbl_attendance 
            (student_id, class_id, date, status) 
            VALUES (:student_id, :class_id, :date, :status)
            ON DUPLICATE KEY UPDATE 
            status = VALUES(status)";
    
    $stmt = $conn->prepare($sql);
    
    // Loop through attendance records
    foreach ($attendance as $record) {
        $student_id = $record['student_id'] ?? null;
        $present = $record['present'] ?? 0;
        
        if (!$student_id) {
            continue; // Skip invalid records
        }
        
        // Convert 1/0 to present/absent
        $status = ($present == 1) ? 'present' : 'absent';
        
        $stmt->bindParam(':student_id', $student_id, PDO::PARAM_INT);
        $stmt->bindParam(':class_id', $section_id, PDO::PARAM_INT);
        // $stmt->bindParam(':subject_id', $subject_id, PDO::PARAM_INT);
        $stmt->bindParam(':date', $attendance_date);
        $stmt->bindParam(':status', $status);
        
        $stmt->execute();
        
        // Check if it was insert or update
        if ($stmt->rowCount() > 0) {
            if ($conn->lastInsertId() > 0) {
                $saved_count++;
            } else {
                $updated_count++;
            }
        }
    }
    
    // Commit transaction
    $conn->commit();
    
    echo json_encode([
        "success" => true,
        "message" => "Attendance saved successfully!",
        "saved" => $saved_count,
        "updated" => $updated_count,
        "total" => $saved_count + $updated_count,
        "date" => $attendance_date
    ]);

} catch (PDOException $e) {
    // Rollback on error
    if ($conn->inTransaction()) {
        $conn->rollBack();
    }
    
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Database error occurred: " . $e->getMessage()
    ]);
}
?>