<?php
    session_start();
    header('Content-Type: application/json');

    require_once('../../db/conn.php');

    $section_id = $_GET['section_id'] ?? null;
    $teacher_id = $_SESSION['instructor_id'] ?? null;

    if (!$section_id ) {
        echo json_encode([
            "success" => false,
            "message" => "Missing section_id "
        ]);
        exit();
    }
    if (!$teacher_id) {
        echo json_encode([
            "success" => false,
            "message" => " no session instructor_id"
        ]);
        exit();
    }

    try {
        // Get section + subject + teacher details
        $sql = "SELECT 
                    c.class_id,
                    c.class_name,
                    
                    sub.subject_id,
                    sub.subject_code,
                    sub.subject_name,
                    
                    t.instructor_id,
                    CONCAT(t.first_name, ' ', t.last_name) AS teacher_name

                FROM tbl_class c
                INNER JOIN tbl_subjects sub ON c.subject_id = sub.subject_id
                INNER JOIN tbl_instructors t ON sub.subject_id = t.subject_id
                WHERE c.class_id = :section_id
                AND t.instructor_id = :teacher_id";

        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':section_id', $section_id);
        $stmt->bindParam(':teacher_id', $teacher_id);
        $stmt->execute();

        $section = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$section) {
            echo json_encode([
                "success" => false,
                "message" => "Section not found or not assigned to you."
            ]);
            exit();
        }

        // Get students
        $sqlStudents = "SELECT 
                            s.student_id,
                            s.student_number,
                            CONCAT(s.first_name, ' ', s.last_name) AS student_name
                        FROM tbl_students s
                        WHERE s.class_id = :section_id
                        ORDER BY s.last_name, s.first_name";

        $stmtStudents = $conn->prepare($sqlStudents);
        $stmtStudents->bindParam(':section_id', $section_id);
        $stmtStudents->execute();

        $students = $stmtStudents->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode([
            "success" => true,
            "section" => $section,
            "students" => $students,
            "total_students" => count($students)
        ]);

    } catch (PDOException $e) {
        echo json_encode([
            "success" => false,
            "message" => "Database error" . $e->getMessage(),
        ]);
    }
?>
