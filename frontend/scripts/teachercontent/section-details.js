$(document).ready(function () {
    const section = JSON.parse(localStorage.getItem("teacherSection"));

    const tableContainer = $("#tableContainer");
    const tableFooter = $("#tableFooter");

    $("#tableLoading").hide();
    tableContainer.show();
    tableFooter.show();

    // Mock students for frontend testing
    const mockStudents = [
        { id: "23101000", name: "William Sy", section: "3B", present: null },
        { id: "23101001", name: "Cristalyn De Dios", section: "3B", present: null },
        { id: "23101002", name: "Amihan Devas", section: "3B", present: null },
        { id: "23101003", name: "Armea Lireo", section: "3B", present: null },
        { id: "23101004", name: "Kruk Kruk", section: "3B", present: null },
        { id: "23101005", name: "Ina Merz", section: "3B", present: null }
    ];

    $("#sectionName").text(section.name);
    $("#subjectText").text(section.subject);
    $("#teacherText").text(section.teacherName);

    const tbody = $("#attendanceTable tbody");
    tbody.empty();

    mockStudents.forEach(st => {
        tbody.append(`
            <tr data-student-id="${st.id}">
                <td class="text-center">
                    <input class="form-check-input attendance-checkbox" type="checkbox" aria-label="Mark ${st.name} as present">
                </td>
                <td><strong>${st.id}</strong></td>
                <td>${st.name}</td>
                <td><span class="section-text">${st.section}</span></td>
                <td><span class="badge status-badge"></span></td>
            </tr>
        `);
    });

    updateCounts();

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
    /*
    // BACKEND: load students from server
    $.ajax({
        url: '../../../backend/controllers/teacher-controller/getTeacherClass.php',
        method: 'GET',
        data: { sectionId: section.id },
        success: function(response) {
            // Populate table
        }
    });
    */
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