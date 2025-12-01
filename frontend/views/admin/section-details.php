<?php
include __DIR__ . '/../../../backend/db/conn.php';

if (!isset($_GET['class_id'])) {
    die("Class ID missing.");
}

$class_id = (int)$_GET['class_id'];

// Fetch class info
$stmt = $conn->prepare("SELECT * FROM tbl_class WHERE class_id = ?");
$stmt->execute([$class_id]);
$class = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$class) {
    die("Class not found.");
}

// Fetch subject info
$subStmt = $conn->prepare("SELECT * FROM tbl_subjects WHERE subject_id = ?");
$subStmt->execute([$class['subject_id']]);
$subject = $subStmt->fetch(PDO::FETCH_ASSOC);

// Fetch all available subjects
$allSubjectsStmt = $conn->prepare("SELECT * FROM tbl_subjects ORDER BY subject_name ASC");
$allSubjectsStmt->execute();
$allSubjects = $allSubjectsStmt->fetchAll(PDO::FETCH_ASSOC);

// Fetch assigned students
$stuStmt = $conn->prepare("
    SELECT * FROM tbl_students 
    WHERE class_id = ? 
    ORDER BY last_name ASC, first_name ASC
");
$stuStmt->execute([$class_id]);
$students = $stuStmt->fetchAll(PDO::FETCH_ASSOC);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Class Details</title>

    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">

    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

    <!-- jQuery -->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>

    <!-- Custom CSS Files -->
    <link rel="stylesheet" href="../../css/main.css">
    <link rel="stylesheet" href="../../css/header.css">
    <link rel="stylesheet" href="../../css/sidebar.css">
    <link rel="stylesheet" href="../../css/modal.css">

    <!-- SEPARATED CSS -->
    <link rel="stylesheet" href="../../frontend/css/admin/section.css">
</head>
<body>

    <!-- Header -->
    <?php include 'components/header.php'; ?>

    <div class="container-fluid">
        <div class="row">

            <!-- Sidebar -->
            <div class="col-md-3 col-lg-2 p-0">
                <?php include 'components/sidebar.php'; ?>
            </div>

            <!-- Main Content -->
            <div class="col-md-9 col-lg-10 p-4">
                
                <input type="hidden" id="sectionClassId" value="<?= $class_id ?>">
                <button class="btn btn-secondary mb-3" onclick="location.href='section.php'">
                    <i class="fas fa-arrow-left"></i> Back
                </button>

                <div class="card p-4 mb-4">
                    <h4 class="mb-3">
                        <i class="fas fa-users text-primary me-2"></i> <?= htmlspecialchars($class['class_name']) ?>
                    </h4>
                    <p class="mb-1">
                        <strong>Assigned Subject:</strong>
                        <span id="currentSubject">
                            <?= $subject ? htmlspecialchars($subject['subject_name']) : "<span class='text-muted'>None Assigned</span>" ?>
                        </span>
                        <button class="btn btn-sm btn-primary ms-2" data-bs-toggle="modal" data-bs-target="#assignSubjectModal">
                            <i class="fas fa-edit me-1"></i> Change Subject
                        </button>
                    </p>
                    <p class="student-count mt-2">Total Students: <?= count($students) ?></p>
                </div>

                <div class="card p-3">
                    <h4 class="mb-3">
                        <i class="fas fa-users text-primary me-2"></i> Assigned Students
                    </h4>
                    <div class="mt-3">
                        <button class="btn btn-sm btn-success" id="openAssignStudentsBtn">
                            <i class="fas fa-user-plus me-1"></i> Assign Students
                        </button>
                    </div>

                    <?php if ($students): ?>
                        <div class="table-responsive">
                            <table class="table table-hover student-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Student ID</th>
                                        <th>Year Level</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <?php foreach ($students as $s): ?>
                                        <tr>
                                            <td><?= htmlspecialchars($s['first_name'] . ' ' . $s['last_name']) ?></td>
                                            <td><?= htmlspecialchars($s['student_number'] ?? '-') ?></td>
                                            <td><span class="badge bg-secondary">Year <?= $s['year_level'] ?></span></td>
                                        </tr>
                                    <?php endforeach; ?>
                                </tbody>
                            </table>
                        </div>
                    <?php else: ?>
                        <p class="text-muted">No students assigned to this class.</p>
                    <?php endif; ?>
                </div>

            </div>
        </div>
    </div>

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>

    <!-- Assign Students Modal -->
    <div class="modal fade" id="assignStudentsModal" tabindex="-1" aria-labelledby="assignStudentsModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header" style="background:#012970; color:white;">
                    <h5 class="modal-title" id="assignStudentsModalLabel">Assign Students to Class</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <p class="text-muted">Select one or more students to assign to this class.</p>
                    <div class="table-responsive" style="max-height:400px; overflow:auto;">
                        <table class="table table-sm table-hover">
                            <thead>
                                <tr>
                                    <th><input type="checkbox" id="selectAllUnassigned"></th>
                                    <th>Name</th>
                                    <th>Student ID</th>
                                    <th>Year Level</th>
                                </tr>
                            </thead>
                            <tbody id="unassignedStudentsBody">
                                <tr><td colspan="4">Loading...</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-primary" id="assignSelectedStudentsBtn">Assign Selected</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Section details JS -->
    <script src="../../scripts/admincontent/section-details.js"></script>

    <!-- Assign Subject Modal -->
    <div class="modal fade" id="assignSubjectModal" tabindex="-1" aria-labelledby="assignSubjectModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header" style="background:#012970; color:white;">
                    <h5 class="modal-title" id="assignSubjectModalLabel">
                        <i class="fas fa-book-open me-2"></i>Assign Subject to Class
                    </h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form id="assignSubjectForm">
                        <div class="mb-3">
                            <label for="subjectSelect" class="form-label">Select Subject <span class="text-danger">*</span></label>
                            <select class="form-select" id="subjectSelect" name="subject_id" required>
                                <option value="">-- Choose a Subject --</option>
                                <?php foreach ($allSubjects as $s): ?>
                                    <option value="<?= $s['subject_id'] ?>" <?= ($class['subject_id'] == $s['subject_id']) ? 'selected' : '' ?>>
                                        <?= htmlspecialchars($s['subject_name']) ?>
                                    </option>
                                <?php endforeach; ?>
                            </select>
                            <small class="text-muted d-block mt-2">
                                <i class="fas fa-info-circle me-1"></i>Select a subject to assign to this class.
                            </small>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-primary" id="assignSubjectBtn">
                        <i class="fas fa-check me-1"></i>Assign Subject
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- JavaScript for Assign Subject -->
    <script>
        const classId = <?= $class_id ?>;

        // Assign Subject Button Click Handler
        document.getElementById('assignSubjectBtn').addEventListener('click', function() {
            const subjectId = document.getElementById('subjectSelect').value;
            
            if (!subjectId) {
                alert('Please select a subject first.');
                return;
            }

            // Show loading state
            const btn = this;
            const originalText = btn.innerHTML;
            btn.disabled = true;
            btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Assigning...';

            // Send AJAX request to assign subject
            fetch('../../../backend/controllers/admin-controller/sections/assignSubjectSections.php', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    class_id: classId,
                    subject_id: parseInt(subjectId)
                })
            })
            .then(response => response.json())
            .then(data => {
                btn.disabled = false;
                btn.innerHTML = originalText;

                if (data.message) {
                    // Success
                    alert('Subject assigned successfully!');
                    
                    // Update the displayed subject
                    const selectedOption = document.getElementById('subjectSelect').options[document.getElementById('subjectSelect').selectedIndex];
                    document.getElementById('currentSubject').innerHTML = selectedOption.text;
                    
                    // Close modal
                    const modal = bootstrap.Modal.getInstance(document.getElementById('assignSubjectModal'));
                    modal.hide();
                    
                    // Reload page after 1 second
                    setTimeout(() => {
                        location.reload();
                    }, 1000);
                } else {
                    alert('Error: ' + (data.message || 'Failed to assign subject'));
                }
            })
            .catch(error => {
                btn.disabled = false;
                btn.innerHTML = originalText;
                console.error('Error:', error);
                alert('An error occurred while assigning the subject. Please try again.');
            });
        });

        // Reset form when modal is closed
        document.getElementById('assignSubjectModal').addEventListener('hidden.bs.modal', function() {
            document.getElementById('assignSubjectForm').reset();
        });
    </script>

</body>
</html>
