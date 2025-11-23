<?php
    session_start();
?>
<header class="header">
    <div class="container-fluid">
        <div class="row align-items-center">
            <div class="col-md-6">
                <div class="d-flex align-items-center">
                    <div class="logo_container me-3">
                        <img src="../img/n.png" alt="Logo" class="logo_img">
                    </div>
                    <span class="sams_title">Administrator Dashboard</span>
                </div>
            </div>
            <div class="col-md-6 text-end">
                <div class="d-flex align-items-center justify-content-end">
                    <span class="search_icon"><i class="fas fa-search"></i></span>
                    <div class="profile d-flex align-items-center ms-3">
                        <div class="profile_icon"><i class="fas fa-user"></i></div>
                        <span class="profile_text ms-2">Welcome Admin <?php echo $_SESSION['username']?></span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</header>