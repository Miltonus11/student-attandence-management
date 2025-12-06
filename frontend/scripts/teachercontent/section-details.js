$(document).ready(function () {

    // Get section from localStorage
    const section = JSON.parse(localStorage.getItem("teacherSection"));

    if (!section || !section.id) {
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "No section data found. Redirecting...",
            confirmButtonColor: "#012970"
        }).then(() => {
            window.location.href = "section.php";
        });
        return;
    }

    // Set today's date as default
    const today = new Date().toISOString().split('T')[0];
    $("#attendanceDate").val(today);

    // Load students from server
    $.ajax({
        url: '../../../backend/controllers/teacher-controller/getSectionDetails.php',
        method: 'GET',
        data: { section_id: section.id },
        dataType: 'json',
        success: function(res) {
            console.log("Section Details:", res);

            if (res.success) {
                // Populate section information
                $("#sectionName").text(res.section.name || res.section.class_name);
                $("#subjectText").text(res.section.subject || res.section.subject_name);
                $("#teacherText").text(res.section.teacherName || res.section.teacher_name);

                // Populate student table
                const tbody = $("#attendanceTable tbody");
                tbody.empty();

                if (res.students && res.students.length > 0) {
                    res.students.forEach(st => {
                        tbody.append(`
                            <tr data-student-id="${st.student_id || st.id}">
                                <td class="text-center">
                                    <input class="form-check-input attendance-checkbox" 
                                           type="checkbox" 
                                           aria-label="Mark ${st.student_name || st.name} as present">
                                </td>
                                <td><strong>${st.student_number || st.id_number || 'N/A'}</strong></td>
                                <td>${st.student_name || st.name}</td>
                                <td><span class="badge bg-secondary status-badge">Not Marked</span></td>
                            </tr>
                        `);
                    });
                    
                    updateCounts();
                } else {
                    tbody.append(`
                        <tr>
                            <td colspan="4" class="text-center text-muted">No students found in this section.</td>
                        </tr>
                    `);
                }
            }
        },
        error: function(xhr, status, error) {
            console.error("Error loading section details:", error, xhr.responseText);
            
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to load section details. Please try again.",
                confirmButtonColor: "#012970"
            });
        }
    });

    // Checkbox logic - mark present/absent
    $(document).on("change", ".attendance-checkbox", function () {
        const badge = $(this).closest("tr").find(".status-badge");

        if ($(this).is(":checked")) {
            badge.removeClass("bg-secondary absent")
                 .addClass("present")
                 .text("Present");  
        } else {
            badge.removeClass("bg-secondary present")
                 .addClass("absent")
                 .text("Absent");
        }

        updateCounts();
    });

    // Mark all present
    $("#markAllPresent").click(function() {
        $(".attendance-checkbox").each(function () {
            $(this).prop("checked", true).trigger("change");
        });
    });

    // Save attendance
    $("#saveAttendance").click(function() {
        const selectedDate = $("#attendanceDate").val();

        // Validate date
        if (!selectedDate) {
            Swal.fire({
                icon: "warning",
                title: "Date Required",
                text: "Please select a date before saving attendance.",
                confirmButtonColor: "#012970"
            });
            return;
        }

        // Check if any attendance is marked
        const totalStudents = $("#attendanceTable tbody tr").length;
        if (totalStudents === 0) {
            Swal.fire({
                icon: "warning",
                title: "No Students",
                text: "No students to save attendance for.",
                confirmButtonColor: "#012970"
            });
            return;
        }

        // Build attendance data
        const attendanceData = [];

        $("#attendanceTable tbody tr").each(function () {
            const studentId = $(this).data("student-id");
            const checkbox = $(this).find(".attendance-checkbox");
            const badge = $(this).find(".status-badge");
            
            if (studentId) {
                attendanceData.push({
                    student_id: studentId,
                    present: checkbox.is(":checked") ? 1 : 0
                });
            }
        });

        console.log("Saving Attendance:", {
            section_id: section.id,
            attendance_date: selectedDate,
            attendance: attendanceData
        });

        // Send to backend
        $.ajax({
            url: '../../../backend/controllers/teacher-controller/postAttendance.php',
            method: 'POST',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify({
                section_id: section.id,
                attendance_date: selectedDate,
                attendance: attendanceData
            }),
            success: function(response) {
                console.log("Save Response:", response);
                
                Swal.fire({
                    icon: "success",
                    title: response.message || "Attendance Saved Successfully!",
                    html: `
                        <p>Date: ${selectedDate}</p>
                        <p>Total Students: ${response.total || attendanceData.length}</p>
                    `,
                    confirmButtonColor: "#012970"
                }).then(() => {
                    window.location.href = "section.php";
                });
            },
            error: function(xhr, status, error) {
                console.error("Error saving attendance:", error, xhr.responseText);
                
                let errorMessage = "Something went wrong!";
                try {
                    const errorData = JSON.parse(xhr.responseText);
                    errorMessage = errorData.message || errorMessage;
                } catch (e) {
                    errorMessage = xhr.responseText || errorMessage;
                }
                
                Swal.fire({
                    icon: "error",
                    title: "Error Saving Attendance",
                    text: errorMessage,
                    confirmButtonColor: "#012970"
                });
            }
        });
    });

    // Search functionality (searches name and ID)
    $('#searchInput').on('input', function() {
        const query = $(this).val().toLowerCase();
        $('#attendanceTable tbody tr').each(function() {
            const name = $(this).find('td:nth-child(3)').text().toLowerCase(); 
            const id = $(this).find('td:nth-child(2)').text().toLowerCase(); 
            
            if (name.includes(query) || id.includes(query)) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
        updateCounts(); 
    });
});

// Analytics function (updated to count only visible rows)
function updateCounts() {
    const visibleRows = $("#attendanceTable tbody tr:visible");
    const total = visibleRows.length;
    const present = visibleRows.find(".attendance-checkbox:checked").length;
    const absent = total - present;

    $("#presentCount").text(present);
    $("#absentCount").text(absent);
    $("#totalCount2").text(total);
    $("#totalCount").text(total);
}