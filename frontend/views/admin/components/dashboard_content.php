<?php
    echo json_encode([
        "message"=> "Session",
        "username" => $_SESSION['username']
    ]);

    
?>
<h1 class="page_title">Administrator Dashboard</h1>

<div class="row">
    <div class="col-md-6 col-lg-3">
        <div class="dashboard_card card-students" onclick="window.location.href='students.php'">
            <div class="card_content">
                <div class="card_label">Students</div>
                <div class="card_value">4</div>
            </div>
            <div class="card_icon">
                <i class="fas fa-user-graduate"></i>
            </div>
        </div>
    </div>
    
    <div class="col-md-6 col-lg-3">
        <div class="dashboard_card card-classes" onclick="window.location.href='classes.php'">
            <div class="card_content">
                <div class="card_label">Classes</div>
                <div class="card_value">4</div>
            </div>
            <div class="card_icon">
                <i class="fas fa-chalkboard"></i>
            </div>
        </div>
    </div>
    
    <div class="col-md-6 col-lg-3">
        <div class="dashboard_card card-attendance">
            <div class="card_content">
                <div class="card_label">Total Student Attendance</div>
                <div class="card_value">47</div>
            </div>
            <div class="card_icon">
                <i class="fas fa-calendar-check"></i>
            </div>
        </div>
    </div>
          
    <div class="col-md-6 col-lg-3">
        <div class="dashboard_card card-teachers" onclick="window.location.href='teachers.php'">
            <div class="card_content">
                <div class="card_label">Class Teachers</div>
                <div class="card_value">1</div>
            </div>
            <div class="card_icon">
                <i class="fas fa-chalkboard-teacher"></i>
            </div>
        </div>
    </div>

    <div class="col-md-6 col-lg-3">
        <div class="dashboard_card card-session">
            <div class="card_content">
                <div class="card_label">Session & Terms</div>
                <div class="card_value">3</div>
            </div>
            <div class="card_icon">
                <i class="fas fa-chalkboard-teacher"></i>
            </div>
        </div>
    </div>
</div>