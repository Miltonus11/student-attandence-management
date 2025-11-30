// Modal Functions for Student

// Storing ng student to for filtering
let allStudents = [];

// Fetch students from the backend and render the table
const fetchStudents = () => {
    $.ajax({
        url: "../../../backend/controllers/Students/getStudents.php",
        method: "GET",
        dataType: "json",
        success: function (result) {
            allStudents = result.Students; // Storing ng student 
            renderStudentTable(allStudents);
            updateStudentCount(allStudents.length);
        },
        error: function (xhr, status, error) {
            console.error("Error fetching students:", error);
            alert("Failed to load students. Please try again.");
        }
    });
};

// Initial fetch on page load
document.addEventListener('DOMContentLoaded', function() {
    fetchStudents();
    
    // Add event listener to year level filter
    document.getElementById('yearLevelFilter').addEventListener('change', function() {
        filterStudentsByYearLevel(this.value);
    });
    
    // Add event listener to select all checkbox
    document.getElementById('selectAll').addEventListener('change', function() {
        const checkboxes = document.querySelectorAll('.student-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.checked = this.checked;
        });
    });
});

// Filter students by year level
function filterStudentsByYearLevel(yearLevel) {
    if (yearLevel === 'all') {
        renderStudentTable(allStudents);
        updateStudentCount(allStudents.length);
    } else {
        const filteredStudents = allStudents.filter(student => 
            student.year_level.toString() === yearLevel.toString()
        );
        renderStudentTable(filteredStudents);
        updateStudentCount(filteredStudents.length);
    }
}

// Add event listener to the select element
document.addEventListener('DOMContentLoaded', function() {
    const yearLevelFilter = document.getElementById('yearLevelFilter');
    
    if (yearLevelFilter) {
        yearLevelFilter.addEventListener('change', function() {
            const selectedYearLevel = this.value;
            filterStudentsByYearLevel(selectedYearLevel);
        });
    }
});

// Update student count display
function updateStudentCount(count) {
    // You'll need to add an element to display the count, or modify this as needed
    console.log(`Total students: ${count}`);
    // Example: document.getElementById('studentCount').textContent = count; 
}

// Render the student table
function renderStudentTable(students) {
    const tbody = document.getElementById('studentTableBody');
    tbody.innerHTML = ''; // Clear existing rows

    students.forEach(student => {
        const row = document.createElement('tr');

        // Action cell with checkbox
        const actionCell = document.createElement('td');
        actionCell.className = 'checkbox-cell';
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'checkbox student-checkbox';
        checkbox.value = student.student_number; // Store student ID as value
        actionCell.appendChild(checkbox);
        row.appendChild(actionCell);

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

            // Show the modal
            const modal = new bootstrap.Modal(document.getElementById("viewStudentModal"));
            modal.show();
        });

        detailsCell.appendChild(viewLink);
        row.appendChild(detailsCell);
        tbody.appendChild(row);
    });

    // Reset select all checkbox when table is re-rendered
    document.getElementById('selectAll').checked = false;
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
    
    if (modal) {
        modal.hide();
    } else {
        // If no instance exists, create one and hide it
        new bootstrap.Modal(modalElement).hide();
    }
    
    const form = modalElement.querySelector('form');
    if (form) form.reset();
}

// Optional: Function to get selected students
function getSelectedStudents() {
    const selectedCheckboxes = document.querySelectorAll('.student-checkbox:checked');
    const selectedStudents = Array.from(selectedCheckboxes).map(checkbox => checkbox.value);
    return selectedStudents;
}