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
    <link rel="stylesheet" href="../../css/Modal.css">
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
                        <input type="text" placeholder="Search">
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
                                    <th>Details</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>23101000</td>
                                    <td>Lawrence Gabriel</td>
                                    <td><span class="view-link" data-type="student">View</span></td>
                                </tr>
                                <tr>
                                    <td>23101001</td>
                                    <td>Jhustine Ocampo</td>
                                    <td><span class="view-link" data-type="student">View</span></td>
                                </tr>
                                <tr>
                                    <td>23101002</td>
                                    <td>Crystalyn Llarenas</td>
                                    <td><span class="view-link" data-type="student">View</span></td>
                                </tr>
                                <tr>
                                    <td>23101003</td>
                                    <td>William Rodriguez</td>
                                    <td><span class="view-link" data-type="student">View</span></td>
                                </tr>
                                <tr>
                                    <td>23101004</td>
                                    <td>Vince Alvendia</td>
                                    <td><span class="view-link" data-type="student">View</span></td>
                                </tr>
                                <tr>
                                    <td>23101005</td>
                                    <td>Lawrence Gabriel</td>
                                    <td><span class="view-link" data-type="student">View</span></td>
                                </tr>
                                <tr>
                                    <td>23101006</td>
                                    <td>Jhustine Ocampo</td>
                                    <td><span class="view-link" data-type="student">View</span></td>
                                </tr>
                                <tr>
                                    <td>23101007</td>
                                    <td>Vince Alvendia</td>
                                    <td><span class="view-link" data-type="student">View</span></td>
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
            <div class="col-md-6">
              <label for="studentId" class="form-label">Student ID No.</label>
              <input type="text" class="form-control" id="studentId" required>
            </div>
          </div>
          <div class="row mb-3">
            <div class="col-md-4">
              <label for="studentFirstName" class="form-label">First Name</label>
              <input type="text" class="form-control" id="studentFirstName" required>
            </div>
            <div class="col-md-4">
              <label for="studentMiddleName" class="form-label">Middle Name</label>
              <input type="text" class="form-control" id="studentMiddleName">
            </div>
            <div class="col-md-4">
              <label for="studentLastName" class="form-label">Last Name</label>
              <input type="text" class="form-control" id="studentLastName" required>
            </div>
          </div>
          <div class="row mb-3">
            <div class="col-md-6">
              <label for="studentEmail" class="form-label">Email</label>
              <input type="email" class="form-control" id="studentEmail" required>
            </div>
            <div class="col-md-6">
              <label for="studentPhone" class="form-label">Phone Number</label>
              <input type="tel" class="form-control" id="studentPhone">
            </div>
          </div>
          <div class="row mb-3">
            <div class="col-md-6">
              <label for="studentBirthDate" class="form-label">Date of Birth</label>
              <input type="date" class="form-control" id="studentBirthDate">
            </div>
            <div class="col-md-6">
              <label class="form-label">Gender</label>
              <div class="d-flex gap-4 mt-2">
                <div class="form-check">
                  <input class="form-check-input" type="radio" name="studentGender" id="studentMale" value="male">
                  <label class="form-check-label" for="studentMale">Male</label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="radio" name="studentGender" id="studentFemale" value="female">
                  <label class="form-check-label" for="studentFemale">Female</label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="radio" name="studentGender" id="studentOther" value="other">
                  <label class="form-check-label" for="studentOther">Other</label>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" onclick="closeModal('student')">Cancel</button>
        <button type="button" class="btn btn-primary" onclick="savePerson('student')">Save Student</button>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
    </div>
  </div>
</div>

    <!-- VIEW STUDENT MODAL -->
<div class="modal fade" id="viewStudentModal" tabindex="-1">
    <div class="modal-dialog modal-md modal-dialog-centered">
        <div class="modal-content">

            <div class="modal-header" style="background:#012970; color:white;">
                <h5 class="modal-title">Student Details</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>

            <div class="modal-body">
                <p><strong>Student ID:</strong> <span id="viewStudentId"></span></p>
                <p><strong>Name:</strong> <span id="viewStudentName"></span></p>

            </div>

            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>

        </div>
    </div>
</div>


    <!-- Bootstrap JS Bundle -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
  <script src="../../scripts/Modal.js"></script> 
</body>
</html>