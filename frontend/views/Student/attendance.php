<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Student Dashboard</title>
    
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
                    <h2 class="section-title">Attendance</h2>

                 
                    <!-- Pagination Section -->
                    <div class="pagination-wrapper">
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

    <!-- VIEW TEACHER MODAL -->
    <div class="modal fade" id="viewTeacherModal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Teacher Information</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <p><strong>Teacher ID:</strong> <span id="viewTeacherId"></span></p>
                    <p><strong>Name:</strong> <span id="viewTeacherName"></span></p>
                    <p><strong>Contact:</strong> <span id="viewTeacherContact"></span></p>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Bootstrap JS Bundle -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js" integrity="sha512-v2CJ7UaYy4JwqLDIrZUI/4hqeoQieOmAZNXBeQyjo21dadnwR+8ZaIJVT8EE2iyI61OV8e6M8PP2/4hpQINQ/g==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
    <script src="../../scripts/admincontent/teacher.js"></script>

</body>
</html>