// Store summary data globally so we can access it in PDF generation
let currentSummaryData = {};

document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
    loadAttendanceChart();
    
    // Add event listener for date change
    document.getElementById('summaryDate').addEventListener('change', loadSummaryData);
    
    // Refresh data every 30 seconds
    setInterval(initializeDashboard, 30000);
});

function initializeDashboard() {
    // Fetch data from backend APIs
    Promise.all([
        fetch('http://localhost/dev/student-attandence-management/backend/controllers/admin-controller/Instructors/getInstructors.php')
            .then(res => res.json())
            .catch(err => { console.error('Error fetching instructors:', err); return { Instructors: [] }; }),
        fetch('http://localhost/dev/student-attandence-management/backend/controllers/admin-controller/sections/getSections.php')
            .then(res => res.json())
            .catch(err => { console.error('Error fetching sections:', err); return { classes: [] }; }),
        fetch('http://localhost/dev/student-attandence-management/backend/controllers/admin-controller/Students/getStudents.php')
            .then(res => res.json())
            .catch(err => { console.error('Error fetching students:', err); return { Students: [] }; }),
        fetch('http://localhost/dev/student-attandence-management/backend/controllers/Subjects/getSubjects.php')
            .then(res => res.json())
            .catch(err => { console.error('Error fetching subjects:', err); return { subjects: [] }; })
    ]).then(([instructorsData, sectionsData, studentsData, subjectsData]) => {
        // Update counts with real data - using correct key names from API responses
        const teachersCount = instructorsData.Instructors ? instructorsData.Instructors.length : 0;
        const sectionsCount = sectionsData.classes ? sectionsData.classes.length : 0;
        const studentsCount = studentsData.Students ? studentsData.Students.length : 0;
        const subjectsCount = subjectsData.subjects ? subjectsData.subjects.length : 0;
        
        document.getElementById('teachersCount').textContent = teachersCount;
        document.getElementById('sectionsCount').textContent = sectionsCount;
        document.getElementById('studentsCount').textContent = studentsCount;
        document.getElementById('subjectsCount').textContent = subjectsCount;
    }).catch(err => {
        console.error('Error initializing dashboard:', err);
        // Keep default values if all requests fail
    });
}

function loadAttendanceChart() {
    const ctx = document.getElementById('attendanceChart').getContext('2d');
    
    // Sample data for the last 7 days
    const dates = getLast7Days();
    const presentData = generateSampleData(650, 750);
    const absentData = generateSampleData(100, 150);
    
    // Create the line chart
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [
                {
                    label: 'Present',
                    data: presentData,
                    borderColor: '#28a745',
                    backgroundColor: 'rgba(40, 167, 69, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'Absent',
                    data: absentData,
                    borderColor: '#dc3545',
                    backgroundColor: 'rgba(220, 53, 69, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function getLast7Days() {
    const days = [];
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        days.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
    }
    return days;
}

function generateSampleData(min, max) {
    const data = [];
    for (let i = 0; i < 7; i++) {
        data.push(Math.floor(Math.random() * (max - min + 1)) + min);
    }
    return data;
}

function openSummaryModal() {
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('summaryModal'));
    modal.show();
    
    // Load summary data
    loadSummaryData();
}

function loadSummaryData() {
    const selectedDate = document.getElementById('summaryDate').value;
    
    if (!selectedDate) {
        showToast('Please select a date', 'error');
        return;
    }
    
    // Fetch real attendance data from backend
    fetch('http://localhost/dev/student-attandence-management/backend/controllers/admin-controller/getAttendanceSummary.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ date: selectedDate })
    })
    .then(res => res.json())
    .then(summaryData => {
        if (!summaryData.success) {
            showToast('Error: ' + (summaryData.message || 'Unable to load attendance data'), 'error');
            console.error('API Error:', summaryData);
            return;
        }
        
        // Store the data globally for PDF generation
        currentSummaryData = summaryData;
        currentSummaryData.date = selectedDate;
        
        // Update summary stats
        document.getElementById('summaryTotal').textContent = summaryData.total;
        document.getElementById('summaryPresent').textContent = summaryData.present;
        document.getElementById('summaryAbsent').textContent = summaryData.absent;
        document.getElementById('summaryPercentage').textContent = summaryData.attendancePercentage + '%';
        
        // Update present students table headers
        document.getElementById('presentStudentsHeader').innerHTML = `
            <i class="fas fa-check-circle me-2"></i>Present Students (${summaryData.present})
        `;
        
        // Update absent students table headers
        document.getElementById('absentStudentsHeader').innerHTML = `
            <i class="fas fa-times-circle me-2"></i>Absent Students (${summaryData.absent})
        `;
        
        // Update present students table
        const presentBody = document.getElementById('presentStudentsBody');
        presentBody.innerHTML = '';
        
        if (summaryData.presentStudents && summaryData.presentStudents.length > 0) {
            summaryData.presentStudents.forEach((student, index) => {
                const row = document.createElement('tr');
                const fullName = `${student.first_name} ${student.last_name}`;
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${student.id}</td>
                    <td>${fullName}</td>
                    <td>${student.class_name || 'N/A'}</td>
                `;
                presentBody.appendChild(row);
            });
        } else {
            presentBody.innerHTML = `
                <tr>
                    <td colspan="4" class="text-center text-muted">No present students for this date</td>
                </tr>
            `;
        }
        
        // Update absent students table
        const absentBody = document.getElementById('absentStudentsBody');
        absentBody.innerHTML = '';
        
        if (summaryData.absentStudents && summaryData.absentStudents.length > 0) {
            summaryData.absentStudents.forEach((student, index) => {
                const row = document.createElement('tr');
                const fullName = `${student.first_name} ${student.last_name}`;
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${student.id}</td>
                    <td>${fullName}</td>
                    <td>${student.class_name || 'N/A'}</td>
                `;
                absentBody.appendChild(row);
            });
        } else {
            absentBody.innerHTML = `
                <tr>
                    <td colspan="4" class="text-center text-muted">No absent students for this date</td>
                </tr>
            `;
        }
    })
    .catch(err => {
        console.error('Error loading summary data:', err);
        showToast('Error loading attendance data', 'error');
    });
}

async function downloadSimplePDF() {
    try {
        // Show loading state
        const downloadBtn = document.querySelector('.btn-download-pdf');
        const originalText = downloadBtn.innerHTML;
        downloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i> Generating PDF...';
        downloadBtn.disabled = true;
        
        // Dynamically load jsPDF library
        await loadJSPDFLibrary();
        
        const summaryDate = currentSummaryData.date || document.getElementById('summaryDate').value;
        const formattedDate = new Date(summaryDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        // Create new PDF document
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('p', 'mm', 'a4');
        
        // Add header
        doc.setFontSize(20);
        doc.setTextColor(33, 37, 41);
        doc.text('Attendance Summary Report', 105, 20, null, null, 'center');
        
        // Add date
        doc.setFontSize(12);
        doc.setTextColor(108, 117, 125);
        doc.text(`Date: ${formattedDate}`, 105, 30, null, null, 'center');
        
        // Add summary box
        doc.setDrawColor(0, 123, 255);
        doc.setFillColor(248, 249, 250);
        doc.roundedRect(20, 40, 170, 25, 3, 3, 'FD');
        
        doc.setFontSize(14);
        doc.setTextColor(33, 37, 41);
        doc.text('Summary Statistics', 105, 50, null, null, 'center');
        
        doc.setFontSize(12);
        doc.setTextColor(73, 80, 87);
        
        // Summary statistics
        const totalX = 40;
        const presentX = 85;
        const absentX = 130;
        const yPos = 60;
        
        // Total Students
        doc.setTextColor(108, 117, 125);
        doc.text('Total Students', totalX, yPos);
        doc.setFontSize(16);
        doc.setTextColor(33, 37, 41);
        doc.text(currentSummaryData.total.toString(), totalX, yPos + 8);
        
        // Present
        doc.setFontSize(12);
        doc.setTextColor(40, 167, 69);
        doc.text('Present', presentX, yPos);
        doc.setFontSize(16);
        doc.text(currentSummaryData.present.toString(), presentX, yPos + 8);
        
        // Absent
        doc.setFontSize(12);
        doc.setTextColor(220, 53, 69);
        doc.text('Absent', absentX, yPos);
        doc.setFontSize(16);
        doc.text(currentSummaryData.absent.toString(), absentX, yPos + 8);
        
        let yPosition = 80;
        
        // Present Students Section
        doc.setFontSize(14);
        doc.setTextColor(40, 167, 69);
        doc.text(`Present Students (${currentSummaryData.present})`, 20, yPosition);
        yPosition += 10;
        
        // Present Students Table
        if (currentSummaryData.presentStudents && currentSummaryData.presentStudents.length > 0) {
            createStudentTable(doc, currentSummaryData.presentStudents, yPosition);
            yPosition += (currentSummaryData.presentStudents.length * 7) + 20;
        } else {
            doc.setFontSize(12);
            doc.setTextColor(108, 117, 125);
            doc.text('No present students', 20, yPosition);
            yPosition += 15;
        }
        
        // Check if we need a new page
        if (yPosition > 250) {
            doc.addPage();
            yPosition = 20;
        }
        
        // Absent Students Section
        doc.setFontSize(14);
        doc.setTextColor(220, 53, 69);
        doc.text(`Absent Students (${currentSummaryData.absent})`, 20, yPosition);
        yPosition += 10;
        
        // Absent Students Table
        if (currentSummaryData.absentStudents && currentSummaryData.absentStudents.length > 0) {
            createStudentTable(doc, currentSummaryData.absentStudents, yPosition);
        } else {
            doc.setFontSize(12);
            doc.setTextColor(108, 117, 125);
            doc.text('No absent students', 20, yPosition);
        }
        
        // Add footer
        doc.addPage();
        doc.setFontSize(10);
        doc.setTextColor(108, 117, 125);
        doc.text('Generated on: ' + new Date().toLocaleString(), 20, 20);
        doc.text('School Attendance Management System', 105, 280, null, null, 'center');
        
        // Save the PDF
        const fileName = `attendance-summary-${summaryDate}.pdf`;
        doc.save(fileName);
        
        // Reset button state
        downloadBtn.innerHTML = originalText;
        downloadBtn.disabled = false;
        
        // Show success message
        showToast('PDF downloaded successfully!', 'success');
        
    } catch (error) {
        console.error('Error generating PDF:', error);
        
        // Reset button state
        const downloadBtn = document.querySelector('.btn-download-pdf');
        downloadBtn.innerHTML = '<i class="fas fa-file-pdf me-1"></i> Download PDF';
        downloadBtn.disabled = false;
        
        // Show error message
        showToast('Error generating PDF. Please try again.', 'error');
    }
}

function createStudentTable(doc, students, startY) {
    // Table headers
    doc.setFontSize(10);
    doc.setTextColor(33, 37, 41);
    doc.setFillColor(240, 240, 240);
    doc.rect(20, startY, 170, 8, 'F');
    
    doc.text('#', 25, startY + 6);
    doc.text('Student ID', 40, startY + 6);
    doc.text('Name', 80, startY + 6);
    doc.text('Section', 140, startY + 6);
    
    // Table rows
    let y = startY + 8;
    doc.setFontSize(10);
    
    students.forEach((student, index) => {
        if (y > 280) { // If we're near the bottom of the page
            doc.addPage();
            y = 20;
            // Redraw headers on new page
            doc.setFillColor(240, 240, 240);
            doc.rect(20, y, 170, 8, 'F');
            doc.text('#', 25, y + 6);
            doc.text('Student ID', 40, y + 6);
            doc.text('Name', 80, y + 6);
            doc.text('Section', 140, y + 6);
            y += 8;
        }
        
        // Alternate row colors
        if (index % 2 === 0) {
            doc.setFillColor(250, 250, 250);
        } else {
            doc.setFillColor(255, 255, 255);
        }
        doc.rect(20, y, 170, 7, 'F');
        
        doc.setTextColor(33, 37, 41);
        doc.text((index + 1).toString(), 25, y + 5);
        doc.text(student.id.toString(), 40, y + 5);
        const fullName = `${student.first_name} ${student.last_name}`;
        doc.text(fullName, 80, y + 5);
        doc.text(student.class_name || 'N/A', 140, y + 5);
        
        y += 7;
    });
    
    return y;
}

function loadJSPDFLibrary() {
    return new Promise((resolve, reject) => {
        if (window.jspdf) {
            resolve();
            return;
        }
        
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

function showToast(message, type = 'success') {
    // Create toast container if it doesn't exist
    let container = document.getElementById('toastContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toastContainer';
        container.className = 'toast-container position-fixed top-0 end-0 p-3';
        container.style.zIndex = '1060';
        document.body.appendChild(container);
    }
    
    // Create toast
    const toastId = 'toast-' + Date.now();
    const toast = document.createElement('div');
    toast.id = toastId;
    toast.className = `toast align-items-center text-white bg-${type === 'success' ? 'success' : 'danger'} border-0`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;
    
    container.appendChild(toast);
    
    // Show toast
    const bsToast = new bootstrap.Toast(toast, { delay: 3000 });
    bsToast.show();
    
    // Remove toast after it's hidden
    toast.addEventListener('hidden.bs.toast', function () {
        toast.remove();
    });
}

 


//itong nasa baba is mismong callable ng data pero yung nasa taas is mock lang





// // Store summary data globally so we can access it in PDF generation
// let currentSummaryData = {};
// let attendanceChart = null;

// $(document).ready(function() {
//     initializeDashboard();
//     loadAttendanceChart();
    
//     // Add event listener for date change
//     $('#summaryDate').on('change', loadSummaryData);
    
//     // Set default date to today
//     const today = new Date().toISOString().split('T')[0];
//     $('#summaryDate').val(today);
    
//     // Refresh dashboard every 30 seconds
//     setInterval(initializeDashboard, 30000);
// });

// // API Configuration
// const API_BASE_URL = 'http://localhost/your-php-api-folder'; // Change this to your actual API URL

// function fetchFromAPI(endpoint, method = 'GET', data = null) {
//     return new Promise((resolve, reject) => {
//         $.ajax({
//             url: `${API_BASE_URL}/${endpoint}`,
//             method: method,
//             contentType: 'application/json',
//             data: data ? JSON.stringify(data) : null,
//             dataType: 'json',
//             success: function(response) {
//                 resolve(response);
//             },
//             error: function(xhr, status, error) {
//                 console.error('AJAX Error:', error);
//                 showToast('Error fetching data from server', 'error');
//                 reject(error);
//             }
//         });
//     });
// }

// function initializeDashboard() {
//     $.ajax({
//         url: `${API_BASE_URL}/dashboard.php`,
//         method: 'GET',
//         dataType: 'json',
//         success: function(dashboardData) {
//             // Update dashboard cards
//             $('#teachersCount').text(dashboardData.teachers || 0);
//             $('#sectionsCount').text(dashboardData.sections || 0);
//             $('#studentsCount').text(dashboardData.students || 0);
//             $('#subjectsCount').text(dashboardData.subjects || 0);
            
//             // Update today's attendance
//             $('#todayPresent').text(dashboardData.todayPresent || 0);
//             $('#todayAbsent').text(dashboardData.todayAbsent || 0);
//         },
//         error: function(xhr, status, error) {
//             console.error('Error initializing dashboard:', error);
//             // Keep default values or show error state
//         }
//     });
// }

// function loadAttendanceChart() {
//     $.ajax({
//         url: `${API_BASE_URL}/attendance_chart.php`,
//         method: 'GET',
//         dataType: 'json',
//         success: function(chartData) {
//             const ctx = document.getElementById('attendanceChart').getContext('2d');
            
//             // Destroy existing chart if it exists
//             if (attendanceChart) {
//                 attendanceChart.destroy();
//             }
            
//             // Create the line chart with actual data
//             attendanceChart = new Chart(ctx, {
//                 type: 'line',
//                 data: {
//                     labels: chartData.dates || getLast7Days(),
//                     datasets: [
//                         {
//                             label: 'Present',
//                             data: chartData.presentData || [],
//                             borderColor: '#28a745',
//                             backgroundColor: 'rgba(40, 167, 69, 0.1)',
//                             borderWidth: 3,
//                             fill: true,
//                             tension: 0.4
//                         },
//                         {
//                             label: 'Absent',
//                             data: chartData.absentData || [],
//                             borderColor: '#dc3545',
//                             backgroundColor: 'rgba(220, 53, 69, 0.1)',
//                             borderWidth: 3,
//                             fill: true,
//                             tension: 0.4
//                         }
//                     ]
//                 },
//                 options: {
//                     responsive: true,
//                     maintainAspectRatio: false,
//                     plugins: {
//                         legend: {
//                             position: 'top',
//                         }
//                     },
//                     scales: {
//                         y: {
//                             beginAtZero: true,
//                             title: {
//                                 display: true,
//                                 text: 'Number of Students'
//                             }
//                         },
//                         x: {
//                             title: {
//                                 display: true,
//                                 text: 'Date'
//                             }
//                         }
//                     }
//                 }
//             });
//         },
//         error: function(xhr, status, error) {
//             console.error('Error loading attendance chart:', error);
//             // Create empty chart as fallback
//             createEmptyChart();
//         }
//     });
// }

// function getLast7Days() {
//     const days = [];
//     for (let i = 6; i >= 0; i--) {
//         const date = new Date();
//         date.setDate(date.getDate() - i);
//         days.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
//     }
//     return days;
// }

// function createEmptyChart() {
//     const ctx = document.getElementById('attendanceChart').getContext('2d');
    
//     if (attendanceChart) {
//         attendanceChart.destroy();
//     }
    
//     attendanceChart = new Chart(ctx, {
//         type: 'line',
//         data: {
//             labels: getLast7Days(),
//             datasets: [
//                 {
//                     label: 'Present',
//                     data: [],
//                     borderColor: '#28a745',
//                     backgroundColor: 'rgba(40, 167, 69, 0.1)',
//                     borderWidth: 3,
//                     fill: true,
//                     tension: 0.4
//                 },
//                 {
//                     label: 'Absent',
//                     data: [],
//                     borderColor: '#dc3545',
//                     backgroundColor: 'rgba(220, 53, 69, 0.1)',
//                     borderWidth: 3,
//                     fill: true,
//                     tension: 0.4
//                 }
//             ]
//         },
//         options: {
//             responsive: true,
//             maintainAspectRatio: false,
//             plugins: {
//                 legend: {
//                     position: 'top',
//                 }
//             },
//             scales: {
//                 y: {
//                     beginAtZero: true
//                 }
//             }
//         }
//     });
// }

// function openSummaryModal() {
//     // Show modal
//     const modal = new bootstrap.Modal(document.getElementById('summaryModal'));
//     modal.show();
    
//     // Load summary data
//     loadSummaryData();
// }

// function loadSummaryData() {
//     const selectedDate = $('#summaryDate').val();
    
//     if (!selectedDate) {
//         showToast('Please select a date', 'error');
//         return;
//     }
    
//     $.ajax({
//         url: `${API_BASE_URL}/attendance_summary.php`,
//         method: 'POST',
//         contentType: 'application/json',
//         data: JSON.stringify({ date: selectedDate }),
//         dataType: 'json',
//         success: function(summaryData) {
//             // Store the data globally for PDF generation
//             currentSummaryData = summaryData;
//             currentSummaryData.date = selectedDate;
            
//             // Update summary stats
//             $('#summaryTotal').text(summaryData.total || 0);
//             $('#summaryPresent').text(summaryData.present || 0);
//             $('#summaryAbsent').text(summaryData.absent || 0);
            
//             // Update table headers
//             $('#presentTable h5').html(`
//                 <i class="fas fa-check-circle me-2"></i>Present Students (${summaryData.present || 0})
//             `);
            
//             $('#absentTable h5').html(`
//                 <i class="fas fa-times-circle me-2"></i>Absent Students (${summaryData.absent || 0})
//             `);
            
//             // Update present students table
//             const presentBody = $('#presentStudentsBody');
//             presentBody.empty();
            
//             if (summaryData.presentStudents && summaryData.presentStudents.length > 0) {
//                 summaryData.presentStudents.forEach((student, index) => {
//                     const row = $('<tr>').html(`
//                         <td>${index + 1}</td>
//                         <td>${student.student_id || student.id || ''}</td>
//                         <td>${student.full_name || student.name || ''}</td>
//                         <td>${student.section || student.class || ''}</td>
//                     `);
//                     presentBody.append(row);
//                 });
//             } else {
//                 presentBody.html(`
//                     <tr>
//                         <td colspan="4" class="text-center text-muted">No present students for this date</td>
//                     </tr>
//                 `);
//             }
            
//             // Update absent students table
//             const absentBody = $('#absentStudentsBody');
//             absentBody.empty();
            
//             if (summaryData.absentStudents && summaryData.absentStudents.length > 0) {
//                 summaryData.absentStudents.forEach((student, index) => {
//                     const row = $('<tr>').html(`
//                         <td>${index + 1}</td>
//                         <td>${student.student_id || student.id || ''}</td>
//                         <td>${student.full_name || student.name || ''}</td>
//                         <td>${student.section || student.class || ''}</td>
//                     `);
//                     absentBody.append(row);
//                 });
//             } else {
//                 absentBody.html(`
//                     <tr>
//                         <td colspan="4" class="text-center text-muted">No absent students for this date</td>
//                     </tr>
//                 `);
//             }
//         },
//         error: function(xhr, status, error) {
//             console.error('Error loading summary data:', error);
//             showToast('Error loading attendance data', 'error');
//         }
//     });
// }

// // PDF Generation Functions (Keep these as they are - they're already good)
// async function downloadSimplePDF() {
//     try {
//         // Show loading state
//         const downloadBtn = $('.btn-download-pdf');
//         const originalText = downloadBtn.html();
//         downloadBtn.html('<i class="fas fa-spinner fa-spin me-1"></i> Generating PDF...');
//         downloadBtn.prop('disabled', true);
        
//         // Dynamically load jsPDF library
//         await loadJSPDFLibrary();
        
//         const summaryDate = currentSummaryData.date || $('#summaryDate').val();
//         const formattedDate = new Date(summaryDate).toLocaleDateString('en-US', {
//             year: 'numeric',
//             month: 'long',
//             day: 'numeric'
//         });
        
//         // Create new PDF document
//         const { jsPDF } = window.jspdf;
//         const doc = new jsPDF('p', 'mm', 'a4');
        
//         // Add header
//         doc.setFontSize(20);
//         doc.setTextColor(33, 37, 41);
//         doc.text('Attendance Summary Report', 105, 20, null, null, 'center');
        
//         // Add date
//         doc.setFontSize(12);
//         doc.setTextColor(108, 117, 125);
//         doc.text(`Date: ${formattedDate}`, 105, 30, null, null, 'center');
        
//         // Add summary box
//         doc.setDrawColor(0, 123, 255);
//         doc.setFillColor(248, 249, 250);
//         doc.roundedRect(20, 40, 170, 25, 3, 3, 'FD');
        
//         doc.setFontSize(14);
//         doc.setTextColor(33, 37, 41);
//         doc.text('Summary Statistics', 105, 50, null, null, 'center');
        
//         doc.setFontSize(12);
//         doc.setTextColor(73, 80, 87);
        
//         // Summary statistics
//         const totalX = 40;
//         const presentX = 85;
//         const absentX = 130;
//         const yPos = 60;
        
//         // Total Students
//         doc.setTextColor(108, 117, 125);
//         doc.text('Total Students', totalX, yPos);
//         doc.setFontSize(16);
//         doc.setTextColor(33, 37, 41);
//         doc.text(currentSummaryData.total.toString(), totalX, yPos + 8);
        
//         // Present
//         doc.setFontSize(12);
//         doc.setTextColor(40, 167, 69);
//         doc.text('Present', presentX, yPos);
//         doc.setFontSize(16);
//         doc.text(currentSummaryData.present.toString(), presentX, yPos + 8);
        
//         // Absent
//         doc.setFontSize(12);
//         doc.setTextColor(220, 53, 69);
//         doc.text('Absent', absentX, yPos);
//         doc.setFontSize(16);
//         doc.text(currentSummaryData.absent.toString(), absentX, yPos + 8);
        
//         let yPosition = 80;
        
//         // Present Students Section
//         doc.setFontSize(14);
//         doc.setTextColor(40, 167, 69);
//         doc.text(`Present Students (${currentSummaryData.present})`, 20, yPosition);
//         yPosition += 10;
        
//         // Present Students Table
//         if (currentSummaryData.presentStudents && currentSummaryData.presentStudents.length > 0) {
//             createStudentTable(doc, currentSummaryData.presentStudents, yPosition);
//             yPosition += (currentSummaryData.presentStudents.length * 7) + 20;
//         } else {
//             doc.setFontSize(12);
//             doc.setTextColor(108, 117, 125);
//             doc.text('No present students', 20, yPosition);
//             yPosition += 15;
//         }
        
//         // Check if we need a new page
//         if (yPosition > 250) {
//             doc.addPage();
//             yPosition = 20;
//         }
        
//         // Absent Students Section
//         doc.setFontSize(14);
//         doc.setTextColor(220, 53, 69);
//         doc.text(`Absent Students (${currentSummaryData.absent})`, 20, yPosition);
//         yPosition += 10;
        
//         // Absent Students Table
//         if (currentSummaryData.absentStudents && currentSummaryData.absentStudents.length > 0) {
//             createStudentTable(doc, currentSummaryData.absentStudents, yPosition);
//         } else {
//             doc.setFontSize(12);
//             doc.setTextColor(108, 117, 125);
//             doc.text('No absent students', 20, yPosition);
//         }
        
//         // Add footer
//         doc.addPage();
//         doc.setFontSize(10);
//         doc.setTextColor(108, 117, 125);
//         doc.text('Generated on: ' + new Date().toLocaleString(), 20, 20);
//         doc.text('School Attendance Management System', 105, 280, null, null, 'center');
        
//         // Save the PDF
//         const fileName = `attendance-summary-${summaryDate}.pdf`;
//         doc.save(fileName);
        
//         // Reset button state
//         downloadBtn.html(originalText);
//         downloadBtn.prop('disabled', false);
        
//         // Show success message
//         showToast('PDF downloaded successfully!', 'success');
        
//     } catch (error) {
//         console.error('Error generating PDF:', error);
        
//         // Reset button state
//         const downloadBtn = $('.btn-download-pdf');
//         downloadBtn.html('<i class="fas fa-file-pdf me-1"></i> Download PDF');
//         downloadBtn.prop('disabled', false);
        
//         // Show error message
//         showToast('Error generating PDF. Please try again.', 'error');
//     }
// }

// function createStudentTable(doc, students, startY) {
//     // Table headers
//     doc.setFontSize(10);
//     doc.setTextColor(33, 37, 41);
//     doc.setFillColor(240, 240, 240);
//     doc.rect(20, startY, 170, 8, 'F');
    
//     doc.text('#', 25, startY + 6);
//     doc.text('Student ID', 40, startY + 6);
//     doc.text('Name', 80, startY + 6);
//     doc.text('Section', 140, startY + 6);
    
//     // Table rows
//     let y = startY + 8;
//     doc.setFontSize(10);
    
//     students.forEach((student, index) => {
//         if (y > 280) { // If we're near the bottom of the page
//             doc.addPage();
//             y = 20;
//             // Redraw headers on new page
//             doc.setFillColor(240, 240, 240);
//             doc.rect(20, y, 170, 8, 'F');
//             doc.text('#', 25, y + 6);
//             doc.text('Student ID', 40, y + 6);
//             doc.text('Name', 80, y + 6);
//             doc.text('Section', 140, y + 6);
//             y += 8;
//         }
        
//         // Alternate row colors
//         if (index % 2 === 0) {
//             doc.setFillColor(250, 250, 250);
//         } else {
//             doc.setFillColor(255, 255, 255);
//         }
//         doc.rect(20, y, 170, 7, 'F');
        
//         doc.setTextColor(33, 37, 41);
//         doc.text((index + 1).toString(), 25, y + 5);
//         doc.text(student.student_id || student.id || '', 40, y + 5);
//         doc.text(student.full_name || student.name || '', 80, y + 5);
//         doc.text(student.section || student.class || '', 140, y + 5);
        
//         y += 7;
//     });
    
//     return y;
// }

// function loadJSPDFLibrary() {
//     return new Promise((resolve, reject) => {
//         if (window.jspdf) {
//             resolve();
//             return;
//         }
        
//         const script = document.createElement('script');
//         script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
//         script.onload = resolve;
//         script.onerror = reject;
//         document.head.appendChild(script);
//     });
// }

// function showToast(message, type = 'success') {
//     // Create toast container if it doesn't exist
//     let container = $('#toastContainer');
//     if (container.length === 0) {
//         container = $('<div>', {
//             id: 'toastContainer',
//             class: 'toast-container position-fixed top-0 end-0 p-3',
//             css: { zIndex: '1060' }
//         });
//         $('body').append(container);
//     }
    
//     // Create toast
//     const toastId = 'toast-' + Date.now();
//     const toast = $(`
//         <div id="${toastId}" class="toast align-items-center text-white bg-${type === 'success' ? 'success' : 'danger'} border-0" 
//              role="alert" aria-live="assertive" aria-atomic="true">
//             <div class="d-flex">
//                 <div class="toast-body">
//                     ${message}
//                 </div>
//                 <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
//             </div>
//         </div>
//     `);
    
//     container.append(toast);
    
//     // Show toast
//     const bsToast = new bootstrap.Toast(toast[0], { delay: 3000 });
//     bsToast.show();
    
//     // Remove toast after it's hidden
//     toast.on('hidden.bs.toast', function() {
//         toast.remove();
//     });
// }





