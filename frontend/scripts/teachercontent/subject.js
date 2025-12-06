$(document).ready(function() {
    let currentSubjectId = null;

    // Handle View button clicks
    $(document).on('click', '.view-btn', function() {
        const subjectId = $(this).data('subject-id');
        const subjectName = $(this).data('subject-name');
        const subjectCode = $(this).data('subject-code');

        currentSubjectId = subjectId;
        
        $('#viewSubjectId').text(subjectId);
        $('#viewSubjectName').text(subjectName);
        $('#viewSubjectCode').text(subjectCode);
        
        // Set to loading initially
        $('#viewSubjectStudent').text('Loading...');

        // Load number of students
        loadStudentCount(subjectId);

        $('#viewSubjectModal').modal('show');
    });

    // Load student count for a subject
    function loadStudentCount(subjectId) {
        $.ajax({
            url: '../../../backend/subjects/get_student_count.php', // Updated path
            type: 'GET',
            data: { 
                subject_id: subjectId
            },
            dataType: 'json',
            success: function(response) {
                if (response.success) {
                    $('#viewSubjectStudent').text(response.student_count);
                } else {
                    $('#viewSubjectStudent').text('0');
                    console.error('Error loading student count:', response.message);
                }
            },
            error: function(xhr, status, error) {
                $('#viewSubjectStudent').text('N/A');
                console.error('AJAX Error:', error);
                console.error('Response:', xhr.responseText);
            }
        });
    }

    // Search function
    window.performSearch = function() {
        const searchTerm = $('#classSearch').val().toLowerCase().trim();
        const subjectCards = $('.subject-card');
        let visibleCount = 0;

        if (searchTerm === '') {
            subjectCards.show();
            $('.no-results').hide();
            return;
        }

        subjectCards.each(function() {
            const title = $(this).data('title') || '';
            const cardText = $(this).text().toLowerCase();
            
            if (title.includes(searchTerm) || cardText.includes(searchTerm)) {
                $(this).show();
                visibleCount++;
            } else {
                $(this).hide();
            }
        });

        if (visibleCount === 0) {
            $('.no-results').show();
        } else {
            $('.no-results').hide();
        }
    };

    window.clearSearch = function() {
        $('#classSearch').val('');
        performSearch();
    };
});