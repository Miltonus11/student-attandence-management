<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Subject List</title>
    
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
    
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <!-- Custom CSS -->
    <link rel="stylesheet" href="../../css/main.css">
    <link rel="stylesheet" href="../../css/header.css">
    <link rel="stylesheet" href="../../css/sidebar.css">
     <link rel="stylesheet" href="../../css/modal.css">
</head>
<body>
    <!-- Header -->
    <?php include 'components/header.php'; ?>

    <!-- Main Container with Sidebar and Content -->
    <div class="container-fluid">
        <div class="row">
            
            <!-- Sidebar -->
            <div class="col-md-3 col-lg-2 p-0">
                <?php include 'components/sidebar.php'; ?>
            </div>

            <!-- Main Content -->
            <div class="main-content">
               
                <!-- Content Area -->
                <div class="content-area">
                    <h2 class="section-title">  Attendance</h2>

                    <!-- Dynamic Attendance Summary Section -->
                    <div class="attendance-summary mb-4">
                        <div class="card">
                            <div class="card-header" style="background-color: #012970; color: white;">
    <h5 class="mb-0">Attendance for this semester</h5>
</div>
                            </div>
                            <div class="card-body">
                                <div class="row text-center">
                                    <div class="col-md-6">
                                        <div class="attendance-item">
                                            <h3 class="text-success mb-1" id="totalPresent">0</h3>
                                            <p class="text-muted mb-0">Total Days Present</p>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="attendance-item">
                                            <h3 class="text-danger mb-1" id="totalAbsent">0</h3>
                                            <p class="text-muted mb-0">Total Days Absent</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Table Section -->
                    <div class="table-container">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Subject Code</th>
                                    <th>Subject Name</th>
                                    <th>Details</th>
                                </tr>
                            </thead>
                           <tbody id="subjectTableBody">
                              <!-- Render Dynamically -->
                            </tbody>
                        </table>
                    </div>

                    <!-- Pagination Section -->
                    <div class="pagination-wrapper">
                        <div>Showing 1 to 8 of 8 entries</div>
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

    <!-- Bootstrap JS Bundle -->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
    <script src="../../scripts/studentcontent/attendance.js"></script>
</body>
</html>