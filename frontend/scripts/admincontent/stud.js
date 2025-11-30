// Modal Functions for Student
let allStudents = [];
let currentStudentId = null;

// Fetch students from backend
const fetchStudents = () => {
    $.ajax({
        url: "../../../backend/controllers/Students/getStudents.php", 
        method: "GET",
        dataType: "json",
        success: function (result) {
            allStudents = result.Students || result.students || [];
            renderStudentTable(allStudents);
        },
        error:() => alert("Failed to load students. Please try again.")
        
    });
};

// Search function
function performSearch() {
    const searchTerm = document.getElementById('studentSearch').value.trim().toLowerCase();
    
    if (searchTerm === '') {
        renderStudentTable(allStudents);
        return;
    }
    
    const filteredStudents = allStudents.filter(student => {
        const fullName = `${student.first_name || ''} ${student.middle_name || ''} ${student.last_name || ''}`.toLowerCase().trim();
        const studentNumber = (student.student_number || student.stud_num || '').toString().toLowerCase();
        
        return fullName.includes(searchTerm) || studentNumber.includes(searchTerm);
    });
    
    renderStudentTable(filteredStudents);
}

// Render student table
function renderStudentTable(students) {
    const tbody = document.getElementById('studentTableBody');
    if (!tbody) return;
   
    tbody.innerHTML = '';

    if (students.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No Students found</td></tr>';
        return;
    }

    students.forEach(student => {
        const row = document.createElement('tr');
        const studentNumber = student.student_number || student.stud_num || 'N/A';
        const fullName = `${student.first_name || ''} ${student.middle_name || ''} ${student.last_name || ''}`.trim() || 'N/A';

        row.innerHTML = `
            <td>${studentNumber}</td>
            <td>${fullName}</td>
            <td>${student.year_level || 'N/A'}</td>
            <td><a href="#" class="view-link" style="cursor: pointer;">View</a></td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-warning" title="Edit">Edit</button>
                    <button class="btn btn-danger " title="Delete">Delete</button>
                </div>
            </td>
        `;

        // Add event listeners
        row.querySelector('.view-link').addEventListener('click', (e) => {
            e.preventDefault();
            showStudentDetails(student);
        });

        row.querySelector('.btn-warning').addEventListener('click', (e) => {
            e.preventDefault();
            editStudent(student);
        });

        row.querySelector('.btn-danger').addEventListener('click', (e) => {
            e.preventDefault();
            deleteStudent(student);
        });

        tbody.appendChild(row);
    });
}

// Show student details
function showStudentDetails(student) {
    currentStudentId = student.id || student.student_id || student.student_id_number;
    
    document.getElementById("viewStudentId").textContent = student.student_number || student.stud_num || 'N/A';
    document.getElementById("viewStudentName").textContent = `${student.first_name || ''} ${student.middle_name || ''} ${student.last_name || ''}`.trim() || 'N/A';
    document.getElementById("viewStudentyearlevel").textContent = student.year_level || 'N/A';
    document.getElementById("viewStudentcontact").textContent = student.contact || 'N/A';

    new bootstrap.Modal(document.getElementById("viewStudentModal")).show();
}

// Open add student modal
function openModal() {
    const modalElement = document.getElementById('addStudentModal');
    const form = modalElement.querySelector('form');
    if (form) form.reset();
    new bootstrap.Modal(modalElement).show();
}

// Close add student modal
function closeModal() {
    const modalElement = document.getElementById('addStudentModal');
    const modal = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
    modal.hide();
    
    const form = modalElement.querySelector('form');
    if (form) form.reset();
}

// Save student
function saveStudent() {
    const studentData = {
        student_number: document.getElementById('student_id').value.trim(),
        year_level: document.getElementById('year_level').value.trim(),
        first_name: document.getElementById('first_name').value.trim(),
        // middle_name: document.getElementById('middle_name').value.trim(),
        last_name: document.getElementById('last_name').value.trim(),
        // contact: document.getElementById('contact').value.trim()
    };
    console.log(studentData.student_number)
    // Validation
    if (!studentData.student_number || !studentData.year_level || !studentData.first_name || !studentData.last_name) {
        alert('Please fill in all required fields.');
        return;
    }

    $.ajax({
        url: "../../../backend/controllers/Students/addStudents.php",
        method: "POST",
        data: studentData,
        success: function (response) {
            handleResponse(response, 'Student added successfully!', fetchStudents, closeModal);
        },
        error: function (xhr, status, error) {
            console.error("Error saving student:", error);
            alert("Failed to save student. Please try again.");
        }
    });
}

// Edit student
function editStudent(student) {
    currentStudentId = student.id || student.student_id || student.student_id_number;
    
    document.getElementById('edit_student_id').value = currentStudentId;
    document.getElementById('edit_student_number').value = student.student_number || student.stud_num || '';
    document.getElementById('edit_year_level').value = student.year_level || '';
    document.getElementById('edit_first_name').value = student.first_name || '';
    document.getElementById('edit_middle_name').value = student.middle_name || '';
    document.getElementById('edit_last_name').value = student.last_name || '';
    document.getElementById('edit_contact').value = student.contact || '';
    
    new bootstrap.Modal(document.getElementById("editStudentModal")).show();
}

// Update student 
function updateStudent() {
    const studentId = document.getElementById('edit_student_id').value;
    const studentData = {
        id: studentId,
        stud_num: document.getElementById('edit_student_number').value.trim(),
        student_number: document.getElementById('edit_student_number').value.trim(),
        year_level: document.getElementById('edit_year_level').value.trim(),
        first_name: document.getElementById('edit_first_name').value.trim(),
        middle_name: document.getElementById('edit_middle_name').value.trim(),
        last_name: document.getElementById('edit_last_name').value.trim(),
        contact: document.getElementById('edit_contact').value.trim()
    };

    if (!studentId) {
        alert('Student ID is missing. Please try again.');
        return;
    }

    if (!studentData.student_number || !studentData.year_level || !studentData.first_name || !studentData.last_name) {
        alert('Please fill in all required fields.');
        return;
    }

    $.ajax({
        url: "../../../backend/controllers/Students/updateStudents.php",
        method: "POST",
        data: studentData,
        success: function (response) {
            handleResponse(response, 'Student updated successfully!', fetchStudents, 
                () => bootstrap.Modal.getInstance(document.getElementById("editStudentModal")).hide());
        },
        error: function (xhr, status, error) {
            console.error("Error updating student:", error);
            alert("Failed to update student. Please try again.");
        }
    });
}

// Delete student
function deleteStudent(student) {
    currentStudentId = student.id || student.student_id || student.student_id_number;
    
    if (!currentStudentId) {
        alert('Cannot delete: Student ID is missing.');
        return;
    }
    
    document.getElementById('deleteStudentId').textContent = student.student_number || student.stud_num || 'N/A';
    document.getElementById('deleteStudentName').textContent = `${student.first_name || ''} ${student.middle_name || ''} ${student.last_name || ''}`.trim() || 'N/A';
    
    new bootstrap.Modal(document.getElementById("deleteStudentModal")).show();
}

// Confirm delete
function confirmDelete() {
    if (!currentStudentId) {
        alert('Student ID is missing. Cannot proceed with deletion.');
        return;
    }

    $.ajax({
        url: "../../../backend/controllers/Students/deleteStudents.php",
        method: "POST",
        data: { id: currentStudentId },
        success: function (response) {
            handleResponse(response, 'Student deleted successfully!', () => {
                bootstrap.Modal.getInstance(document.getElementById("deleteStudentModal")).hide();
                currentStudentId = null;
                fetchStudents();
            });
        },
        error: function (xhr, status, error) {
            console.error("Error deleting student:", error);
            alert("Failed to delete student. Please try again.");
        }
    });
}

// Helper function to handle API responses  / optional pwede ren rmeove to
function handleResponse(response, successMessage, onSuccess, onSuccessCallback) {
    try {
        const result = typeof response === 'string' ? JSON.parse(response) : response;
        
        if (result.message && result.message.includes("successfully")) {
            alert(successMessage);
            if (onSuccessCallback) onSuccessCallback();
            if (onSuccess) onSuccess();
        } else {
            alert(result.error || result.message || 'Operation failed.');
        }
    } catch (e) {
        console.error("Parse error:", e);
        alert('Unexpected response from server.');
    }
}

// Initialize event listeners
document.addEventListener('DOMContentLoaded', function() {
    fetchStudents();
    
    const searchInput = document.getElementById('studentSearch');
    const searchButton = document.querySelector('.search-btn');
    
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => e.key === 'Enter' && performSearch());
    }
    
    if (searchButton) {
        searchButton.addEventListener('click', performSearch);
    }

    // Auto-reset modals when closed
    document.querySelectorAll('.modal').forEach(modalEl => {
        modalEl.addEventListener('hidden.bs.modal', () => { 
            const form = modalEl.querySelector('form'); 
            if (form) form.reset();
        });
    });
});