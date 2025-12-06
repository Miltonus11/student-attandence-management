<?php
    require_once('../../../backend/controllers/auth/teacher-auth-check.php');
    $teacher_id = $_SESSION['instructor_id'];
    $first_name = $_SESSION['first_name'];
    $last_name = $_SESSION['last_name'];

    echo $teacher_id;
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0"> 
    <title>Teacher Section</title>

    <!-- Bootstrap -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <!-- Custom CSS -->
    <link rel="stylesheet" href="../../css/main.css">
    <link rel="stylesheet" href="../../css/header.css">
    <link rel="stylesheet" href="../../css/sidebar.css">
    <link rel="stylesheet" href="../../css/modal.css">
    <link rel="stylesheet" href="../../css/teacher/section-details.css"> 
   
</head>
<body>

<?php include 'components/header.php'; ?>

<div class="container-fluid">
    <div class="row">
        <div class="col-md-3 col-lg-2 p-0">
            <?php include 'components/sidebar.php'; ?>
        </div>

        <div class="col-md-9 col-lg-10 p-4">
            <h2 class="mb-4 section-header" style="color: #012970; font-weight: bold;">
                <i class="fas fa-users" style="color: #012970;"></i> Class Information
            </h2>

        
            <div class="row g-4">
                <!-- Section Information Card -->
                <div class="col-md-6">
                    <div class="card shadow-sm info-card h-100">
                        <div class="card-body">
                            <h3 class="mb-3" id="sectionName">Section Name</h3>
                            <p class="mb-1"><strong>Subject:</strong></p>
                            <h5 id="subjectText">Subject here</h5>
                            <p class="mb-1 mt-2"><strong>Teacher:</strong></p>
                            <h5 id="teacherText">Teacher here</h5>
                        </div>
                    </div>
                </div>

                <!-- Analytics Card -->
                <div class="col-md-6">
                    <div class="card shadow-sm analytics-card h-100">
                        <div class="card-body d-flex justify-content-around align-items-center text-center">
                            <div>
                                <i class="fas fa-user-check fa-2x mb-2 analytics-icon"></i>
                                <h6 class="mb-0">Present</h6>
                                <h4 id="presentCount">0</h4>
                            </div>
                            <div>
                                <i class="fas fa-user-xmark fa-2x mb-2 analytics-icon"></i>
                                <h6 class="mb-0">Absent</h6>
                                <h4 id="absentCount">0</h4>
                            </div>
                            <div>
                                <i class="fas fa-users fa-2x mb-2 analytics-icon"></i>
                                <h6 class="mb-0">Total</h6>
                                <h4 id="totalCount2">0</h4>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

             
            <!-- Student Table -->
            <div class="card shadow-sm mt-4">

             
                <!-- Card header with Title, Search, and Buttons -->
                <div class="card-header bg-white">
                    <div class="d-flex justify-content-between align-items-center">
                        <!-- Title and Search on the left -->
                        <div class="d-flex align-items-center gap-3">
                            <h3 class="h5 mb-0">Student List</h3>
                            <div class="position-relative">
                                <input 
                                    type="text" 
                                    id="searchInput" 
                                    class="form-control form-control-sm" 
                                    placeholder="Search by name or ID..." 
                                    aria-label="Search students"
                                />
                                <i class="fas fa-search position-absolute top-50 end-0 translate-middle-y me-2 text-muted"></i>
                            </div>
                        </div>

                        <!-- Calendar and Buttons on the right -->
                        <div class="d-flex align-items-center gap-2">
                            <!-- Calendar input -->
                            <input 
                                type="date" 
                                id="attendanceDate" 
                                class="form-control form-control-sm custom-date-input"
                                aria-label="Select attendance date"
                            />

                            <!-- Mark All Present button -->
                            <button class="btn btn-darkblue btn-primary" id="markAllPresent" aria-label="Mark all students as present">
                                <i class="fas fa-user-check me-1"></i> Mark All Present
                            </button>

                            <!-- Save Attendance button -->
                            <button class="btn btn-darkblue btn-primary" id="saveAttendance" aria-label="Save attendance data">
                                <i class="fas fa-floppy-disk me-1"></i> Save Attendance
                            </button>

                            <button class="btn btn-danger me-2" id="downloadPDF" aria-label="Download attendance as PDF">
                               <i class="fas fa-file-pdf me-1"></i> Download PDF
                            </button>

                        </div>

                    </div>
                </div>

                <!-- Table Body -->
                <div class="card-body p-0" style="max-height: 400px; overflow-y: auto;">
                    <table class="table table-hover mb-0" id="attendanceTable">
                        <thead class="table-light">
                            <tr>
                                <th width="90">Action</th>
                                <th>Student ID No.</th>
                                <th>Student Name</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- JS will fill rows (mockdata) -->
                        </tbody>
                    </table>
                </div>

                <div class="card-footer bg-white">
                    <span class="text-muted">Showing <span id="totalCount">0</span> students</span>
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
                   
                    <!-- Present Students -->
                    <div class="mb-4">
                        <h5 class="mb-3 text-success">
                            <i class="fas fa-check-circle me-2"></i>Present Students (720)
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
                        <h5 class="mb-3 text-danger">
                            <i class="fas fa-times-circle me-2"></i>Absent Students (130)
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
                
                </div>
            </div>
        </div>
    </div>


<!-- Scripts -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.25/jspdf.plugin.autotable.min.js"></script>
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
<script src="../../scripts/teachercontent/section-details.js"></script>
<!-- <script src="scripts/script.js"></script>  -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
<script src="../../scripts/logout.js"></script>

</body>
</html>