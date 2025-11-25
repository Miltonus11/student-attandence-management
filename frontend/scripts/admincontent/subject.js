  // Modal Functions for Teacher
            const fetchSubjects = () => {
            $.ajax({
                //   url:"../../../backend/controllers/Students/get.php",   //update for the subject
                method:"GET",
                dataType:"json",
                success: function(result){
                    renderSubjectTable(result);
                    console.log(result.Subjects)
                }
            })
        }
        //fetching for subject
        fetchSubjects();

        function renderSubjectTable(Subjects) {
            const tbody = document.getElementById('subjectTableBody');
            tbody.innerHTML = ''; // Clear existing rows
            Subjects.Subjects.forEach(subject => {
                const row = document.createElement('tr');
                // Teacher ID No. cell
                const idCell = document.createElement('td');
                idCell.textContent = subject.subject_number;
                row.appendChild(idCell);
                // Name cell
                const nameCell = document.createElement('td');
                nameCell.textContent = subject.subject_name;
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
       
       
       // Modal Functions for Subject
        function openModal() {
            const modalId = 'addSubjectModal';
            const modal = new bootstrap.Modal(document.getElementById(modalId));
            const form = document.querySelector(`#${modalId} form`);
            if(form) form.reset();
            modal.show();
        }

        function closeModal() {
            const modalId = 'addSubjectModal';
            const modalElement = document.getElementById(modalId);
            const modal = bootstrap.Modal.getInstance(modalElement);
            
            if(modal) modal.hide();
            const form = modalElement.querySelector('form');
            if(form) form.reset();
        }

        function saveSubject() {
            const subjectid = document.getElementById('subjectid').value;
            const subjectcode = document.getElementById('subjectcode').value;
            const subjecttitle = document.getElementById('subjecttitle').value;

            if(!subjectid || !subjectcode || !subjecttitle) {
                alert('Please fill in all required fields.');
                return;
            }

            // Validate input
            if(subjectid.trim() === '' || subjectcode.trim() === '' || subjecttitle.trim() === '') {
                alert('Please fill in all required fields.');
                return;
            }

            alert('Subject added successfully!');
            closeModal();

            // TODO: Add table update logic here
            // You can add the new subject to the table dynamically
        }

        // View Modal Function for Subjects
        document.addEventListener("DOMContentLoaded", function () {
            document.querySelectorAll(".view-link").forEach(function (link) {
                link.addEventListener("click", function () {
                    const row = this.closest("tr");
                    const subjectid = row.cells[0].innerText;
                    const subjectcode = row.cells[1].innerText;
                    const subjecttitle = row.cells[2].innerText;

                    document.getElementById("viewSubjectId").innerText = subjectid;
                    document.getElementById("viewSubjectCode").innerText = subjectcode;
                    document.getElementById("viewSubjectTitle").innerText = subjecttitle;
              
                    const modal = new bootstrap.Modal(document.getElementById("viewSubjectModal"));
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
  