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
    $student_number = $_POST['stud_num'];
    $first_name = $_POST['first_name'];
    $last_name = $_POST['last_name'];
    $year_level = $_POST['year_level'];
    require_once('../../db/conn.php');
    try{
        //create user 
        if(!$student_number && !$first_name && !$last_name && !$year_level){
        $password = random_int(1000,9000);

        //check student number if it exist
        $sql = "SELECT * from tbl_students WHERE student_number = :student_number";
        $stmt = $conn -> prepare($sql);
        $stmt -> bindParam(':student_number', $student_number);
        $stmt->execute();
        $student = $stmt->fetch(PDO::FETCH_ASSOC);

        if($student){
            http_response_code(409);
            echo json_encode([
                "error"=> "Conflict / redundant ID"
            ]);
            exit();
        };
        //if it exist, exit

        $sql = "INSERT INTO tbl_users (username, password, user_role, status) 
                VALUES (:username, :password, 'student', 1)";
        $stmt = $conn -> prepare($sql);
        $stmt -> bindParam(':username', $student_number);
        $stmt -> bindParam(':password', $password);
        $stmt -> execute();

        //once user is created, get the ID of the user (user_id)
        $user_id = $conn->lastInsertId();
        
        // sql statement for student creation
        $sql = "INSERT INTO tbl_students (user_id ,student_number, first_name, last_name, year_level) 
                VALUES (:user_id, :student_number, :first_name, :last_name, :year_level)";
        $stmt = $conn ->prepare($sql);
        $stmt -> bindParam(':user_id', $user_id);
        $stmt -> bindParam(':student_number', $student_number);
        $stmt -> bindParam(':first_name', $first_name);
        $stmt -> bindParam(':last_name', $last_name);
        $stmt -> bindParam(':year_level', $year_level);

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
    //To do next, verify if yearLevel is empty, use ! rather than isset
    // craete transaction.
?>

