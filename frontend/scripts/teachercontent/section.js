$(document).ready(function () {
    const container = $("#sectionContainer");

    $.ajax({
    url: '../../../backend/controllers/teacher-controller/getTeacherSection.php',
    method: 'GET',
    dataType: 'json',
    success: function(response) {
        console.log(response.sections);
        
        if (response.sections && response.sections.length > 0) {
            container.empty(); // Clear container first
            
            // Loop through each section and create a card
            response.sections.forEach(function(section) {
                // Create card for each section
                const card = $(`
                    <div class="section-btn-card">
                        <div class="section-name">
                            <i class="fa-solid fa-chalkboard"></i> ${section.name}
                        </div>
                        <div class="section-subject">${section.subject}</div>
                        <div class="section-students">
                            <i class="fas fa-users"></i> ${section.num_students} Students
                        </div>
                        <button class="btn-view">
                            <i class="fas fa-eye"></i> View
                        </button>
                    </div>
                `);

                // Save section data to localStorage and redirect when clicking view button
                card.find(".btn-view").click(function() {
                    const section_data = localStorage.setItem("teacherSection", JSON.stringify(section));
                    console.log(section_data)
                    window.location.href = "section-details.php?section_id=" + section.id;
                });

                // Append card to container
                container.append(card);
            });
            
            container.show();
            
        } else {
            container.html(`
                <div class="alert alert-info">
                    <i class="fas fa-info-circle"></i> No sections found.
                </div>
            `);
            container.show();
        }
    },
    error: function (xhr, status, error) {
        console.error("Error fetching sections:", error, xhr.responseText);
        
        if (xhr.status === 401) {
            alert("Session expired. Please login again.");
            window.location.href = '../loginPage.php';
        }
    }
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
    
    */
});
