<?php
session_start();

if (!isset($_SESSION['logged_in']) || $_SESSION['user_role'] !== 'instructor') {
    header('Location: ../loginPage.php');
    exit();
}
?>