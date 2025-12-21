 <div class="col-md-3 col-lg-2 p-0">
    
                <div class="sidebar">

        <!-- Profile Section - Now Dynamic  need  the backend/sidebar.php-->
        <div class="profile-section" style="text-align: center; padding: 20px; border-bottom: 1px solid #ddd;">
            <img src="<?php echo $sidebar_user['avatar'] ?? '../../src/image.png'; ?>"
                 alt="Profile Picture" 
                 class="profile-image" 
                 style="width: 70px; height: 70px; object-fit: cover; margin-bottom: 10px; border-radius:100px;"
                 id="sidebarProfileImage">
            <div class="profile-name" 
                 style="font-weight: bold; font-size: 16px;"
                 id="sidebarProfileName">
                <?php echo htmlspecialchars($_SESSION['first_name'] . " " . $_SESSION['last_name'] ?? 'Teacher'); ?>
            </div>
        </div>

                     <div class="sidebar_section">
                        <div class="sidebar_title">Subject</div>
                        <a href="subject.php" class="sidebar_item" id="subject.php">
                            <span class="sidebar_item_icon"><i class="fas fa-book"></i></span>
                            <span class="sidebar_item_text">Subject</span>
                            <span class="arrow"><i class="fas fa-chevron-right"></i></span>
                        </a>
                    </div>


                    <div class="sidebar_section">
                        <div class="sidebar_title">Section</div>
                        <a href="section.php" class="sidebar_item" id="section.php">
                            <span class="sidebar_item_icon"><i class="fas fa-chalkboard"></i></span>
                            <span class="sidebar_item_text">Section</span>
                            <span class="arrow"><i class="fas fa-chevron-right"></i></span>
                        </a>
                    </div>
                   

                             <div class="sidebar_item">
                        <span class="sidebar_item_icon"><i class="fas fa-sign-out-alt"></i></span>
                        <span class="sidebar_item_text">Logout</span>
                    </div>
                </div>
            </div>
            