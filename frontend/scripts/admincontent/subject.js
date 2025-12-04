$(document).ready(function() {
    let currentSubjectId = null; // Store current subject ID globally

    // Function to open the Add Subject modal
    window.openAddModal = function() {
        $('#addClassesModal').modal('show');
    };

    // Handle Add Subject form submission
    $('#saveSubjectBtn').on('click', function() {
        const formData = new FormData(document.getElementById('addSubjectForm'));
        
        $.ajax({
            url: '../../../backend/subjects/addsubjects.php', 
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function(response) {
                try {
                    const result = JSON.parse(response);
                    if (result.success) {
                        alert(result.message || 'Subject added successfully!');
                        $('#addClassesModal').modal('hide');
                        location.reload();
                    } else {
                        alert('Error: ' + (result.error || 'Failed to add subject.'));
                    }
                } catch (e) {
                    alert('Invalid response from server.');
                }
            },
            error: function() {
                alert('An error occurred while adding the subject.');
            }
        });
    });

    // Handle Edit button clicks
    $(document).on('click', '.edit-btn', function() {
        const subjectId = $(this).data('subject-id');
        const subjectName = $(this).data('subject-name');
        const subjectCode = $(this).data('subject-code');

        $('#editSubjectId').val(subjectId);
        $('#editSubjectName').val(subjectName);
        $('#editSubjectCode').val(subjectCode);
        $('#editSubjectModal').modal('show');
    });

    // Handle Update Subject
    $('#updateSubjectBtn').on('click', function() {
        const formData = new FormData(document.getElementById('editSubjectForm'));
        
        $.ajax({
            url: '../../../backend/subjects/update_subject.php',
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function(response) {
                try {
                    const result = JSON.parse(response);
                    if (result.success) {
                        alert(result.message || 'Subject updated successfully!');
                        $('#editSubjectModal').modal('hide');
                        location.reload();
                    } else {
                        alert('Error: ' + (result.error || 'Failed to update subject.'));
                    }
                } catch (e) {
                    alert('Invalid response from server.');
                }
            },
            error: function() {
                alert('An error occurred while updating the subject.');
            }
        });
    });

    // Handle View button clicks
    $(document).on('click', '.view-btn', function() {
        const subjectId = $(this).data('subject-id');
        const subjectName = $(this).data('subject-name');
        const subjectCode = $(this).data('subject-code');

        currentSubjectId = subjectId; // Store globally
        
        $('#viewSubjectId').text(subjectId);
        $('#viewSubjectName').text(subjectName);
        $('#viewSubjectCode').text(subjectCode);

        // Reset select dropdown
        $('#addInstructorSelect').val('');

        // Show loading and hide others
        $('#loadingInstructors').show();
        $('#noInstructors').hide();
        $('#instructorContent').hide();

        // Load assigned instructors
        loadInstructors(subjectId);
        
        $('#viewSubjectModal').modal('show');
    });

    // Function to load instructors
    function loadInstructors(subjectId) {
        $.ajax({
            url: '../../../backend/subjects/getAssignedInstructor.php', 
            type: 'GET',
            data: { subject_id: subjectId },
            dataType: 'json',
            success: function(response) {
                $('#loadingInstructors').hide();
                if (response.success && response.instructors && response.instructors.length > 0) {
                    let content = '<ul class="list-group">';
                    response.instructors.forEach(function(instructor) {
                        content += `<li class="list-group-item d-flex justify-content-between align-items-center">
                            <div>
                                <strong>${instructor.first_name} ${instructor.last_name}</strong><br>
                                <small class="text-muted">ID: ${instructor.instructor_id}</small>
                            </div>
                            <button class="btn btn-sm btn-danger remove-instructor-btn" 
                                    data-instructor-id="${instructor.instructor_id}">
                                <i class="fas fa-times"></i> Remove
                            </button>
                        </li>`;
                    });
                    content += '</ul>';
                    $('#instructorContent').html(content).show();
                    $('#noInstructors').hide();
                } else {
                    $('#noInstructors').show();
                    $('#instructorContent').hide();
                }
            },
            error: function(xhr, status, error) {
                $('#loadingInstructors').hide();
                $('#noInstructors').show();
                console.error('Error loading instructors:', error);
            }
        });
    }

    // Handle Assign Instructor
    $('#assignInViewBtn').on('click', function() {
        const instructorId = $('#addInstructorSelect').val();
        
        if (!instructorId) {
            alert('Please select an instructor.');
            return;
        }

        if (!currentSubjectId) {
            alert('No subject selected.');
            return;
        }

        $.ajax({
            url: '../../../backend/subjects/assignInstructor.php', // Separate file for POST
            type: 'POST',
            data: { 
                subject_id: currentSubjectId, 
                instructor_id: instructorId 
            },
            dataType: 'json',
            success: function(response) {
                if (response.success) {
                    alert(response.message || 'Instructor assigned successfully!');
                    // Refresh instructor list
                    loadInstructors(currentSubjectId);
                    // Reset dropdown
                    $('#addInstructorSelect').val('');
                } else {
                    alert('Error: ' + (response.error || 'Failed to assign instructor.'));
                }
            },
            error: function() {
                alert('An error occurred while assigning the instructor.');
            }
        });
    });

    // Handle Remove Instructor
    $(document).on('click', '.remove-instructor-btn', function(e) {
        e.preventDefault();
        
        const instructorId = $(this).data('instructor-id');
        
        if (!confirm('Are you sure you want to remove this instructor from this subject?')) {
            return;
        }

        $.ajax({
            url: '../../../backend/subjects/remove_instructor.php',
            type: 'POST',
            data: { 
                subject_id: currentSubjectId, 
                instructor_id: instructorId 
            },
            dataType: 'json',
            success: function(response) {
                if (response.success) {
                    alert(response.message || 'Instructor removed successfully!');
                    // Refresh instructor list
                    loadInstructors(currentSubjectId);
                } else {
                    alert('Error: ' + (response.error || 'Failed to remove instructor.'));
                }
            },
            error: function() {
                alert('An error occurred while removing the instructor.');
            }
        });
    });

    // Search functionality
    window.performSearch = function() {
        const query = $('#classSearch').val().toLowerCase().trim();
        let hasResults = false;

        $('.subject-card').each(function() {
            const title = $(this).data('title');
            if (title.includes(query)) {
                $(this).show();
                hasResults = true;
            } else {
                $(this).hide();
            }
        });

        if (query === '') {
            $('.no-results').hide();
            $('.subject-card').show();
        } else if (!hasResults) {
            $('.no-results').show();
        } else {
            $('.no-results').hide();
        }
    };

    // Clear search
    window.clearSearch = function() {
        $('#classSearch').val('');
        performSearch();
    };

    // Initialize search on page load
    performSearch();
});