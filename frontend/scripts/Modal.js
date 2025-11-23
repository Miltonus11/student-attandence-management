//ADD MODAL FUNCTION
function openModal(type) {
    const modalId = type === 'teacher' ? 'addTeacherModal' : 'addStudentModal';
    const modal = new bootstrap.Modal(document.getElementById(modalId));
    const form = document.querySelector(`#${modalId} form`);
    if(form) form.reset();
    modal.show();
}

function closeModal(type) {
    const modalId = type === 'teacher' ? 'addTeacherModal' : 'addStudentModal';
    const modalElement = document.getElementById(modalId);
    const modal = bootstrap.Modal.getInstance(modalElement);

    if(modal) modal.hide();
    const form = modalElement.querySelector('form');
    if(form) form.reset();
}

function savePerson(type) {
    const modalId = type === 'teacher' ? 'addTeacherModal' : 'addStudentModal';
    const form = document.querySelector(`#${modalId} form`);

    let id = type === 'teacher' ? document.getElementById('teacherId').value 
      : document.getElementById('studentId').value;
    let firstName = type === 'teacher' ? document.getElementById('firstName').value
      : document.getElementById('studentFirstName').value;
    let lastName = type === 'teacher' ? document.getElementById('lastName').value 
      : document.getElementById('studentLastName').value;
    let email = type === 'teacher' ? document.getElementById('email').value 
      : document.getElementById('studentEmail').value;

    if(!id || !firstName || !lastName || !email) {
        alert('Please fill in all required fields.');
        return;
    }

    alert(`${type.charAt(0).toUpperCase() + type.slice(1)} added successfully!`);
    closeModal(type);

    // TODO: Add table update logic here
}

document.querySelectorAll('.modal').forEach(modalEl => {
    modalEl.addEventListener('hidden.bs.modal', () => {
        const form = modalEl.querySelector('form');
        if(form) form.reset();
    });
});

        
 // VIEW MODAL FUNCTION
document.addEventListener("DOMContentLoaded", function () {

    document.querySelectorAll(".view-link").forEach(function (link) {

        link.addEventListener("click", function () {

            const row = this.closest("tr");

            const id = row.children[0].innerText;
            const name = row.children[1].innerText;

            // Detect type: student or teacher
            const type = this.dataset.type; 

            if (type === "student") {
                document.getElementById("viewStudentId").innerText = id;
                document.getElementById("viewStudentName").innerText = name;

                const modal = new bootstrap.Modal(document.getElementById("viewStudentModal"));
                modal.show();
            }

            if (type === "teacher") {
                document.getElementById("viewTeacherId").innerText = id;
                document.getElementById("viewTeacherName").innerText = name;

                const modal = new bootstrap.Modal(document.getElementById("viewTeacherModal"));
                modal.show();
            }

        });
    });

});
