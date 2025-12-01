// Modal Functions for Subject

// Fetch subjects from the backend and render the table
const fetchSubjects = () => {
    $.ajax({
        url: "../../backend/controllers/subjects/getSubjects.php", 
        method: "GET",
        dataType: "json",
        success: function (result) {
                console.log(result)
                renderSubjectTable(result.subjects || result.subjects); 

        },
        error: function (xhr, status, error) {
            console.error("Error fetching subjects:", error);
            console.log("XHR response:", xhr.responseText);
            alert("Failed to load subjects. Please check console for details.");
        }
    });
};

// Initial fetch on page load
document.addEventListener('DOMContentLoaded', fetchSubjects);

// Render the subject table
function renderSubjectTable(subjects) {
    const tbody = document.getElementById('subjectTableBody');
    if (!tbody) {
        console.error("Table body element not found");
        return;
    }
    
    tbody.innerHTML = ''; // Clear existing rows

    if (!subjects || subjects.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = ``;
        tbody.appendChild(row);
        return;
    }

    subjects.forEach(subject => {
        const row = document.createElement('tr');

        // Subject ID No. cell
        const idCell = document.createElement('td');
        idCell.textContent = subject.subject_id || subject.id || 'N/A';
        row.appendChild(idCell);

        // Subject Code cell
        const codeCell = document.createElement('td');
        codeCell.textContent = subject.subject_code || 'N/A';
        row.appendChild(codeCell);

        // Subject Title cell
        const nameCell = document.createElement('td');
        nameCell.textContent = subject.subject_name || subject.subject_title || 'N/A';  
        row.appendChild(nameCell);

        // Details cell with a view link
        const detailsCell = document.createElement('td');
        const viewLink = document.createElement('a');
        viewLink.textContent = 'View';
        viewLink.className = 'view-link';
        viewLink.href = '#';
        viewLink.style.cursor = 'pointer';

        // Event listener for opening the modal
        viewLink.addEventListener('click', function (event) {
            event.preventDefault();

            // Get data from the subject object
            document.getElementById("viewSubjectId").innerText = subject.subject_id || subject.id || 'N/A';
            document.getElementById("viewSubjectCode").innerText = subject.subject_code || 'N/A';
            document.getElementById("viewSubjectName").innerText = subject.subject_name || subject.subject_title || 'N/A';

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
    
    if (modal) {
        modal.hide();
    } else {
        const newModal = new bootstrap.Modal(modalElement);
        newModal.hide();
    }
    
    const form = modalElement.querySelector('form');
    if (form) form.reset();
}

// Save a new subject (send to backend)
function saveSubject() {
    const subject_id = document.getElementById('subject_id').value.trim();
    const subject_code = document.getElementById('subject_code').value.trim();
    const subject_name = document.getElementById('subject_name').value.trim(); 

    // Check for empty fields
    if (!subject_id || !subject_code || !subject_name) {
        alert('Please fill in all required fields.');
        return;
    }

    // Prepare data for AJAX
    const subjectData = {
        subject_id: subject_id,
        subject_code: subject_code,
        subject_name: subject_name, 
    };

    // Send to backend
    $.ajax({
        url: "../../../backend/controllers/Subject/addSubject.php", 
        method: "POST", 
        data: subjectData,
        success: function (response) {
            try {
                const result = typeof response === 'string' ? JSON.parse(response) : response;
                if (result.success) {
                    alert('Subject added successfully!');
                    closeModal();
                    fetchSubjects(); // Refresh the table
                } else {
                    alert('Failed to add subject: ' + (result.message || 'Unknown error'));
                }
            } catch (e) {
                console.error('Error parsing response:', e);
                alert('Subject added successfully!');
                closeModal();
                fetchSubjects();
            }
        },
        error: function (xhr, status, error) {
            console.error("Error saving subject:", error);
            console.log("XHR response:", xhr.responseText);
            alert("Failed to save subject. Please check console for details.");
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