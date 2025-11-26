// Modal Functions for Subject

// Fetch subjects from the backend and render the table
const fetchSubjects = () => {
    $.ajax({
        // url: "../../../backend/controllers/Subjects/getSubjects.php", 
        method: "GET",
        dataType: "json",
        success: function (result) {
            renderSubjectTable(result.Subjects);  
        },
        error: function (xhr, status, error) {
            console.error("Error fetching subjects:", error);
            alert("Failed to load subjects. Please try again.");
        }
    });
};

// Initial fetch on page load
document.addEventListener('DOMContentLoaded', fetchSubjects);

// Render the subject table
function renderSubjectTable(subjects) {
    const tbody = document.getElementById('subjectTableBody');
    tbody.innerHTML = ''; // Clear existing rows

    subjects.forEach(subject => {
        const row = document.createElement('tr');

        // Subject ID No. cell
        const idCell = document.createElement('td');
        idCell.textContent = subject.subject_id;
        row.appendChild(idCell);

        // Subject Code cell
        const codeCell = document.createElement('td');
        codeCell.textContent = subject.subject_code;
        row.appendChild(codeCell);

        // Subject Title cell
        const titleCell = document.createElement('td');
        titleCell.textContent = subject.subject_name;  
        row.appendChild(titleCell);


        // Details cell with a view link
        const detailsCell = document.createElement('td');
        const viewLink = document.createElement('a');
        viewLink.textContent = 'View';
        viewLink.className = 'view-link';
        viewLink.href = '#'; // Prevent navigation

        // Event listener for opening the modal
        viewLink.addEventListener('click', function (event) {
            event.preventDefault();

            // Get data from the subject object
            document.getElementById("viewSubjectId").innerText = subject.subject_id;
            document.getElementById("viewSubjectCode").innerText = subject.subject_code;
            document.getElementById("viewSubjectTitle").innerText = subject.subject_name;

            // Show the modal
            const modal = new bootstrap.Modal(document.getElementById("viewSubjectModal"));
            modal.show();
        });

        detailsCell.appendChild(viewLink);
        row.appendChild(detailsCell);
        tbody.appendChild(row);
    });
}

// Open the add subject modal
function openModal() {
    const modalId = 'addSubjectModal';
    const modal = new bootstrap.Modal(document.getElementById(modalId));
    const form = document.querySelector(`#${modalId} form`);
    if (form) form.reset();
    modal.show();
}

// Close the add subject modal
function closeModal() {
    const modalId = 'addSubjectModal';
    const modalElement = document.getElementById(modalId);
    const modal = bootstrap.Modal.getInstance(modalElement);
    
    if (modal) modal.hide();
    const form = modalElement.querySelector('form');
    if (form) form.reset();
}

// Save a new subject (send to backend)
function saveSubject() {
    const subject_id = document.getElementById('subject_id').value.trim();
    const subject_code = document.getElementById('subject_code').value.trim();
    const subject_title = document.getElementById('subject_title').value.trim();
   

    // Check for empty fields
    if (!subjectid || !subjectcode || !subjecttitle) {
        alert('Please fill in all required fields.');
        return;
    }

    // Prepare data for AJAX
    const subjectData = {
        subject_id: subject_id,
        subject_code: subject_code,
        subject_title: subject_title,
      
    };

    // Send to backend (adjust URL as needed)
    $.ajax({
        // url: "../../../backend/controllers/Subjects/addSubject.php",  
        method: "POST", 
        data: subjectData,
        success: function (response) {
            alert('Subject added successfully!');
            closeModal();
            fetchSubjects(); // Refresh the table
        },
        error: function (xhr, status, error) {
            console.error("Error saving subject:", error);
            alert("Failed to save subject. Please try again.");
        }
    });
}

// Reset modals on hide (global for all modals)
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.modal').forEach(modalEl => {
        modalEl.addEventListener('hidden.bs.modal', () => {
            const form = modalEl.querySelector('form');
            if (form) form.reset();
        });
    });
});
