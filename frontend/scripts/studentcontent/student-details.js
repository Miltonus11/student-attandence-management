// Mock data for section information 
const mockSectionData = {
    sectionName: "Section A - Morning",
    subjectInfo: "Mathematics 101",
    teacherName: "Dr. Smith"
};

// Mock attendance data
const mockAttendance = {
    present: 67,
    absent: 2,
    totalDays: 100,
    attendanceRate: 97.0
};

// Task storage with mock initial tasks
let tasks = JSON.parse(localStorage.getItem('calendarTasks')) || {
    "2025-08-15": ["Math Homework", "Physics Lab Report"],
    "2025-08-20": ["Computer Science Project"],
    "2025-09-01": ["Study for Midterms"],
    "2025-09-10": ["Submit Assignment"],
    "2025-10-05": ["Group Meeting"],
    "2025-11-15": ["Final Project Due"]
};

// jQuery version with mock data
$(document).ready(function() {
    // Function to load section data (mocked)
    function loadSectionData() {
        // Show loading state
        $('#sectionName').text('Loading...');
        $('#subjectInfo').text('Loading...');
        $('#teacherName').text('Loading...');
        
        // Simulate API delay
        setTimeout(function() {
            // Populate the data with the single section
            $('#sectionName').text(mockSectionData.sectionName);
            $('#subjectInfo').text(mockSectionData.subjectInfo);
            $('#teacherName').text(mockSectionData.teacherName);
            
            // Update page title
            document.title = mockSectionData.sectionName + " - Attendance";
            
            console.log('Section data loaded:', mockSectionData);
        }, 300); // 300ms delay to simulate API call
    }

    // Error handling function (just in case)
    function showError(message) {
        $('#sectionName').text('Error');
        $('#subjectInfo').text(message);
        $('#teacherName').text('N/A');
        
        console.error(message);
    }

    // Load data when page loads
    loadSectionData();
    
    // Initialize calendar and attendance stats
    initializeCalendar();
});

// Initialize calendar and attendance
function initializeCalendar() {
    const start = new Date(2025, 7, 1); // August 1, 2025
    const end = new Date(2025, 11, 31); // December 31, 2025
    const today = new Date();
    
    generateCalendar(start, end, today);
    updateAttendanceStats();
    
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
            updateCalendarTasks();
            
            // Show success message
            showToast('Task added successfully!', 'success');
            
            // Close modal after adding task
            setTimeout(() => {
                $('#taskModal').modal('hide');
            }, 1000);
        } else {
            showToast('Please enter a task description', 'warning');
            input.focus();
        }
    });
}

function generateCalendar(start, end, today) {
    const grid = $('#calendarGrid');
    if (!grid.length) return;
    
    grid.empty();
    
    let current = new Date(start);
    const months = [];
    
    while (current <= end) {
        const year = current.getFullYear();
        const month = current.getMonth();
        if (!months.some(m => m.year === year && m.month === month)) {
            months.push({year, month});
        }
        current.setMonth(current.getMonth() + 1);
    }
    
    months.forEach(m => grid.append(createMonthCalendar(m.year, m.month, today)));
}

function createMonthCalendar(year, month, today) {
    const months = ["January", "February", "March", "April", "May", "June",
                   "July", "August", "September", "October", "November", "December"];
    
    const $div = $('<div>').addClass('month-calendar');
    
    const $header = $('<div>').addClass('month-header').text(`${months[month]} ${year}`);
    $div.append($header);
    
    const $table = $('<table>').addClass('calendar-table');
    
    // Header row 
    const $thead = $('<thead>');
    const $headerRow = $('<tr>');
    ['S', 'M', 'T', 'W', 'T', 'F', 'S'].forEach(day => {
        $headerRow.append($('<th>').text(day));
    });
    $thead.append($headerRow);
    $table.append($thead);
    
    // Body
    const $tbody = $('<tbody>');
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDay = firstDay.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const daysInMonth = lastDay.getDate();
    
    let date = 1;
    
    // Create 6 weeks (rows)
    for (let week = 0; week < 6; week++) {
        const $row = $('<tr>');
        
        // 7 days per week
        for (let day = 0; day < 7; day++) {
            const $cell = $('<td>');
            
            // Calculate if this cell should have a date
            if ((week === 0 && day < startDay) || date > daysInMonth) {
                // Empty cell
                $cell.addClass('empty-cell');
            } else {
                $cell.text(date);
                const cellDate = new Date(year, month, date);
                const dateStr = formatDate(cellDate);
                
                // Check if today
                const isToday = year === today.getFullYear() && 
                               month === today.getMonth() && 
                               date === today.getDate();
                
                if (isToday) {
                    $cell.addClass('today');
                }
                
                // Check for tasks
                if (tasks[dateStr]?.length > 0) {
                    $cell.addClass('has-task');
                    const $indicator = $('<div>')
                        .addClass('task-indicator')
                        .text(tasks[dateStr].length);
                    $cell.append($indicator);
                }
                
                // Add click event
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
    return $div[0];
}

function openTaskModal(date) {
    const dateStr = formatDate(date);
    const formatted = date.toLocaleDateString('en-US', { 
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
    });
    
    $('#selectedDate').text(formatted);
    $('#selectedDate').data('date', dateStr);
    $('#taskInput').val('').focus();
    
    refreshTaskList(dateStr);
    
    // Show modal
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
                    updateCalendarTasks();
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
    localStorage.setItem('calendarTasks', JSON.stringify(tasks));
}

function updateCalendarTasks() {
    const start = new Date(2025, 7, 1); 
    const end = new Date(2025, 11, 31); 
    const today = new Date();
    generateCalendar(start, end, today);
}

function formatDate(date) {
    return `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2,'0')}-${date.getDate().toString().padStart(2,'0')}`;
}

function updateAttendanceStats() {
    //  mock attendance data
    const present = mockAttendance.present;
    const absent = mockAttendance.absent;
    const attendanceRate = mockAttendance.attendanceRate;
    
    //  DOM elements
    $('#daysPresent').text(present);
    $('#daysAbsent').text(absent);
    
    // Uattendance message
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

// Helper function to show toast notifications
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
    
    // Create toast container if it doesn't exist
    if (!$('.toast-container').length) {
        $('body').append('<div class="toast-container position-fixed bottom-0 end-0 p-3" style="z-index: 9999;"></div>');
    }
    
    $('.toast-container').append(toastHTML);
    const toastElement = document.getElementById(toastId);
    const toast = new bootstrap.Toast(toastElement, { delay: 3000 });
    toast.show();
}

// Initialize mock data on page load
$(window).on('load', function() {
    console.log('Mock data initialized:', {
        section: mockSectionData,
        attendance: mockAttendance,
        tasks: tasks
    });
    
    // Add some sample tasks if localStorage is empty
    if (localStorage.getItem('calendarTasks') === null) {
        localStorage.setItem('calendarTasks', JSON.stringify(tasks));
    }
    
    // Show welcome message
    setTimeout(() => {
        showToast('Welcome to Attendance Details!', 'success');
    }, 1000);
});