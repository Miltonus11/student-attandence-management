
<?php
include __DIR__ . '/../../../backend/db/conn.php';

// Handle form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $class_name    = trim($_POST['class_name'] ?? '');
    $class_section = trim($_POST['class_section'] ?? '');
    $subject_id    = intval($_POST['subject_id'] ?? 0);
    $year_level    = intval($_POST['year_level'] ?? 0);
    $students      = $_POST['students'] ?? [];

    if ($class_name === '' || $class_section === '' || $subject_id === 0 || $year_level === 0) {
        $error = "Please fill in Class Name, Section, Subject and Year Level.";
    } else {
        $insert = $conn->prepare("INSERT INTO tbl_class (class_name, subject_id) 
                                  VALUES (:name, :subject_id)");
        $insert->execute([
            ':name' => $class_name,
            ':subject_id' => $subject_id
        ]);
        $class_id = $conn->lastInsertId();

        if (!empty($students)) {
            $update = $conn->prepare("UPDATE tbl_students SET class_id = :class_id WHERE student_id = :sid");
            foreach ($students as $sid) {
                $update->execute([':class_id' => $class_id, ':sid' => (int)$sid]);
            }
        }

        header("Location: section.php");
        exit;
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Add Class</title>

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>

    <link rel="stylesheet" href="../../css/main.css">
    <link rel="stylesheet" href="../../css/header.css">
    <link rel="stylesheet" href="../../css/sidebar.css">
    <link rel="stylesheet" href="../../css/modal.css">
</head>
<body>

<?php include 'components/header.php'; ?>

<div class="container-fluid">
    <div class="row">

        <div class="col-md-3 col-lg-2 p-0">
            <?php include 'components/sidebar.php'; ?>
        </div>

        <div class="col-md-9 col-lg-10 p-4">

            <div class="d-flex justify-content-between align-items-center border-bottom pb-3 mb-4">
                <h2>Add a Class</h2>
                <div class="d-flex gap-2">
                    <button form="addClassForm" type="submit" class="btn btn-primary">
                        <i class="fa-regular fa-floppy-disk"></i> Submit
                    </button>
                    <button class="btn btn-outline-secondary" onclick="window.location.href='section.php'">
                        <i class="fa-solid fa-xmark me-1"></i> Cancel
                    </button>
                </div>
            </div>

            <?php if(!empty($error)): ?>
                <div class="alert alert-danger"><?=htmlspecialchars($error)?></div>
            <?php endif; ?>

            <form id="addClassForm" action="add-classes.php" method="POST" class="mb-4">
                <div class="row g-4">
                    <div class="col-md-6">
                        <div class="mb-3">
                            <label for="className" class="form-label text-muted">Class Name</label>
                            <input type="text" class="form-control" id="className" name="class_name" placeholder="Set Class Name" required>
                        </div>
                        <div class="mb-3">
                            <label for="classSection" class="form-label text-muted">Section</label>
                            <input type="text" class="form-control" id="classSection" name="class_section" placeholder="Ex: BSIT 3" required>
                        </div>
                        <div class="mb-3">
                            <label for="assignSubject" class="form-label text-muted">Assign Subject</label>
                            <select class="form-select" id="assignSubject" name="subject_id" required>
                                <option value="">Assign Subject</option>
                                <?php
                                $sstmt = $conn->query("SELECT subject_id, subject_name FROM tbl_subjects ORDER BY subject_name ASC");
                                while ($s = $sstmt->fetch()) {
                                    echo "<option value=\"{$s['subject_id']}\">" . htmlspecialchars($s['subject_name']) . "</option>";
                                }
                                ?>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label for="yearLevelFilter" class="form-label text-muted">Year Level</label>
                            <select class="form-select w-auto" id="yearLevelFilter" name="year_level" required>
                                <option value="">Select Year Level</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                            </select>
                        </div>
                    </div>
                </div>


            <div class="d-flex justify-content-between align-items-center mb-3">
                <div class="d-flex gap-2">
                    <button id="selectAllBtn" class="btn btn-sm btn-outline-secondary" type="button">Select All</button>
                    <button id="clearAllBtn" class="btn btn-sm btn-outline-secondary" type="button">Clear</button>
                </div>
                <div class="input-group w-25">
                    <span class="input-group-text bg-white border-end-0"><i class="fas fa-search"></i></span>
                    <input type="text" class="form-control border-start-0" id="searchInput" placeholder="Search students">
                </div>
            </div>

            <div class="table-container" style="max-height:420px; overflow:auto;">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Action</th>
                            <th>Student ID</th>
                            <th>Student Name</th>
                            <th>Year Level</th>
                            <th>Details</th>
                        </tr>
                    </thead>
                    <tbody id="studentTableBody">
                        <tr><td colspan="5">Please select a Year Level</td></tr>
                    </tbody>
                </table>
            </div>

            </form> 

            <!-- MODAL -->
            <div class="modal fade" id="viewStudentModal" tabindex="-1" aria-labelledby="viewStudentModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-md modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header" style="background:#012970; color:white;">
                            <h5 class="modal-title" id="viewStudentModalLabel">Student Details</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <p><strong>Student ID:</strong> <span id="viewStudentId">-</span></p>
                            <p><strong>Name:</strong> <span id="viewStudentName">-</span></p>
                            <p><strong>Year Level:</strong> <span id="viewStudentyearlevel">-</span></p>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>A
</div>

<script src="../../scripts/admincontent/add-classes.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
     <script src="../../scripts/logout.js"></script>
</body>
</html>
