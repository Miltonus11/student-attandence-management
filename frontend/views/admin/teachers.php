<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Manage Teacher</title>
    
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
                
                <!-- Only show the modified search bar section -->
<div class="content-header">
    <div class="search-bar">
        <span class="search-icon">🔍</span>
        <input type="text" placeholder="Search teachers by name ..." id="teacherSearch">
    </div>
    <button class="btn btn-primary me-2" onclick="openModal()">+ Add Teacher</button>
</div>
                <!-- Content Area -->
                <div class="content-area">
                    <h2 class="section-title">Teacher List</h2>

                    <!-- Table Section -->
                    <div class="table-container">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Teacher ID No.</th>
                                    <th>Name</th>
                                       <th>Details</th> 
                                       <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody id="teacherTableBody">
                                <!-- Render Dynamically -->
                                    <tr>
                                  <td colspan="5" class="text-center">Loading teachers...</td>
                              </tr>
                            </tbody>
                        </table>
                    </div>

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

    <!-- Add Teacher Modal -->
    <div class="modal fade" id="addTeacherModal" tabindex="-1" aria-labelledby="addTeacherModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header" style="background:#012970; color:white;">
                    <h5 class="modal-title" id="addTeacherModalLabel">Add New Teacher</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form id="addTeacherForm">
                        <div class="row mb-3">
                            <div class="col-md-6">
                                <label for="teacher_id" class="form-label">Teacher ID No.</label>
                                <input type="text" class="form-control" id="teacher_id" required>
                            </div>
                        </div>
                        <div class="row mb-3">
                            <div class="col-md-4">
                                <label for="first_name" class="form-label">First Name</label>
                                <input type="text" class="form-control" id="first_name" required>
                            </div>
                            <div class="col-md-4">
                                <label for="middle_name" class="form-label">Middle Name</label>
                                <input type="text" class="form-control" id="middle_name">
                            </div>
                            <div class="col-md-4">
                                <label for="last_name" class="form-label">Last Name</label>
                                <input type="text" class="form-control" id="last_name" required>
                            </div>
                        </div>
                      
                            <div class="col-md-6">
                                <label for="instructor_contact" class="form-label">Contact</label>
                                <input type="text" class="form-control" id="instructor_contact" required>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                            <button type="button" class="btn btn-primary" onclick="saveTeacher()">Save Teacher</button>
                        </div>
                    </form>
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

    <!-- EDIT TEACHER MODAL -->
<div class="modal fade" id="editTeacherModal" tabindex="-1" aria-labelledby="editTeacherModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="editTeacherModalLabel">Edit Teacher</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form id="editTeacherForm">
                    <input type="hidden" id="edit_teacher_id">
                    <div class="row mb-3">
                        <div class="col-md-6">
                            <label for="edit_teacher_number" class="form-label">Teacher ID No.</label>
                            <input type="text" class="form-control" id="edit_teacher_number" required>
                        </div>
                    </div>
                    <div class="row mb-3">
                        <div class="col-md-4">
                            <label for="edit_first_name" class="form-label">First Name</label>
                            <input type="text" class="form-control" id="edit_first_name" required>
                        </div>
                        <div class="col-md-4">
                            <label for="edit_middle_name" class="form-label">Middle Name</label>
                            <input type="text" class="form-control" id="edit_middle_name">
                        </div>
                        <div class="col-md-4">
                            <label for="edit_last_name" class="form-label">Last Name</label>
                            <input type="text" class="form-control" id="edit_last_name" required>
                        </div>
                    </div>
                    <div class="row mb-3">
                        <div class="col-md-6">
                            <label for="edit_instructor_contact" class="form-label">Contact</label>
                            <input type="text" class="form-control" id="edit_instructor_contact" required>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button type="button" class="btn btn-primary" onclick="updateTeacher()">Update Teacher</button>
            </div>
        </div>
    </div>
</div>


    <!-- DELETE CONFIRMATION MODAL -->
    <div class="modal fade delete-modal" id="deleteTeacherModal" tabindex="-1" aria-labelledby="deleteTeacherModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-sm modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="deleteTeacherModalLabel">Confirm Delete</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>

                <div class="modal-body">
                    <p>Are you sure you want to delete this teacher?</p>
                    <p><strong>Teacher ID:</strong> <span id="deleteTeacherId">-</span></p>
                    <p><strong>Name:</strong> <span id="deleteTeacherName">-</span></p>
                </div>
                
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-danger" onclick="confirmDelete()">Delete</button>
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