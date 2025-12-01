// Modal Functions for Section
// Storing all Classes for filtering
let allClasses = [];

// Fetch sections from the backend and render the table
const fetchClasses = () => {
    $.ajax({
        url: "../../../backend/controllers/sections/getSections.php", 
        method: "GET",
        dataType: "json",
        success: function (result) {
            allClasses = result.classes || [];
            renderClassTable(allClasses);  
        },
        error: function (xhr, status, error) {
            console.error("Error fetching classes:", error);
            alert("Failed to load classes. Please try again.");
        }
    });
};

// Search function
function performSearch() {
    const searchTerm = document.getElementById('classSearch').value.trim().toLowerCase();
    
    if (searchTerm === '') {
        // If search is empty, show all Classes
        renderClassTable(allClasses);
        return;
    }
    
    const filteredClasses = allClasses.filter(classItem => {
        const classSection = (classItem.class_section || '').toString().toLowerCase();
        const classId = (classItem.class_id || '').toString().toLowerCase();  
        
        return classSection.includes(searchTerm) || classId.includes(searchTerm);
    });
    
    renderClassTable(filteredClasses);
}

// Render the class table
function renderClassTable(classes) {
    const tbody = document.getElementById('classTableBody');
    if (!tbody) {
        console.error("Table body element not found");
        return;
    }
    
    tbody.innerHTML = ''; 

    if (!classes || classes.length === 0) {
        const row = document.createElement('tr');
        const cell = document.createElement('td');
        cell.colSpan = 3;  
        cell.textContent = 'No Classes found';
        cell.style.textAlign = 'center';
        row.appendChild(cell);
        tbody.appendChild(row);
        return;
    }

    classes.forEach(classItem => {
        const row = document.createElement('tr');

        // Class ID No. cell
        const idCell = document.createElement('td');
        idCell.textContent = classItem.class_id || classItem.id || 'N/A';  
        row.appendChild(idCell);

        // Class Section cell
        const sectionCell = document.createElement('td');
        sectionCell.textContent = classItem.class_section || 'N/A';  
        row.appendChild(sectionCell);

        // Details cell with a view link
        const detailsCell = document.createElement('td');
        const viewLink = document.createElement('a');
        viewLink.textContent = 'View';
        viewLink.className = 'view-link';
        viewLink.href = '#';
        viewLink.style.cursor = 'pointer';

        // Event listener for opening the modal
        viewLink.addEventListener('click', function (event) {
            event.preventDefault();

            // Added: Check for modal elements before setting content
            const modalId = document.getElementById("viewClassId");
            const modalSection = document.getElementById("viewClassSection");
            const modalElement = document.getElementById("viewClassModal");

            if (!modalId || !modalSection || !modalElement) {
                console.error('One or more view modal elements not found!');
                return;
            }

            // Get data from the class object
            modalId.innerText = classItem.class_id || 'N/A';
            modalSection.innerText = classItem.class_section || 'N/A';

            // Show the modal
            const modal = new bootstrap.Modal(modalElement);
            modal.show();
        });

        detailsCell.appendChild(viewLink);
        row.appendChild(detailsCell);
        tbody.appendChild(row);
    });
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
