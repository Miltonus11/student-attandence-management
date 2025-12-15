<?php
    require_once('../../../backend/controllers/auth/admin-auth-check.php');
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard</title>
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <!-- Chart.js -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <!-- css -->
    <link rel="stylesheet" href="../../css/main.css"> 
    <link rel="stylesheet" href="../../css/header.css">
    <link rel="stylesheet" href="../../css/sidebar.css">
    <link rel="stylesheet" href="../../css/dashboard_content.css">
  
</head>
<body>
    <!-- Header -->
    <?php include 'components/header.php'; ?>
    
    <!-- Main Container -->
    <div class="container-fluid">
        <div class="row">
            <!-- Sidebar -->
            <?php include 'components/sidebar.php'; ?>

            <!-- Main Content -->
            <div class="col-md-9 col-lg-10 main_content">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h1 class="page_title">Administrator Dashboard</h1>
                    <!-- Simple Generate Report Button -->
                    <button type="button" class="btn-generate" onclick="openSummaryModal()">
                        <i class="fas fa-file-pdf me-1"></i> Generate Summary
                    </button>
                </div>  

                <!-- Main Dashboard Cards -->
                <div class="row">
                    <!-- Teachers Card -->
                    <div class="col-md-6 col-lg-3">
                        <div class="dashboard_card card-teachers" onclick="window.location.href='teachers.php'">
                            <div class="card_content">
                                <div class="card_label">Teachers</div>
                                <div class="card_value" id="teachersCount">0</div>
                            </div>
                            <div class="card_icon">
                                <i class="fas fa-chalkboard-teacher"></i>
                            </div>
                        </div>
                    </div>

                    <!-- Section Card -->
                    <div class="col-md-6 col-lg-3">
                        <div class="dashboard_card card-classes" onclick="window.location.href='section.php'">
                            <div class="card_content">
                                <div class="card_label">Sections</div>
                                <div class="card_value" id="sectionsCount">0</div>
                            </div>
                            <div class="card_icon">
                                <i class="fas fa-chalkboard"></i>
                            </div>
                        </div>
                    </div>

                    <!-- Students Card -->
                    <div class="col-md-6 col-lg-3">
                        <div class="dashboard_card card-students" onclick="window.location.href='students.php'">
                            <div class="card_content">
                                <div class="card_label">Students</div>
                                <div class="card_value" id="studentsCount">0</div>
                            </div>
                            <div class="card_icon">
                                <i class="fas fa-user-graduate"></i>
                            </div>
                        </div>
                    </div>

                    <!-- Subject Card -->
                    <div class="col-md-6 col-lg-3">
                        <div class="dashboard_card card-attendance" onclick="window.location.href='subject.php'">
                            <div class="card_content">
                                <div class="card_label">Subjects</div>
                                <div class="card_value" id="subjectsCount">0</div>
                            </div>
                            <div class="card_icon">
                                <i class="fas fa-book-open"></i>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Weekly Attendance Chart -->
                <div class="row mt-4">
                    <div class="col-12">
                        <div class="card">
                            <div class="card-header">
                                <h5 class="mb-0">Weekly Attendance</h5>
                            </div>
                            <div class="card-body">
                                <canvas id="attendanceChart" height="250"></canvas>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Simple Summary Modal -->
    <div class="modal fade" id="summaryModal" tabindex="-1" aria-labelledby="summaryModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header bg-primary text-white">
                    <h5 class="modal-title" id="summaryModalLabel">
                        <i class="fas fa-chart-bar me-2"></i>Attendance Summary
                    </h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                   
                <!-- Date Selection -->
                    <div class="mb-4">
                        <label for="summaryDate" class="form-label">Select Date</label>
                        <input type="date" class="form-control" id="summaryDate" value="<?php echo date('Y-m-d'); ?>">
                    </div>
                    
                    <!-- Summary Statistics -->
                    <div class="summary-stats">
                        <div class="row text-center">
                            <div class="col-md-3">
                                <h5 class="text-muted">Total Students</h5>
                                <h3 id="summaryTotal">0</h3>
                            </div>
                            <div class="col-md-3">
                                <h5 class="text-success">Present</h5>
                                <h3 id="summaryPresent">0</h3>
                            </div>
                            <div class="col-md-3">
                                <h5 class="text-danger">Absent</h5>
                                <h3 id="summaryAbsent">0</h3>
                            </div>
                            <div class="col-md-3">
                                <h5 class="text-info">Attendance %</h5>
                                <h3 id="summaryPercentage">0%</h3>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Present Students -->
                    <div class="mb-4">
                        <h5 class="mb-3 text-success" id="presentStudentsHeader">
                            <i class="fas fa-check-circle me-2"></i>Present Students (0)
                        </h5>
                        <div class="table-responsive">
                            <table class="table table-sm" id="presentTable">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Student ID</th>
                                        <th>Name</th>
                                        <th>Section</th>
                                    </tr>
                                </thead>
                                <tbody id="presentStudentsBody">
                                    <!-- Present students will be populated here -->
                                </tbody>
                            </table>
                        </div>
                    </div>
                    
                    <!-- Absent Students -->
                    <div class="mb-4">
                        <h5 class="mb-3 text-danger" id="absentStudentsHeader">
                            <i class="fas fa-times-circle me-2"></i>Absent Students (0)
                        </h5>
                        <div class="table-responsive">
                            <table class="table table-sm" id="absentTable">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Student ID</th>
                                        <th>Name</th>
                                        <th>Section</th>
                                    </tr>
                                </thead>
                                <tbody id="absentStudentsBody">
                                    <!-- Absent students will be populated here -->
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn-download-pdf" onclick="downloadSimplePDF()">
                        <i class="fas fa-file-pdf me-1"></i> Download PDF
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Bootstrap JS Bundle with Popper -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
    <script src="../../scripts/logout.js"></script>
      <script src="../../scripts/admincontent/dashboard-analytics.js"></script>  
   
</body>
</html>