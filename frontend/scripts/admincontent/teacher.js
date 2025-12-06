// Global variables
let allTeachers = [];
let currentTeacherId = null;
let searchTimeout = null;

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    fetchTeachers();
    
    // Setup search functionality with auto-search
    const searchInput = document.getElementById('teacherSearch');
    
    if (searchInput) {
        // Clear any existing timeout when user types
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            
            // Debounce the search to avoid too many rapid calls
            searchTimeout = setTimeout(() => {
                performSearch(this.value.trim());
            }, 300); // 300ms delay
        });
        
        // Clear search when user clears input
        searchInput.addEventListener('change', function() {
            if (this.value === '') {
                performSearch('');
            }
        });
    }
});

// Fetch teachers from backend
const fetchTeachers = () => {
    $.ajax({
        url: "../../../backend/controllers/admin-controller/Instructors/getInstructors.php", 
        method: "GET",
        dataType: "json",
        success: function (result) {
            // Check both capital and lowercase keys
            allTeachers = result.Instructors || result.teachers || result || [];
            renderTeacherTable(allTeachers);
        },
        error: (xhr, status, error) => {
            console.error("Error loading teachers:", error);
            alert("Failed to load teachers. Please try again.");
        }
    });
};

// Search function
function performSearch(searchTerm = '') {
    if (searchTerm === '' && document.getElementById('teacherSearch')) {
        searchTerm = document.getElementById('teacherSearch').value.trim().toLowerCase();
    } else {
        searchTerm = searchTerm.toLowerCase();
    }
    
    const filteredTeachers = allTeachers.filter(teacher => {
        const fullName = `${teacher.first_name || ''} ${teacher.middle_name || ''} ${teacher.last_name || ''}`.toLowerCase().trim();
        const teacherNumber = (teacher.instructor_number || teacher.instructor_id || teacher.teacher_number || '').toString().toLowerCase();
        
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
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No Teachers found</td></tr>';
        return;
    }

    teachers.forEach(teacher => {
        const row = document.createElement('tr');
        const teacherNumber = teacher.instructor_number || teacher.instructor_id || teacher.teacher_number || 'N/A';
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
    currentTeacherId = teacher.instructor_id || teacher.id || teacher.userid;
    
    document.getElementById("viewTeacherId").textContent = teacher.instructor_number || teacher.instructor_id || 'N/A';
    document.getElementById("viewTeacherName").textContent = `${teacher.first_name || ''} ${teacher.middle_name || ''} ${teacher.last_name || ''}`.trim() || 'N/A';
    document.getElementById("viewTeacherContact").textContent = teacher.contact || teacher.instructor_contact || 'N/A';

    const modal = new bootstrap.Modal(document.getElementById("viewTeacherModal"));
    modal.show();
}

// Open add teacher modal
function openModal() {
    const modalElement = document.getElementById('addTeacherModal');
    const form = modalElement.querySelector('form');
    if (form) form.reset();
    
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
}

// Close add teacher modal
function closeModal() {
    const modalElement = document.getElementById('addTeacherModal');
    const modal = bootstrap.Modal.getInstance(modalElement);
    if (modal) {
        modal.hide();
    }
    
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
        instructor_contact: document.getElementById('instructor_contact').value.trim()
    };
    
    // Validation
    if (!teacherData.instructor_number || !teacherData.first_name || !teacherData.last_name || !teacherData.instructor_contact) {
        alert('Please fill in all required fields.');
        return;
    }

    $.ajax({
        url: "../../../backend/controllers/admin-controller/Instructors/addInstructors.php",
        method: "POST",
        dataType: "json",
        data: teacherData,
        success: function (response) {
            handleResponse(response, 'Teacher added successfully!');
            closeModal();
            fetchTeachers();
        },
        error: function (xhr, status, error) {
            console.error("Error saving teacher:", error);
            alert("Failed to save teacher. Please try again.");
        }
    });
}

// Edit teacher
function editTeacher(teacher) {
    currentTeacherId = teacher.instructor_id || teacher.id || teacher.userid;
    
    document.getElementById('edit_teacher_id').value = currentTeacherId;
    document.getElementById('edit_teacher_number').value = teacher.instructor_number || teacher.instructor_id || '';
    document.getElementById('edit_first_name').value = teacher.first_name || '';
    document.getElementById('edit_middle_name').value = teacher.middle_name || '';
    document.getElementById('edit_last_name').value = teacher.last_name || '';
    document.getElementById('edit_instructor_contact').value = teacher.contact || teacher.instructor_contact || '';
    
    const modal = new bootstrap.Modal(document.getElementById("editTeacherModal"));
    modal.show();
}

// Update teacher 
function updateTeacher() {
    const teacherId = document.getElementById('edit_teacher_id').value;
    const teacherData = {
        id: teacherId,
        instructor_id: teacherId,
        instructor_number: document.getElementById('edit_teacher_number').value.trim(),
        first_name: document.getElementById('edit_first_name').value.trim(),
        middle_name: document.getElementById('edit_middle_name').value.trim(),
        last_name: document.getElementById('edit_last_name').value.trim(),
        instructor_contact: document.getElementById('edit_instructor_contact').value.trim()
    };

    if (!teacherId) {
        alert('Teacher ID is missing. Please try again.');
        return;
    }

    if (!teacherData.instructor_number || !teacherData.first_name || !teacherData.last_name || !teacherData.instructor_contact) {
        alert('Please fill in all required fields.');
        return;
    }

    $.ajax({
        url: "../../../backend/controllers/admin-controller/Instructors/updateInstructors.php",
        method: "POST",
        data: teacherData,
        success: function (response) {
            handleResponse(response, 'Teacher updated successfully!');
            
            // Hide the modal
            const modalElement = document.getElementById("editTeacherModal");
            const modal = bootstrap.Modal.getInstance(modalElement);
            if (modal) {
                modal.hide();
            }
            
            // Refresh the teacher list
            fetchTeachers();
        },
        error: function (xhr, status, error) {
            console.error("Error updating teacher:", error);
            alert("Failed to update teacher. Please try again.");
        }
    });
}

// Delete teacher
function deleteTeacher(teacher) {
    currentTeacherId = teacher.instructor_id || teacher.id || teacher.userid;
    
    if (!currentTeacherId) {
        alert('Cannot delete: Teacher ID is missing.');
        return;
    }
    
    document.getElementById('deleteTeacherId').textContent = teacher.instructor_number || teacher.instructor_id || 'N/A';
    document.getElementById('deleteTeacherName').textContent = `${teacher.first_name || ''} ${teacher.middle_name || ''} ${teacher.last_name || ''}`.trim() || 'N/A';
    
    const modal = new bootstrap.Modal(document.getElementById("deleteTeacherModal"));
    modal.show();
}

// Confirm delete
function confirmDelete() {
    if (!currentTeacherId) {
        alert('Teacher ID is missing. Cannot proceed with deletion.');
        return;
    }

    $.ajax({
        url: "../../../backend/controllers/admin-controller/Instructors/deleteInstructors.php",
        method: "POST",
        data: { id: currentTeacherId, instructor_id: currentTeacherId },
        success: function (response) {
            handleResponse(response, 'Teacher deleted successfully!');
            
            // Hide the delete modal
            const modalElement = document.getElementById("deleteTeacherModal");
            const modal = bootstrap.Modal.getInstance(modalElement);
            if (modal) {
                modal.hide();
            }
            
            // Reset currentTeacherId and refresh list
            currentTeacherId = null;
            fetchTeachers();
        },
        error: function (xhr, status, error) {
            console.error("Error deleting teacher:", error);
            alert("Failed to delete teacher. Please try again.");
        }
    });
}

// Helper function to handle API responses
function handleResponse(response, successMessage) {
    try {
        const result = typeof response === 'string' ? JSON.parse(response) : response;
        
        if (result.success || (result.message && result.message.toLowerCase().includes("success"))) {
            alert(successMessage);
        } else {
            alert(result.error || result.message || 'Operation failed.');
        }
    } catch (e) {
        console.error("Parse error:", e);
        // Check if response is already a success message
        if (typeof response === 'string' && response.includes('success')) {
            alert(successMessage);
        } else {
            alert('Unexpected response from server.');
        }
    }
}