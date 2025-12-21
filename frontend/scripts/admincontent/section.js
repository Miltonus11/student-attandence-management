// Modal Functions for Section
// Storing all Classes for filtering
let allClasses = [];

// Fetch sections from the backend and render the table
    const fetchClasses = () => {
    $.ajax({
        url: "../../../backend/controllers/admin-controller/sections/getSections.php", 
        method: "GET",
        dataType: "json",
        success: function (result) {
            console.log(result)
            allClasses = result.classes || [];
            renderClass(allClasses);  
        },
        error: function (xhr, status, error) {
            console.error("Error fetching classes:", error);
            alert("Failed to load classes. Please try again.");
        }
    });
    };

$(document).ready(function(){

    fetchClasses();
})


// Class Handle Show Class

// Render the class table

function renderClass(classes) {
    let html = "";

    classes.forEach(c => {
        let title = c.class_name;
        let year  = c.year_level ?  `<span class='badge bg-secondary ms-2'>Year ${c.year_level}</span>` : "";
        const teacherName = c.teacher_name ? c.teacher_name : '<span class="text-danger">Not assigned</span>';
        html += `
            <div class='col-md-12 col-lg-12 mb-3 class-card' data-title='${title}'>
                <div class='card h-100'>
                    <div class='card-body d-flex justify-content-between align-items-center'>
                        <h5 class='card-title mb-0'>
                            <i class='fas fa-graduation-cap text-primary me-2'></i>
                            ${title}${year}
                        </h5>
                     
                        <button class='btn btn-primary'
                            onclick="window.location.href='section-details.php?class_id=${c.class_id}'">
                            <i class='fas fa-eye'></i> View
                        </button>
                    </div>
                </div>
            </div>
        `;
    });

    $("#classList").html(html);
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log("Page loaded, fetching classes...");
    fetchClasses();
    
    // Added: Event listeners for search (button click and Enter key)
    const searchInput = document.getElementById('classSearch');
    const searchButton = document.getElementById('searchButton');
    
    if (searchInput) {
        searchInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                performSearch();
            }
        });
    } else {
        console.warn('Search input not found; search may not work.');
    }
    
    if (searchButton) {
        searchButton.addEventListener('click', performSearch);
    } else {
        console.warn('Search button not found; search may not work.');
    }
});
