// Fetch subjects from backend
function fetchSubjects(teacherId) {
    $.ajax({
        url: "../../../backend/controllers/teacher-controller/getTeacherSubjects.php",
        method: "GET",
        dataType: "json",
        success: function (res) {
            if (res.success) {
                renderSubjectTable(res.subjects);
            } else {
                alert("Failed to load subjects: " + (res.message || "Unknown error"));
            }
        },
        error: function (xhr, status, error) {
            console.error("Error fetching subjects:", error, xhr.responseText);
        }
    });
}

// Render table
function renderSubjectTable(subjects) {
    const tbody = document.getElementById('subjectTableBody');
    tbody.innerHTML = '';

    if (!subjects || subjects.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" class="text-center">No subjects found.</td></tr>`;
        return;
    }

    subjects.forEach(subject => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${subject.subject_code}</td>
            <td>${subject.subject_name}</td>
            <td>${subject.num_students || 0}</td>
            <td><a href="#" class="view-link">View</a></td>
        `;

        tr.querySelector('.view-link').addEventListener('click', function(e) {
            e.preventDefault();
            document.getElementById('viewSubjectId').innerText = subject.subject_id;
            document.getElementById('viewSubjectCode').innerText = subject.subject_code;
            document.getElementById('viewSubjectName').innerText = subject.subject_name;

            const modal = new bootstrap.Modal(document.getElementById('viewSubjectModal'));
            modal.show();
        });

        tbody.appendChild(tr);
    });
}

// Fetch subjects on page load
document.addEventListener('DOMContentLoaded', function() {
    const teacherId = 1; 
    fetchSubjects(teacherId);
});
