<?php
    require_once('../../../backend/controllers/auth/student-auth-check.php');
    $student_id = $_SESSION['student_id'];
    $first_name = $_SESSION['first_name'];
    $last_name = $_SESSION['last_name'];

    echo "<script>var studentId = $student_id;</script>";
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Section Attendance</title>

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>

    <link rel="stylesheet" href="../../css/main.css">
    <link rel="stylesheet" href="../../css/header.css">
    <link rel="stylesheet" href="../../css/sidebar.css">
    <link rel="stylesheet" href="../../css/modal.css">
    <link rel="stylesheet" href="../../css/section-details.css">
    <link rel="stylesheet" href="../../css/attendance-details.css">

</head>
<body>

<?php include 'components/header.php'; ?>

<div class="container-fluid">
    <div class="row">

        <div class="col-md-3 col-lg-2 p-0">
            <?php include 'components/sidebar.php'; ?>
        </div>

        <div class="col-md-9 col-lg-10 p-4">

            <div class="calendar-container">
                <!-- Calendar Section -->
                <div class="calendar-section">
                    <div class="calendar-nav d-flex justify-content-between align-items-center">
                        <button id="prevYear" class="btn btn-outline-secondary"><i class="fas fa-angle-double-left"></i> Prev Year</button>
                        <div class="d-flex align-items-center">
                            <button id="prevMonth" class="btn btn-outline-primary me-2"><i class="fas fa-chevron-left"></i> Previous</button>
                            <h3 id="currentMonthYear" class="mx-3">Loading...</h3>
                            <button id="nextMonth" class="btn btn-outline-primary ms-2">Next <i class="fas fa-chevron-right"></i></button>
                        </div>
                        <button id="nextYear" class="btn btn-outline-secondary">Next Year <i class="fas fa-angle-double-right"></i></button>
                    </div>
                    <div id="calendarGrid" class="fade-in"></div>
                </div>
                
                <!-- Stats and Reminder Section -->
                <div class="stats-section">
                    <!-- Days Present Card -->
                    <div class="stat-card days-present">
                        <h3>Days Present</h3>
                        <div class="stat-value">
                            <i class="fas fa-hand-paper"></i>
                            <span id="daysPresent">0</span>
                        </div>
                    </div>
                    
                    <!-- Days Absent Card -->
                    <div class="stat-card days-absent">
                        <h3>Days Absent</h3>
                        <div class="stat-value">
                            <i class="fas fa-user-slash"></i>
                            <span id="daysAbsent">0</span>
                        </div>
                    </div>
                    
                    <!-- Attendance Reminder Card -->
                    <div class="attendance-reminder">
                        <h3>Attendance Reminder</h3>
                        <p id="attendanceMessage">Loading attendance information...</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Task Modal -->
<div class="modal fade" id="taskModal" tabindex="-1" aria-labelledby="taskModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="taskModalLabel">Tasks for <span id="selectedDate"></span></h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div id="taskList" class="task-list"></div>
                <div class="mt-3">
                    <form id="taskForm">
                        <div class="mb-3">
                            <label for="taskInput" class="form-label">Add New Task</label>
                            <input type="text" class="form-control" id="taskInput" placeholder="Enter task description" required>
                        </div>
                        <button type="submit" class="btn btn-primary">Add Task</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
<script src="../../scripts/studentcontent/student-details.js"></script>
<script src="../../scripts/logout.js"></script>

</body>
</html>