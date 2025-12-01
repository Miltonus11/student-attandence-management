$(document).ready(function() {
    let allStudents = []; 

    // fetch all students once on page load without class
    $.getJSON("../../../backend/controllers/admin-controller/Students/getStudents.php", function(res) {
        allStudents = res.Students || [];
    });

    // Load students when year level changes
    $("#yearLevelFilter").on("change", function () {
    let level = $(this).val();

    let filtered;
    let unassignedStudents = allStudents.filter(s => s.class_id == 0);
    // If nothing selected → show ALL students
    if (level === "") {
        filtered = unassignedStudents;
    } else {
        filtered = allStudents.filter(s => s.year_level == level);
    }

    let html = "";
    if (filtered.length === 0) {
        html = `<tr><td colspan="5">No students found</td></tr>`;
    } else {
        filtered.forEach(function (row) {
            html += `
            <tr>
                <td><input type="checkbox" name="students[]" class="studentCheckbox" value="${row.student_id}"></td>
                <td>${row.student_number}</td>
                <td>${row.first_name} ${row.last_name}</td>
                <td>${row.year_level}</td>
                <td>
                    <a href="#" class="view-link" 
                        data-id="${row.student_id}"
                        data-name="${row.first_name} ${row.last_name}"
                        data-number="${row.student_number}"
                        data-year="${row.year_level}">
                        View
                    </a>
                </td>
            </tr>`;
        });
    }

    $("#studentTableBody").html(html);
});

    // Search filter
    $("#searchInput").keyup(function () {
        let value = $(this).val().toLowerCase();
        $("#studentTableBody tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        });
    });

    // Select All
    $("#selectAllBtn").on("click", function () {
        $(".studentCheckbox").prop("checked", true);
    });

    // Clear All
    $("#clearAllBtn").on("click", function () {
        $(".studentCheckbox").prop("checked", false);
    });

    // View student in modal
    $(document).on("click", ".viewBtn", function () {
        $("#viewStudentId").text($(this).data("number"));
        $("#viewStudentName").text($(this).data("name"));
        $("#viewStudentyearlevel").text($(this).data("year"));

        $("#viewStudentModal").modal("show");
    });
    // Student modal
    $(document).on('click', '.view-link', function(e) {
        e.preventDefault();
        const name = $(this).data('name');
        const number = $(this).data('number');
        const year = $(this).data('year');

        $('#viewStudentName').text(name);
        $('#viewStudentId').text(number);
        $('#viewStudentyearlevel').text(year);

        const modal = new bootstrap.Modal(document.getElementById('viewStudentModal'));
        modal.show();
});

// Initialize
// $(document).ready(function() {
//     fetchStudents();
// });

});
