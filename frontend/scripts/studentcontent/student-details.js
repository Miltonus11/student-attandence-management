let currentMonth = new Date().getMonth(); 
let currentYear = new Date().getFullYear();
const startYear = 2025;
const startMonth = 7; 
let subjectName = '';

// Task storage (dynamic per subject)
let tasks = {};

// jQuery ready
$(document).ready(function() {
    loadSectionData();
    initializeCalendar();
});

// Load section data dynamically
function loadSectionData() {
    $('#sectionName').text('Loading...');
    $('#subjectInfo').text('Loading...');
    $('#teacherName').text('Loading...');

    $.ajax({
        url: '../../../backend/controllers/student-controller/getStudentAttendance.php',
        method: 'GET',
        data: { student_id: studentId },
        success: function(response) {
            if (response.success) {
                const data = response.Attendance;

                const present = data.length > 0 ? data[0].present : 0;
                const absent  = data.length > 0 ? data[0].absent : 0;
                console.log(data.present)
                $('#daysPresent').text(present);
                $('#daysAbsent').text(absent);
                showToast('Data loaded successfully!', 'success');
            } else {
                showError(response.message || 'Failed to load data');
            }
        },
        error: function() {
        }
    });
}

function loadSubjectTasks() {
    const taskKey = `tasks_${subjectName}`;
    tasks = JSON.parse(localStorage.getItem(taskKey)) || getDefaultTasksForSubject(subjectName);
    localStorage.setItem(taskKey, JSON.stringify(tasks));
}

function getDefaultTasksForSubject(subject) {
    const defaults = {
        'Math': { "2025-08-15": ["Algebra Homework"], "2025-09-01": ["Geometry Assignment"] },
        'Science': { "2025-08-20": ["Lab Report"], "2025-10-05": ["Physics Experiment"] },
        'Foreign Language': { "2025-09-10": ["Vocabulary Quiz"], "2025-11-15": ["Conversation Practice"] },
    };
    return defaults[subject] || { "2025-08-15": ["General Task"] };
}

function showError(message) {
    $('#sectionName').text('Error');
    $('#subjectInfo').text(message);
    $('#teacherName').text('N/A');
    console.error(message);
    showToast(message, 'error');
}

// Initialize calendar
function initializeCalendar() {
    if (currentYear < startYear || (currentYear === startYear && currentMonth < startMonth)) {
        currentMonth = startMonth;
        currentYear = startYear;
    }

    generateCalendar();
    updateNavButtons();

    $('#prevMonth').on('click', function() {
        if (currentMonth === startMonth && currentYear === startYear) return;
        currentMonth--;
        if (currentMonth < 0) { currentMonth = 11; currentYear--; }
        generateCalendar();
        updateNavButtons();
    });

    $('#nextMonth').on('click', function() {
        currentMonth++;
        if (currentMonth > 11) { currentMonth = 0; currentYear++; }
        generateCalendar();
        updateNavButtons();
    });

    // Added handlers for year navigation
    $('#prevYear').on('click', function() {
        if (currentYear > startYear) {
            currentYear--;
            generateCalendar();
            updateNavButtons();
        }
    });

    $('#nextYear').on('click', function() {
        currentYear++;
        generateCalendar();
        updateNavButtons();
    });

    // Task form submission
    $('#taskForm').on('submit', function(e) {
        e.preventDefault();
        const input = $('#taskInput');
        const text = input.val().trim();
        const date = $('#selectedDate').data('date');
        
        if (text) {
            addTask(date, text);
            input.val('');
            refreshTaskList(date);
            generateCalendar();
            showToast('Task added successfully!', 'success');
            setTimeout(() => $('#taskModal').modal('hide'), 1000);
        } else {
            showToast('Please enter a task description', 'warning');
            input.focus();
        }
    });
}

function updateNavButtons() {
    $('#prevMonth').prop('disabled', currentMonth === startMonth && currentYear === startYear);
    $('#nextMonth').prop('disabled', false); 
    $('#prevYear').prop('disabled', currentYear <= startYear);
    $('#nextYear').prop('disabled', false); 
    $('#currentMonthYear').text(`${["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"][currentMonth]} ${currentYear}`);
}

function generateCalendar() {
    const grid = $('#calendarGrid');
    grid.empty();
    grid.append(createMonthCalendar(currentYear, currentMonth, new Date()));
}

function createMonthCalendar(year, month, today) {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    
    const $div = $('<div>').addClass('month-calendar');
    $div.append($('<div>').addClass('month-header').text(`${months[month]} ${year}`));
    
    const $table = $('<table>').addClass('calendar-table');
    const $thead = $('<thead>');
    const $headerRow = $('<tr>');
    ['S', 'M', 'T', 'W', 'T', 'F', 'S'].forEach(day => $headerRow.append($('<th>').text(day)));
    $thead.append($headerRow);
    $table.append($thead);
    
    const $tbody = $('<tbody>');
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDay = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    
    let date = 1;
    for (let week = 0; week < 6; week++) {
        const $row = $('<tr>');
        for (let day = 0; day < 7; day++) {
            const $cell = $('<td>');
            if ((week === 0 && day < startDay) || date > daysInMonth) {
                $cell.addClass('empty-cell');
            } else {
                $cell.text(date);
                const cellDate = new Date(year, month, date);
                const dateStr = formatDate(cellDate);
                
                if (year === today.getFullYear() && month === today.getMonth() && date === today.getDate()) {
                    $cell.addClass('today');
                }
                
                if (tasks[dateStr]?.length > 0) {
                    $cell.addClass('has-task');
                    $cell.append($('<div>').addClass('task-indicator').text(tasks[dateStr].length));
                }
                
                $cell.on('click', () => openTaskModal(cellDate));
                date++;
            }
            $row.append($cell);
        }
        $tbody.append($row);
        if (date > daysInMonth) break;
    }
    
    $table.append($tbody);
    $div.append($table);
    return $div;
}

function openTaskModal(date) {
    const dateStr = formatDate(date);
    const formatted = date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    
    $('#selectedDate').text(formatted);
    $('#selectedDate').data('date', dateStr);
    $('#taskInput').val('').focus();
    
    refreshTaskList(dateStr);
    $('#taskModal').modal('show');
}

function refreshTaskList(dateStr) {
    const $list = $('#taskList');
    $list.empty();
    
    if (tasks[dateStr]?.length > 0) {
        tasks[dateStr].forEach((task, i) => {
            const $item = $('<div>').addClass('task-item d-flex justify-content-between align-items-center mb-2 p-2 border rounded');
                        const $text = $('<span>').text(task);
            
            const $actions = $('<div>');
            
            const $delBtn = $('<button>')
                .addClass('btn btn-sm btn-danger')
                .html('<i class="fas fa-trash"></i>')
                .on('click', () => {
                    deleteTask(dateStr, i);
                    refreshTaskList(dateStr);
                    generateCalendar();
                    showToast('Task deleted', 'info');
                });
            
            $actions.append($delBtn);
            $item.append($text).append($actions);
            $list.append($item);
        });
    } else {
        const $noTasks = $('<div>')
            .addClass('no-tasks text-muted text-center py-3')
            .text('No tasks for this date. Add one above!');
        $list.append($noTasks);
    }
}

function addTask(date, text) {
    if (!tasks[date]) tasks[date] = [];
    tasks[date].push(text);
    saveTasks();
}

function deleteTask(date, index) {
    if (tasks[date]) {
        tasks[date].splice(index, 1);
        if (tasks[date].length === 0) delete tasks[date];
        saveTasks();
    }
}

function saveTasks() {
    const taskKey = `tasks_${subjectName}`;
    localStorage.setItem(taskKey, JSON.stringify(tasks));
}

function formatDate(date) {
    return `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2,'0')}-${date.getDate().toString().padStart(2,'0')}`;
}

function updateAttendanceStats() {
    const mockAttendance = { present: 67, absent: 2, attendanceRate: 97.0 };
    const present = mockAttendance.present;
    const absent = mockAttendance.absent;
    const attendanceRate = mockAttendance.attendanceRate;
     $('#daysPresent').text(present);
    $('#daysAbsent').text(absent);
    
    let msg = '';
    let colorClass = '';
    
    if (attendanceRate >= 95) {
        msg = 'Your attendance is excellent! Keep up the good work.';
        colorClass = 'text-success';
    } else if (attendanceRate >= 90) {
        msg = 'Good attendance! Try to maintain it.';
        colorClass = 'text-primary';
    } else if (attendanceRate >= 80) {
        msg = 'Your attendance is acceptable, but could be better.';
        colorClass = 'text-warning';
    } else {
        msg = 'Your attendance needs improvement. Please attend classes regularly.';
        colorClass = 'text-danger';
    }
    
    $('#attendanceMessage').html(`
        <span class="${colorClass} fw-bold">Attendance Rate: ${attendanceRate}%</span><br>
        ${msg}
    `);
}

function showToast(message, type = 'info') {
    const bgClass = {
        'success': 'bg-success',
        'error': 'bg-danger',
        'warning': 'bg-warning',
        'info': 'bg-info'
    }[type] || 'bg-info';
    
    const icon = {
        'success': 'fa-check-circle',
        'error': 'fa-exclamation-circle',
        'warning': 'fa-exclamation-triangle',
        'info': 'fa-info-circle'
    }[type] || 'fa-info-circle';
    
    const toastId = 'toast-' + Date.now();
    const toastHTML = `
        <div id="${toastId}" class="toast align-items-center text-white ${bgClass} border-0" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="d-flex">
                <div class="toast-body">
                    <i class="fas ${icon} me-2"></i>
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        </div>
    `;
    
    if (!$('.toast-container').length) {
        $('body').append('<div class="toast-container position-fixed bottom-0 end-0 p-3" style="z-index: 9999;"></div>');
    }
    
    $('.toast-container').append(toastHTML);
    const toastElement = document.getElementById(toastId);
    const toast = new bootstrap.Toast(toastElement, { delay: 3000 });
    toast.show();
}

// Initialize on load
$(window).on('load', function() {
    setTimeout(() => {
        showToast('Welcome back!', 'success');
    }, 1000);
});