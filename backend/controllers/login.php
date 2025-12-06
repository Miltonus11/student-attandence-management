<?php 
    session_start();
    // validate user method
    if($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode([
            "message" => "Method Not Allowed"
        ]);
        exit();
    }
    // get user input
    $uname = $_POST['username'];
    $pw = $_POST['password'];

    // $hashed_pw = password_hash($pw, PASSWORD_BCRYPT);
    // echo $hashed_pw;
    
    require_once('../db/conn.php');
    if(isset($uname) && isset($pw)){
        //sql
        $sql = "SELECT * FROM tbl_users WHERE username = ?";

        //prepare
        $stmt = $conn->prepare($sql);
        //execute
        $stmt->execute([$uname]);
        //fetch
        $user= $stmt->fetch(PDO::FETCH_ASSOC);
        
        if(!$user){
            echo json_encode([
                "status" => "error",
                "message" => "No User Fetched"
            ]);
            exit();
        }
        if($uname == $user['username']){
            // there is a user , validate with password
            if(password_verify($pw, $user['password'])){
                //if the pw is correct
                $user_id = $user['user_id'];
                $_SESSION['logged_in'] = true;
                $_SESSION['user_id'] = $user_id;
                $_SESSION['username'] = $user['username'];
                $_SESSION['user_role'] = $user['user_role'];

                // gets table data from user if they are student or instructor
                if($user['user_role'] === 'student'){
                    $sql = "SELECT * FROM tbl_students WHERE user_id = ?";
                    $stmt = $conn->prepare($sql);
                    $stmt->execute([$user_id]);
                    $student = $stmt->fetch(PDO::FETCH_ASSOC);
                    
                    //set student session
                    $_SESSION['student_id'] = $student['student_id'];
                    $_SESSION['first_name'] = $student['first_name'];
                    $_SESSION['last_name'] = $student['last_name'];
                    $_SESSION['class_id'] = $student['class_id'];
                    $_SESSION['full_name'] = $student['first_name'] . ' ' . $student['last_name'];

                    echo json_encode([
                        "status" => "success",
                        "user_level" => $user['user_role']
                    ]);
                    exit();
                } elseif($user['user_role'] === 'instructor'){
                    $sql = "SELECT * FROM tbl_instructors WHERE user_id = ?";
                    $stmt = $conn->prepare($sql);
                    $stmt->execute([$user_id]);
                    $instructor = $stmt->fetch(PDO::FETCH_ASSOC);

                    $_SESSION['instructor_id'] = $instructor['instructor_id'];
                    $_SESSION['first_name'] = $instructor['first_name'];
                    $_SESSION['last_name'] = $instructor['last_name'];
                    $_SESSION['subject_id'] = $instructor['subject_id'];
                    $_SESSION['full_name'] = $instructor['first_name'] . ' ' . $instructor['last_name'];

                    echo json_encode([
                        "status" => "success",
                        "user_level" => $user['user_role']
                    ]);
                    exit();

                } else {
                    echo json_encode([
                        "status" => "success",
                        "user_level" => $user['user_role'],
                        "user_id" => $user['user_id'],
                    ]);
                    exit();
                }

            } else {
                // if not correct
                echo json_encode([
                    "status" => "error",
                    "message" => "Incorrect Password"
                ]);
                exit();
            }
        } else {
            //if there is none,
                echo json_encode([
                    "status" => "error",
                    "message" => "No User Found"
                ]);
                exit();
            //return no user found
        }   
        exit();
        
    } else {
        echo json_encode([
            "status" =>"error",
            "message" => "Please fill in all fields"
        ]);
        exit();
    }
?>