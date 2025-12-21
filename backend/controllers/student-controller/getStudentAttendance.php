<?php
    session_start();
    header('Content-Type: application/json');

    // Check method
    if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
        http_response_code(405);
        echo json_encode([
            "success" => false,
            "message" => "Method Not Allowed"
        ]);
        exit();
    };
    // $student_id = $_SESSION['student_id'];

    $student_id = $_GET['student_id'];
    require_once('../../db/conn.php');

    if(!$student_id){
        http_response_code(400);
        echo json_encode([
            "message" => 'error'
        ]);
        exit();
    }
    try{
        $sql = "SELECT 
                SUM(status = 'present') AS present,
                SUM(status = 'absent') AS absent
                FROM tbl_attendance
                WHERE student_id = :student_id";
        $stmt = $conn ->prepare($sql);
        $stmt -> bindParam(':student_id', $student_id);
        $stmt -> execute();
        $attendance = $stmt->fetchAll(PDO::FETCH_ASSOC);
        

        echo json_encode([
            "success" => true,
            "Attendance" => $attendance
        ]);


    }catch(PDOException $e) {
        http_response_code(500);
        echo json_encode([
            "message" => $e->getMessage()
        ]);
    }
?>