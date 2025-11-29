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
    <link rel="stylesheet" href="../../css/settings.css">
    
    
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
                
                <!-- Header Section -->
                <div class="content-header">
                    <h2 class="section-title">Settings</h2>
                </div>

                <!-- Content Area -->
                <div class="content-area">
             
                    
                    <div class="about-section">
                        <!-- System Name -->
                        <div class="about-item">
                            <div class="about-label">SYSTEM NAME</div>
                            <div class="about-value">SITS Attendance Management System</div>
                        </div>
                        
                        <!-- Version Number -->
                        <div class="about-item">
                            <div class="about-label">VERSION NUMBER</div>
                            <div class="about-value">v1.6.7</div>
                        </div>
                        
                        <!-- Help / Contact Support -->
                        <div class="about-item">
                            <div class="about-label">HELP / CONTANCT SUPPORT</div>
                            <div class="about-value">Sitssystem@gmail.com</div>
                        </div>
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