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
                echo json_encode([
                    "status" => "success",
                    "message" => "Welcome " . $user['username'],
                    "user_level" =>  $user['user_level']
                    
                ]);
                
                // Start session
                $_SESSION['username'] = $uname;
                $_SESSION['user_level'] = $user['user_level'];

                

                exit();
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