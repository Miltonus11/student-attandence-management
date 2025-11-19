$(document).ready(function(e){
    
    $('#loginForm').on("submit", function(e){
        e.preventDefault();
        $.ajax({
            url:'../../backend/controllers/login.php',
            method:'POST',
            dataType:'json',
            data: {
                username: $('#id-number').val(),
                password: $('#password').val()
            },
            success: function(res){
                console.log(res)
                if(res.status == "success"){
                    // redirect to a website
                    const userLevel = res.user_level
                    switch(userLevel) {
                        case "admin":
                            window.location.href ="admin/admin-dashboard.php";
                            break;
                        case "student":
                            window.location.href ="students/student-dashboard.php";
                            break;
                        default:
                            window.location.href ="../loginPage.php";
                            break;
                    }
                }else{
                    $('#error-text').text("Incorrect Credentials").css("color","red");
                }
            },
            error: function(xhr){
                console.log(xhr.responseText)
            }
        })
    })
})