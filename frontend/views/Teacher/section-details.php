<?php
include __DIR__ . '/../../../backend/db/conn.php';
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Section 3B - Attendance</title>

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.css">

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

            <div class="col-md-9 col-lg-10 p-0">
                <div class="p-4">
                    
                    <h1 class="bsit-title mb-4">BSIT 3B</h1>

                    <?php
                        // Dynamic student data array - Students are loaded with NO initial 'present' status
                        $students = [
                            ['id' => '23101000', 'name' => 'William Sy', 'section' => '3B'],
                            ['id' => '23101001', 'name' => 'Cristalyn De Dios', 'section' => '3B'],
                            ['id' => '23101002', 'name' => 'Amihan Devas', 'section' => '3B'],
                            ['id' => '23101003', 'name' => 'Armea Lireo', 'section' => '3B'],
                            ['id' => '23101004', 'name' => 'Kruk Kruk', 'section' => '3B'],
                            ['id' => '23101005', 'name' => 'Ina Merz', 'section' => '3B'],
                            ['id' => '23101006', 'name' => 'William Sy', 'section' => '3B']
                        ];
                        $totalCount = count($students);
                        // Initial counts are set for a fresh session (all absent)
                        $presentCount = 0; 
                        $absentCount = $totalCount;
                    ?>

                    <div class="card shadow-sm p-4 mb-4">
                        
                        <h2 class="section-heading mb-3 h4 fw-bold">Section Information</h2>
                        
                        <div class="row">
                            
                            <div class="col-md-6 border-end">
                                <div class="row ps-3">
                                    <div class="col-12 d-flex mb-2">
                                        <p class="text-secondary me-3 mb-0" style="width: 70px;">Subject</p>
                                        <p class="fw-bold mb-0 flex-grow-1">IT 101 - Introduction to Computing 1 (ACHUCUCUCUCCUCUCUHU HINDI MAAAPEKTUHAN 'YUNG ANALYTICS 'PAG NAGING DYNAMIC)</p>
                                    </div>
                                </div>
                                <div class="row ps-3">
                                    <div class="col-12 d-flex mb-0">
                                        <p class="text-secondary me-3 mb-0" style="width: 70px;">Teacher</p>
                                        <p class="fw-bold mb-0 flex-grow-1">gusto ko ng tiramisu cake</p>
                                    </div>
                                </div>
                            </div>

                            <div class="col-md-6">
                                <div class="row text-center">
                                    
                                    <div class="col-4">
                                        <h5 class="card-title text-success mb-1">
                                            <i class="fa-solid fa-check me-1"></i> Present
                                        </h5>
                                        <h2 class="display-6 text-success mb-0 fw-bold" id="presentCount">
                                            <?php echo $presentCount; ?>
                                        </h2>
                                    </div>
                                    
                                    <div class="col-4">
                                        <h5 class="card-title text-secondary mb-1">
                                            <i class="fa-solid fa-xmark me-1"></i> Absent
                                        </h5>
                                        <h2 class="display-6 text-secondary mb-0 fw-bold" id="absentCount">
                                            <?php echo $absentCount; ?>
                                        </h2>
                                    </div>
                                    
                                    <div class="col-4">
                                        <h5 class="card-title text-primary mb-1">
                                            <i class="fa-solid fa-users me-1"></i> Total
                                        </h5>
                                        <h2 class="display-6 text-primary mb-0 fw-bold" id="totalCount">
                                            <?php echo $totalCount; ?>
                                        </h2>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="card shadow-sm">
                        <div class="card-header bg-white border-bottom-0 pt-3 d-flex justify-content-between align-items-center">
                            <h3 class="section-heading h5 fw-bold mb-0">Student List</h3>
                            
                            <div>
                                <button class="btn btn-sm btn-light border me-2 action-btn" id="markAllPresent">
                                    <i class="fa-solid fa-check-double me-1"></i> Mark All as Present
                                </button>
                                <button class="btn btn-sm btn-primary save-btn" id="saveAttendance">
                                    <i class="fa-solid fa-floppy-disk me-1"></i> Save Attendance
                                </button>
                            </div>
                        </div>

                        <div class="card-body p-0">
                            <div class="table-responsive">
                                <table class="table table-hover student-table align-middle mb-0" id="attendanceTable">
                                    <thead class="table-light">
                                        <tr>
                                            <th class="text-center" style="width: 80px;">Action</th>
                                            <th>Student ID No.</th>
                                            <th>Student Name</th>
                                            <th>Section</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <?php foreach ($students as $student):
                                            $statusClass = 'bg-secondary';
                                            $statusText = 'Absent';
                                            $isChecked = '';
                                        ?>
                                        <tr data-student-id="<?php echo $student['id']; ?>">
                                            <td>
                                                <div class="form-check d-flex justify-content-center">
                                                    <input class="form-check-input attendance-checkbox" 
                                                        type="checkbox" 
                                                        id="attendance_<?php echo $student['id']; ?>"
                                                        data-student-id="<?php echo $student['id']; ?>"
                                                        <?php echo $isChecked; ?>>
                                                </div>
                                            </td>
                                            <td><strong class="text-dark"><?php echo $student['id']; ?></strong></td>
                                            <td><?php echo $student['name']; ?></td>
                                            <td><a href="#" class="text-decoration-none fw-bold text-primary"><?php echo $student['section']; ?></a></td>
                                            <td>
                                                <span class="badge <?php echo $statusClass; ?> status-badge d-flex align-items-center justify-content-center" style="width: 85px;">
                                                    <i class="fa-solid fa-circle-xmark me-1" style="font-size: 0.7em;"></i>
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
                            <span class="text-muted">
                                Showing <?php echo $totalCount; ?> students
                            </span>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>


<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
<script src="../../scripts/teachercontent/section-details.js"></script>

</body>
</html>