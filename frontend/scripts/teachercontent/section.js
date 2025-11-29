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
            // Fixed: Simplified data access (removed redundancy)
            allClasses = result.classes || [];
            renderClassTable(allClasses);  
        },
        error: function (xhr, status, error) {
            console.error("Error fetching classes:", error);
            alert("Failed to load classes. Please try again.");
        }
    });
};



// Render the class table
function renderClassTable(classes) {
    const tbody = document.getElementById('classTableBody');
    if (!tbody) {
        console.error("Table body element not found");
        return;
    }
    
    tbody.innerHTML = ''; // Clear existing rows

    if (!classes || classes.length === 0) {
        const row = document.createElement('tr');
        const cell = document.createElement('td');
        cell.colSpan = 3;  // Adjusted to match columns (ID, Section, Details)
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

