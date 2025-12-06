<?php
include __DIR__ . '/../../../backend/db/conn.php';

// Fetch all available instructors for the assign modal
$allInstructorsStmt = $conn->prepare("SELECT * FROM tbl_instructors ORDER BY last_name ASC, first_name ASC");
$allInstructorsStmt->execute();
$allInstructors = $allInstructorsStmt->fetchAll(PDO::FETCH_ASSOC);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Manage Subject</title>

    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">

    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

    <!-- Page CSS -->
    <link rel="stylesheet" href="../../css/admin/section.css">

    <!-- Global CSS -->
    <link rel="stylesheet" href="../../css/main.css">
    <link rel="stylesheet" href="../../css/header.css">
    <link rel="stylesheet" href="../../css/sidebar.css">
    <link rel="stylesheet" href="../../css/modal.css">

    <!-- jQuery -->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
</head>

<body>

    <!-- Header -->
    <?php include 'components/header.php'; ?>

    <!-- Main Container -->
    <div class="container-fluid">
        <div class="row">

            <!-- Sidebar -->
            <div class="col-md-3 col-lg-2 p-0">
                <?php include 'components/sidebar.php'; ?>
            </div>

            <!-- Main Content -->
            <div class="col-md-9 col-lg-10 p-4">

                <!-- Title Section -->
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <div>
                        <h2 class="mb-1">
                            Subject List
                        </h2>
                        <span class="subject-count text-muted">
                            <?php
                                $stmt = $conn->query("SELECT COUNT(*) AS count FROM tbl_subjects");
                                $count = $stmt->fetch()['count'];
                                echo "Total Subjects: {$count}";
                            ?>
                        </span>
                    </div>
                </div>

              <!-- Search Bar Section -->
              <div class="d-flex align-items-center mb-4">
                <div class="input-group" style="max-width: 400px;">
                    <input type="text" 
                           class="form-control" 
                           id="classSearch" 
                           placeholder="Search subjects..."
                           onkeyup="performSearch()">
                    <button class="btn btn-outline-secondary" type="button" onclick="clearSearch()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
              </div>


                <!-- Subject List -->
                <div id="subjectList">
                    <?php
                        $stmt = $conn->query("SELECT * FROM tbl_subjects ORDER BY subject_id ASC");
                        $subjects = $stmt->fetchAll();

                        if (!$subjects) {
                            echo '
                                <div class="alert alert-info text-center">
                                    <i class="fas fa-info-circle"></i> No subjects yet. Add one to get started!
                                </div>
                            ';
                        } else {
                            echo '<div class="row" id="subjectGrid">';

                            foreach ($subjects as $subject) {
                                $title = htmlspecialchars($subject['subject_name']);
                                $subjectCode = htmlspecialchars($subject['subject_code'] ?? '');
                                $yearLevel = isset($subject['year_level']) && $subject['year_level'] !== null
                                    ? "<span class='badge bg-secondary ms-2'>Year {$subject['year_level']}</span>"
                                    : "";
                                
                                echo "
                                    <div class='col-md-12 col-lg-12 mb-3 subject-card' data-title='" . strtolower($title) . "'>
                                        <div class='card h-100'>
                                            <div class='card-body d-flex justify-content-between align-items-center'>
                                                <div>
                                                    <h5 class='card-title mb-0'>
                                                        <i class='fas fa-graduation-cap text-primary me-2'></i>
                                                        {$title}{$yearLevel}
                                                    </h5>
                                                    <p class='text-muted mb-0 small'>{$subjectCode}</p>
                                                </div>
                                                <div>
                                                    <button class='btn btn-sm btn-info me-2 view-btn' data-subject-id='{$subject['subject_id']}' data-subject-name='{$title}' data-subject-code='{$subjectCode}'>
                                                        <i class='fas fa-eye'></i> View
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ";
                            }

                            echo '</div>';

                            echo '
                                <div class="no-results alert alert-warning text-center" style="display: none;">
                                    <i class="fas fa-search-minus"></i> No subjects match your search.
                                </div>
                            ';
                        }
                    ?>
                </div>

            </div>
        </div>
    </div>

    <!-- View Subject Modal -->
    <div class="modal fade" id="viewSubjectModal" tabindex="-1" aria-labelledby="viewSubjectModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header" style="background:#012970; color:white;">
                    <h5 class="modal-title" id="viewSubjectModalLabel">
                        <i class="fas fa-eye me-2"></i>Subject Details
                    </h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="subject-details">
                        <div class="mb-3">
                            <h6 class="text-muted mb-2">Subject Information</h6>
                            <div class="card bg-light">
                                <div class="card-body">
                                    <div class="row">
                                        <div class="col-md-6 mb-3">
                                            <p class="mb-1"><strong>Subject ID:</strong></p>
                                            <p class="mb-3" id="viewSubjectId">--</p>
                                        </div>
                                        <div class="col-md-6 mb-3">
                                            <p class="mb-1"><strong>Subject Code:</strong></p>
                                            <p class="mb-3" id="viewSubjectCode">--</p>
                                        </div>
                                        <div class="col-md-6 mb-3">
                                            <p class="mb-1"><strong>Subject Name:</strong></p>
                                            <p class="mb-3" id="viewSubjectName">--</p>
                                        </div>
                                        <div class="col-md-6 mb-3">
                                            <p class="mb-1"><strong>Number of Students:</strong></p>
                                            <p class="mb-3" id="viewSubjectStudent">--</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>
    
    <!-- Scripts -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="../../scripts/teachercontent/subject.js"></script>
    <script src="../../scripts/logout.js"></script>
</body>
</html>