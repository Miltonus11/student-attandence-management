$(document).ready(function () {
    const section = JSON.parse(localStorage.getItem("teacherSection"));

    const tableContainer = $("#tableContainer");
    const tableFooter = $("#tableFooter");

    $("#tableLoading").hide();
    tableContainer.show();
    tableFooter.show();
    
    // BACKEND: load students from server
    $.ajax({
        url: '../../../backend/controllers/teacher-controller/getSectionDetails.php',
        method: 'GET',
        data: { section_id: section.id },
        success: function(res) {
            // Populate table
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

                updateCounts();
                    }
        
    });
    

   

    

    //TO DO: 'DI SURE LOGIC
    // Checkbox logic
    $(document).on("change", ".attendance-checkbox", function () {
        const badge = $(this).closest("tr").find(".status-badge");

        if ($(this).is(":checked")) {
            badge
                .removeClass("bg-secondary bg-danger")
                .addClass("present") 
                .text("Present");
        } else {
            badge
                .removeClass("bg-secondary present")
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
        const attendanceData = [];

        $("#attendanceTable tbody tr").each(function () {
            const id = $(this).data("student-id");
            const checked = $(this).find(".attendance-checkbox").is(":checked");

            attendanceData.push({
                id,
                present: checked ? 1 : 0
            });
        });

        console.log("Saved Attendance:", attendanceData);

        Swal.fire({
            icon: "success",
            title: "Attendance Saved!",
            confirmButtonColor: "#012970"
        }).then(() => {
            window.location.href = "section.php";
        });
    });

    //TO DO:
    
});

// Analytics 
function updateCounts() {
    const total = $("#attendanceTable tbody tr").length;
    const present = $(".attendance-checkbox:checked").length;
    const absent = total - present;

    $("#presentCount").text(present);
    $("#absentCount").text(absent);
    $("#totalCount2").text(total);
    $("#totalCount").text(total);
}