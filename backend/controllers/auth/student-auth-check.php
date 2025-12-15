<?php
session_start();

if (!isset($_SESSION['logged_in']) || $_SESSION['user_role'] !== 'student') {
    header('Location: ../AccessDeniedPage.php');
    exit();
}
?>