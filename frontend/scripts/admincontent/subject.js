// Search functionality for classes
function performSearch() {
    const searchTerm = document.getElementById('classSearch').value.toLowerCase().trim();
    const classCards = document.querySelectorAll('.class-card');
    const noResultsDiv = document.querySelector('.no-results');
    
    let hasResults = false;
    
    classCards.forEach(card => {
        const title = card.getAttribute('data-title').toLowerCase();
        
        if (searchTerm === '' || title.includes(searchTerm)) {
            card.style.display = 'block';
            hasResults = true;
        } else {
            card.style.display = 'none';
        }
    });
    
    // Show/hide no results message
    if (noResultsDiv) {
        if (!hasResults && searchTerm !== '') {
            noResultsDiv.style.display = 'block';
        } else {
            noResultsDiv.style.display = 'none';
        }
    }
    
    // Show/hide the grid container
    const classGrid = document.getElementById('classGrid');
    if (classGrid) {
        if (!hasResults && searchTerm !== '') {
            classGrid.style.display = 'none';
        } else {
            classGrid.style.display = 'flex';
        }
    }
}

function clearSearch() {
    document.getElementById('classSearch').value = '';
    performSearch();
}

// Add event listener for Enter key in search
if (document.getElementById('classSearch')) {
    document.getElementById('classSearch').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
}



// Handle assign modal show event to populate form
const assignInstructorModal = document.getElementById('assignInstructorModal');
if (assignInstructorModal) {
    assignInstructorModal.addEventListener('show.bs.modal', function (event) {
        const button = event.relatedTarget;
        const subjectId = button.getAttribute('data-subject-id');
        document.getElementById('assignSubjectId').value = subjectId;
    });

    // Assign Instructor Button Click Handler
    document.getElementById('assignInstructorBtn').addEventListener('click', function() {
        const subjectId = document.getElementById('assignSubjectId').value;
        const instructorId = document.getElementById('instructorSelect').value;
        
        if (!instructorId) {
            alert('Please select an instructor first.');
            return;
        }

        // Show loading state
        const btn = this;
        const originalText = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Assigning...';

        // Send AJAX request to assign instructor
        fetch('../../../backend/controllers/admin-controller/Instructors/putInstructor.php', // wala pato sa database
             {  
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                subject_id: parseInt(subjectId),
                instructor_id: parseInt(instructorId)
            })
        })
        .then(response => response.json())
        .then(data => {
            btn.disabled = false;
            btn.innerHTML = originalText;

            if (data.message) {
                // Success
                alert('Instructor assigned successfully!');
                
                // Close modal
                const modal = bootstrap.Modal.getInstance(assignInstructorModal);
                modal.hide();
                
                // Reload page after 1 second
                setTimeout(() => {
                    location.reload();
                }, 1000);
            } else {
                alert('Error: ' + (data.message || 'Failed to assign instructor'));
            }
        })
        .catch(error => {
            btn.disabled = false;
            btn.innerHTML = originalText;
            console.error('Error:', error);
            alert('An error occurred while assigning the instructor. Please try again.');
        });
    });

    // Reset assign form when modal is closed
    assignInstructorModal.addEventListener('hidden.bs.modal', function() {
        document.getElementById('assignInstructorForm').reset();
    });
}

//handle the subject details shown in the manage subject
const getSubjectDetails = (subjectId) => {
    $.ajax({
        url: "../../../backend/controllers/admin-controller/subjects/getSubjectDetails.php", 
        method: "GET",
        data: {subject_id: subjectId},
        dataType: "json",
        success: function (data) {
            console.log(data);
        },
        error:() => alert("Failed to load students. Please try again.")
        
    });
}
// Handle view modal show event
const viewSubjectModal = document.getElementById('viewSubjectModal');
if (viewSubjectModal) {
    let currentSubjectId = null; // Store subject ID globally for this modal
    
    viewSubjectModal.addEventListener('show.bs.modal', function (event) {
        const button = event.relatedTarget;
        currentSubjectId = button.getAttribute('data-subject-id');
        const subjectName = button.getAttribute('data-subject-name');
        getSubjectDetails(currentSubjectId)
        
        // Set basic subject info
        document.getElementById('viewSubjectId').textContent = currentSubjectId;
        document.getElementById('viewSubjectName').textContent = subjectName;
        
        // Reset instructor select
        document.getElementById('addInstructorSelect').value = '';
        
        // Show loading state
        document.getElementById('loadingInstructors').style.display = 'block';
        document.getElementById('noInstructors').style.display = 'none';
        document.getElementById('instructorsContent').style.display = 'none';
        
        // Fetch subject details and assigned instructors
        fetchInstructors(currentSubjectId);
    });

    // Function to fetch and display instructors
    function fetchInstructors(subjectId) {
        fetch(`../../../backend/controllers/admin-controller/subjects/getAssignedInstructor.php?subject_id=${subjectId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // Hide loading
                document.getElementById('loadingInstructors').style.display = 'none';
                
                if (data.success) {
                    // Display instructors
                    const instructorsContent = document.getElementById('instructorsContent');
                    const noInstructorsDiv = document.getElementById('noInstructors');
                    
                    if (data.instructors && data.instructors.length > 0) {
                        instructorsContent.innerHTML = '';
                        
                        data.instructors.forEach(instructor => {
                            const instructorCard = `
                                <div class="card mb-2">
                                    <div class="card-body">
                                        <div class="row align-items-center">
                                            <div class="col-md-8">
                                                <h6 class="mb-1">${instructor.first_name} ${instructor.last_name}</h6>
                                                <p class="mb-0 text-muted small">ID: ${instructor.instructor_id}</p>
                                            </div>
                                            <div class="col-md-4 text-end">
                                                <button class="btn btn-sm btn-outline-danger" onclick="unassignInstructor(${subjectId}, ${instructor.instructor_id})">
                                                    <i class="fas fa-user-times"></i> Unassign
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            `;
                            instructorsContent.innerHTML += instructorCard;
                        });
                        
                        instructorsContent.style.display = 'block';
                        noInstructorsDiv.style.display = 'none';
                    } else {
                        instructorsContent.style.display = 'none';
                        noInstructorsDiv.style.display = 'block';
                    }
                } else {
                    console.error('Error:', data.message);
                    document.getElementById('noInstructors').innerHTML = `
                        <i class="fas fa-exclamation-triangle fa-2x text-warning mb-2"></i>
                        <p class="text-warning">Error loading instructors</p>
                    `;
                    document.getElementById('noInstructors').style.display = 'block';
                }
            })
            .catch(error => {
                console.error('Fetch error:', error);
                document.getElementById('loadingInstructors').style.display = 'none';
                document.getElementById('noInstructors').innerHTML = `
                    <i class="fas fa-exclamation-triangle fa-2x text-danger mb-2"></i>
                    <p class="text-danger">Failed to load data</p>
                `;
                document.getElementById('noInstructors').style.display = 'block';
            });
    }

    // Handle Assign Instructor button in the modal body
    document.getElementById('assignInViewBtn').addEventListener('click', function() {
        const instructorId = document.getElementById('addInstructorSelect').value;
        
        if (!instructorId) {
            alert('Please select an instructor first.');
            return;
        }

        if (!currentSubjectId) {
            alert('Subject ID not found.');
            return;
        }

        assignInstructorToSubject(currentSubjectId, instructorId);
    });

    // Handle the footer Assign Instructor button
    document.getElementById('viewModalAssignBtn').addEventListener('click', function() {
        // Show the assign instructor modal
        const assignModal = new bootstrap.Modal(document.getElementById('assignInstructorModal'));
        
        // Set the subject ID in the assign modal
        document.getElementById('assignSubjectId').value = currentSubjectId;
        
        // Show the assign modal
        assignModal.show();
        
        // Close the view modal
        const viewModal = bootstrap.Modal.getInstance(viewSubjectModal);
        viewModal.hide();
    });

    // Function to assign instructor
    function assignInstructorToSubject(subjectId, instructorId) {
        // Show loading state
        const btn = document.getElementById('assignInViewBtn');
        const originalText = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Assigning...';

        // Send AJAX request to assign instructor

        const assignData = {
            subject_id:parseInt(subjectId),
            instructor_id:parseInt(instructorId)
        };
        console.log(assignData);
        $.ajax({
            url: '../../../backend/controllers/admin-controller/subjects/assignInstructor.php',
            method: 'PUT',
            dataType:"json",
            data: JSON.stringify(assignData),
            success: function(res) {
                if (res.success) {
                    alert('Instructor assigned successfully!');

                    // Reset select
                    $('#addInstructorSelect').val('');
                    
                    //
                    btn.disabled = false;
                    btn.innerHTML = originalText;
                    // Refresh instructor list
                    fetchInstructors(subjectId);
                    
                } else {
                    console.log('Error: ' + (res.message || 'Failed to assign instructor'));
                }
            },

            error: function(xhr, status, error) {
                btn.disabled = false;
                btn.innerHTML = originalText;
                console.log("AJAX Error: " + error);
            }
        });
    }



    // Reset view modal when closed
    viewSubjectModal.addEventListener('hidden.bs.modal', function() {
        document.getElementById('viewSubjectId').textContent = '--';
        document.getElementById('viewSubjectName').textContent = '--';
        currentSubjectId = null;
    });
}
//  OPTIONAL TO DELETED INSTRUCTORS / functions

// function unassignInstructor(subjectId, instructorId) {
//     if (!confirm('Are you sure you want to unassign this instructor?')) {
//         return;
//     }

//     // Show confirmation dialog
//     if (!confirm('This will remove the instructor from this subject. Continue?')) {
//         return;
//     }

//     fetch('../../../backend/controllers/admin-controller/Instructors/deleteInstructors.php', {
//         method: 'DELETE',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//             subject_id: subjectId,
//             instructor_id: instructorId
//         })
//     })
//     .then(response => response.json())
//     .then(data => {
//         if (data.success) {
//             alert('Instructor unassigned successfully!');
            
//             // Close the modal
//             const modal = bootstrap.Modal.getInstance(viewSubjectModal);
//             modal.hide();
            
//             // Reload the page after 1 second
//             setTimeout(() => {
//                 location.reload();
//             }, 1000);
//         } else {
//             alert('Error: ' + (data.message || 'Failed to unassign instructor'));
//         }
//     })
//     .catch(error => {
//         console.error('Error:', error);
//         alert('An error occurred. Please try again.');
//     });
// }

// Handle edit modal show event to populate form
const editSubjectModal = document.getElementById('editSubjectModal');
if (editSubjectModal) {
    editSubjectModal.addEventListener('show.bs.modal', function (event) {
        const button = event.relatedTarget;
        const subjectId = button.getAttribute('data-subject-id');
        const subjectName = button.getAttribute('data-subject-name');

        document.getElementById('editSubjectId').value = subjectId;
        document.getElementById('editSubjectName').value = subjectName;
    });

    // Update Subject Button Click Handler
    document.getElementById('updateSubjectBtn').addEventListener('click', function() {
        const subjectId = document.getElementById('editSubjectId').value;
        const subjectName = document.getElementById('editSubjectName').value.trim();
        
        if (!subjectName) {
            alert('Please enter a subject name.');
            return;
        }

        // Show loading state
        const btn = this;
        const originalText = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Updating...';

        // Send AJAX request to update subject
        fetch('../../../backend/controllers/admin-controller/subjects/updateSubject.php', {  
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                subject_id: parseInt(subjectId),
                subject_name: subjectName
            })
        })
        .then(response => response.json())
        .then(data => {
            btn.disabled = false;
            btn.innerHTML = originalText;

            if (data.success) {
                // Success
                alert('Subject updated successfully!');
                
                // Close modal
                const modal = bootstrap.Modal.getInstance(editSubjectModal);
                modal.hide();
                
                // Reload page to reflect changes
                location.reload();
            } else {
                alert('Error: ' + (data.message || 'Failed to update subject'));
            }
        })
        .catch(error => {
            btn.disabled = false;
            btn.innerHTML = originalText;
            console.error('Error:', error);
            alert('An error occurred while updating the subject. Please try again.');
        });
    });

    // Reset edit form when modal is closed
    editSubjectModal.addEventListener('hidden.bs.modal', function() {
        document.getElementById('editSubjectForm').reset();
    });
}