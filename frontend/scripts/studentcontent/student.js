
// Mock data
const mockClasses = [
    { class_id: 1, class_name: "Mathematics 101" },
    { class_id: 2, class_name: "Science 101"},
    { class_id: 3, class_name: "English Literature"},
    { class_id: 4, class_name: "History of Arts"},
    { class_id: 5, class_name: "Computer Science" },
 
];

// Global variable
let currentClasses = mockClasses;

//Load all classes
 
function loadClasses() {
    console.log("Loading classes...");
    
    // Simulate delay
    setTimeout(() => {
        displayClasses(currentClasses);
        updateClassCount(currentClasses.length);
    }, 100);
}

// Display classes in the grid
 
function displayClasses(classes) {
    const $classList = $('#classList');
    
    if (!classes || classes.length === 0) {
        $classList.html(`
            <div class="alert alert-info text-center">
                <i class="fas fa-info-circle"></i> No classes yet. Add one to get started!
            </div>
        `);
        return;
    }
    
    let html = '<div class="row" id="classGrid">';
    
    classes.forEach(c => {
        const title = escapeHtml(c.class_name);
       
        html += `
            <div class='col-md-12 col-lg-12 mb-3 class-card' data-title='${title}'>
                <div class='card h-100'>
                    <div class='card-body d-flex justify-content-between align-items-center'>
                        <h5 class='card-title mb-0'>
                            <i class='fas fa-graduation-cap text-primary me-2'></i>
                            ${title}
                        </h5>
                        <button class='btn btn-primary' onclick="viewClassDetails(${c.class_id})">
                            <i class='fas fa-eye'></i> View
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    html += `
        <div class="no-results alert alert-warning text-center d-none">
            <i class="fas fa-search-minus"></i> No classes match your search.
        </div>
    `;
    
    $classList.html(html);
}

// View class details
function viewClassDetails(classId) {
    const className = mockClasses.find(c => c.class_id === classId)?.class_name || 'Unknown Class';
    //  redirect to student-details.php
    window.location.href = `student-details.php?class_id=${classId}`;
}

//  Escape HTML to prevent XSS
function escapeHtml(text) {
    if (!text) return '';
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Initialize on load
$(document).ready(function() {
    console.log("Mock version loaded");
    loadClasses();
});