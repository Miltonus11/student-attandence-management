// Modal Functions for Teacher

// Fetch instructors from the backend and render the table
const fetchInstructors = () => {
    $.ajax({
        // url: "../../../backend/controllers/Instructors/getInstructors.php",  
        method: "GET",
        dataType: "json",
        success: function (result) {
            renderTeacherTable(result.Instructors);  
        },
        error: function (xhr, status, error) {
            console.error("Error fetching instructors:", error);
            alert("Failed to load instructors. Please try again.");
        }
    });
};

// Initial fetch on page load
document.addEventListener('DOMContentLoaded', fetchInstructors);

// Render the teacher table
function renderTeacherTable(instructors) {
    const tbody = document.getElementById('teacherTableBody');
    tbody.innerHTML = ''; // Clear existing rows

    instructors.forEach(instructor => {
        const row = document.createElement('tr');

        // Teacher ID No. cell
        const idCell = document.createElement('td');
        idCell.textContent = instructor.instructor_number;
        row.appendChild(idCell);

        // Name cell (full name: first_name + last_name)
        const nameCell = document.createElement('td');
        nameCell.textContent = `${instructor.first_name} ${instructor.last_name}`;
        row.appendChild(nameCell);


        // Contact cell 
        const contactCell = document.createElement('td');
        contactCell.textContent = instructor.email || instructor.contact || 'N/A';
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

            // Get data from the instructor object
            document.getElementById("viewTeacherId").innerText = instructor.instructor_number;
            document.getElementById("viewTeacherName").innerText = `${instructor.first_name} ${instructor.last_name}`;
            document.getElementById("viewTeacherContact").innerText = instructor.contact;

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

// Close the add teacher modal
function closeModal() {
    const modalId = 'addTeacherModal';
    const modalElement = document.getElementById(modalId);
    const modal = bootstrap.Modal.getInstance(modalElement);
    
    if (modal) modal.hide();
    const form = modalElement.querySelector('form');
    if (form) form.reset();
}

// Save a new teacher (send to backend)
function saveTeacher() {
    const instructor_id = document.getElementById('instructor_id').value.trim();
    const first_name = document.getElementById('first_name').value.trim();
    const last_name = document.getElementById('last_name').value.trim();
    const instructor_email = document.getElementById('instructor_email').value.trim();

    // Check for empty fields
    if (!teacherId || !firstName || !lastName || !email) {
        alert('Please fill in all required fields.');
        return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
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

    // Send to backend (adjust URL as needed)
    $.ajax({
        // url: "../../../backend/controllers/Instructors/addInstructor.php",  
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
