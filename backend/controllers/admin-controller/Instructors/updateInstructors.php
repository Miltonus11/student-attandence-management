<?php
    header('Content-Type: application/json');

    if($_SERVER['REQUEST_METHOD'] !== 'POST'){
        http_response_code(405);
        echo json_encode([
            "message" => "Method Not Allowed"
        ]);
        exit();
    }

    require_once('../../../db/conn.php');

    $instructor_id = isset($_POST['id']) && $_POST['id'] !== '' ? trim($_POST['id']) : (isset($_POST['instructor_id']) ? trim($_POST['instructor_id']) : null);
    $instructor_number = isset($_POST['instructor_number']) ? trim($_POST['instructor_number']) : null;
    $first_name = isset($_POST['first_name']) ? trim($_POST['first_name']) : null;
    $last_name = isset($_POST['last_name']) ? trim($_POST['last_name']) : null;

    // Validate required fields
    if (empty($instructor_id) || empty($instructor_number) || empty($first_name) || empty($last_name)) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Missing required fields", "received" => $_POST]);
        exit();
    }

    try {
        $query = "UPDATE tbl_instructors 
                  SET instructor_number = :instructor_number, 
                      first_name = :first_name, 
                      last_name = :last_name
                  WHERE instructor_id = :instructor_id";

        $stmt = $conn->prepare($query);

        $stmt->bindParam(':instructor_number', $instructor_number);
        $stmt->bindParam(':first_name', $first_name);
        $stmt->bindParam(':last_name', $last_name);
        $stmt->bindParam(':instructor_id', $instructor_id);

        if ($stmt->execute()) {
            echo json_encode(["status" => "success", "message" => "Instructor updated successfully"]);
        } else {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => "Update failed"]);
        }
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
?>