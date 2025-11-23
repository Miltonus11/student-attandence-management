<?php
    header('Content-Type: application/json');

    $student_id = $_GET['stud_id'] ?? null;

    if($userId){
        require_once('../conn.php');
        //sql
        $sql = "SELECT * FROM tbl_students WHERE id = :id";

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
        require_once('../conn.php');
        //sql
        $sql = "SELECT * FROM items";
        //prep
        $stmt = $conn->prepare($sql);
        //exe
        $stmt->execute();
        //fetch
        $items = $stmt->fetchAll(PDO::FETCH_ASSOC);

        //echo
        echo json_encode([
            "success" => true,
            "items" => $items
        ]);
    }
?>