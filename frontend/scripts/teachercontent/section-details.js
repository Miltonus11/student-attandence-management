$(document).ready(function() {
    
    // Function to set status/icon based on checkbox state and update counts
    function initializeAttendance() {
        $('#attendanceTable tbody tr').each(function() {
            const checkbox = $(this).find('.attendance-checkbox');
            const statusBadge = $(this).find('td:last-child .badge');
            const statusIcon = statusBadge.find('i');
            
            // This ensures the status/icon matches the unchecked state from PHP
            if (!checkbox.prop('checked')) {
                statusBadge.removeClass('bg-success bg-primary bg-danger').addClass('bg-secondary').text('Absent');
                statusIcon.removeClass('fa-circle-check').addClass('fa-circle-xmark');
            } else {
                statusBadge.removeClass('bg-secondary bg-danger').addClass('bg-primary').text('Present');
                statusIcon.removeClass('fa-circle-xmark').addClass('fa-circle-check');
            }
            statusBadge.prepend(statusIcon);
        });
        updateAttendanceCounts();
    }
    
    // Initialize attendance on page load
    initializeAttendance();
    
    // Handle checkbox change
    $('.attendance-checkbox').change(function() {
        const checkbox = $(this);
        const row = checkbox.closest('tr');
        const statusBadge = row.find('td:last-child .badge');
        const statusIcon = statusBadge.find('i');
        const isPresent = checkbox.prop('checked');
        
        statusBadge.text(isPresent ? 'Present' : 'Absent');
        
        if (isPresent) {
            statusBadge.removeClass('bg-secondary bg-danger').addClass('bg-primary');
            statusIcon.removeClass('fa-circle-xmark').addClass('fa-circle-check');
        } else {
            statusBadge.removeClass('bg-primary bg-success').addClass('bg-secondary');
            statusIcon.removeClass('fa-circle-check').addClass('fa-circle-xmark');
        }
        statusBadge.prepend(statusIcon);
        
        updateAttendanceCounts();
    });
    
    // Mark all as present
    $('#markAllPresent').click(function() {
        $('.attendance-checkbox').prop('checked', true).trigger('change');
    });
    
    const markAllAbsentButton = $('<button class="btn btn-sm btn-light border action-btn" id="markAllAbsent"><i class="fa-solid fa-xmark-double me-1"></i> Mark All as Absent</button>');
    $('.card-header > div').prepend(markAllAbsentButton);

    $('#markAllAbsent').click(function() {
        $('.attendance-checkbox').prop('checked', false).trigger('change');
    });
    
    // Save attendance
    $('#saveAttendance').click(function() {
        const attendanceData = [];
        
        $('#attendanceTable tbody tr').each(function() {
            const studentId = $(this).data('student-id');
            const checkbox = $(this).find('.attendance-checkbox');
            const isPresent = checkbox.prop('checked');
            
            attendanceData.push({
                id: studentId,
                present: isPresent ? 1 : 0
            });
        });
        
        // Simulating AJAX call success
        console.log('Attendance data to save:', attendanceData);
        
        // Show success message with SweetAlert
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                title: 'Success!',
                text: 'Attendance saved successfully!',
                icon: 'success',
                confirmButtonColor: '#012970',
                confirmButtonText: 'OK'
            }).then((result) => {
                if (result.isConfirmed) {
                    // Clear all checkboxes and trigger change to reset status to Absent
                    $('.attendance-checkbox').prop('checked', false).trigger('change'); 
                    
                    // Redirect to section.php
                    window.location.href = 'section.php'; 
                }
            });
        } else {
            // Fallback to native alert
            if (confirm('Attendance saved successfully! Click OK to go back to sections.')) {
                // Clear all checkboxes and trigger change
                $('.attendance-checkbox').prop('checked', false).trigger('change'); 

                // Redirect to section.php
                window.location.href = 'section.php';
            }
        }
    });
    
    // Update attendance counts in the information panel
    function updateAttendanceCounts() {
        const total = $('#attendanceTable tbody tr').length;
        const present = $('#attendanceTable tbody tr .attendance-checkbox:checked').length;
        const absent = total - present;
        
        $('#presentCount').text(present);
        $('#absentCount').text(absent);
        $('#totalCount').text(total);
    }
    
    // Ensure counts are initialized when the page is ready
    updateAttendanceCounts();
});