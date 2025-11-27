// Modal Functions for teacher
// Storing all teachers for filtering
let allTeachers = [];

// Fetch instructors from the backend and render the table
const fetchInstructors = () => {
    $.ajax({
        url: "../../../backend/controllers/Instructors/getInstructors.php",  
        method: "GET",
        dataType: "json",
        success: function (result) {
            allTeachers = result.Teachers || result.Instructors || [];
            renderTeacherTable(allTeachers);  
        },
        error: function (xhr, status, error) {
            console.error("Error fetching instructors:", error);
            alert("Failed to load instructors. Please try again.");
        }
    });
};

// Search function
function performSearch() {
    const searchTerm = document.getElementById('teacherSearch').value.trim().toLowerCase();
    
    if (searchTerm === '') {
        // If search is empty, show all teachers
        renderTeacherTable(allTeachers);
        return;
    }
    
    // Filter teachers based on search term
    const filteredTeachers = allTeachers.filter(teacher => {
        // Search in individual name fields
        if (teacher.first_name && teacher.first_name.toLowerCase().includes(searchTerm)) {
            return true;
        }
        
        return false;
    });
    
    renderTeacherTable(filteredTeachers);
}

// Add event listeners
document.addEventListener('DOMContentLoaded', function() {
    fetchInstructors();
    
    // Add Enter key support for search
    const searchInput = document.getElementById('teacherSearch');
    const searchButton = document.getElementById('searchButton');
    
    if (searchInput) {
        searchInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                performSearch();
            }
        });
    }
    
    if (searchButton) {
        searchButton.addEventListener('click', performSearch);
    }
});

// Render the teacher table
function renderTeacherTable(teachers) {
    const tbody = document.getElementById('teacherTableBody');
    if (!tbody) {
        console.error('Teacher table body not found!');
        return;
    }
    
    tbody.innerHTML = ''; // Clear existing rows

    if (teachers.length === 0) {
        const row = document.createElement('tr');
        const cell = document.createElement('td');
        cell.colSpan = 4;
        cell.textContent = 'No teachers found';
        cell.style.textAlign = 'center';
        row.appendChild(cell);
        tbody.appendChild(row);
        return;
    }

    teachers.forEach(teacher => {
        const row = document.createElement('tr');

        // Teacher ID No. cell
        const idCell = document.createElement('td');
        idCell.textContent = teacher.instructor_number || teacher.teacher_id || 'N/A';
        row.appendChild(idCell);

        // Name cell (full name: first_name + middle_name + last_name)
        const nameCell = document.createElement('td');
        nameCell.textContent = `${teacher.first_name} ${teacher.middle_name || ''} ${teacher.last_name}`.trim();
        row.appendChild(nameCell);

        // Contact cell
        const contactCell = document.createElement('td');
        contactCell.textContent = teacher.contact || teacher.email || 'N/A';
        row.appendChild(contactCell);

        // Details cell with a view link
        const detailsCell = document.createElement('td');
        const viewLink = document.createElement('a');
        viewLink.textContent = 'View';
        viewLink.className = 'view-link';
        viewLink.href = '#'; // Prevent navigation

        // Event listener for opening the modal
        viewLink.addEventListener('click', function (event) {
            event.preventDefault();

            // Get data from the teacher object
            document.getElementById("viewTeacherId").innerText = teacher.instructor_number || teacher.teacher_id || 'N/A';
            document.getElementById("viewTeacherName").innerText = `${teacher.first_name} ${teacher.middle_name || ''} ${teacher.last_name}`.trim();
            document.getElementById("viewTeacherContact").innerText = teacher.contact || teacher.email || 'N/A';

            // Show the modal
            const modal = new bootstrap.Modal(document.getElementById("viewTeacherModal"));
            modal.show();
        });

        detailsCell.appendChild(viewLink);
        row.appendChild(detailsCell);
        tbody.appendChild(row);
    });
}

// Open the add teacher modal
function openModal() {
    const modalId = 'addTeacherModal';
    const modal = new bootstrap.Modal(document.getElementById(modalId));
    const form = document.querySelector(`#${modalId} form`);
    if (form) form.reset();
    modal.show();
}

// Close the add student modal
function closeModal() {
    const modalId = 'addTeacherModal';
    const modalElement = document.getElementById(modalId);
    const modal = bootstrap.Modal.getInstance(modalElement);
    
    if (modal) modal.hide();
    const form = modalElement.querySelector('form');
    if (form) form.reset();
}


/// Save a new teacher (send to backend)
function saveTeacher() {
    const instructor_id = document.getElementById('instructor_id').value.trim();
    const first_name = document.getElementById('first_name').value.trim();
    const last_name = document.getElementById('last_name').value.trim();
    const instructor_email = document.getElementById('instructor_email').value.trim();

    // Check for empty fields
    if (!instructor_id || !first_name || !last_name || !instructor_email) {
        alert('Please fill in all required fields.');
        return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(instructor_email)) {
        alert('Please enter a valid email address.');
        return;
    }

    // Prepare data for AJAX
    const teacherData = {
        instructor_id: instructor_id,
        first_name: first_name,
        last_name: last_name,
        instructor_email: instructor_email,
    };

    // Send to backend
    $.ajax({
        url: "../../../backend/controllers/Instructors/addInstructor.php",  // Uncomment this
        method: "POST",  
        data: teacherData,
        success: function (response) {
            alert('Teacher added successfully!');
            closeModal();
            fetchInstructors(); // Refresh the table
        },
        error: function (xhr, status, error) {
            console.error("Error saving teacher:", error);
            alert("Failed to save teacher. Please try again.");
        }
    });
}


// Reset modals on hide (global for all modals)
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.modal').forEach(modalEl => {
        modalEl.addEventListener('hidden.bs.modal', () => {
            const form = modalEl.querySelector('form');
            if (form) form.reset();
        });
    });
});



