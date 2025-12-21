<?php
    header('Content-Type: application/json');

    if($_SERVER['REQUEST_METHOD'] !== 'GET'){
        http_response_code(405);
        echo json_encode([
            "message" => "Method Not Allowed"
        ]);
        exit();
    }

    require_once('../../../db/conn.php');
    $days = 7;
    try{
        $sql= "SELECT 
                DATE(a.date) as day,
                SUM(a.status ='present')  AS present,
                SUM(a.status ='absent') AS absent
            FROM tbl_attendance a
            WHERE a.date >= DATE_SUB(CURDATE(), INTERVAL $days DAY)
            GROUP BY DATE(a.date)
            ORDER BY day ASC
           ";
        $stmt = $conn -> prepare($sql);
        $stmt ->execute();
        $labels = [];
        $present = [];
        $absent = [];

        while($data_row = $stmt->fetch(PDO::FETCH_ASSOC)){
            // convert the date 01-24-54 to unix code so that it can be recorded as timestamp
            // the date(format, timestap) 

            $labels[] = date("D", strtotime($data_row['day']));
            $present[] = (int)$data_row['present'];
            $absent[] =(int)$data_row['absent'];
        }

        echo json_encode([
            'success' => true,
            'labels' => $labels,
            'present' => $present,
            'absent' => $absent
        ]);
    }catch(PDOException $e){
        http_response_code(500);
        echo json_encode([
            "message" => $e -> getMessage()
        ]);
    }
?>