<?php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        "success" => false,
        "message" => "Method Not Allowed"
    ]);
    exit();
}

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

if (!$input || !isset($input['date'])) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Missing required field: date"
    ]);
    exit();
}

$attendance_date = $input['date'];

require_once('../../db/conn.php');

try {
    // Get total number of students
    $sqlTotal = "SELECT COUNT(*) as total FROM tbl_students";
    $stmtTotal = $conn->prepare($sqlTotal);
    $stmtTotal->execute();
    $totalResult = $stmtTotal->fetch(PDO::FETCH_ASSOC);
    $totalStudents = $totalResult['total'] ?? 0;

    // Get present and absent count for the selected date
    $sqlAttendance = "SELECT status, COUNT(*) as count 
                      FROM tbl_attendance 
                      WHERE date = :date 
                      GROUP BY status";
    
    $stmtAttendance = $conn->prepare($sqlAttendance);
    $stmtAttendance->bindParam(':date', $attendance_date, PDO::PARAM_STR);
    $stmtAttendance->execute();
    $attendanceResults = $stmtAttendance->fetchAll(PDO::FETCH_ASSOC);
    
    $presentCount = 0;
    $absentCount = 0;
    
    foreach ($attendanceResults as $result) {
        if ($result['status'] === 'present') {
            $presentCount = (int)$result['count'];
        } elseif ($result['status'] === 'absent') {
            $absentCount = (int)$result['count'];
        }
    }
    
    // Get present students details
    $sqlPresentStudents = "SELECT s.student_id as id, s.first_name, s.last_name, c.class_name 
                          FROM tbl_attendance a
                          JOIN tbl_students s ON a.student_id = s.student_id
                          LEFT JOIN tbl_class c ON a.class_id = c.class_id
                          WHERE a.date = :date AND a.status = 'present'
                          ORDER BY s.first_name ASC";
    
    $stmtPresentStudents = $conn->prepare($sqlPresentStudents);
    $stmtPresentStudents->bindParam(':date', $attendance_date, PDO::PARAM_STR);
    $stmtPresentStudents->execute();
    $presentStudents = $stmtPresentStudents->fetchAll(PDO::FETCH_ASSOC);
    
    // Get absent students details
    $sqlAbsentStudents = "SELECT s.student_id as id, s.first_name, s.last_name, c.class_name 
                         FROM tbl_attendance a
                         JOIN tbl_students s ON a.student_id = s.student_id
                         LEFT JOIN tbl_class c ON a.class_id = c.class_id
                         WHERE a.date = :date AND a.status = 'absent'
                         ORDER BY s.first_name ASC";
    
    $stmtAbsentStudents = $conn->prepare($sqlAbsentStudents);
    $stmtAbsentStudents->bindParam(':date', $attendance_date, PDO::PARAM_STR);
    $stmtAbsentStudents->execute();
    $absentStudents = $stmtAbsentStudents->fetchAll(PDO::FETCH_ASSOC);
    
    // Calculate attendance percentage
    $markedAttendance = $presentCount + $absentCount;
    $attendancePercentage = $markedAttendance > 0 
        ? round(($presentCount / $markedAttendance) * 100, 2) 
        : 0;
    
    echo json_encode([
        "success" => true,
        "date" => $attendance_date,
        "total" => $totalStudents,
        "present" => $presentCount,
        "absent" => $absentCount,
        "marked" => $markedAttendance,
        "attendancePercentage" => $attendancePercentage,
        "presentStudents" => $presentStudents,
        "absentStudents" => $absentStudents
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Database error: " . $e->getMessage()
    ]);
    error_log("Error in getAttendanceSummary.php: " . $e->getMessage());
}
?>
