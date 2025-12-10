<?php
    require_once('../../../backend/controllers/auth/teacher-auth-check.php');
    $teacher_id = $_SESSION['instructor_id'];
    $first_name = $_SESSION['first_name'];
    $last_name = $_SESSION['last_name'];

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0"> 
    <title>My Section</title>

    <!-- Bootstrap -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">

    <!-- Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

    <!-- Custom CSS -->
    <link rel="stylesheet" href="../../css/main.css">
    <link rel="stylesheet" href="../../css/header.css">
    <link rel="stylesheet" href="../../css/sidebar.css">
    <link rel="stylesheet" href="../../css/teacher/section.css"> 
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
                <i class="fas fa-users" style="color: #012970;"></i> Assigned Section
            </h2>

            <!-- Section Button Container -->
            <div id="sectionContainer" class="row g-3"></div> 

            <!-- Fallback for No Sections -->
            <div id="noSectionsMessage" class="text-center d-none">
                <i class="fas fa-info-circle fa-3x text-muted mb-3"></i>
                <p class="text-muted">No sections assigned yet. Check back later or contact your administrator.</p>
            </div>
        </div>
    </div>
</div>

<!-- Bootstrap JS -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script src="../../scripts/teachercontent/section.js"></script>
<script src="../../scripts/logout.js"></script>

</body>
</html>