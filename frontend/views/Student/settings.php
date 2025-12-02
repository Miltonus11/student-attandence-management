<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Manage Settings</title>
    
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
    
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    
    <!-- Custom CSS -->
    <link rel="stylesheet" href="../../css/main.css">
    <link rel="stylesheet" href="../../css/header.css">
    <link rel="stylesheet" href="../../css/sidebar.css">
    <link rel="stylesheet" href="../../css/modal.css">
    <link rel="stylesheet" href="../../css/tsettings.css">
    <link rel="stylesheet" href="../../css/set.css">
    
   
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
            <div class="col-md-9 col-lg-10 main-content" style="padding: 25px 30px;">
                
                <!-- Page Title -->
                <h2 class="section-title">Settings</h2>
                
                <!-- Alert Container -->
                <div id="alertContainer"></div>

                <!-- Profile Section -->
                <div class="profile-section">
                    <h3 style="font-weight: 600; margin-bottom: 25px; color: #1a1a1a;">Profile</h3>
                    
                    <div class="profile-container">
                        <!-- Avatar -->
                        <div class="profile-avatar">
                            <div class="avatar-circle" id="avatarPreview">
                                <i class="fas fa-user"></i>
                            </div>
                            <a href="#" class="upload-image-link" id="uploadLink">Upload Image</a>
                        </div>
                        
                        <!-- Profile Info -->
                        <div class="profile-info">
                            <!-- Name -->
                            <div class="info-row">
                                <div class="info-item">
                                    <div class="info-label">Name</div>
                                    <div class="info-value" id="displayName">John Lawrence Gabriel</div>
                                </div>
                                <button class="edit-btn" onclick="editField('name')">Edit</button>
                            </div>
                            
                            <!-- Email -->
                            <div class="info-row">
                                <div class="info-item">
                                    <div class="info-label">Email</div>
                                    <div class="info-value">
                                        <a href="mailto:JohnlawrenceGabriel@gmail.com" id="emailLink">JohnlawrenceGabriel@gmail.com</a>
                                    </div>
                                </div>
                                <button class="edit-btn" onclick="editField('email')">Edit</button>
                            </div>
                            
                            <!-- Contact -->
                            <div class="info-row">
                                <div class="info-item">
                                    <div class="info-label">Contact</div>
                                    <div class="info-value" id="displayContact">
                                        (+63) 94******* 
                                        <a href="#" class="show-link" onclick="toggleContact(event)">Show</a>
                                    </div>
                                </div>
                                <button class="edit-btn" onclick="editField('contact')">Edit</button>
                            </div>
                            
                            <!-- Password -->
                            <div class="info-row">
                                <div class="info-item">
                                    <div class="info-label">Password</div>
                                    <div class="info-value">
                                        *********** 
                                        <a href="#" class="show-link" id="togglePasswordView">Show</a>
                                    </div>
                                </div>
                                <button class="edit-btn" type="button" data-bs-toggle="modal" data-bs-target="#changePasswordModal">Edit</button>
                            </div>
                        </div>
                    </div>

                    <!-- About Section -->
                    <div class="about-section mt-5">
                        <h3>About</h3>
                        
                        <!-- System Name -->
                        <div class="about-item">
                            <div class="about-label">System Name</div>
                            <div class="about-value">SITS Attendance Management System</div>
                        </div>
                        
                        <!-- Version Number -->
                        <div class="about-item">
                            <div class="about-label">Version Number</div>
                            <div class="about-value">v1.6.7</div>
                        </div>
                        
                        <!-- Help / Contact Support -->
                        <div class="about-item">
                            <div class="about-label">Help / Contact Support</div>
                            <div class="about-value"><a href="mailto:Sitssystem@gmail.com">Sitssystem@gmail.com</a></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Edit Modal for Name, Email, Contact -->
    <div class="modal fade" id="editModal" tabindex="-1" aria-labelledby="editModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="editModalLabel">Edit</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <input type="hidden" id="editFieldType">
                    <div id="formFields"></div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-primary" onclick="saveChanges()">Save Changes</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Change Password Modal -->
    <div class="modal fade" id="changePasswordModal" tabindex="-1" aria-labelledby="changePasswordModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="changePasswordModalLabel">Change Password</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form id="changePasswordForm" method="POST">
                    <div class="modal-body">
                        <!-- Current Password -->
                        <div class="mb-3">
                            <label for="currentPassword" class="form-label">Current Password</label>
                            <div class="input-group">
                                <input type="password" class="form-control" id="currentPassword" name="currentPassword" required>
                                <button class="btn btn-outline-secondary" type="button" id="toggleCurrentPassword">
                                    <i class="fas fa-eye"></i>
                                </button>
                            </div>
                        </div>
                        
                        <!-- New Password -->
                        <div class="mb-3">
                            <label for="newPassword" class="form-label">New Password</label>
                            <div class="input-group">
                                <input type="password" class="form-control" id="newPassword" name="newPassword" required>
                                <button class="btn btn-outline-secondary" type="button" id="toggleNewPassword">
                                    <i class="fas fa-eye"></i>
                                </button>
                            </div>
                            <div class="form-text">Password must be at least 8 characters long</div>
                        </div>
                        
                        <!-- Confirm New Password -->
                        <div class="mb-3">
                            <label for="confirmPassword" class="form-label">Confirm New Password</label>
                            <div class="input-group">
                                <input type="password" class="form-control" id="confirmPassword" name="confirmPassword" required>
                                <button class="btn btn-outline-secondary" type="button" id="toggleConfirmPassword">
                                    <i class="fas fa-eye"></i>
                                </button>
                            </div>
                            <div class="form-text">Re-enter your new password</div>
                        </div>
                        
                        <!-- Password Strength Indicator -->
                        <div class="mt-3">
                            <div class="d-flex justify-content-between mb-1">
                                <small>Password strength:</small>
                                <small id="passwordStrengthText">Weak</small>
                            </div>
                            <div class="progress" style="height: 5px;">
                                <div id="passwordStrengthBar" class="progress-bar bg-danger" role="progressbar" style="width: 25%"></div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="submit" class="btn btn-primary" id="changePasswordBtn">Change Password</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Success Modal -->
    <div class="modal fade" id="successModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-body text-center p-5">
                    <div class="mb-4">
                        <i class="fas fa-check-circle text-success" style="font-size: 4rem;"></i>
                    </div>
                    <h5 class="modal-title mb-3">Password Changed Successfully!</h5>
                    <p class="text-muted">Your password has been updated successfully.</p>
                    <button type="button" class="btn btn-primary mt-3" data-bs-dismiss="modal">OK</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Error Modal -->
    <div class="modal fade" id="errorModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-body text-center p-5">
                    <div class="mb-4">
                        <i class="fas fa-exclamation-circle text-danger" style="font-size: 4rem;"></i>
                    </div>
                    <h5 class="modal-title mb-3" id="errorTitle">Error Changing Password</h5>
                    <p class="text-muted" id="errorMessage"></p>
                    <button type="button" class="btn btn-primary mt-3" data-bs-dismiss="modal">Try Again</button>
                </div>
            </div>
        </div>
    </div>

    <!-- Bootstrap JS Bundle -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
    <script src="../../scripts/studentcontent/settings.js"></script>
    
    
</body>
</html>