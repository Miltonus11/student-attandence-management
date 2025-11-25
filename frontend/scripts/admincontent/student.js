
        // Modal Functions for Student
            const fetchStudents = () => {
            $.ajax({
                url:"../../../backend/controllers/Students/getStudents.php",
                method:"GET",
                dataType:"json",
                success: function(result){
                    renderStudentTable(result);
                    console.log(result.Students)
                }
            })
        }
        //fetching for student
        fetchStudents();

        function renderStudentTable(Students) {
            const tbody = document.getElementById('studentTableBody');
            tbody.innerHTML = ''; // Clear existing rows
            Students.Students.forEach(student => {
                const row = document.createElement('tr');
                // Teacher ID No. cell
                const idCell = document.createElement('td');
                idCell.textContent = student.student_number;
                row.appendChild(idCell);
                // Name cell
                const nameCell = document.createElement('td');
                nameCell.textContent = student.first_name;
                row.appendChild(nameCell);

                //yearlevel
                const yearLevelCell = document.createElement('td');
                yearLevelCell.textContent = student.year_level;
                row.appendChild(yearLevelCell) ;           
                // Details cell with a view link
                const detailsCell = document.createElement('td');
                const viewLink = document.createElement('a');
                viewLink.textContent = 'View';
                viewLink.className = 'view-link';
                viewLink.href = '#'; // Replace with actual link or add event listener
                viewLink.addEventListener('click', () => {
                    // Add your logic here, e.g., open a modal or navigate to details page
                    alert(`Viewing details for ${teacher.name} (ID: ${teacher.id})`);
                }); 
                detailsCell.appendChild(viewLink);
                row.appendChild(detailsCell);
                tbody.appendChild(row);
            });
        }

        document.addEventListener('DOMContentLoaded', renderStudentTable);
        function openModal() {
            const modalId = 'addStudentModal';
            const modal = new bootstrap.Modal(document.getElementById(modalId));
            const form = document.querySelector(`#${modalId} form`);
            if(form) form.reset();
            modal.show();
        }

        function closeModal() {
            const modalId = 'addStudentModal';
            const modalElement = document.getElementById(modalId);
            const modal = bootstrap.Modal.getInstance(modalElement);
            
            if(modal) modal.hide();
            const form = modalElement.querySelector('form');
            if(form) form.reset();
        }

        function saveStudent() {
            const student_id = document.getElementById('student_id').value;
            const year_level = document.getElementById('year_level').value;
            const first_name = document.getElementById('first_name').value;
            const last_name = document.getElementById('last_name').value;
            const student_email = document.getElementById('student_email').value;

            if(!student_id || !year_level  || !first_name || !last_name || !student_email) {
                alert('Please fill in all required fields.');
                return;
            }

            // Validate input
            if(student_id.trim() === '' || year_level.trim() === '' || first_name.trim() === '' || last_name.trim() === '' || student_email.trim() === '') {
                alert('Please fill in all required fields.');
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(student_email)) {
                alert('Please enter a valid email address.');
                return;
            }

            alert('Student added successfully!');
            closeModal();

            // TODO: Add table update logic here
            // You can add the new student to the table dynamically
        }

        // View Modal Function for Students
        document.addEventListener("DOMContentLoaded", function () {

            document.querySelectorAll("view-link").forEach(function (link) {
                link.addEventListener("click", function () {
                    const row = this.closest("tr");
                    const student_id = row.cells[0].innerText;
                    const studentName = row.cells[1].innerText;
                    const studentyearlevel = row.cells[2].innerText;

                    document.getElementById("viewStudentId").innerText = student_id;
                    document.getElementById("viewStudentName").innerText = studentName;
                    document.getElementById("viewStudentyearlevel").innerText = studentyearlevel;
              
                    const modal = new bootstrap.Modal(document.getElementById("viewStudentModal"));
                    modal.show();
                });
            });

            // Reset form when modal is closed
            document.querySelectorAll('.modal').forEach(modalEl => {
                modalEl.addEventListener('hidden.bs.modal', () => {
                    const form = modalEl.querySelector('form');
                    if(form) form.reset();
                });
            });
        });
   