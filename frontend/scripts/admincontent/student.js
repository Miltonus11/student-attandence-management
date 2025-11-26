// Modal Functions for Student
        const fetchStudents = () => {
        $.ajax({
            url:"../../../backend/controllers/Students/getStudents.php",
            method:"GET",
            dataType:"json",
            success: function(result){
                renderStudentTable(result.Students);
                console.log(result)
                }
            })
        }

// Initial fetch on page load
document.addEventListener('DOMContentLoaded', fetchStudents);

// Render the student table
function renderStudentTable(students) {
    const tbody = document.getElementById('studentTableBody');
    tbody.innerHTML = ''; // Clear existing rows

    students.forEach(student => {
        const row = document.createElement('tr');

        // Student ID No. cell
        const idCell = document.createElement('td');
        idCell.textContent = student.student_number;
        row.appendChild(idCell);

       // Name cell (full name: first_name + middle_name + last_name)
        const nameCell = document.createElement('td');
        nameCell.textContent = `${student.first_name} ${student.middle_name || ''} ${student.last_name}`.trim();
        row.appendChild(nameCell);

        // Year Level cell
        const yearLevelCell = document.createElement('td');
        yearLevelCell.textContent = student.year_level;
        row.appendChild(yearLevelCell);

        // Contact cell
        const contactCell = document.createElement('td');
        contactCell.textContent = student.contact;
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

            // Get data from the student object
            document.getElementById("viewStudentId").innerText = student.student_number;
           document.getElementById("viewStudentName").innerText = `${student.first_name} ${student.middle_name || ''} ${student.last_name}`.trim();
            document.getElementById("viewStudentyearlevel").innerText = student.year_level;
            document.getElementById("viewStudentcontact").innerText = student.contact;

            // Show the modal
            const modal = new bootstrap.Modal(document.getElementById("viewStudentModal"));
            modal.show();
        });

        detailsCell.appendChild(viewLink);
        row.appendChild(detailsCell);
        tbody.appendChild(row);
    });
}

// Open the add student modal
function openModal() {
    const modalId = 'addStudentModal';
    const modal = new bootstrap.Modal(document.getElementById(modalId));
    const form = document.querySelector(`#${modalId} form`);
    if (form) form.reset();
    modal.show();
}

// Close the add student modal
function closeModal() {
    const modalId = 'addStudentModal';
    const modalElement = document.getElementById(modalId);
    const modal = bootstrap.Modal.getInstance(modalElement);
    
    if (modal) modal.hide();
    const form = modalElement.querySelector('form');
    if (form) form.reset();
}

// Save a new student (send to backend)
function saveStudent() {
    const student_id = document.getElementById('student_id').value.trim();
    const year_level = document.getElementById('year_level').value.trim();
    const first_name = document.getElementById('first_name').value.trim();
     const middle_name_name = document.getElementById('middle_name').value.trim();
    const last_name = document.getElementById('last_name').value.trim();
    const student_email = document.getElementById('student_email').value.trim();

    // Check for empty fields
    if (!student_id || !year_level || !first_name || !last_name || !student_email) {
        alert('Please fill in all required fields.');
        return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(student_email)) {
        alert('Please enter a valid email address.');
        return;
    }

    // Prepare data for AJAX
    const studentData = {
        student_id: student_id,
        year_level: year_level,
        first_name: first_name,
        middle_name: middle_name,
        last_name: last_name,
        student_email: student_email
    };

    // Send to backend (adjust URL as needed)
    $.ajax({
        // url: "../../../backend/controllers/Students/addStudent.php", 
        data: studentData,
        success: function (response) {
            alert('Student added successfully!');
            closeModal();
            fetchStudents(); // Refresh the table
        },
        error: function (xhr, status, error) {
            console.error("Error saving student:", error);
            alert("Failed to save student. Please try again.");
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
