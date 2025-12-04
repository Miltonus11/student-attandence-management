
$(document).ready(function() {
    // Default: all students are absent initially
    function initializeAttendance() {
        $('#attendanceTable tbody tr').each(function() {
            const checkbox = $(this).find('.attendance-checkbox');
            const statusBadge = $(this).find('td:last-child .badge');
            
            if (!checkbox.prop('checked')) {
                statusBadge.removeClass('bg-success').addClass('bg-danger').text('Absent');
            }
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
        const isPresent = checkbox.prop('checked');
        
        if (isPresent) {
            statusBadge.removeClass('bg-danger').addClass('bg-success').text('Present');
        } else {
            statusBadge.removeClass('bg-success').addClass('bg-danger').text('Absent');
        }
        
        updateAttendanceCounts();
    });
    
    // Mark all as present
    $('#markAllPresent').click(function() {
        $('.attendance-checkbox').prop('checked', true).trigger('change');
    });
    
    // Mark all as absent
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
        
        // Here you would typically send this data to the server via AJAX
        console.log('Attendance data to save:', attendanceData);
        
        // Show success message with SweetAlert or Bootstrap modal
        if (typeof Swal !== 'undefined') {
            // Using SweetAlert if available
            Swal.fire({
                title: 'Success!',
                text: 'Attendance saved successfully!',
                icon: 'success',
                confirmButtonColor: '#012970',
                confirmButtonText: 'OK'
            }).then((result) => {
                if (result.isConfirmed) {
                    // Redirect to section.php
                    window.location.href = 'section.php';
                }
            });
        } else {
            // Fallback to native alert
            if (confirm('Attendance saved successfully!\n\nClick OK to go back to sections.')) {
                // Redirect to section.php
                window.location.href = 'section.php';
            }
        }
    });
    
    // Update attendance counts
    function updateAttendanceCounts() {
        const total = $('#attendanceTable tbody tr').length;
        const present = $('#attendanceTable tbody tr .attendance-checkbox:checked').length;
        const absent = total - present;
        
        $('#presentCount').text(present);
        $('#absentCount').text(absent);
        $('#totalCount').text(total);
    }
    
    // Initialize counts
    updateAttendanceCounts();
});
