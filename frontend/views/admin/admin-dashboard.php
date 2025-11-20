<?php
    session_start();
    if(!isset($_SESSION['username']) && $_SESSION['user_level'] == "admin"){
        header("Location: ../loginPage.php");
    }
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard</title>
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <!-- css -->
    <link rel="stylesheet" href="../../css/main.css"> 
<link rel="stylesheet" href="../../css/header.css">
<link rel="stylesheet" href="../../css/sidebar.css">
    <link rel="stylesheet" href="../../css/dashboard_content.css">
</head>
<body>
    <!-- Header -->
   <?php include 'components/header.php'; ?>

    <!-- Main Container -->
    <div class="container-fluid">
        <div class="row">
            <!-- Sidebar -->
             <?php include 'components/sidebar.php'; ?>

            <!-- Main Content -->
           
            <div class="col-md-9 col-lg-10 main_content">
                <h1 class="page_title">Administrator Dashboard</h1>

<div class="row">
    <div class="col-md-6 col-lg-3">
        <div class="dashboard_card card-students" onclick="window.location.href='students.php'">
            <div class="card_content">
                <div class="card_label">Students</div>
                <div class="card_value">4</div>
            </div>
            <div class="card_icon">
                <i class="fas fa-user-graduate"></i>
            </div>
        </div>
    </div>
    
    <div class="col-md-6 col-lg-3">
        <div class="dashboard_card card-classes" onclick="window.location.href='classes.php'">
            <div class="card_content">
                <div class="card_label">Classes</div>
                <div class="card_value">4</div>
            </div>
            <div class="card_icon">
                <i class="fas fa-chalkboard"></i>
            </div>
        </div>
    </div>
    
    <div class="col-md-6 col-lg-3">
        <div class="dashboard_card card-attendance">
            <div class="card_content">
                <div class="card_label">Total Student Attendance</div>
                <div class="card_value">47</div>
            </div>
            <div class="card_icon">
                <i class="fas fa-calendar-check"></i>
            </div>
        </div>
    </div>
          
    <div class="col-md-6 col-lg-3">
        <div class="dashboard_card card-teachers" onclick="window.location.href='teachers.php'">
            <div class="card_content">
                <div class="card_label">Class Teachers</div>
                <div class="card_value">1</div>
            </div>
            <div class="card_icon">
                <i class="fas fa-chalkboard-teacher"></i>
            </div>
        </div>
    </div>

    <div class="col-md-6 col-lg-3">
        <div class="dashboard_card card-session">
            <div class="card_content">
                <div class="card_label">Session & Terms</div>
                <div class="card_value">3</div>
            </div>
            <div class="card_icon">
                <i class="fas fa-chalkboard-teacher"></i>
            </div>
        </div>
    </div>
</div>
            </div>
           
            </div>
        </div>
    </div>

    <!-- Bootstrap JS Bundle with Popper -->

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
 <script src="../script/logout.js"></script> 
</body>
</html>
</body>

</html>