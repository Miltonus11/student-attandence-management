(function () {
    'use strict';

    const API_ENDPOINT = '../../../backend/controllers/student-controller/getStudentSubject.php';

    const classListContainer = document.getElementById('classList');
    const currentUserInput = document.getElementById('currentUserId');

    function escapeHtml(text) {
        if (text === null || text === undefined) return '';
        return String(text)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function showLoading() {
        classListContainer.innerHTML = `
            <div class="d-flex align-items-center gap-2 p-3">
                <div class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></div>
                <div class="text-muted">Loading assigned subject...</div>
            </div>
        `;
    }

    function showError(message) {
        classListContainer.innerHTML = `
            <div class="alert alert-danger" role="alert">
                <i class="fas fa-exclamation-triangle me-2"></i>
                ${escapeHtml(message)}
            </div>
        `;
        console.error('Student subjects error:', message);
    }

    function renderClassCard(item) {
        const classId = item.class_id ?? item.classId ?? null;
        const className = escapeHtml(item.class_name ?? item.className ?? 'Unnamed Class');
        const subjectName = escapeHtml(item.subject_name ?? item.subjectName ?? '');
        const teacherFullName = item.teacher_name ? escapeHtml(item.teacher_name) : '';

        if (!classId) {
            return `<div class="alert alert-warning">Invalid class data returned by server.</div>`;
        }

        return `
            <div class="row">
                <div class="col-12">
                    <div class="card mb-3">
                        <div class="card-body d-flex justify-content-between align-items-center">
                            <div>
                                <h5 class="card-title mb-1">
                                    <i class="fas fa-graduation-cap text-primary me-2"></i>
                                    ${className}
                                </h5>
                                ${subjectName ? `<div class="text-muted small">Subject: ${subjectName}</div>` : ''}
                                ${teacherFullName ? `<div class="text-muted small">Teacher: ${teacherFullName}</div>` : ''}
                            </div>

                            <div>
                                <button class="btn btn-primary btn-sm" data-class-id="${classId}" aria-label="View Subject">
                                    <i class="fas fa-eye me-1"></i> View
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    function setupClickHandler() {
        classListContainer.addEventListener('click', function (ev) {
            const btn = ev.target.closest('button[data-class-id]');
            if (!btn) return;
            const classId = btn.getAttribute('data-class-id');
            if (!classId) {
                showError('Invalid class identifier');
                return;
            }
            window.location.href = `student-details.php?class_id=${encodeURIComponent(classId)}`;
        });
    }

    async function fetchAssignedSubject(userId) {
        const url = new URL(API_ENDPOINT, window.location.href);
        url.searchParams.set('user_id', userId);

        try {
            const resp = await fetch(url.toString(), {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                },
                credentials: 'same-origin' 
            });

            if (!resp.ok) {
                // Try to parse JSON error body if present
                let bodyText = await resp.text();
                try {
                    const jsonErr = JSON.parse(bodyText);
                    throw new Error(jsonErr.message || `Server responded with status ${resp.status}`);
                } catch (e) {
                    throw new Error(`Server responded with status ${resp.status}`);
                }
            }

            const data = await resp.json();

            if (data === null) {
                throw new Error('Empty response from server');
            }

            if (data.success && data.data) {
                return data.data;
            }

            if (data.class_id || data.classId) {
                return data;
            }

            if (data.message) {
                throw new Error(data.message);
            }

            throw new Error('Unexpected response format from server');
        } catch (err) {
            throw err;
        }
    }

    // Initialize page
    async function init() {
        setupClickHandler();

        const userId = currentUserInput ? currentUserInput.value.trim() : '';
        if (!userId) {
            showError('Missing user id. Please sign in again.');
            return;
        }

        showLoading();

        try {
            const assigned = await fetchAssignedSubject(userId);

            const classes = Array.isArray(assigned) ? assigned : [assigned];

            // If empty array or single object missing class_id => show none found
            if (!classes.length || !classes[0] || !classes[0].class_id) {
                classListContainer.innerHTML = `
                    <div class="alert alert-info">
                        <i class="fas fa-info-circle me-2"></i>
                        No assigned subjects found for your account.
                    </div>
                `;
                return;
            }

            const html = classes.map(renderClassCard).join('\n');
            classListContainer.innerHTML = html;

        } catch (error) {
            showError(error.message || 'Failed to load assigned subject. Please try again later.');
        }
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
