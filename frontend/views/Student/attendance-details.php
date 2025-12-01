<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>IT 115: Web Systems - Attendance</title>
    
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
    
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    
     <!-- Custom CSS -->
    <link rel="stylesheet" href="../../css/main.css">
    <link rel="stylesheet" href="../../css/header.css">
    <link rel="stylesheet" href="../../css/sidebar.css">
     <link rel="stylesheet" href="../../css/modal.css">
     <link rel="stylesheet" href="../../css/attendance-details.css">
</head>
<body>
    <!-- Header -->
    <?php include 'components/header.php'; ?>

    <!-- Main Container with Sidebar and Content -->
    <div class="container-fluid">
        <div class="row">
            
            <!-- Sidebar -->
            <div class="col-md-3 col-lg-2 p-0">
                <?php include 'components/sidebar.php'; ?>
            </div>

            <div class="main-content">
                <!-- Header with Title and Back Button -->
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <div>
                        <h2 class="section-title">IT_101</h2>
                        <div class="semester-info">1st Semester S.Y. 2024-2025</div>
                    </div>
                    <!-- Back Button on the right -->
                    <a href="student.php" class="btn" style="background-color: #012970; color: white; border: none;">
                        <i class="fas fa-arrow-left me-2"></i>Back to Attendance
                    </a>
                </div>
                
                <div class="calendar-container">
                    <!-- Calendar Section -->
                    <div class="calendar-section">
                        <div class="calendar-grid" id="calendarGrid">
                            <!-- Calendar months will be dynamically generated here -->
                        </div>
                    </div>
                    
                    <!-- Stats and Reminder Section -->
                    <div class="stats-section">
                        <!-- Days Present Card -->
                        <div class="stat-card days-present">
                            <h3>Days Present</h3>
                            <div class="stat-value">
                                <i class="fas fa-hand-paper"></i>
                                <span id="daysPresent">67</span>
                            </div>
                        </div>
                        
                        <!-- Days Absent Card -->
                        <div class="stat-card days-absent">
                            <h3>Days Absent</h3>
                            <div class="stat-value">
                                <i class="fas fa-user-slash"></i>
                                <span id="daysAbsent">2</span>
                            </div>
                        </div>
                        
                        <!-- Attendance Reminder Card -->
                        <div class="attendance-reminder">
                            <h3>Attendance Reminder</h3>
                            <p id="attendanceMessage">Your attendance is excellent! Keep up the good work.</p>
                        </div>
                    </div>
                </div>
                
                <!-- Pagination Section -->
                <div class="pagination-wrapper">
                    <div id="paginationInfo">Showing 1 to 8 of 8 entries</div>
                    <nav>
                        <ul class="pagination pagination-sm mb-0">
                            <li class="page-item disabled"><a class="page-link" href="#">Previous</a></li>
                            <li class="page-item active"><a class="page-link" href="#">1</a></li>
                            <li class="page-item disabled"><a class="page-link" href="#">Next</a></li>
                        </ul>
                    </nav>
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
                    <div id="taskList" class="task-list">
                        <!-- Tasks will be displayed here -->
                    </div>
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
    
    <!-- Bootstrap JS Bundle -->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
     <script src="../../scripts/studentcontent/attendance-details.js"></script>
  
</body>
</html>