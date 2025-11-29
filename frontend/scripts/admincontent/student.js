// Modal Functions for Student  
// Storing all Students for filtering  
let allStudents = [];  // array kung saan ilalagay ang listahan ng students

// Fetch students from the backend and render the table  
const fetchStudents = () => {
    $.ajax({
        url: "../../../backend/controllers/Students/getStudents.php", 
        method: "GET", // GET request
        dataType: "json", // inaasahang JSON ang response
        success: function (result) { // kapag successful ang request
           
            allStudents = result.Students || result.students || []; // kunin ang students mula sa response
            renderStudentTable(allStudents);  // i-display ang students sa table
        },
        error: function (xhr, status, error) { // kapag nag-error
            console.error("Error fetching students:", error); // ipakita ang error sa console
            alert("Failed to load students. Please try again."); // alert na may nag-error
        }
    });
};

// Search function  
function performSearch() {
    const searchTerm = document.getElementById('studentSearch').value.trim().toLowerCase(); // kunin ang search input at gawing lowercase
    
    if (searchTerm === '') { // kung walang laman ang search box
        renderStudentTable(allStudents); // ibalik ang full list
        return;
    }
    
    // Filter students based on search term  
    const filteredStudents = allStudents.filter(student => {
        const fullName = `${student.first_name || ''} ${student.middle_name || ''} ${student.last_name || ''}`.toLowerCase().trim(); // buo pangalan
        const studentNumber = (student.student_number || '').toString().toLowerCase(); // student number
        
        return fullName.includes(searchTerm) || studentNumber.includes(searchTerm); // match ng pangalan o student number
    });
    
    renderStudentTable(filteredStudents); // i-display ang filtered results
}

// Render the student table  
function renderStudentTable(students) {
    const tbody = document.getElementById('studentTableBody'); // kunin ang table body
    if (!tbody) { // kung hindi makita ang table body
        console.error('Student table body not found!'); 
        return;
    }
   
    tbody.innerHTML = ''; // i-clear ang laman ng table

    if (students.length === 0) { // kung walang students
        const row = document.createElement('tr'); // gumawa ng row
        const cell = document.createElement('td'); // gumawa ng cell
        cell.colSpan = 5;  // ispread sa 5 columns
        cell.textContent = 'No Students found'; // text kapag walang data
        cell.style.textAlign = 'center'; // gitnang text
        row.appendChild(cell);
        tbody.appendChild(row);
        return;
    }

    students.forEach(student => { // loop sa bawat student
        const row = document.createElement('tr'); // bagong row

        const idCell = document.createElement('td'); // cell para sa ID
        idCell.textContent = student.student_number || 'N/A'; // display student number
        row.appendChild(idCell);

        const nameCell = document.createElement('td'); // cell para sa pangalan
        nameCell.textContent = `${student.first_name || ''} ${student.middle_name || ''} ${student.last_name || ''}`.trim() || 'N/A'; // buo pangalan
        row.appendChild(nameCell);

        const yearLevelCell = document.createElement('td'); // cell para sa year level
        yearLevelCell.textContent = student.year_level || 'N/A'; 
        row.appendChild(yearLevelCell);

        const contactCell = document.createElement('td'); // cell para sa contact number
        contactCell.textContent = student.contact || 'N/A';
        row.appendChild(contactCell);

        const detailsCell = document.createElement('td'); // cell para sa actions
        const viewLink = document.createElement('a'); // "View" link
        viewLink.textContent = 'View';
        viewLink.className = 'view-link';
        viewLink.href = '#';
        viewLink.style.cursor = 'pointer';

        viewLink.addEventListener('click', function (event) { // pag-click ng view
            event.preventDefault(); // iwas i-refresh ang page

            document.getElementById("viewStudentId").innerText = student.student_number || 'N/A'; // ipakita ID
            document.getElementById("viewStudentName").innerText = `${student.first_name || ''} ${student.middle_name || ''} ${student.last_name || ''}`.trim() || 'N/A'; // ipakita name
            document.getElementById("viewStudentyearlevel").innerText = student.year_level || 'N/A'; // ipakita year
            document.getElementById("viewStudentcontact").innerText = student.contact || 'N/A'; // ipakita contact

            const modalElement = document.getElementById("viewStudentModal"); // kunin modal
            const modal = new bootstrap.Modal(modalElement); // initialize bootstrap modal
            modal.show(); // ipakita modal
        });

        detailsCell.appendChild(viewLink); // ilagay ang view link sa cell
        row.appendChild(detailsCell); // idagdag ang cell sa row
        tbody.appendChild(row); // idagdag ang row sa table body
    });
}

// Open the add student modal 
function openModal() {
    const modalId = 'addStudentModal'; 
    const modalElement = document.getElementById(modalId); 
    const modal = new bootstrap.Modal(modalElement); 
    const form = modalElement.querySelector('form'); 
    if (form) form.reset(); // reset ang form
    modal.show(); // ipakita ang modal
}

// Close the add student modal 
function closeModal() {
    const modalId = 'addStudentModal';
    const modalElement = document.getElementById(modalId);
    const modal = bootstrap.Modal.getInstance(modalElement);
    
    if (!modal) { // kung walang bootstrap instance
        const newModal = new bootstrap.Modal(modalElement);
        newModal.hide();
    } else {
        modal.hide(); // itago modal
    }
    
    const form = modalElement.querySelector('form');
    if (form) form.reset(); // reset form
}

// Add event listeners when DOM is loaded  or  pag-load ng page
document.addEventListener('DOMContentLoaded', function() {
    fetchStudents(); // i-load ang students
    
    const searchInput = document.getElementById('studentSearch'); // search input
    const searchButton = document.getElementById('searchButton'); // search button
    
    if (searchInput) {
        searchInput.addEventListener('keypress', function(event) { // Enter key search
            if (event.key === 'Enter') {
                performSearch();
            }
        });
    }
    
    if (searchButton) {
        searchButton.addEventListener('click', performSearch); // click search
    }
});


/// Function to save student
function saveStudent() {
    const student_number = document.getElementById('student_id').value.trim();
    const year_level = document.getElementById('year_level').value.trim();
    const first_name = document.getElementById('first_name').value.trim();
    const middle_name = document.getElementById('middle_name').value.trim();
    const last_name = document.getElementById('last_name').value.trim();
    const contact = document.getElementById('contact').value.trim();

    // Validation - check required fields
    if (!student_number || !year_level || !first_name || !last_name || !contact) {
        alert('Please fill in all required fields.');
        return;
    }

    // Prepare student data 
    const studentData = {
        stud_num: student_number,           
        year_level: year_level,
        first_name: first_name,
        middle_name: middle_name,  
        last_name: last_name,
        contact: contact,
    };

    // Send AJAX request to save student
    $.ajax({
        url: "../../../backend/controllers/Students/addStudents.php",
        method: "POST",
        data: studentData,
        success: function (response) {
            try {
                // Try to parse JSON response
                const result = typeof response === 'string' ? JSON.parse(response) : response;
                
                if (result.message && result.message.includes("successfully")) {
                    alert('Student added successfully!');
                    closeModal();
                    fetchStudents();
                } else if (result.error) {
                    alert(result.error);
                } else {
                    alert(result.message || 'Failed to add student.');
                }
            } catch (e) {
                console.error("Parse error:", e);
                alert('Unexpected response from server.');
            }
        },
        error: function (xhr, status, error) {
            console.error("Error saving student:", error);
            console.log("XHR response:", xhr.responseText);
            alert("Failed to save student. Please try again.");
        }
    });
}

// auto-reset ng bawat modal kapag sinara
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.modal').forEach(modalEl => {
        modalEl.addEventListener('hidden.bs.modal', () => { 
            const form = modalEl.querySelector('form'); 
            if (form) form.reset(); // reset form
        });
    });
});
