<?php
    header('Content-Type: application/json');

    if($_SERVER['REQUEST_METHOD'] !== 'GET'){
        http_response_code(405);
        echo json_encode([
            "message" => "Method Not Allowed"
        ]);
        exit();
    }
    $instructor_id = $_GET['inst_id'] ?? null;

    if($instructor_id){
        require_once('../../../db/conn.php');
        //sql
        $sql = "SELECT * FROM tbl_instructors WHERE id = :id";

        //prepare
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':id', $itemId);

        //execute
        $stmt->execute();

        //fetch 
        $items = $stmt->fetch(PDO::FETCH_ASSOC);

        if(!$items){
            echo json_encode([
                "success"=> false,
                "message"=> "item not found"
            ]);
            exit();
        } else {
            echo json_encode([
                "success" => true,
                "items" => $items
            ]);
            exit();
        }
    } else {
        require_once('../../db/conn.php');
        //sql
        $sql = "SELECT * FROM tbl_instructors ";
        //prep
        $stmt = $conn->prepare($sql);
        //exe
        $stmt->execute();
        //fetch
        $instructors = $stmt->fetchAll(PDO::FETCH_ASSOC);

        //echo
        echo json_encode([
            "success" => true,
            "Instructors" => $instructors
        ]);
    }
?>