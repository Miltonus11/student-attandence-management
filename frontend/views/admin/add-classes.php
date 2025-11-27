<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Add Class</title>

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
    <?php include 'components/header.php'; ?>

    <div class="container-fluid">
        <div class="row">
            <div class="col-md-3 col-lg-2 p-0">
                <?php include 'components/sidebar.php'; ?>
            </div>

            <div class="col-md-9 col-lg-10 main-content p-4">
                <div class="d-flex justify-content-between align-items-center border-bottom pb-3 mb-4">
                    <h2>Add a Class</h2>
                    <div class="d-flex gap-2">
                        <button class="btn btn-primary" onclick="window.location.href='section.php'">
                            <i class="fa-regular fa-floppy-disk"></i> Submit
                        </button>
                        <button class="btn btn-outline-secondary" onclick="window.location.href='section.php'">
                            <i class="fa-solid fa-xmark me-1"></i> Cancel
                        </button>
                    </div>
                </div> 

                <form class="mb-4" action="#" method="POST">
                    <div class="row g-4">
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label for="className" class="form-label text-muted">Class Name</label>
                                <input type="text" class="form-control" id="className" placeholder="Set Class Name">
                            </div>

                            <div class="mb-3">
                                <label for="assignSubject" class="form-label text-muted">Assign Subject</label>
                                <select class="form-select" id="assignSubject">
                                    <option selected>Assign Subject</option>
                                    <option value="1">IT 115</option>
                                    <option value="2">IT 118</option>
                                    <option value="3">IT 114</option>
                                     <option value="4">IT 117</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </form>
                
                <div class="d-flex justify-content-between align-items-center mb-3">
            
                <select class="form-select w-auto" id="yearLevelFilter">
                    <option value="all">All Year Levels</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                </select>
                    
                    <div class="input-group w-25">
                        <span class="input-group-text bg-white border-end-0"><i class="fas fa-search"></i></span>
                        <input type="text" class="form-control border-start-0" id="searchInput" placeholder="Search">
                    </div>
                </div>

                <!-- Content Area -->
                <div class="content-area">
                    <h2 class="section-title">Class List</h2>
                    <!-- Table Section -->
                    <div class="table-container">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th class="checkbox-cell">Action</th>
                                    <th>Student ID No.</th>
                                    <th>Student Name</th>
                                    <th>Year Level</th>
                                    <th>Details</th>
                                </tr>
                            </thead>
                    
                            <tbody id="studentTableBody">
                                <!-- Rows will be populated dynamically -->
                            </tbody>
                        </table>
                    </div>
                    <!-- Pagination Section -->
                    <div class="pagination-wrapper">
                        <div id="paginationInfo">Showing 0 to 0 of 0 entries</div>
                        <nav>
                            <ul class="pagination pagination-sm mb-0" id="paginationControls">
                                <!-- Pagination will be populated dynamically -->
                            </ul>
                        </nav>
                    </div>
                </div>
                
                <!-- VIEW STUDENT MODAL -->
                <div class="modal fade" id="viewStudentModal" tabindex="-1" aria-labelledby="viewStudentModalLabel" aria-hidden="true">
                    <div class="modal-dialog modal-md modal-dialog-centered">
                        <div class="modal-content">
                            <div class="modal-header" style="background:#012970; color:white;">
                                <h5 class="modal-title" id="viewStudentModalLabel">Student Details</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>

                            <div class="modal-body">
                                <p><strong>Student ID:</strong> <span id="viewStudentId">-</span></p>
                                <p><strong>Name:</strong> <span id="viewStudentName">-</span></p> 
                                <p><strong>Year Level:</strong> <span id="viewStudentyearlevel">-</span></p>
                            </div>
                            
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Bootstrap JS Bundle -->
                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
                <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
               <script src="../../scripts/admincontent/add-classes.js"></script>
            </div>
        </div>
    </div>
</body>
</html>