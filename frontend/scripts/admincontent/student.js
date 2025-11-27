// Modal Functions for Student
// Storing all Students for filtering
let allStudents = [];

// Fetch students from the backend and render the table
const fetchStudents = () => {
    $.ajax({
        url: "../../../backend/controllers/Students/getStudents.php",
        method: "GET",
        dataType: "json",
        success: function (result) {
           
            allStudents = result.Students || result.students || [];
            renderStudentTable(allStudents);  
        },
        error: function (xhr, status, error) {
            console.error("Error fetching students:", error);
            alert("Failed to load students. Please try again.");
        }
    });
};

// Search function
function performSearch() {
    const searchTerm = document.getElementById('studentSearch').value.trim().toLowerCase();
    
    if (searchTerm === '') {
        // If search is empty, show all Students
        renderStudentTable(allStudents);
        return;
    }
    
    // Filter students based on search term (optimized: removed redundant checks)
    const filteredStudents = allStudents.filter(student => {
        const fullName = `${student.first_name || ''} ${student.middle_name || ''} ${student.last_name || ''}`.toLowerCase().trim();
        const studentNumber = (student.student_number || '').toString().toLowerCase();
        
        return fullName.includes(searchTerm) || studentNumber.includes(searchTerm);
    });
    
    renderStudentTable(filteredStudents);
}

// Render the student table
function renderStudentTable(students) {
    const tbody = document.getElementById('studentTableBody');
    if (!tbody) {
        console.error('Student table body not found!');
        return;
    }
   
    tbody.innerHTML = ''; // Clear existing rows

    if (students.length === 0) {
        const row = document.createElement('tr');
        const cell = document.createElement('td');
        cell.colSpan = 5; 
        cell.textContent = 'No Students found';
        cell.style.textAlign = 'center';
        row.appendChild(cell);
        tbody.appendChild(row);
        return;
    }

    students.forEach(student => {
        const row = document.createElement('tr');

        // Student ID No. cell
        const idCell = document.createElement('td');
        idCell.textContent = student.student_number || 'N/A';
        row.appendChild(idCell);

        // Name cell (full name: first_name + middle_name + last_name)
        const nameCell = document.createElement('td');
        nameCell.textContent = `${student.first_name || ''} ${student.middle_name || ''} ${student.last_name || ''}`.trim() || 'N/A';
        row.appendChild(nameCell);

        // Year Level cell
        const yearLevelCell = document.createElement('td');
        yearLevelCell.textContent = student.year_level || 'N/A';
        row.appendChild(yearLevelCell);

        // Contact cell
        const contactCell = document.createElement('td');
        contactCell.textContent = student.contact || 'N/A';
        row.appendChild(contactCell);

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

            // Get data from the student object with fallbacks
            document.getElementById("viewStudentId").innerText = student.student_number || 'N/A';
            document.getElementById("viewStudentName").innerText = `${student.first_name || ''} ${student.middle_name || ''} ${student.last_name || ''}`.trim() || 'N/A';
            document.getElementById("viewStudentyearlevel").innerText = student.year_level || 'N/A';
            document.getElementById("viewStudentcontact").innerText = student.contact || 'N/A';

            // Show the modal
            const modalElement = document.getElementById("viewStudentModal");
            const modal = new bootstrap.Modal(modalElement);
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
    const modalElement = document.getElementById(modalId);
    const modal = new bootstrap.Modal(modalElement);
    const form = modalElement.querySelector('form');
    if (form) form.reset();
    modal.show();
}

// Close the add student modal
function closeModal() {
    const modalId = 'addStudentModal';
    const modalElement = document.getElementById(modalId);
    const modal = bootstrap.Modal.getInstance(modalElement);
    
    // If no instance exists, create one
    if (!modal) {
        const newModal = new bootstrap.Modal(modalElement);
        newModal.hide();
    } else {
        modal.hide();
    }
    
    const form = modalElement.querySelector('form');
    if (form) form.reset();
}

// Add event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    fetchStudents();
    
    // Add Enter key support for search
    const searchInput = document.getElementById('studentSearch');
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


/// Save a new student (send to backend)
function saveStudent() {
    const student_number = document.getElementById('student_id').value.trim();
    const year_level = document.getElementById('year_level').value.trim();
    const first_name = document.getElementById('first_name').value.trim();
    const middle_name = document.getElementById('middle_name').value.trim(); 
    const last_name = document.getElementById('last_name').value.trim();
    const contact = document.getElementById('contact').value.trim();


    // Check for empty fields
    if (!student_number || !year_level || !first_name || !last_name || !contact ) {
        alert('Please fill in all required fields.');
        return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(student_email)) {
        alert('Please enter a valid email address.');
        return;
    }

    // Contact number validation (optional but recommended)
    const contactRegex = /^[0-9+\-\s()]{10,}$/;
    if (!contactRegex.test(contact)) {
        alert('Please enter a valid contact number.');
        return;
    }

    // Prepare data for AJAX
    const studentData = {
        student_number: student_number,
        year_level: year_level,
        first_name: first_name,
        middle_name: middle_name,  
        last_name: last_name,
        contact: contact,
       
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