<?php
    require_once('../../../backend/controllers/auth/admin-auth-check.php');
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Manage Student</title>
    
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
                        <span class="search-icon">🔍</span>
                       <input type="text" placeholder="Search" id="studentSearch">
    <button class="btn btn-primary me-1 search-btn" onclick="performSearch()">Search</button>
                    </div>
                    <button class="btn btn-primary me-2" onclick="openModal()">+ Add Student</button>
                </div>

                 <!-- Content Area -->
                <div class="content-area">
                    <h2 class="section-title">Student List</h2>

                 <!-- Table Section -->
<div class="table-container">
    <table class="table">
        <thead>
            <tr>
                <th>Student ID No.</th>
                <th>Name</th>
                <th>Year Level</th>
                <th>Details</th>
                <th>Actions</th> 
            </tr>
        </thead>
        
        <tbody id="studentTableBody">
            <!-- Render Dynamically -->
            <tr>
                <td colspan="6" class="text-center">Loading students...</td>
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

    
<!-- Add Student Modal -->
    <div class="modal fade" id="addStudentModal" tabindex="-1" aria-labelledby="addStudentModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header" style="background:#012970; color:white;">
                    <h5 class="modal-title" id="addStudentModalLabel">Add New Student</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>

                <div class="modal-body">
                    <form id="addStudentForm">
                        <div class="row mb-3">
                            <div class="col-md-3">
                                <label for="student_id" class="form-label">Student ID No.</label>
                                <input type="text" class="form-control" id="student_id" required>
                            </div>
                            
                            <div class="col-md-2">
                                <label for="year_level" class="form-label">Year Level</label>
                                <input type="text" class="form-control" id="year_level" required>
                            </div>
                        </div> 

                        <div class="row mb-3">
                            <div class="col-md-3">
                                <label for="first_name" class="form-label">First Name</label>
                                <input type="text" class="form-control" id="first_name" required>
                            </div>

                            <div class="col-md-4">
                                <label for="last_name" class="form-label">Last Name</label>
                                <input type="text" class="form-control" id="last_name" required>
                            </div>
                        </div>
                    </form>
                </div>

                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                    <button type="button" class="btn btn-primary" onclick="saveStudent()">Save Student</button>
                </div>
            </div>
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
                    <p><strong>Contact:</strong> <span id="viewStudentcontact">-</span></p>  
                </div>
                
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>

    <!-- EDIT STUDENT MODAL -->
    <div class="modal fade" id="editStudentModal" tabindex="-1" aria-labelledby="editStudentModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="editStudentModalLabel">Edit Student</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>

                <div class="modal-body">
                    <div class="row mb-3">
                        <input type="hidden" id="edit_student_id">
                        <div class="col-md-1">
                            <label for="edit_student_number" class="form-label">Student ID No.</label>
                            <input type="text" class="form-control" id="edit_student_number" readonly>
                        </div>
                        <div style="margin-left:20px" class="col-md-2">
                            <label for="edit_year_level" class="form-label">Year Level</label>
                            <input type="text" class="form-control" id="edit_year_level" required>
                        </div>
                    </div>
                    <div class="row mb-3">
                        <div class="col-md-3">
                            <label for="edit_first_name" class="form-label">First Name</label>
                            <input type="text" class="form-control" id="edit_first_name" required>
                        </div>

                        <div class="col-md-4">
                            <label for="edit_last_name" class="form-label">Last Name</label>
                            <input type="text" class="form-control" id="edit_last_name" required>
                        </div>
                    </div>

                    </form>
                </div>

                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-primary" onclick="updateStudent()">Update Student</button>
                </div>
            </div>
        </div>
    </div>

    <!-- DELETE CONFIRMATION MODAL -->
    <div class="modal fade delete-modal" id="deleteStudentModal" tabindex="-1" aria-labelledby="deleteStudentModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-sm modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="deleteStudentModalLabel">Confirm Delete</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>

                <div class="modal-body">
                    <p>Are you sure you want to delete this student?</p>
                    <p><strong>Student ID:</strong> <span id="deleteStudentId">-</span></p>
                    <p><strong>Name:</strong> <span id="deleteStudentName">-</span></p>
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
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
   <script src="../../scripts/admincontent/stud.js"></script>
   
</body>
</html>