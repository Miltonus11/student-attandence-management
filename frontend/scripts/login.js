alert("Script Loaded")
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
                    alert("Login Succesful, redirecting now...")
                    window.location.href ="admin/admin.php"
                }else{
                    $('#error-text').text("Incorrect Credentials").css("color","red")
                }
            },
            error: function(xhr){
                console.log(xhr.textResponse)
            }
        })
    })
})