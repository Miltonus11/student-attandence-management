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
            <h2 class="mb-4 section-header">
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
                                <i class="fas fa-user-check fa-2x mb-2"></i>
                                <h6 class="mb-0">Present</h6>
                                <h4 id="presentCount">0</h4>
                            </div>
                            <div>
                                <i class="fas fa-user-xmark fa-2x mb-2"></i>
                                <h6 class="mb-0">Absent</h6>
                                <h4 id="absentCount">0</h4>
                            </div>
                            <div>
                                <i class="fas fa-users fa-2x mb-2"></i>
                                <h6 class="mb-0">Total</h6>
                                <h4 id="totalCount2">0</h4>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Student Table -->
            <div class="card shadow-sm mt-4">
                <div class="card-header bg-white d-flex justify-content-between align-items-center">
                    <h3 class="h5 mb-0">Student List</h3>
                    <div>
                        <button class="btn btn-darkblue me-2" id="markAllPresent" aria-label="Mark all students as present">
                            <i class="fas fa-user-check me-1"></i> Mark All Present
                        </button>
                        <button class="btn btn-darkblue me-2" id="saveAttendance" aria-label="Save attendance data">
                            <i class="fas fa-floppy-disk me-1"></i> Save Attendance
                        </button>
                    </div>
                </div>

                <div class="card-body p-0" style="max-height: 400px; overflow-y: auto;">
                    <table class="table table-hover mb-0" id="attendanceTable">
                        <thead class="table-light">
                            <tr>
                                <th width="90">Action</th>
                                <th>Student ID No.</th>
                                <th>Student Name</th>
                                <th>Section</th>
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

<!-- Scripts -->
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
<script src="../../scripts/teachercontent/section-details.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>

</body>
</html>