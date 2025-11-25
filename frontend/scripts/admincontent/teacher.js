       // Modal Functions for Teacher
            const fetchInstructors = () => {
            $.ajax({
                //   url:"../../../backend/controllers/Students/get.php",   //update for the instructor
                method:"GET",
                dataType:"json",
                success: function(result){
                    renderStudentTable(result);
                    console.log(result.Instructors)
                }
            })
        }
        //fetching for Instructor
        fetchInstructors();

        function renderTeacherTable(Instructors) {
            const tbody = document.getElementById('teacherTableBody');
            tbody.innerHTML = ''; // Clear existing rows
            Instructors.Instructors.forEach(instructor => {
                const row = document.createElement('tr');
                // Teacher ID No. cell
                const idCell = document.createElement('td');
                idCell.textContent = instructor.instructor_number;
                row.appendChild(idCell);
                // Name cell
                const nameCell = document.createElement('td');
                nameCell.textContent = instructor.first_name;
                row.appendChild(nameCell);     
                      
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
       
       // Modal Functions for Teacher
    
   
        function openModal() {
            const modalId = 'addTeacherModal';
            const modal = new bootstrap.Modal(document.getElementById(modalId));
            const form = document.querySelector(`#${modalId} form`);
            if(form) form.reset();
            modal.show();
        }

        function closeModal() {
            const modalId = 'addTeacherModal';
            const modalElement = document.getElementById(modalId);
            const modal = bootstrap.Modal.getInstance(modalElement);
            
            if(modal) modal.hide();
            const form = modalElement.querySelector('form');
            if(form) form.reset();
        }

        function saveTeacher() {
            const teacherId = document.getElementById('teacherId').value;
            const firstName = document.getElementById('firstName').value;
            const lastName = document.getElementById('lastName').value;
            const email = document.getElementById('email').value;

            if(!teacherId || !firstName || !lastName || !email) {
                alert('Please fill in all required fields.');
                return;
            }

            // Validate input
            if(teacherId.trim() === '' || firstName.trim() === '' || lastName.trim() === '' || email.trim() === '') {
                alert('Please fill in all required fields.');
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address.');
                return;
            }

            alert('Teacher added successfully!');
            closeModal();

            // TODO: Add table update logic here
            // You can add the new teacher to the table dynamically
        }

        // View Modal Function for Teachers
        document.addEventListener("DOMContentLoaded", function () {
            document.querySelectorAll(".view-link").forEach(function (link) {
                link.addEventListener("click", function () {
                    const row = this.closest("tr");
                    const teacherId = row.cells[0].innerText;
                    const teacherName = row.cells[1].innerText;

                    document.getElementById("viewTeacherId").innerText = teacherId;
                    document.getElementById("viewTeacherName").innerText = teacherName;
                    // You can add more fields here if you have the data
              
                    const modal = new bootstrap.Modal(document.getElementById("viewTeacherModal"));
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