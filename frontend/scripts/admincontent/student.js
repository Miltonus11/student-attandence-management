
        // Modal Functions for Student
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
            const studentId = document.getElementById('studentId').value;
            const studentyearlevel = document.getElementById('studentyearlevel').value;
            const studentFirstName = document.getElementById('studentFirstName').value;
            const studentLastName = document.getElementById('studentLastName').value;
            const studentEmail = document.getElementById('studentEmail').value;

            if(!studentId || !studentyearlevel || !studentFirstName || !studentLastName || !studentEmail) {
                alert('Please fill in all required fields.');
                return;
            }

            // Validate input
            if(studentId.trim() === '' || studentyearlevel.trim() === '' || studentFirstName.trim() === '' || studentLastName.trim() === '' || studentEmail.trim() === '') {
                alert('Please fill in all required fields.');
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(studentEmail)) {
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
            document.querySelectorAll(".view-link").forEach(function (link) {
                link.addEventListener("click", function () {
                    const row = this.closest("tr");
                    const studentId = row.cells[0].innerText;
                    const studentName = row.cells[1].innerText;
                    const studentyearlevel = row.cells[2].innerText;

                    document.getElementById("viewStudentId").innerText = studentId;
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
   