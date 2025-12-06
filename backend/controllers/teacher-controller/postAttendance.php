<?php
    header('Content-Type: application/json');
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        "success" => false,
        "message" => "Method Not Allowed"
        ]);
    }   
    exit();
    $input = json_decode(file_get_contents('php://input'), true);

    if(!$input){
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "Invalid JSON input"
        ]);
        exit();
    }
    //inputs
    $section_id = $input['section_id']?? null;
    $attendance_date = $input['attendance_date']??null;
    $attendace = $input['attendance'] ?? [];

    if(!$section_id || !$attendance_date || empty($attendace)){
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "Incomplete Fields"
        ]);
        exit();
    }
    //get teacher ID and subject ID
    $teacher_id = $_SESSION['instructor_id'];
    $subect_id = $_SESSION['subject_id'];

    require_once('../../../db/conn.php');

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

    // verify if 1 it is assigned
    if ($verify['count'] == 0) {
        http_response_code(403);
        echo json_encode([
            "success" => false,
            "message" => "Access denied. This section is not assigned to you."
        ]);
        exit();
    }
    // begin transaction
    $conn -> beginTransaction();
    $saved_count = 0;
    $updated_count = 0;

    //prepare insert/update statement
    $sql = "INSERT INTO tbl_attendance (student_id, subject_id, class_id, date, status) 
                    VALUES (:student_id, :subject_id, :class_id, :date, :status)
                    ON DUPLICATE KEY UPDATE
                    status = VALUES(status)";
    $stmt = $conn->prepare($sql);
    } catch (PDOException $e) {
        if ($conn->inTransaction()) {
        $conn->rollBack();
        }
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "message" => "Database error occurred"
        ]);
        error_log("Error in saveAttendance.php: " . $e->getMessage());
    }
        

?>