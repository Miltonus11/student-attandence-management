<?php
    header('Content-Type: application/json');

    if($_SERVER['REQUEST_METHOD'] !== 'POST'){
        http_response_code(405);
        echo json_encode([
            "message" => "Method Not Allowed"
        ]);
        exit();
    }

    //get input from frontend
    $instructor_number = $_POST['instructor_number'];
    $first_name = $_POST['first_name'];
    $last_name = $_POST['last_name'];
    require_once('../../../db/conn.php');
    try{
        //create user 
        if(isset($instructor_number) && isset($first_name) && isset($last_name)){
        $password = password_hash('password', PASSWORD_BCRYPT);

        $sql = "INSERT INTO tbl_users (username, password, user_role, status) 
                VALUES (:username, :password, 'instructor', 1)";
        $stmt = $conn -> prepare($sql);
        $stmt -> bindParam(':username', $instructor_number);
        $stmt -> bindParam(':password', $password);
        $stmt -> execute();

        //once user is created, get the ID of the user (user_id)
        $user_id = $conn->lastInsertId();
        
        // sql statement for instructor creation
        $sql = "INSERT INTO tbl_instructors (user_id ,instructor_number, first_name, last_name) 
                VALUES (:user_id, :instructor_number, :first_name, :last_name)";
        $stmt = $conn ->prepare($sql);
        $stmt -> bindParam(':user_id', $user_id);
        $stmt -> bindParam(':instructor_number', $instructor_number);
        $stmt -> bindParam(':first_name', $first_name);
        $stmt -> bindParam(':last_name', $last_name);

        $stmt -> execute();

        http_response_code(201);
        echo json_encode([
            "message" => "User added succesfully"
        ]);
        exit();
        }  else{
            http_response_code(403);
            echo json_encode([
                "message" => "Error adding user"
            ]);
            exit();
        }
    } catch(PDOException $e){
        http_response_code(500);
        echo json_encode([
            "message" => "Error" . $e->getMessage()
        ]);
    }
    
?>