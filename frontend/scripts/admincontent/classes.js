
        // Modal Functions
        function openModal() {
            const modalId = 'addClassesModal';
            const modal = new bootstrap.Modal(document.getElementById(modalId));
            const form = document.querySelector(`#${modalId} form`);
            if(form) form.reset();
            modal.show();
        }

        function closeModal() {
            const modalId = 'addClassesModal';
            const modalElement = document.getElementById(modalId);
            const modal = bootstrap.Modal.getInstance(modalElement);
            
            if(modal) modal.hide();
            const form = modalElement.querySelector('form');
            if(form) form.reset();
        }

        function saveClasses() {
            const classesid = document.getElementById('classesid').value;
            const classsection = document.getElementById('classsection').value;

            if(!classesid || !classsection) {
                alert('Please fill in all required fields.');
                return;
            }

            // Validate input
            if(classesid.trim() === '' || classsection.trim() === '') {
                alert('Please fill in all required fields.');
                return;
            }

            alert('Class added successfully!');
            closeModal();

            // TODO: Add table update logic here
            // You can add the new class to the table dynamically
        }

        // View Modal Function
        document.addEventListener("DOMContentLoaded", function () {
            document.querySelectorAll(".view-link").forEach(function (link) {
                link.addEventListener("click", function () {
                    const row = this.closest("tr");
                    const classesid = row.cells[0].innerText;
                    const classsection = row.cells[1].innerText;

                    document.getElementById("viewClassesId").innerText = classesid;
                    document.getElementById("viewClassSection").innerText = classsection;
              
                    const modal = new bootstrap.Modal(document.getElementById("viewClassesModal"));
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
