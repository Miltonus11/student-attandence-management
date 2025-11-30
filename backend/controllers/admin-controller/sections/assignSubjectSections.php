<?php
    header('Content-Type: application/json');

    if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
        http_response_code(405);
        echo json_encode(["message" => "Method Not Allowed"]);
        exit();
    }

    //get input
    $input = json_decode(file_get_contents("php://input"), true);
    $class_id = $input['class_id'] ?? null;
    $subject_id = $input['subject_id'] ?? null;

    //
    if (!$class_id || !$subject_id) {
        http_response_code(400);
        echo json_encode(["message" => "Missing class_id or subject_id"]);
        exit();
    }

    require_once('../../db/conn.php');

    try {

        //  Check if subject already belongs to another class
        $stmt = $conn->prepare("SELECT * FROM tbl_class WHERE subject_id = :subject_id");
        $stmt->bindParam(':subject_id', $subject_id);
        $stmt->execute();

        if ($stmt->fetch()) {
            http_response_code(409);
            echo json_encode([
                "message" => "This subject is already assigned to another class."
            ]);
            exit();
        }

        //  Assign subject to class
        $sql = "UPDATE tbl_class 
                SET subject_id = :subject_id 
                WHERE class_id = :class_id";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':subject_id', $subject_id);
        $stmt->bindParam(':class_id', $class_id);
        $stmt->execute();

        echo json_encode([
            "message" => "Subject assigned to class successfully"
        ]);

    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => $e->getMessage()]);
    }
?>






