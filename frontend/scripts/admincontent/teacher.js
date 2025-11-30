// Global variables
let allTeachers = [];
let currentTeacherId = null;

// Fetch teachers
const fetchTeachers = () => {
    $.ajax({
        url: "../../../backend/controllers/Instructors/getInstructors.php",
        method: "GET",
        dataType: "json",
        success: (result) => {
            allTeachers = result.Instructors || result.teachers || [];
            renderTeacherTable(allTeachers);
        },
        error: () => alert("Failed to load instructors. Please try again.")
    });
};

// Search function
function performSearch() {
    const searchTerm = document.getElementById('teacherSearch').value.trim().toLowerCase();
    
    if (searchTerm === '') {
        renderTeacherTable(allTeachers);
        return;
    }
    
    const filteredTeachers = allTeachers.filter(teacher => {
        const fullName = `${teacher.first_name || ''} ${teacher.middle_name || ''} ${teacher.last_name || ''}`.toLowerCase().trim();
        const teacherNumber = (teacher.instructor_number || teacher.teacher_number || '').toString().toLowerCase();
        
        return fullName.includes(searchTerm) || teacherNumber.includes(searchTerm);
    });
    
    renderTeacherTable(filteredTeachers);
}

// Render teacher table
function renderTeacherTable(teachers) {
    const tbody = document.getElementById('teacherTableBody');
    if (!tbody) return;
   
    tbody.innerHTML = '';

    if (teachers.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align: center;">No Teachers found</td></tr>';
        return;
    }

    teachers.forEach(teacher => {
        const row = document.createElement('tr');
        const teacherNumber = teacher.instructor_number || teacher.teacher_number || 'N/A';
        const fullName = `${teacher.first_name || ''} ${teacher.middle_name || ''} ${teacher.last_name || ''}`.trim() || 'N/A';

        row.innerHTML = `
            <td>${teacherNumber}</td>
            <td>${fullName}</td>
            <td><a href="#" class="view-link" style="cursor: pointer;">View</a></td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-warning" title="Edit">Edit</button>
                    <button class="btn btn-danger" title="Delete">Delete</button>
                </div>
            </td>
        `;

        // Add event listeners
        row.querySelector('.view-link').addEventListener('click', (e) => {
            e.preventDefault();
            showTeacherDetails(teacher);
        });

        row.querySelector('.btn-warning').addEventListener('click', (e) => {
            e.preventDefault();
            editTeacher(teacher);
        });

        row.querySelector('.btn-danger').addEventListener('click', (e) => {
            e.preventDefault();
            deleteTeacher(teacher);
        });

        tbody.appendChild(row);
    });
}

// Show teacher details
function showTeacherDetails(teacher) {
    currentTeacherId = teacher.id || teacher.instructor_id;
    
    document.getElementById("viewTeacherId").textContent = teacher.instructor_number || teacher.teacher_number || '';
    document.getElementById("viewTeacherName").textContent = `${teacher.first_name || ''} ${teacher.middle_name || ''} ${teacher.last_name || ''}`.trim() || 'N/A';
    document.getElementById("viewTeacherContact").textContent = teacher.contact || 'N/A';

    new bootstrap.Modal(document.getElementById("viewTeacherModal")).show();
}

// Open add teacher modal
function openModal() {
    const modalElement = document.getElementById('addTeacherModal');
    const form = modalElement.querySelector('form');
    if (form) form.reset();
    new bootstrap.Modal(modalElement).show();
}

// Close add teacher modal
function closeModal() {
    const modalElement = document.getElementById('addTeacherModal');
    const modal = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
    modal.hide();
    
    const form = modalElement.querySelector('form');
    if (form) form.reset();
}

// Save teacher
function saveTeacher() {
    const teacherData = {
        instructor_number: document.getElementById('teacher_id').value.trim(),
        first_name: document.getElementById('first_name').value.trim(),
        middle_name: document.getElementById('middle_name').value.trim(),
        last_name: document.getElementById('last_name').value.trim(),
        contact: document.getElementById('contact').value.trim(),
    };

    // Validation
    if (!teacherData.instructor_number || !teacherData.first_name || !teacherData.last_name) {
        alert('Please fill in all required fields (Teacher ID, First Name, Last Name).');
        return;
    }

    $.ajax({
        url: "../../../backend/controllers/Instructors/addInstructors.php",
        method: "POST",
        data: teacherData,
        success: function (response) {
            handleResponse(response, 'Teacher added successfully!', fetchTeachers, closeModal);
        },
        error: function (xhr, status, error) {
            console.error("Error saving teacher:", error);
            alert("Failed to save teacher. Please try again.");
        }
    });
}

// Edit teacher
function editTeacher(teacher) {
    currentTeacherId = teacher.id || teacher.instructor_id;
    
    document.getElementById('edit_teacher_id').value = currentTeacherId;
    document.getElementById('edit_teacher_number').value = teacher.instructor_number || teacher.teacher_number || '';
    document.getElementById('edit_first_name').value = teacher.first_name || '';
    document.getElementById('edit_middle_name').value = teacher.middle_name || '';
    document.getElementById('edit_last_name').value = teacher.last_name || '';
    document.getElementById('edit_contact').value = teacher.contact || '';
    
    new bootstrap.Modal(document.getElementById("editTeacherModal")).show();
}

// Update teacher 
function updateTeacher() {
    const teacherId = document.getElementById('edit_teacher_id').value;
    const teacherData = {
        id: teacherId,
        instructor_number: document.getElementById('edit_teacher_number').value.trim(),
        first_name: document.getElementById('edit_first_name').value.trim(),
        middle_name: document.getElementById('edit_middle_name').value.trim(),
        last_name: document.getElementById('edit_last_name').value.trim(),
        contact: document.getElementById('edit_contact').value.trim(),
    };

    if (!teacherId) {
        alert('Teacher ID is missing. Please try again.');
        return;
    }

    if (!teacherData.instructor_number || !teacherData.first_name || !teacherData.last_name) {
        alert('Please fill in all required fields.');
        return;
    }

    $.ajax({
        url: "../../../backend/controllers/Instructors/updateInstructors.php",
        method: "POST",
        data: teacherData,
        success: function (response) {
            handleResponse(response, 'Teacher updated successfully!', fetchTeachers, 
                () => {
                    const modal = bootstrap.Modal.getInstance(document.getElementById("editTeacherModal"));
                    if (modal) modal.hide();
                });
        },
        error: function (xhr, status, error) {
            console.error("Error updating teacher:", error);
            alert("Failed to update teacher. Please try again.");
        }
    });
}

// Delete teacher
function deleteTeacher(teacher) {
    currentTeacherId = teacher.id || teacher.instructor_id;
    
    if (!currentTeacherId) {
        alert('Cannot delete: Teacher ID is missing.');
        return;
    }
    
    document.getElementById('deleteTeacherId').textContent = teacher.instructor_number || teacher.teacher_number || 'N/A';
    document.getElementById('deleteTeacherName').textContent = `${teacher.first_name || ''} ${teacher.middle_name || ''} ${teacher.last_name || ''}`.trim() || 'N/A';
    
    new bootstrap.Modal(document.getElementById("deleteTeacherModal")).show();
}

// Confirm delete
function confirmDelete() {
    if (!currentTeacherId) {
        alert('Teacher ID is missing. Cannot proceed with deletion.');
        return;
    }

    $.ajax({
        url: "../../../backend/controllers/Instructors/deleteInstructors.php",
        method: "POST",
        data: { id: currentTeacherId },
        success: function (response) {
            handleResponse(response, 'Teacher deleted successfully!', () => {
                const modal = bootstrap.Modal.getInstance(document.getElementById("deleteTeacherModal"));
                if (modal) modal.hide();
                currentTeacherId = null;
                fetchTeachers();
            });
        },
        error: function (xhr, status, error) {
            console.error("Error deleting teacher:", error);
            alert("Failed to delete teacher. Please try again.");
        }
    });
}

// Helper function to handle API responses
function handleResponse(response, successMessage, onSuccess, onSuccessCallback) {
    try {
        const result = typeof response === 'string' ? JSON.parse(response) : response;
        
        if (result.message && result.message.toLowerCase().includes("success")) {
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
    fetchTeachers();
    
    const searchInput = document.getElementById('teacherSearch');
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