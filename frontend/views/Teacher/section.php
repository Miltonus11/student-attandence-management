<?php
include __DIR__ . '/../../../backend/db/conn.php';
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Manage Subject</title>

    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">

    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

    <!-- Page CSS -->
    <link rel="stylesheet" href="../../css/admin/section.css">

    <!-- Global CSS -->
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

                <!-- Title + Search + Add Button -->
                <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap">

                    <!-- Left: Title + Search Bar -->
                    <div class="d-flex align-items-center gap-3 flex-wrap">
                        <div>
                            <h2 class="mb-0">
                                </i> Manage Subject
                            </h2>
                            <span class="class-count">
                                <?php
                                    $stmt = $conn->query("SELECT COUNT(*) AS count FROM tbl_class");
                                    $count = $stmt->fetch()['count'];
                                    echo "Total Classes: {$count}";
                                ?>
                            </span>
                        </div>


                </div>

                <!-- Class List -->
                <div id="classList">
                    <?php
                        $stmt = $conn->query("SELECT * FROM tbl_class ORDER BY class_id ASC");
                        $classes = $stmt->fetchAll();

                        if (!$classes) {
                            echo '
                                <div class="alert alert-info text-center">
                                    <i class="fas fa-info-circle"></i> No classes yet. Add one to get started!
                                </div>
                            ';
                        } else {
                            echo '<div class="row" id="classGrid">';

                            foreach ($classes as $c) {
                                $title = htmlspecialchars($c['class_name']);
                                $year = isset($c['year_level']) && $c['year_level'] !== null
                                    ? "<span class='badge bg-secondary ms-2'>Year {$c['year_level']}</span>"
                                    : "";

                                echo "
                                    <div class='col-md-12 col-lg-12 mb-3 class-card' data-title='{$title}'>
                                        <div class='card h-100'>
                                            <div class='card-body d-flex justify-content-between align-items-center'>
                                                <h5 class='card-title mb-0'>
                                                    <i class='fas fa-graduation-cap text-primary me-2'></i>
                                                    {$title}{$year}
                                                </h5>
                                                <button class='btn btn-primary'
                                                    onclick=\"window.location.href='section-details.php?class_id={$c['class_id']}'\">
                                                    <i class='fas fa-eye'></i> View
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ";
                            }

                            echo '</div>';

                            echo '
                                <div class="no-results alert alert-warning text-center">
                                    <i class="fas fa-search-minus"></i> No classes match your search.
                                </div>
                            ';
                        }
                    ?>
                </div>

            </div>
        </div>
    </div>

    <!-- Scripts -->
    <script src="../../scripts/admincontent/add-classes.js"></script>
     <script src="../../scripts/logout.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>

</body>
</html>
