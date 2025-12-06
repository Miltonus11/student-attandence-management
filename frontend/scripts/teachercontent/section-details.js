$(document).ready(function () {

    // Get section from localStorage
    const section = JSON.parse(localStorage.getItem("teacherSection"));

    // BACKEND: load students from server
    $.ajax({
        url: '../../../backend/controllers/teacher-controller/getSectionDetails.php',
        method: 'GET',
        data: { section_id: section.id },
        success: function(res) {
            console.log(res);

            $("#sectionName").text(res.section.class_name);
            $("#subjectText").text(res.section.subject_name);
            $("#teacherText").text(res.section.teacher_name);

            const tbody = $("#attendanceTable tbody");
            tbody.empty();

            res.students.forEach(st => {
                tbody.append(`
                    <tr data-student-id="${st.student_id}">
                        <td class="text-center">
                            <input class="form-check-input attendance-checkbox" type="checkbox" aria-label="Mark ${st.student_name} as present">
                        </td>
                        <td><strong>${st.student_number}</strong></td>
                        <td>${st.student_name}</td>
                        <td><span class="badge status-badge"></span></td>
                    </tr>
                `);
            });

        }
    });

    // Checkbox logic
    $(document).on("change", ".attendance-checkbox", function () {
        const badge = $(this).closest("tr").find(".status-badge");

        if ($(this).is(":checked")) {
            badge.removeClass("absent")
                 .addClass("present")
                 .text("Present");  
        } else {
            badge.removeClass("present")
                 .addClass("absent")
                 .text("Absent");
        }

        updateCounts();
    });

    // Mark all present
    $("#markAllPresent").click(() => {
        $(".attendance-checkbox").each(function () {
            $(this).prop("checked", true).trigger("change");
        });
    });

    // Save attendance
    $("#saveAttendance").click(() => {
        const selectedDate = $("#attendanceDate").val();

        if (!selectedDate) {
            Swal.fire({
                icon: "warning",
                title: "Please select a date before saving attendance.",
                confirmButtonColor: "#012970"
            });
            return;
        }

        const attendanceData = [];

        $("#attendanceTable tbody tr").each(function () {
            const id = $(this).data("student-id");
            const checked = $(this).find(".attendance-checkbox").is(":checked");

            attendanceData.push({
                id,
                present: checked ? 1 : 0
            });
        });

        console.log("Saved Attendance:", attendanceData, "Date:", selectedDate);

        Swal.fire({
            icon: "success",
            title: "Attendance Saved!",
            confirmButtonColor: "#012970"
        }).then(() => {
            window.location.href = "section.php";
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

// BACKEND CONN
     // Example POST request 
        /*
        $.ajax({
            url: '../../../backend/controllers/teacher-controller/saveAttendance.php',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                sectionId: section.id,
                attendance: attendanceData
            }),
            success: function(response) {
                Swal.fire({
                    icon: "success",
                    title: response.message || "Attendance Saved!",
                    confirmButtonColor: "#012970"
                }).then(() => {
                    window.location.href = "section.php";
                });
            },
            error: function(xhr, status, error) {
                Swal.fire({
                    icon: "error",
                    title: "Error saving attendance",
                    text: xhr.responseText || "Something went wrong!",
                    confirmButtonColor: "#012970"
                });
            }
        });
        */
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

