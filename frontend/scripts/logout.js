document.addEventListener('DOMContentLoaded', function() {;
    
    // Optional: Add logout functionality
    const logoutItem = document.querySelector('.sidebar_item:has(.fa-sign-out-alt)');
    if (logoutItem) {
        logoutItem.addEventListener('click', function() {
            if (confirm('Are you sure you want to logout?')) {
                
                window.location.href = '../../logout.php';
                
            }
        });
    }
});