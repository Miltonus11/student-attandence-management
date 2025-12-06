$(document).ready(function () {
    const section = JSON.parse(localStorage.getItem("teacherSection"));

    const tableContainer = $("#tableContainer");
    const tableFooter = $("#tableFooter");

    $("#tableLoading").hide();
    tableContainer.show();
    tableFooter.show();
    
    // BACKEND: load students from server
    $.ajax({
        url: '../../../backend/controllers/teacher-controller/getSectionDetails.php',
        method: 'GET',
        data: { section_id: section.id },
        success: function(res) {
            // Populate table
            console.log(res);
            $("#sectionName").text(res.section.class_name);
            $("#subjectText").text(res.section.subject_name);
            $("#teacherText").text(res.section.teacher_name);

            const tbody = $("#attendanceTable tbody");
            tbody.empty();

            res.students.forEach(st => {
                tbody.append(`
                    <tr data-student-id="${st.student_id}">
                        <td class="text-center">
                            <input class="form-check-input attendance-checkbox" type="checkbox" aria-label="Mark ${st.student_name} as present">
                        </td>
                        <td><strong>${st.student_number}</strong></td>
                        <td>${st.student_name}</td>
                        <td><span class="badge status-badge"></span></td>
                    </tr>
                `);
            });

            updateCounts();
        }
    });

    // Checkbox logic
    $(document).on("change", ".attendance-checkbox", function () {
        const badge = $(this).closest("tr").find(".status-badge");

        if ($(this).is(":checked")) {
            badge
                .removeClass("bg-secondary bg-danger")
                .addClass("present") 
                .text("Present");
        } else {
            badge
                .removeClass("bg-secondary present")
                .addClass("absent") 
                .text("Absent");
        }

        updateCounts();
    });

    // Mark all present
    $("#markAllPresent").click(() => {
        $(".attendance-checkbox").each(function () {
            $(this).prop("checked", true).trigger("change");
        });
    });

    // Save attendance
    $("#saveAttendance").click(() => {
        const attendanceData = [];

        $("#attendanceTable tbody tr").each(function () {
            const id = $(this).data("student-id");
            const checked = $(this).find(".attendance-checkbox").is(":checked");

            attendanceData.push({
                id,
                present: checked ? 1 : 0
            });
        });

        console.log("Saved Attendance:", attendanceData);

        Swal.fire({
            icon: "success",
            title: "Attendance Saved!",
            confirmButtonColor: "#012970"
        }).then(() => {
            window.location.href = "section.php";
        });
    });

    // Download PDF button handler
    $("#downloadPDF").click(async function () {
        const button = $(this);
        const originalHTML = button.html();
        
        try {
            // Disable button and show loading
            button.html('<i class="fas fa-spinner fa-spin me-1"></i> Generating PDF...');
            button.prop('disabled', true);
            
            // Get section data from localStorage AND current DOM elements
            const section = JSON.parse(localStorage.getItem("teacherSection"));
            
            if (!section || !section.id) {
                throw new Error("No section data found. Please go back and select a section.");
            }
            
            // Get the current section information from the page (updated values)
            const currentSectionInfo = {
                class_name: $("#sectionName").text() || section.class_name,
                subject_name: $("#subjectText").text() || section.subject_name,
                teacher_name: $("#teacherText").text() || section.teacher_name
            };
            
            // Get current attendance data from the table
            const attendanceData = [];
            const students = [];
            
            $("#attendanceTable tbody tr").each(function () {
                const studentId = $(this).data("student-id");
                const studentNumber = $(this).find("td:nth-child(2)").text().trim();
                const studentName = $(this).find("td:nth-child(3)").text().trim();
                const isPresent = $(this).find(".attendance-checkbox").is(":checked");
                
                attendanceData.push({
                    student_id: studentId,
                    status: isPresent ? 'Present' : 'Absent'
                });
                
                students.push({
                    student_id: studentId,
                    student_number: studentNumber,
                    name: studentName
                });
            });
            
            // Generate the PDF with merged section info
            const result = await pdfGenerator.generatePDFFromCurrentData(
                currentSectionInfo, // Use the updated section info
                students,
                attendanceData
            );
            
            if (result.success) {
                // Download the PDF 
                const timestamp = new Date().toISOString().slice(0, 10);
                const className = currentSectionInfo.class_name || 'Unknown_Class';
                // Use a safer replace method
                const safeClassName = className.replace ? 
                    className.replace(/\s+/g, '_') : 
                    'Unknown_Class';
                const filename = `Attendance_${safeClassName}_${timestamp}.pdf`;
                
                result.doc.save(filename);
                
                // Show success message
                Swal.fire({
                    icon: 'success',
                    title: 'PDF Generated!',
                    text: 'Attendance report has been downloaded successfully.',
                    timer: 2000,
                    showConfirmButton: false
                });
            } else {
                throw new Error(result.error || 'Failed to generate PDF');
            }
            
        } catch (error) {
            console.error('PDF Generation Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Generation Failed',
                text: 'Could not generate PDF. ' + (error.message || 'Please try again.'),
                footer: '<small>Check browser console for details</small>'
            });
        } finally {
            // Restore button state
            button.html(originalHTML);
            button.prop('disabled', false);
        }
    });
});

// Analytics 
function updateCounts() {
    const total = $("#attendanceTable tbody tr").length;
    const present = $(".attendance-checkbox:checked").length;
    const absent = total - present;

    $("#presentCount").text(present);
    $("#absentCount").text(absent);
    $("#totalCount2").text(total);
    $("#totalCount").text(total);
}

// Simplified PDF Generator 
class RealTimePDFGenerator {
    constructor() {
        this.doc = null;
    }

    init() {
        // Check if jsPDF is available
        if (typeof window.jspdf !== 'undefined') {
            const { jsPDF } = window.jspdf;
            this.doc = new jsPDF('p', 'mm', 'a4');
            return true;
        }
        console.error('jsPDF library not loaded');
        return false;
    }

    async generatePDFFromCurrentData(section, students, attendanceData) {
        try {
            // Initialize jsPDF
            if (!this.init()) {
                throw new Error('Failed to initialize PDF generator');
            }
            
            const { jsPDF } = window.jspdf;
            this.doc = new jsPDF('p', 'mm', 'a4');
            const doc = this.doc;
            const pageWidth = doc.internal.pageSize.width;
            let yPos = 20;
            
            // Create attendance map for quick lookup
            const attendanceMap = {};
            attendanceData.forEach(record => {
                attendanceMap[record.student_id] = record.status;
            });
            
            // Set document properties 
            doc.setProperties({
                title: `Attendance Report - ${section?.class_name || 'Unknown Class'}`,
                subject: 'Attendance Report',
                author: 'Teacher Portal',
                creator: 'Learning Management System'
            });
            
            // Header
            doc.setFontSize(16);
            doc.setFont("helvetica", "bold");
            doc.text("Attendance Report", pageWidth / 2, yPos, { align: 'center' });
            yPos += 10;
            
            // Date and Time
            const now = new Date();
            const dateStr = now.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
            const timeStr = now.toLocaleTimeString('en-US', { hour12: true });
            
            doc.setFontSize(10);
            doc.setFont("helvetica", "italic");
            doc.text(`Generated on: ${dateStr} at ${timeStr}`, pageWidth / 2, yPos, { align: 'center' });
            yPos += 15;
            
            // Section Information - UPDATED to use passed section data
            doc.setFontSize(14);
            doc.setFont("helvetica", "bold");
            doc.text("Section Information", 14, yPos);
            yPos += 8;
            
            doc.setFontSize(11);
            doc.setFont("helvetica", "normal");
            
            // Class Information
            doc.text(`Class: ${section?.class_name || 'N/A'}`, 20, yPos);
            yPos += 6;
            
            // Subject Information (from the example image: "IT IN THE MODERN WORLD")
            doc.text(`Subject: ${section?.subject_name || 'N/A'}`, 20, yPos);
            yPos += 6;
            
            // Teacher Information
            doc.text(`Teacher: ${section?.teacher_name || 'N/A'}`, 20, yPos);
            yPos += 6;
            
            // Date - using current date from the PDF generation
            doc.text(`Date: ${dateStr}`, 20, yPos);
            yPos += 15;
            
            // Separator line
            doc.setDrawColor(200, 200, 200);
            doc.line(14, yPos, pageWidth - 14, yPos);
            yPos += 10;
            
            // Attendance Summary
            const presentCount = attendanceData.filter(a => a.status === 'Present').length;
            const absentCount = attendanceData.filter(a => a.status === 'Absent').length;
            const totalCount = students.length;
            
            doc.setFontSize(12);
            doc.setFont("helvetica", "bold");
            doc.text("Attendance Summary", pageWidth / 2, yPos, { align: 'center' });
            yPos += 8;
            
            doc.setFontSize(11);
            doc.setFont("helvetica", "normal");
            const summaryText = `Present: ${presentCount} | Absent: ${absentCount} | Total: ${totalCount}`;
            doc.text(summaryText, pageWidth / 2, yPos, { align: 'center' });
            yPos += 20;
            
            // Student Attendance Table
            if (students.length > 0) {
                // Prepare table data 
                const headers = [['No.', 'Student ID', 'Student Name', 'Status']];
                const tableData = students.map((student, index) => [
                    index + 1,
                    student.student_number || 'N/A',
                    student.name || 'Unknown',
                    attendanceMap[student.student_id] || 'Absent'
                ]);
                
                // Use autoTable if available
                if (typeof doc.autoTable !== 'undefined') {
                    doc.autoTable({
                        startY: yPos,
                        head: headers,
                        body: tableData,
                        theme: 'grid',
                        styles: {
                            fontSize: 9, 
                            cellPadding: 2, 
                        },
                        headStyles: {
                            fillColor: [41, 128, 185],
                            textColor: 255,
                            fontStyle: 'bold'
                        },
                        alternateRowStyles: {
                            fillColor: [245, 245, 245]
                        },
                        columnStyles: {
                            0: { cellWidth: 10 },
                            1: { cellWidth: 30 },
                            2: { cellWidth: 70 },
                            3: { cellWidth: 20 }
                        },
                        margin: { left: 14, right: 14 },
                        tableWidth: 'wrap',
                        didDrawPage: function(data) {
                            // Footer
                            doc.setFontSize(8);
                            doc.setFont("helvetica", "italic");
                            const pageCount = doc.internal.getNumberOfPages();
                            doc.text(`Page ${data.pageNumber} of ${pageCount}`, 
                                    pageWidth / 2, 
                                    doc.internal.pageSize.height - 10, 
                                    { align: 'center' });
                        },
                        overflow: 'linebreak',
                        overflowColumns: false
                    });
                } else {
                    // Fallback without autoTable
                    doc.setFontSize(12);
                    doc.setFont("helvetica", "bold");
                    doc.text("Student Attendance:", 14, yPos);
                    yPos += 10;
                    
                    students.forEach((student, index) => {
                        if (yPos > 270) {
                            doc.addPage();
                            yPos = 20;
                        }
                        doc.setFontSize(10);
                        doc.setFont("helvetica", "normal");
                        const status = attendanceMap[student.student_id] || 'Absent';
                        const statusColor = status === 'Present' ? [0, 128, 0] : [255, 0, 0];
                        doc.setTextColor(...statusColor);
                        
                        // Truncate long names to fit
                        const studentName = student.name || 'Unknown';
                        const displayName = studentName.length > 30 ? 
                            studentName.substring(0, 27) + '...' : studentName;
                        
                        doc.text(`${index + 1}. ${student.student_number || 'N/A'} - ${displayName} (${status})`, 
                                14, yPos);
                        doc.setTextColor(0, 0, 0);
                        yPos += 7;
                    });
                }
            }
            
            return {
                success: true,
                doc: doc
            };
            
        } catch (error) {
            console.error('PDF Generation Error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
}

// Initialize PDF Generator
const pdfGenerator = new RealTimePDFGenerator();