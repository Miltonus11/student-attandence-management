// Subject Functions
let allSubjects = [];

// Fetch attendance data from backend
const fetchAttendanceData = () => {
    $.ajax({
        url: "../../../backend/controllers/Attendance/getStudentAttendance.php", 
        method: "GET",
        dataType: "json",
        success: (result) => {
            if (result.success && result.attendance) {
                document.getElementById('totalPresent').textContent = result.attendance.total_present;
                document.getElementById('totalAbsent').textContent = result.attendance.total_absent;
            } else {
                console.error("Error fetching attendance:", result.message);
            }
        },
        error: (xhr, status, error) => {
            console.error("Error fetching attendance data:", error);
        }
    });
};

// Fetch subjects from backend
const fetchSubjects = () => {
    $.ajax({
        url: "../../../backend/controllers/Subjects/getSubjects.php", 
        method: "GET",
        dataType: "json",
        success: (result) => {
            allSubjects = result.subjects || [];
            renderSubjectTable(allSubjects);  
        },
        error: (xhr, status, error) => {
            console.error("Error fetching subjects:", error);
            alert("Failed to load subjects. Please try again.");
        }
    });
};

// Render subject table
function renderSubjectTable(subjects) {
    const tbody = document.getElementById('subjectTableBody');
    if (!tbody) {
        console.error("Table body element not found");
        return;
    }
    
    tbody.innerHTML = '';

    if (!subjects?.length) {
        const row = document.createElement('tr');
        const cell = document.createElement('td');
        cell.colSpan = 3;
        cell.textContent = 'No subjects found';
        cell.style.textAlign = 'center';
        row.appendChild(cell);
        tbody.appendChild(row);
        return;
    }

    subjects.forEach(subject => {
        const row = document.createElement('tr');

        // Subject Code
        const codeCell = document.createElement('td');
        codeCell.textContent = subject.subject_code || 'N/A';
        row.appendChild(codeCell);

        // Subject Name
        const nameCell = document.createElement('td');
        nameCell.textContent = subject.subject_name || 'N/A';
        row.appendChild(nameCell);

        // View Details Link
        const detailsCell = document.createElement('td');
        const viewLink = document.createElement('a');
        viewLink.textContent = 'View';
        viewLink.className = 'btn btn-primary btn-sm';
        viewLink.href = `attendance-details.php?subject_id=${subject.subject_id}`;
        viewLink.style.cssText = 'cursor: pointer; text-decoration: none;';

        detailsCell.appendChild(viewLink);
        row.appendChild(detailsCell);
        tbody.appendChild(row);
    });
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log("Page loaded, fetching data...");
    fetchAttendanceData();
    fetchSubjects();
});


