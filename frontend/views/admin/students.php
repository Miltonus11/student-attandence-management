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
    <title>Create Classes</title>
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <!-- css -->
 <link rel="stylesheet" href="../../css/main.css"> 
<link rel="stylesheet" href="../../css/header.css">
<link rel="stylesheet" href="../../css/sidebar.css">
    <link rel="stylesheet" href="../../css/student_content.css">
</head>
<body>

    <!-- Header -->
    <?php include 'components/header.php'; ?>

    <!-- sidebar -->
    <div class="container-fluid">
        <div class="row">
            <!-- Sidebar -->
            <div class="col-md-3 col-lg-2 p-0">
                <?php include 'components/sidebar.php'; ?>
            </div>
            
            <!-- Main Content -->
             <div class="col-md-9 col-lg-10 mt-4">
                <div class="container-fluid">
                    <nav aria-label="breadcrumb">
                        <ol class="breadcrumb">
                            <li class="breadcrumb_item"><a href="./admin-dashboard.php">Home</a></li>
                            <li class="breadcrumb_item active" aria-current="page">Manage Students</li>
                        </ol>
                    </nav>

                    <h1 class="page_title">Create Student</h1>
                    
                    <!-- Form Section -->
                    <div class="form_container">
                        <form id="teacherForm" method="POST" action="">
                            <div class="row mb-3">
                                <div class="col-md-6">
                                    <label for="firstName" class="form-label required">First Name</label>
                                    <input type="text" class="form-control" id="firstName" name="firstName" required>
                                </div>
                                <div class="col-md-6">
                                    <label for="lastName" class="form-label required">Last Name</label>
                                    <input type="text" class="form-control" id="lastName" name="lastName" required>
                                </div>
                            </div>
                            
                            <div class="row mb-3">
                                <div class="col-md-6">
                                    <label for="email" class="form-label required">Email Address</label>
                                    <input type="email" class="form-control" id="email" name="email" required>
                                </div>
                                <div class="col-md-6">
                                    <label for="phone" class="form-label required">Phone No</label>
                                    <input type="tel" class="form-control" id="phone" name="phone" required>
                                </div>
                            </div>
                            
                            <div class="row mb-3">
                                <div class="col-md-6">
                                    <label for="class" class="form-label required">Select Class</label>
                                    <select class="form-select" id="class" name="class" required>
                                        <option value="">Select Class</option>
                                        <option value="Class 1">Class 1</option>
                                        <option value="Class 2">Class 2</option>
                                        <option value="Class 3">Class 3</option>
                                        <option value="Class 4">Class 4</option>
                                        <option value="Class 5">Class 5</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div class="d-flex justify-content-end">
                                <button type="submit" class="btn btn-primary">Submit</button>
                            </div>
                        </form>
                    </div>
                    
                    <!-- Table Section -->
                    <div class="table_container">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <h2>All Students</h2>
                            <div class="d-flex align-items-center">
                                <span class="me-2">Show:</span>
                                <select class="form-select form-select-sm w-auto">
                                    <option>10</option>
                                    <option>15</option>
                                    <option>20</option>
                                    <option>30</option>
                                </select>
                            </div>
                        </div>
                        
                        <div class="table_responsive">
                            <table class="table table-striped table-hover">
                                <thead>
                                    <tr>
                                        <th>Admission No.</th>
                                        <th>First Name</th>
                                        <th>Last Name</th>
                                        <th>Email Address</th>
                                        <th>Phone No</th>
                                        <th>Class</th>
                                        <th>Date Created</th>
                                        <th>Edit</th>
                                        <th>Delete</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    
                                </tbody>
                            </table>
                        </div>
                        
                        <div class="d-flex justify-content-between align-items-center mt-3">
                            <div>Showing 1 to 1 of 1 entries</div>
                            <nav>
                                <ul class="pagination pagination-sm mb-0">
                                    <li class="page-item disabled"><a class="page-link" href="#">Previous</a></li>
                                    <li class="page-item active"><a class="page-link" href="#">1</a></li>
                                    <li class="page-item disabled"><a class="page-link" href="#">Next</a></li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Bootstrap JS Bundle -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>