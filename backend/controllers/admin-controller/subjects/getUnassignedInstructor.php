<?php
    header('Content-type: application/json');

    //checker or validator
    if($_SERVER['REQUEST_METHOD']!=="GET"){
        http_response_code(405);
        echo json_encode([
            "Message" => "Method Not Allowed",
        ]);
        exit();
    }

    require_once('../../../db/conn.php');

    try{
        $sql = "SELECT * FROM tbl_instructors WHERE subject_id = 0";
        $stmt = $conn -> prepare($sql);
        $stmt->execute();
        $unassignedTeachers = $stmt->fetchAll(PDO::FETCH_ASSOC);

        http_response_code(200);
        echo json_encode([
            "success" => true,
            "teachers" => $unassignedTeachers,
        ]);
        exit();
    }catch(PDOException $e){
        echo json_encode([
            "error" => $e -> getMessage()
        ]);
        exit();
    }
?>