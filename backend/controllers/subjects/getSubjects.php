<?php
    header('Content-Type: application/json');

    if($_SERVER['REQUEST_METHOD'] !== 'GET'){
        http_response_code(405);
        echo json_encode([
            "message" => "Method Not Allowed"
        ]);
        exit();
    }
    require_once('../../db/conn.php');
    
    try {
        //sql
        $sql = "SELECT * FROM tbl_subjects";
    
        //stmt
        $stmt = $conn -> prepare($sql);

        //exec
        $stmt -> execute();

        $subjects = $stmt -> fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode([
            "success" => true,
            "subjects" => $subjects
        ]);
        
    } catch (PDOException $e){
       http_response_code(500);
        echo json_encode([
            "message" => "Error" . $e->getMessage()
        ]);
    }
?>