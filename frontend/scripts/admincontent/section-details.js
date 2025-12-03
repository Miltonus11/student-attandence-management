
// section-details.js
function getClassIdFromPage(){
    const el = document.getElementById('sectionClassId');
    if (el) return el.value || el.getAttribute('data-class-id');
    const params = new URLSearchParams(window.location.search);
    return params.get('class_id');
}

// Optional: assign subject handler if those elements exist
document.addEventListener('DOMContentLoaded', function(){
    const assignSubjectBtn = document.getElementById('assignSubjectBtn');
    if (assignSubjectBtn) {
        assignSubjectBtn.addEventListener('click', function(){
            const classId = getClassIdFromPage();
            const subjectId = document.getElementById('subjectSelect').value;
            if (!subjectId) { alert('Please select a subject first.'); return; }
            const btn = this;
            const orig = btn.innerHTML;
            btn.disabled = true; btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Assigning...';
            fetch('../../../backend/controllers/admin-controller/sections/assignSubjectSections.php', {
                method: 'PUT', 
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ class_id: parseInt(classId), subject_id: parseInt(subjectId) })
            }).then(r=>r.json()).then(data=>{
                btn.disabled = false; btn.innerHTML = orig;
                if (data.message) { alert(data.message); location.reload(); }
                else alert('Failed to assign subject');
            }).catch(e=>{btn.disabled=false;btn.innerHTML=orig;console.error(e);alert('Error assigning subject');});
        });
    }

    // Assign students modal buttons
    const openBtn = document.getElementById('openAssignStudentsBtn');
    if (openBtn) openBtn.addEventListener('click', function(){
        const cid = getClassIdFromPage();
        if (!cid) { alert('Class ID missing'); return; }
        document.getElementById('assignStudentsModal').setAttribute('data-class-id', cid);
        loadUnassignedStudents();
        const modal = new bootstrap.Modal(document.getElementById('assignStudentsModal'));
        modal.show();
    });

    const selectAll = document.getElementById('selectAllUnassigned');
    selectAll && selectAll.addEventListener('change', function(){
        const checked = this.checked;
        document.querySelectorAll('#unassignedStudentsBody input[type="checkbox"].unassigned-student-checkbox').forEach(cb=>cb.checked = checked);
    });

    const assignBtn = document.getElementById('assignSelectedStudentsBtn');
    assignBtn && assignBtn.addEventListener('click', assignSelectedStudents);
});

function loadUnassignedStudents() {
    const tbody = document.getElementById('unassignedStudentsBody');
    tbody.innerHTML = '<tr><td colspan="4">Loading...</td></tr>';
    
    const cid = document.getElementById('assignStudentsModal').getAttribute('data-class-id');
    if (!cid) {
        tbody.innerHTML = '<tr><td colspan="4">Class ID missing.</td></tr>';
        return;
    }
    
    $.ajax({
        url: '../../../backend/controllers/admin-controller/sections/getUnassignedStudents.php',
        method: 'GET',
        data: { class_id: cid },  // Pass class_id as query param
        dataType: 'json',
        success: function(data) {
            if (!data.success) {
                tbody.innerHTML = '<tr><td colspan="4">Failed to load students.</td></tr>';
                return;
            }
            const students = data.students || [];
            if (students.length === 0) {
                tbody.innerHTML = '<tr><td colspan="4">No unassigned students available.</td></tr>';
                return;
            }
            tbody.innerHTML = '';
            students.forEach(s => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td><input type="checkbox" class="unassigned-student-checkbox" value="${s.student_id}"></td>
                    <td>${escapeHtml(s.first_name)} ${escapeHtml(s.last_name)}</td>
                    <td>${escapeHtml(s.student_number || s.stud_number || '-')}</td>
                    <td>${escapeHtml(s.year_level || '-')}</td>
                `;
                tbody.appendChild(tr);
            });
        },
        error: function(xhr, status, error) {
            console.error('AJAX Error:', error);
            tbody.innerHTML = '<tr><td colspan="4">Error loading students.</td></tr>';
        }
    });
}


function assignSelectedStudents(){
    const checked = Array.from(document.querySelectorAll('#unassignedStudentsBody input[type="checkbox"].unassigned-student-checkbox:checked')).map(cb=>cb.value);
    if (checked.length === 0) {
         alert('Please select at least one student to assign.'); return; 
        }
    const modalEl = document.getElementById('assignStudentsModal');
    const cid = modalEl.getAttribute('data-class-id') || getClassIdFromPage();
    if (!cid) { alert('Class ID missing.'); return; }
    const formData = new FormData(); formData.append('class_id', cid); checked.forEach(id=>formData.append('students[]', id));
    const btn = document.getElementById('assignSelectedStudentsBtn'); const orig = btn.innerHTML; btn.disabled=true; btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Assigning...';
    fetch('../../../backend/controllers/admin-controller/sections/assignStudentSections.php', { method: 'POST', body: formData })
        .then(r=>r.json()).then(data=>{
            btn.disabled=false; btn.innerHTML=orig;
            if (data.message) { 
                alert(data.message); 
                const modal = bootstrap.Modal.getInstance(modalEl); 
                modal && modal.hide(); 
                setTimeout(()=>location.reload(),600); 
            }
            else alert('Unexpected response from server.');
        }).catch(err=>{ console.error(err); btn.disabled=false; btn.innerHTML=orig; alert('Failed to assign students.'); });
}

function escapeHtml(unsafe){ if (unsafe===null||unsafe===undefined) return ''; return String(unsafe).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;'); }