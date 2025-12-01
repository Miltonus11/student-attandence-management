// Task storage
let tasks = JSON.parse(localStorage.getItem('calendarTasks')) || {};

document.addEventListener('DOMContentLoaded', function() {
    const start = new Date(2025, 7, 1); // August 1, 2025
    const end = new Date(2025, 11, 31); // December 31, 2025
    const today = new Date();
    
    generateCalendar(start, end, today);
    updateAttendanceStats(today, start);
    
    document.getElementById('taskForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const input = document.getElementById('taskInput');
        const text = input.value.trim();
        const date = document.getElementById('selectedDate').dataset.date;
        
        if (text) {
            addTask(date, text);
            input.value = '';
            refreshTaskList(date);
            updateCalendarTasks();
        }
    });
});

function generateCalendar(start, end, today) {
    const grid = document.getElementById('calendarGrid');
    grid.innerHTML = '';
    
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
    
    months.forEach(m => grid.appendChild(createMonthCalendar(m.year, m.month, today)));
}

function createMonthCalendar(year, month, today) {
    const months = ["January", "February", "March", "April", "May", "June",
                   "July", "August", "September", "October", "November", "December"];
    
    const div = document.createElement('div');
    div.className = 'month-calendar';
    
    const header = document.createElement('div');
    header.className = 'month-header';
    header.textContent = `${months[month]} ${year}`;
    div.appendChild(header);
    
    const table = document.createElement('table');
    table.className = 'calendar-table';
    
    // Header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    ['S', 'S', 'M', 'T', 'W', 'T', 'F'].forEach(day => {
        const th = document.createElement('th');
        th.textContent = day;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);
    
    // Body
    const tbody = document.createElement('tbody');
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDay = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();
    
    let date = 1;
    let prevDate = prevMonthDays - startDay + 1;
    
    for (let i = 0; i < 6; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < 7; j++) {
            const cell = document.createElement('td');
            
            if (i === 0 && j < startDay) {
                cell.textContent = prevDate++;
                cell.className = 'grayed';
            } else if (date > daysInMonth) {
                cell.textContent = date++ - daysInMonth;
                cell.className = 'grayed';
            } else {
                cell.textContent = date;
                const cellDate = new Date(year, month, date);
                const dateStr = formatDate(cellDate);
                
                if (year === today.getFullYear() && month === today.getMonth() && date === today.getDate()) {
                    cell.classList.add('today');
                }
                
                if (tasks[dateStr]?.length > 0) {
                    cell.classList.add('has-task');
                    const indicator = document.createElement('div');
                    indicator.className = 'task-indicator';
                    indicator.textContent = tasks[dateStr].length;
                    cell.appendChild(indicator);
                }
                
                cell.addEventListener('click', () => openTaskModal(cellDate));
                date++;
            }
            row.appendChild(cell);
        }
        tbody.appendChild(row);
        if (date > daysInMonth) break;
    }
    
    table.appendChild(tbody);
    div.appendChild(table);
    return div;
}

function openTaskModal(date) {
    const dateStr = formatDate(date);
    const formatted = date.toLocaleDateString('en-US', { 
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
    });
    
    document.getElementById('selectedDate').textContent = formatted;
    document.getElementById('selectedDate').dataset.date = dateStr;
    
    refreshTaskList(dateStr);
    new bootstrap.Modal(document.getElementById('taskModal')).show();
}

function refreshTaskList(dateStr) {
    const list = document.getElementById('taskList');
    list.innerHTML = '';
    
    if (tasks[dateStr]?.length > 0) {
        tasks[dateStr].forEach((task, i) => {
            const item = document.createElement('div');
            item.className = 'task-item';
            
            const text = document.createElement('span');
            text.textContent = task;
            
            const actions = document.createElement('div');
            actions.className = 'task-actions';
            
            const delBtn = document.createElement('button');
            delBtn.className = 'btn btn-sm btn-danger';
            delBtn.innerHTML = '<i class="fas fa-trash"></i>';
            delBtn.addEventListener('click', () => {
                deleteTask(dateStr, i);
                refreshTaskList(dateStr);
                updateCalendarTasks();
            });
            
            actions.appendChild(delBtn);
            item.appendChild(text);
            item.appendChild(actions);
            list.appendChild(item);
        });
    } else {
        const noTasks = document.createElement('div');
        noTasks.className = 'no-tasks';
        noTasks.textContent = 'No tasks for this date';
        list.appendChild(noTasks);
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

function updateAttendanceStats(today, start) {
    const daysSinceStart = Math.floor((today - start) / 86400000) + 1;
    const present = Math.max(0, Math.min(67, daysSinceStart - 2));
    const absent = Math.max(0, Math.min(2, daysSinceStart - present));
    
    document.getElementById('daysPresent').textContent = present;
    document.getElementById('daysAbsent').textContent = absent;
    
    const rate = (present / daysSinceStart) * 100;
    let msg = 'Your attendance needs improvement. Please attend classes regularly.';
    if (rate >= 95) msg = 'Your attendance is excellent! Keep up the good work.';
    else if (rate >= 90) msg = 'Good attendance! Try to maintain it.';
    else if (rate >= 80) msg = 'Your attendance is acceptable, but could be better.';
    
    document.getElementById('attendanceMessage').textContent = msg;
}