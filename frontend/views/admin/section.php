<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Manage Classes</title>
    
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
    
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <!-- jQuery (required for AJAX) -->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
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
                <!-- Header Section with Search and Add Button -->
                <div class="content-header">
                    <div class="search-bar">
                        <span class="search-icon"><i class="fas fa-search"></i></span>
                      <input type="text" placeholder="Search" id="classSearch">
    <button class="btn btn-primary me-1 search-btn" onclick="performSearch()">Search</button>
                    </div>
                    
                    <button class="btn btn-primary me-2" onclick="window.location.href='add-classes.php'">
                     <i class="fas fa-plus"></i> Add Classes
                    </button>
                </div>

                <!-- Content Area -->
                <div class="content-area">
                    <h2 class="section-title">Class List</h2>

                    <!-- Table Section -->
                    <div class="table-container">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Class ID No.</th>
                                    <th>Class Section</th>
                                    <th>Details</th>
                                    
                                </tr>
                            </thead>
                            <tbody id="classTableBody">
                                <!-- Render Dynamically -->
                            </tbody>
                        </table>
                    </div>

                    <!-- Pagination Section -->
                    <div class="pagination-wrapper">
                        <div>Showing <span id="classCount">0</span> entries</div>
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

    <!-- View Class Modal -->
    <div class="modal fade" id="viewClassModal" tabindex="-1">
        <div class="modal-dialog modal-md modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Class Details</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <p><strong>Class ID No.:</strong> <span id="viewClassId"></span></p> 
                    <p><strong>Class Section:</strong> <span id="viewClassSection"></span></p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>

    

    <!-- Bootstrap JS Bundle -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
    <script src="../../scripts/admincontent/section.js"></script> 
</body>
</html>