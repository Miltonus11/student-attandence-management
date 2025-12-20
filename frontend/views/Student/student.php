<?php
include __DIR__ . '/../../../backend/db/conn.php';
require_once('../../../backend/controllers/auth/student-auth-check.php');

$student_id = $_SESSION['student_id'];
$first_name = $_SESSION['first_name'];
$last_name = $_SESSION['last_name'];
$user_id = $_SESSION['user_id']; 

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Subject List</title>

    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">

    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

    <link rel="stylesheet" href="../../css/main.css">
    <link rel="stylesheet" href="../../css/header.css">
    <link rel="stylesheet" href="../../css/sidebar.css">
    <link rel="stylesheet" href="../../css/modal.css">
</head>

<body>

    <!-- Header -->
    <?php include 'components/header.php'; ?>

    <input type="hidden" id="currentUserId" value="<?php echo htmlspecialchars($user_id, ENT_QUOTES); ?>">

    <!-- Main Container -->
    <div class="container-fluid">
        <div class="row">

            <!-- Sidebar -->
            <div class="col-md-3 col-lg-2 p-0">
                <?php include 'components/sidebar.php'; ?>
            </div>

            <!-- Main Content -->
            <div class="col-md-9 col-lg-10 p-4">

                <!-- Title  -->
                <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap">

                    <div class="d-flex align-items-center gap-3 flex-wrap">
                        <div>
                            <h2 class="mb-0">
                                <i class="fas fa-chalkboard-teacher text-primary"></i> Subject List
                            </h2>
                        </div>
                    </div>
                </div>

                <!-- Class List Container -->
                <div id="classList" class="mb-4">
                    <!-- dynamically populated by JS -->
                    <div class="text-muted">Loading subjects...</div>
                </div>

            </div>
        </div>
    </div>


    <!-- Scripts -->
    <script src="../../scripts/studentcontent/student.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="../../scripts/logout.js"></script>
</body>
</html>
