<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Manage Subject</title>
    
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
                <!-- Header Section with Search and Add Button -->
                <div class="content-header">
                    <div class="search-bar">
                        <span class="search-icon"><i class="fas fa-search"></i></span>
                        <input type="text" placeholder="Search subjects...">
                    </div>
                    <button class="btn btn-primary me-2" onclick="openModal()">
                        <i class="fas fa-plus"></i> Add Subject
                    </button>
                </div>

                <!-- Content Area -->
                <div class="content-area">
                    <h2 class="section-title">Subject List</h2>

                    <!-- Table Section -->
                    <div class="table-container">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Subject ID No.</th>
                                    <th>Subject Code</th>
                                    <th>Subject Title</th>
                                    <th>Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>2310092222</td>
                                    <td>CFE 1</td>
                                    <td>God 's Journey with his people</td>
                                    <td><span class="view-link" data-type="subject">View</span></td>
                                </tr>
                                <tr>
                                    <td>2310092222</td>
                                    <td>CFE 1</td>
                                    <td>God 's Journey with his people</td>
                                    <td><span class="view-link" data-type="subject">View</span></td>
                                </tr>
                                <tr>
                                    <td>2310092222</td>
                                    <td>CFE 1</td>
                                    <td>God 's Journey with his people</td>
                                    <td><span class="view-link" data-type="subject">View</span></td>
                                </tr>
                                <tr>
                                    <td>2310092222</td>
                                    <td>CFE 1</td>
                                    <td>God 's Journey with his people</td>
                                    <td><span class="view-link" data-type="subject">View</span></td>
                                </tr>
                                <tr>
                                    <td>2310092222</td>
                                    <td>CFE 1</td>
                                    <td>God 's Journey with his people</td>
                                    <td><span class="view-link" data-type="subject">View</span></td>
                                </tr>
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

    <!-- Add Subject Modal -->
    <div class="modal fade" id="addSubjectModal" tabindex="-1" aria-labelledby="addSubjectModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="addSubjectModalLabel">Add New Subject</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>

                <div class="modal-body">
                    <form id="addsubjectform">
                        <div class="row mb-3">
                            <div class="col-md-6">
                                <label for="subjectid" class="form-label">Subject ID No.</label>
                                <input type="text" class="form-control" id="subjectid" required>
                            </div>
                            <div class="col-md-6">
                                <label for="subjectcode" class="form-label">Subject Code</label>
                                <input type="text" class="form-control" id="subjectcode" required>
                            </div>
                        </div>
                        <div class="row mb-3">
                            <div class="col-md-12">
                                <label for="subjecttitle" class="form-label">Subject Title</label>
                                <input type="text" class="form-control" id="subjecttitle" required>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                    <button type="button" class="btn btn-primary" onclick="saveSubject()">Save Subject</button>
                </div>
            </div>
        </div>
    </div>

    <!-- View Subject Modal -->
    <div class="modal fade" id="viewSubjectModal" tabindex="-1">
        <div class="modal-dialog modal-md modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Subject Details</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>

                <div class="modal-body">
                    <p><strong>Subject ID No.:</strong> <span id="viewSubjectId"></span></p>
                    <p><strong>Subject Code:</strong> <span id="viewSubjectCode"></span></p>
                    <p><strong>Subject Title:</strong> <span id="viewSubjectTitle"></span></p>
                </div>

                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Bootstrap JS Bundle -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
   <script src="../../scripts/admincontent/subject.js"></script> 
</body>
</html>