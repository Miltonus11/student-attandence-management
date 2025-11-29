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
            <div class="main-content" style="padding: 25px 30px;">
                
                <!-- Page Title -->
                <h2 class="section-title">Settings</h2>

                <!-- Profile Section -->
                <div class="profile-section">
                    <h3 style="font-weight: 600; margin-bottom: 25px; color: #1a1a1a;">Profile</h3>
                    
                    <div class="profile-container">
                        <!-- Avatar -->
                        <div class="profile-avatar">
                            <div class="avatar-circle">
                                <i class="fas fa-user"></i>
                            </div>
                            <a href="#" class="upload-image-link">Upload Image</a>
                        </div>
                        
                        <!-- Profile Info -->
                        <div class="profile-info">
                            <!-- Name -->
                            <div class="info-row">
                                <div class="info-item">
                                    <div class="info-label">Name</div>
                                    <div class="info-value">John lawrence Gabriel </div>
                                </div>
                                <button class="edit-btn">Edit</button>
                            </div>
                            
                            <!-- Email -->
                            <div class="info-row">
                                <div class="info-item">
                                    <div class="info-label">Email</div>
                                    <div class="info-value"><a href="mailto:JohnlawrenceGabriel@gmail.com">JohnlawrenceGabriel@gmail.com</a></div>
                                </div>
                                <button class="edit-btn">Edit</button>
                            </div>
                            
                            <!-- Contact -->
                            <div class="info-row">
                                <div class="info-item">
                                    <div class="info-label">Contact</div>
                                    <div class="info-value">
                                        (+63) 94******* 
                                        <a href="#" class="show-link">Show</a>
                                    </div>
                                </div>
                                <button class="edit-btn">Edit</button>
                            </div>
                            
                            <!-- Password -->
                            <div class="info-row">
                                <div class="info-item">
                                    <div class="info-label">Password</div>
                                    <div class="info-value">
                                        *********** 
                                        <a href="#" class="show-link">Show</a>
                                    </div>
                                </div>
                                <button class="edit-btn">Edit</button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- About Section -->
                <div class="about-section">
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

    <!-- Bootstrap JS Bundle -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
</body>
</html>