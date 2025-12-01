<?php
header('Content-Type: application/json');

if($_SERVER['REQUEST_METHOD'] !== 'GET'){
    http_response_code(405);
    echo json_encode([
        "success" => false,
        "message" => "Method Not Allowed"
    ]);
    exit();
}

$class_id = $_GET['class_id'] ?? null;

try {
    require_once('../../../db/conn.php');
    
    if($class_id){
       
        $sql = "SELECT * FROM tbl_class WHERE class_id = :class_id";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':class_id', $class_id);
        $stmt->execute();

        $class = $stmt->fetch(PDO::FETCH_ASSOC);

        if(!$class){
            echo json_encode([
                "success" => false,
                "message" => "Class not found"
            ]);
            exit();
        } else {
            echo json_encode([
                "success" => true,
                "class" => $class
            ]);
            exit();
        }
    } else {
  
        $sql = "SELECT * FROM tbl_class ORDER BY class_id";
        $stmt = $conn->prepare($sql);
        $stmt->execute();
        $classes = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode([
            "success" => true,
            "classes" => $classes, 
            "count" => count($classes)
        ]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Database error: " . $e->getMessage()
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Error: " . $e->getMessage()
    ]);
}
?>