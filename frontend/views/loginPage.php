<?php
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Student Attendance Management System</title>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.8/js/bootstrap.min.js" integrity="sha512-nKXmKvJyiGQy343jatQlzDprflyB5c+tKCzGP3Uq67v+lmzfnZUi/ZT+fc6ITZfSC5HhaBKUIvr/nTLCV+7F+Q==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>

  <link rel="stylesheet" href="../css/style.css">
</head>
<body>

  <!-- LOGIN WRAPPER -->
  <div class="login-wrapper d-flex flex-column justify-content-center align-items-center min-vh-100">
    <div class="login-form">
      <div class="form-title">ACCOUNT LOGIN</div>

      <!-- LOGO -->
      <div class="logo-container mb-4">
        <div class="logo">
          <img src="../src/sits_logo.png" alt="Logo">
        </div>
      </div>

      <form id="loginForm">
        <!-- ID NUMBER FIELD -->
        <div class="mb-3">
          <label for="id-number" class="form-label">ID Number</label>
          <div class="input-with-icon">
            <span class="input-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#777" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"/>
              </svg>
            </span>
            <input type="text" id="id-number" class="form-control" placeholder="Enter ID number..." required>
          </div>
        </div>

        <!-- PASSWORD FIELD -->
        <div class="mb-3">
          <label for="password" class="form-label">Password</label>
          <div class="input-with-icon">
            <span class="input-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#777" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 8H17V6C17 3.24 14.76 1 12 1C9.24 1 7 3.24 7 6V8H6C4.9 8 4 8.9 4 10V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V10C20 8.9 19.1 8 18 8ZM12 17C10.9 17 10 16.1 10 15C10 13.9 10.9 13 12 13C13.1 13 14 13.9 14 15C14 16.1 13.1 17 12 17ZM15.1 8H8.9V6C8.9 4.29 10.29 2.9 12 2.9C13.71 2.9 15.1 4.29 15.1 6V8Z"/>
              </svg>
            </span>
            <input type="password" id="password" class="form-control" placeholder="Enter password..." required>
          </div>
          <p id="error-text"></p>
        </div>

        <!-- LOGIN BUTTON -->
        <button type="submit" class="login-btn w-100 py-2 mb-3">LOGIN</button>

        <!-- FORGOT PASSWORD -->
        <div class="forgot-password mb-2">
          <a href="#" id="forgotPasswordLink">FORGOT PASSWORD?</a>
        </div>
      </form>
    </div>

    <!-- FOOTER -->
    <footer class="text-center mt-4 text-muted">
      © 2025 Student Attendance Management System
    </footer>
  </div>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js" integrity="sha512-v2CJ7UaYy4JwqLDIrZUI/4hqeoQieOmAZNXBeQyjo21dadnwR+8ZaIJVT8EE2iyI61OV8e6M8PP2/4hpQINQ/g==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
  <script src="../scripts/login.js"></script>
</body>
</html>