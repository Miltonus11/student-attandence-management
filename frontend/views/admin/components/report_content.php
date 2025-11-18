<div class="col-md-9 col-lg-10 mt-4">
        <div class="container-fluid">
            <nav aria-label="breadcrumb">
                <ol class="breadcrumb">
                    <li class="breadcrumb_item"><a href="./admin-dashboard.php">Home</a></li>
                    <li class="breadcrumb_item active" aria-current="page">Report</li>
                </ol>
            </nav>

            <div class="container dashboard_container mt-4">
                <div class="row">
                    <!-- Main Content -->
                    <div class="col-md-9">
                        <h1>Administrator Dashboard</h1>

<div class="row">
    <div class="col-md-6 col-lg-3">
        <div class="dashboard_card card-students" onclick="window.location.href='students.php'">
            <div class="card_content">
                <div class="card_label">Students</div>
                <div class="card_value">4</div>
            </div>
            <div class="card_icon">
                <i class="fas fa-user-graduate"></i>
            </div>
        </div>
    </div>
    
    <div class="col-md-6 col-lg-3">
        <div class="dashboard_card card-classes" onclick="window.location.href='classes.php'">
            <div class="card_content">
                <div class="card_label">Classes</div>
                <div class="card_value">4</div>
            </div>
            <div class="card_icon">
                <i class="fas fa-chalkboard"></i>
            </div>
        </div>
    </div>
    
    <div class="col-md-6 col-lg-3">
        <div class="dashboard_card card-attendance">
            <div class="card_content">
                <div class="card_label">Total Student Attendance</div>
                <div class="card_value">47</div>
            </div>
            <div class="card_icon">
                <i class="fas fa-calendar-check"></i>
            </div>
        </div>
    </div>
          
    <div class="col-md-6 col-lg-3">
        <div class="dashboard_card card-teachers" onclick="window.location.href='teachers.php'">
            <div class="card_content">
                <div class="card_label">Class Teachers</div>
                <div class="card_value">1</div>
            </div>
            <div class="card_icon">
                <i class="fas fa-chalkboard-teacher"></i>
            </div>
        </div>
    </div>

    <div class="col-md-6 col-lg-3">
        <div class="dashboard_card card-session">
            <div class="card_content">
                <div class="card_label">Session & Terms</div>
                <div class="card_value">3</div>
            </div>
            <div class="card_icon">
                <i class="fas fa-chalkboard-teacher"></i>
            </div>
        </div>
    </div>
</div>
                        <div class="divider"></div>
                        
                        <!-- Report Navigation -->
                        <div class="row">
                            <div class="col-md-6">
                                <div class="card report-card">
                                    <div class="card-header bg-student-reports text-white">
                                        <h5 class="mb-0"><i class="fas fa-user-graduate me-2"></i>Student Reports</h5>
                                    </div>
                                    <div class="card-body">
                                        <div class="list-group">
                                            <a href="student_attendance.php" class="list-group-item list-group-item-action">
                                                <i class="fas fa-clipboard-list me-2"></i>Daily Attendance Report
                                            </a>
                                            <a href="student_monthly.php" class="list-group-item list-group-item-action">
                                                <i class="fas fa-calendar me-2"></i>Monthly Summary Report
                                            </a>
                                            <a href="student_individual.php" class="list-group-item list-group-item-action">
                                                <i class="fas fa-user me-2"></i>Individual Student Report
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="card report-card">
                                    <div class="card-header bg-teacher-reports text-white">
                                        <h5 class="mb-0"><i class="fas fa-chalkboard-teacher me-2"></i>Teacher Reports</h5>
                                    </div>
                                    <div class="card-body">
                                        <div class="list-group">
                                            <a href="teacher_attendance.php" class="list-group-item list-group-item-action">
                                                <i class="fas fa-clipboard-list me-2"></i>Daily Attendance Report
                                            </a>
                                            <a href="teacher_monthly.php" class="list-group-item list-group-item-action">
                                                <i class="fas fa-calendar me-2"></i>Monthly Summary Report
                                            </a>
                                            <a href="teacher_individual.php" class="list-group-item list-group-item-action">
                                                <i class="fas fa-user me-2"></i>Individual Teacher Report
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>