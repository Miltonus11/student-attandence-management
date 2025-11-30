<?php
include __DIR__ . '/../../../backend/db/conn.php';

if (!isset($_GET['class_id'])) {
    die("Class ID missing.");
}

$class_id = (int)$_GET['class_id'];

// Fetch class info
$stmt = $conn->prepare("SELECT * FROM tbl_classes WHERE class_id = ?");
$stmt->execute([$class_id]);
$class = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$class) {
    die("Class not found.");
}

// Fetch subject info
$subStmt = $conn->prepare("SELECT * FROM tbl_subjects WHERE subject_id = ?");
$subStmt->execute([$class['subject_id']]);
$subject = $subStmt->fetch(PDO::FETCH_ASSOC);

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

    <style>
        body { background-color: #f4f6f9; }
        .card { border-radius: 12px; transition: all 0.3s ease; box-shadow: 0 2px 6px rgba(0,0,0,0.08); }
        .card:hover { transform: translateY(-3px); box-shadow: 0 6px 12px rgba(0,0,0,0.15); }
        .student-table th, .student-table td { vertical-align: middle; }
        .student-count { font-size: 0.9rem; color: #6c757d; }
    </style>

    <link rel="stylesheet" href="../../css/main.css">
    <link rel="stylesheet" href="../../css/header.css">
    <link rel="stylesheet" href="../../css/sidebar.css">
    <link rel="stylesheet" href="../../css/modal.css">
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

                <button class="btn btn-secondary mb-3" onclick="location.href='section.php'">
                    <i class="fas fa-arrow-left"></i> Back
                </button>

                <div class="card p-4 mb-4">
                    <h2 class="mb-1">
                        <i class="fas fa-chalkboard text-primary me-2"></i><?= htmlspecialchars($class['class_name']) ?>
                    </h2>
                    <p class="mb-1"><strong>Section:</strong> <?= htmlspecialchars($class['class_section']) ?></p>
                    <p class="mb-1"><strong>Year Level:</strong> <?= htmlspecialchars($class['year_level']) ?></p>
                    <p class="mb-1">
                        <strong>Assigned Subject:</strong>
                        <?= $subject ? htmlspecialchars($subject['subject_name']) : "<span class='text-muted'>None</span>" ?>
                    </p>
                    <p class="student-count mt-2">Total Students: <?= count($students) ?></p>
                </div>

                <div class="card p-3">
                    <h4 class="mb-3"><i class="fas fa-users text-primary me-2"></i> Assigned Students</h4>

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

</body>
</html>
