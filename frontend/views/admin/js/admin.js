document.addEventListener('DOMContentLoaded', function() {
    //  sidebar item clicks
    document.querySelectorAll('.sidebar_item').forEach(item => {
        item.addEventListener('click', function() {
            document.querySelectorAll('.sidebar_item').forEach(i => {
                i.classList.remove('active');
            });
            this.classList.add('active');
        });
    });
    
    // Optional: Add functionality for sidebar arrows if needed
    document.querySelectorAll('.sidebar_item .arrow').forEach(arrow => {
        arrow.addEventListener('click', function(e) {

            e.stopPropagation(); 
            const parentItem = this.closest('.sidebar_item');

           
            console.log('Arrow clicked for:', parentItem.querySelector('.sidebar_item_text').textContent);
        });
    });
    
    // Optional: Add logout functionality
    const logoutItem = document.querySelector('.sidebar_item:has(.fa-sign-out-alt)');
    if (logoutItem) {
        logoutItem.addEventListener('click', function() {
            if (confirm('Are you sure you want to logout?')) {
                
                window.location.href = 'logout.php';
            }
        });
    }
});