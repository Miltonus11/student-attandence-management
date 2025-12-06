<?php
session_start();
header('Content-Type: application/json');


// Get teacher_id from session
// $teacher_id = $_GET['instructor_id'];
$teacher_id = $_SESSION['instructor_id'];

require_once('../../db/conn.php');

try {
    // Get classes/sections with all necessary info
    $sql = "SELECT 
            c.class_id as id,
            c.class_name as name,
            sub.subject_id,
            sub.subject_code,
            sub.subject_name,
            CONCAT(sub.subject_code, ' - ', sub.subject_name) as subject,
            CONCAT(t.first_name, ' ', t.last_name) as teacherName,
            COUNT(DISTINCT s.student_id) as num_students
        FROM tbl_instructors t
        INNER JOIN tbl_subjects sub ON t.subject_id = sub.subject_id
        INNER JOIN tbl_class c ON c.subject_id = sub.subject_id
        LEFT JOIN tbl_students s ON s.class_id = c.class_id
        WHERE t.instructor_id = :teacher_id
        GROUP BY c.class_id, c.class_name, sub.subject_id, sub.subject_code, 
                 sub.subject_name, t.first_name, t.last_name
        ORDER BY c.class_name";
        
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':teacher_id', $teacher_id, PDO::PARAM_INT);
    $stmt->execute();

    $classes = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Format response to match your frontend expectations
    echo json_encode([
        "sections" => $classes,
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Database error occurred"
    ]);
    error_log("Error in getTeacherClass.php: " . $e->getMessage());
}
?>