$(document).ready(function () {
    const container = $("#sectionContainer");

    // Mock data for testing
    const mockTeacherSection = {
        teacherId: 99,
        section: {
            id: "3B",
            name: "BSIT 3B",
            subject: "IT 101 - Introduction to Computing 1",
            teacherName: "Boss Olen"
        }
    };

    const section = mockTeacherSection.section;

    //  card for section
    const card = $(`
        <div class="section-btn-card">
            <div class="section-name"><i class="fa-solid fa-chalkboard"></i> ${section.name}</div>
            <button class="btn-view"><i class="fas fa-eye"></i> View</button>
        </div>
    `);

    container.append(card);

    // Save for section-details.php
    localStorage.setItem("teacherSection", JSON.stringify(section));

    // Redirect when clicking the view button
    card.find(".btn-view").click(() => {
        window.location.href = "section-details.php?section=" + section.id;
    });


    //TODO: SESSION
    
    // BACKEND CONN
     // Example POST request 
        /*
        $.ajax({
            url: '../../../backend/controllers/teacher-controller/saveAttendance.php',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                sectionId: section.id,
                attendance: attendanceData
            }),
            success: function(response) {
                Swal.fire({
                    icon: "success",
                    title: response.message || "Attendance Saved!",
                    confirmButtonColor: "#012970"
                }).then(() => {
                    window.location.href = "section.php";
                });
            },
            error: function(xhr, status, error) {
                Swal.fire({
                    icon: "error",
                    title: "Error saving attendance",
                    text: xhr.responseText || "Something went wrong!",
                    confirmButtonColor: "#012970"
                });
            }
        });
        */

    /*
    // 
    $.ajax({
        url: '../../../backend/controllers/teacher-controller/getTeacherClass.php',
        method: 'GET',
        data: { teacherId: 99 },
        success: function(response) {
            container.show();
            const section = response.section;
            localStorage.setItem("teacherSection", JSON.stringify(section));
        }
    });
    */
});
