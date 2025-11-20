<?php
    session_start();
    if(!isset($_SESSION['username'])){
        header("Location: ../loginPage.php");
    }
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Manage Classes - Administrator Dashboard</title>
   <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <!-- css -->
      <link rel="stylesheet" href="../../css/main.css"> 
<link rel="stylesheet" href="../../css/header.css">
<link rel="stylesheet" href="../../css/sidebar.css">
<link rel="stylesheet" href="../../classes_content.css">
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
                <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
                <li class="breadcrumb_item"><a href="./admin-dashboard.php">Home</a></li>
                <li class="breadcrumb_item active" aria-current="page">Manage Classes</li>
            </ol>
        </nav>

                <h1 class="page_title">Manage Classes</h1>
                
                <!-- Classes Management Content -->
                <div class="card classes_table">
                    <div class="card_header">
                        <div class="d-flex justify-content-between align-items-center">
                            <h5 class="mb-0">Class List</h5>
                            <button class="btn btn-primary btn-sm">
                                <i class="fas fa-plus me-1"></i> Add New Class
                            </button>
                        </div>
                    </div>
                    <div class="card_body">
                        <div class="table_responsive">
                            <table class="table table-striped">
                                <thead>
                                    <tr>
                                        <th>Class ID</th>
                                        <th>Class Name</th>
                                        <th>Grade Level</th>
                                        <th>Class Teacher</th>
                                        <th>Number of Students</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                 
                                    <tr>
                                        <td>CLS002</td>
                                        <td>Science</td>
                                        <td>Grade 9</td>
                                        <td>Ms. Davis</td>
                                        <td>30</td>
                                        <td>
                                            <button class="btn btn-sm btn-outline-primary me-1">
                                                <i class="fas fa-edit"></i>
                                            </button>
                                            <button class="btn btn-sm btn-outline-danger">
                                                <i class="fas fa-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Bootstrap JS Bundle  -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
    <!-- <script src="js/admin.js"></script> -->
</body>
</html>