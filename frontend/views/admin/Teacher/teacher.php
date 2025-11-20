<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Administrator Dashboard</title>
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <!-- css -->
       <link rel="stylesheet" href="../admin/main.css"> 
<link rel="stylesheet" href="../Student/css/header.css">
<link rel="stylesheet" href="../Student/css/sidebar.css">
<link rel="stylesheet" href="../Student/css/student_content.css"> 
</head>
<body>
    <!-- Header -->
   <?php include 'header.php'; ?> 

    <!-- Main Container -->
    <div class="container-fluid">
        <div class="row">
            <!-- Sidebar -->
             <?php include '../Student/header/sidebar.php'; ?> 

            <!-- Main Content -->
                  <?php include "../Student/student_content.php"; ?> 
            
           
            </div>
        </div>
    </div>

    <!-- Bootstrap JS Bundle with Popper -->

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
 <script src="../Student/js/logout.js"></script> 
</body>
</html>
</body>

</html>