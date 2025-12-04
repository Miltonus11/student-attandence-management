// Function to fetch instructor for a subject (now only one)
function fetchInstructor(subjectId) {
    if (!subjectId) {
        console.error('No subject ID provided');
        return;
    }
    
    const loadingElement = document.getElementById('loadingInstructors');
    const noInstructorsElement = document.getElementById('noInstructors');
    const instructorContentElement = document.getElementById('instructorContent');
    
    if (loadingElement) loadingElement.style.display = 'block';
    if (noInstructorsElement) noInstructorsElement.style.display = 'none';
    if (instructorContentElement) instructorContentElement.style.display = 'none';
    
    $.ajax({
        url: '../../../backend/controllers/admin-controller/Instructors/getInstructor.php',
        method: 'GET',
        data: { subject_id: subjectId },
        dataType: 'json',
        success: function(data) {
            if (loadingElement) loadingElement.style.display = 'none';
            
            if (data.success && data.instructor) {
                if (instructorContentElement) {
                    instructorContentElement.innerHTML = `
                        <div class="card">
                            <div class="card-body">
                                <div class="row align-items-center">
                                    <div class="col-md-8">
                                        <h6 class="mb-1">${data.instructor.first_name} ${data.instructor.last_name}</h6>
                                        <p class="mb-0 text-muted small">ID: ${data.instructor.instructor_id}</p>
                                        <p class="mb-0 text-muted small">Email: ${data.instructor.email || 'N/A'}</p>
                                    </div>
                                    <div class="col-md-4 text-end">
                                        <button class="btn btn-sm btn-outline-danger" onclick="unassignInstructor(${subjectId}, ${data.instructor.instructor_id})">
                                            <i class="fas fa-user-times"></i> Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                    
                    instructorContentElement.style.display = 'block';
                }
                if (noInstructorsElement) noInstructorsElement.style.display = 'none';
                
                // Disable assign button if instructor exists
                const assignBtn = document.getElementById('assignInViewBtn');
                if (assignBtn) {
                    assignBtn.disabled = true;
                    assignBtn.innerHTML = '<i class="fas fa-user-check me-1"></i> Already Assigned';
                    assignBtn.classList.remove('btn-primary');
                    assignBtn.classList.add('btn-secondary');
                }
            } else {
                if (noInstructorsElement) {
                    noInstructorsElement.innerHTML = `
                        <i class="fas fa-user-plus fa-2x text-muted mb-2"></i>
                        <p class="text-muted">No instructor assigned yet</p>
                    `;
                    noInstructorsElement.style.display = 'block';
                }
                if (instructorContentElement) instructorContentElement.style.display = 'none';
                
                // Enable assign button if no instructor
                const assignBtn = document.getElementById('assignInViewBtn');
                if (assignBtn) {
                    assignBtn.disabled = false;
                    assignBtn.innerHTML = '<i class="fas fa-user-plus me-1"></i> Assign';
                    assignBtn.classList.remove('btn-secondary');
                    assignBtn.classList.add('btn-primary');
                }
            }
        },
        error: function(xhr, status, error) {
            console.error('Error fetching instructor:', error, xhr.responseText);
            if (loadingElement) loadingElement.style.display = 'none';
            if (noInstructorsElement) {
                noInstructorsElement.innerHTML = `
                    <i class="fas fa-exclamation-triangle fa-2x text-danger mb-2"></i>
                    <p class="text-danger">Failed to load instructor</p>
                `;
                noInstructorsElement.style.display = 'block';
            }
        }
    });
}

// Assign instructor from view modal
document.getElementById('assignInViewBtn')?.addEventListener('click', function() {
    const instructorId = document.getElementById('addInstructorSelect')?.value;
    const subjectIdElement = document.getElementById('viewSubjectId');
    const subjectId = subjectIdElement ? subjectIdElement.textContent : '';
    
    if (!subjectId) {
        alert('Cannot identify subject. Please refresh and try again.');
        return;
    }
    
    if (!instructorId) {
        alert('Please select an instructor first.');
        document.getElementById('addInstructorSelect')?.focus();
        return;
    }

    const btn = this;
    const originalText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Assigning...';

    const formData = new FormData();
    formData.append('subject_id', subjectId);
    formData.append('instructor_id', instructorId);

    $.ajax({
        url: '../../../backend/controllers/admin-controller/Instructors/addInstructor.php', // Changed to singular
        method: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function(data) {
            btn.disabled = false;
            btn.innerHTML = originalText;

            try {
                const response = typeof data === 'string' ? JSON.parse(data) : data;
                if (response.success || response.message === "Instructor assigned successfully") {
                    alert('Instructor assigned successfully!');
                    
                    // Clear and disable the select
                    const selectElement = document.getElementById('addInstructorSelect');
                    if (selectElement) {
                        selectElement.value = '';
                        selectElement.disabled = true;
                    }
                    
                    // Refresh instructor display
                    fetchInstructor(subjectId);
                } else {
                    alert('Error: ' + (response.message || 'Failed to assign instructor'));
                    if (response.message.includes('already has an assigned instructor')) {
                        fetchInstructor(subjectId); // Refresh to show current instructor
                    }
                }
            } catch (e) {
                console.error('JSON Parse Error:', e, 'Raw data:', data);
                alert('An error occurred while processing the response.');
            }
        },
        error: function(xhr, status, error) {
            btn.disabled = false;
            btn.innerHTML = originalText;
            console.error('AJAX Error:', status, error, xhr.responseText);
            alert('An error occurred. Please try again.');
        }
    });
});

// Unassign instructor
function unassignInstructor(subjectId, instructorId) {
    if (!subjectId || !instructorId) {
        alert('Invalid parameters');
        return;
    }

    if (!confirm('Are you sure you want to remove this instructor from the subject?')) {
        return;
    }

    const formData = new FormData();
    formData.append('subject_id', subjectId);
    formData.append('instructor_id', instructorId);

    $.ajax({
        url: '../../../backend/controllers/admin-controller/Instructors/deleteInstructor.php', // Changed to singular
        method: 'POST',
        data: formData,
        processData: false,
        contentType: false,
        success: function(data) {
            try {
                const response = typeof data === 'string' ? JSON.parse(data) : data;
                if (response.success || response.message === "Instructor removed successfully") {
                    alert('Instructor removed successfully!');
                    
                    // Enable the select dropdown again
                    const selectElement = document.getElementById('addInstructorSelect');
                    if (selectElement) {
                        selectElement.disabled = false;
                    }
                    
                    // Refresh instructor display
                    fetchInstructor(subjectId);
                } else {
                    alert('Error: ' + (response.message || 'Failed to remove instructor'));
                }
            } catch (e) {
                console.error('JSON Parse Error:', e, 'Raw data:', data);
                alert('An error occurred while processing the response.');
            }
        },
        error: function(xhr, status, error) {
            console.error('AJAX Error:', status, error, xhr.responseText);
            alert('An error occurred. Please try again.');
        }
    });
}

// Update the initializePage function to use fetchInstructor instead of fetchInstructors
function initializePage() {
    // Handle View button click
    document.querySelectorAll('.view-btn').forEach(button => {
        button.addEventListener('click', function() {
            const subjectId = this.getAttribute('data-subject-id');
            const subjectName = this.getAttribute('data-subject-name');
            const subjectCode = this.getAttribute('data-subject-code');
            
            // Set basic info
            const viewSubjectIdElement = document.getElementById('viewSubjectId');
            const viewSubjectNameElement = document.getElementById('viewSubjectName');
            const viewSubjectCodeElement = document.getElementById('viewSubjectCode');
            
            if (viewSubjectIdElement) viewSubjectIdElement.textContent = subjectId;
            if (viewSubjectNameElement) viewSubjectNameElement.textContent = subjectName;
            if (viewSubjectCodeElement) viewSubjectCodeElement.textContent = subjectCode;
            
            // Reset and show loading
            const loadingElement = document.getElementById('loadingInstructors');
            const noInstructorsElement = document.getElementById('noInstructors');
            const instructorContentElement = document.getElementById('instructorContent');
            
            if (loadingElement) loadingElement.style.display = 'block';
            if (noInstructorsElement) noInstructorsElement.style.display = 'none';
            if (instructorContentElement) {
                instructorContentElement.style.display = 'none';
                instructorContentElement.innerHTML = '';
            }
            
            // Enable select dropdown
            const selectElement = document.getElementById('addInstructorSelect');
            if (selectElement) {
                selectElement.disabled = false;
                selectElement.value = '';
            }
            
            // Fetch instructor (singular)
            fetchInstructor(subjectId);
            
            // Show modal
            const viewModalElement = document.getElementById('viewSubjectModal');
            if (viewModalElement) {
                const viewModal = new bootstrap.Modal(viewModalElement);
                viewModal.show();
            }
        });
    });
    
    // ... rest of your initializePage function ...
}