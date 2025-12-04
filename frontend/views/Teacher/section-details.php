<?php
include __DIR__ . '/../../../backend/db/conn.php';
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Teacher Section</title>

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>

    <link rel="stylesheet" href="../../css/main.css">
    <link rel="stylesheet" href="../../css/header.css">
    <link rel="stylesheet" href="../../css/sidebar.css">
    <link rel="stylesheet" href="../../css/modal.css">
    <link rel="stylesheet" href="../../css/section-details.css">
    
</head>
<body>

<?php include 'components/header.php'; ?>

<div class="container-fluid">
    <div class="row">

        <div class="col-md-3 col-lg-2 p-0">
            <?php include 'components/sidebar.php'; ?>
        </div>

        <div class="col-md-9 col-lg-10 p-4">
            
           

            <!-- Section Header -->
            <div class="section-header">
                <h1 class="mb-3">SSIT 3B</h1>
                <h2 class="h4 mb-4">Section Information</h2>
                
                <div class="row">
                    <div class="col-md-6">
                        <p class="mb-2"><strong>Subject</strong></p>
                        <h4>IT 101 - Introduction to Computing 1</h4>
                    </div>
                    <div class="col-md-6">
                        <p class="mb-2"><strong>Teacher</strong></p>
                        <h4>Boss Olen</h4>
                    </div>
                </div>
            </div>

            <!-- Student List Table -->
            <div class="card shadow-sm">
                <div class="card-header bg-white border-bottom-0 pt-3 d-flex justify-content-between align-items-center">
                    <div>
                        <h3 class="h5 mb-0">Student List</h3>
                    </div>
                    <div>
                        <button class="btn btn-success me-2" id="markAllPresent">
                            Mark All Present
                        </button>
                        <button class="btn btn-danger" id="markAllAbsent">
                            Mark All Absent
                        </button>
                    </div>
                </div>
                <div class="card-body p-0">
                    <div class="table-responsive">
                        <table class="table table-hover mb-0" id="attendanceTable">
                            <thead class="table-light">
                                <tr>
                                    <th width="80">Action</th>
                                    <th>Student ID No.</th>
                                    <th>Student Name</th>
                                    <th>Section</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php
                                // Dynamic student data array
                                //ito mock para makita if gagana para mamaya para sa js and for ajax para sa back end 
                                $students = [
                                    ['id' => '23101000', 'name' => 'William Sy', 'section' => '3B', 'present' => false],
                                    ['id' => '23101001', 'name' => 'Cristalyn De Dios', 'section' => '3B', 'present' => false],
                                    ['id' => '23101002', 'name' => 'Amihan Devas', 'section' => '3B', 'present' => false],
                                    ['id' => '23101003', 'name' => 'Armea Lireo', 'section' => '3B', 'present' => false],
                                    ['id' => '23101004', 'name' => 'Kruk Kruk', 'section' => '3B', 'present' => false],
                                    ['id' => '23101005', 'name' => 'Ina Merz', 'section' => '3B', 'present' => false]
                                ];

                                foreach ($students as $student):
                                    $statusClass = $student['present'] ? 'present' : 'absent';
                                    $statusText = $student['present'] ? 'Present' : 'Absent';
                                ?>
                                <tr data-student-id="<?php echo $student['id']; ?>">
                                    <td>
                                        <div class="form-check d-flex justify-content-center">
                                            <input class="form-check-input attendance-checkbox" 
                                                   type="checkbox" 
                                                   id="attendance_<?php echo $student['id']; ?>"
                                                   data-student-id="<?php echo $student['id']; ?>"
                                                   <?php echo $student['present'] ? 'checked' : ''; ?>>
                                            <!-- Removed the label text -->
                                        </div>
                                    </td>
                                    <td><strong><?php echo $student['id']; ?></strong></td>
                                    <td><?php echo $student['name']; ?></td>
                                    <td><span class="badge bg-primary"><?php echo $student['section']; ?></span></td>
                                    <td>
                                        <span class="badge bg-<?php echo $student['present'] ? 'success' : 'danger'; ?>">
                                            <?php echo $statusText; ?>
                                        </span>
                                    </td>
                                </tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="card-footer bg-white border-top-0 pt-3">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <span class="text-muted">
                                Showing <?php echo count($students); ?> students
                            </span>
                        </div>
                        <div>
                            <button class="btn btn-primary" id="saveAttendance">
                                Save Attendance
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Summary Statistics -->
            <div class="row mt-4">
                <div class="col-md-4">
                    <div class="card text-center border-success">
                        <div class="card-body">
                            <h5 class="card-title text-success">
                                Present
                            </h5>
                            <h2 class="display-6 text-success" id="presentCount">
                                <?php 
                                    $presentCount = array_sum(array_column($students, 'present'));
                                    echo $presentCount;
                                ?>
                            </h2>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card text-center border-danger">
                        <div class="card-body">
                            <h5 class="card-title text-danger">
                                Absent
                            </h5>
                            <h2 class="display-6 text-danger" id="absentCount">
                                <?php echo count($students) - $presentCount; ?>
                            </h2>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card text-center border-primary">
                        <div class="card-body">
                            <h5 class="card-title text-primary">
                                Total Students
                            </h5>
                            <h2 class="display-6 text-primary" id="totalCount">
                                <?php echo count($students); ?>
                            </h2>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
</div>


<!-- Optional: Include SweetAlert for better alert design -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css">
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
 <script src="../../scripts/teachercontent/section-details.js"></script>

</body>
</html>