
<?php
include __DIR__ . '/../../../backend/db/conn.php'; //pwede tabggalin to if my backend na
    require_once('../../../backend/controllers/auth/student-auth-check.php');
    $student_id = $_SESSION['student_id'];
    $first_name = $_SESSION['first_name'];
    $last_name = $_SESSION['last_name'];

    echo $student_id;
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Subject List</title>

    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">

    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

    <link rel="stylesheet" href="../../css/main.css">
    <link rel="stylesheet" href="../../css/header.css">
    <link rel="stylesheet" href="../../css/sidebar.css">
    <link rel="stylesheet" href="../../css/modal.css">

    <!-- jQuery -->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
</head>

<body>

    <!-- Header -->
    <?php include 'components/header.php'; ?>

    <!-- Main Container -->
    <div class="container-fluid">
        <div class="row">

            <!-- Sidebar -->
            <div class="col-md-3 col-lg-2 p-0">
                <?php include 'components/sidebar.php'; ?>
            </div>

            <!-- Main Content -->
            <div class="col-md-9 col-lg-10 p-4">

                <!-- Title  -->
                <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap">

                    <div class="d-flex align-items-center gap-3 flex-wrap">
                        <div>
                            <h2 class="mb-0">
                                <i class="fas fa-chalkboard-teacher text-primary"></i> Subject List
                            </h2>
                            <span class="class-count">

                            <!-- dto makikita mo kung ilang count yung subject sa database optional lang to
                             pero pwede lagyan sa backend  -->
                                <?php
                                    $stmt = $conn->query("SELECT COUNT(*) AS count FROM tbl_class");
                                    $count = $stmt->fetch()['count'];
                                    echo "Total Classes: {$count}";
                                ?>
                            </span>
                        </div>
                    
                </div>
                <!-- Class List Container -->
                <div id="classList">
                    <!-- dynamic na to -->
                </div>

            </div>
        </div>
    </div>

     <!-- Pagination Section -->
            <div class="pagination-wrapper">
                <div id="paginationInfo">Showing 1 to 8 of 8 entries</div>
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

    <!-- Scripts -->
    <script src="../../scripts/studentcontent/student.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="../../scripts/logout.js"></script>
    
  
</body>
</html>