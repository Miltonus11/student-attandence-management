// User data object
let userData = {};

// Load user data from database
function loadUserData() {
    $.ajax({
        url: 'getuser.php',//tbl_user
        type: 'GET',
        dataType: 'json',
        success: response => {
            if (response.success) {
                userData = response.data;
                updateUserDisplay();
                updateSidebar();
            } else {
                showAlert('Failed to load user data', 'danger');
            }
        },
        error: () => showAlert('Error loading user data', 'danger')
    });
}

// Update sidebar with user data but need sidebar.php
function updateSidebar() {
    if (!userData) return;
    
    // Update sidebar profile image
    const sidebarProfileImg = document.querySelector('.profile-section .profile-image');
    if (sidebarProfileImg && userData.avatar) {
        sidebarProfileImg.src = userData.avatar.includes('http') ? 
            userData.avatar : 
            `../../uploads/avatars/${userData.avatar}`;
        sidebarProfileImg.alt = `${userData.name || 'User'} Profile Picture`;
    }
    
    // Update sidebar profile name
    const sidebarProfileName = document.querySelector('.profile-section .profile-name');
    if (sidebarProfileName && userData.name) {
        sidebarProfileName.textContent = userData.name;
    }
}

// Show edit modal
function editField(fieldType) {
    const modal = new bootstrap.Modal(document.getElementById('editModal'));
    const formFields = document.getElementById('formFields');
    const editFieldType = document.getElementById('editFieldType');
    
    editFieldType.value = fieldType;
    formFields.innerHTML = '';
    
    const fieldConfig = {
        name: { label: 'Name', type: 'text', placeholder: userData.name || '' },
        email: { label: 'Email Address', type: 'email', placeholder: userData.email || '' },
        contact: { label: 'Contact Number', type: 'tel', placeholder: userData.contact || '' }
    };
    
    const config = fieldConfig[fieldType];
    if (!config) return;
    
    document.getElementById('editModalLabel').textContent = `Edit ${config.label}`;
    
    formFields.innerHTML = `
        <div class="mb-3">
            <label for="editInput" class="form-label">${config.label}</label>
            <input type="${config.type}" class="form-control" id="editInput" 
                   value="${config.placeholder}" required>
        </div>
    `;
    
    modal.show();
}

// Save changes to database
function saveChanges() {
    const fieldType = document.getElementById('editFieldType').value;
    const value = document.getElementById('editInput').value.trim();
    
    if (!value) {
        showAlert('Please enter a value', 'danger');
        return;
    }
    
    // Basic validation
    if (fieldType === 'email' && !validateEmail(value)) {
        showAlert('Please enter a valid email address', 'danger');
        return;
    }
    
    if (fieldType === 'contact' && !validateContact(value)) {
        showAlert('Please enter a valid Philippine mobile number (09xxxxxxxxx)', 'danger');
        return;
    }
    
    // Show loading
    const saveBtn = document.querySelector('#editModal .btn-primary');
    const originalText = saveBtn.innerHTML;
    saveBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Saving...';
    saveBtn.disabled = true;
    
    // Send AJAX request
    $.ajax({
        url: 'updateprofile.php', //tbl_students
        type: 'POST',
        data: { field: fieldType, value: value, user_id: userData.user_id },
        dataType: 'json',
        success: response => {
            if (response.success) {
                userData[fieldType] = value;
                updateDisplay(fieldType, value);
                if (fieldType === 'name') updateSidebar();
                showAlert(response.message || `${fieldType.charAt(0).toUpperCase() + fieldType.slice(1)} updated successfully!`, 'success');
                bootstrap.Modal.getInstance(document.getElementById('editModal')).hide();
            } else {
                showAlert(response.message || 'Failed to update', 'danger');
            }
        },
        error: () => showAlert('An error occurred. Please try again.', 'danger'),
        complete: () => {
            saveBtn.innerHTML = originalText;
            saveBtn.disabled = false;
        }
    });
}

// Update display after edit
function updateDisplay(fieldType, value) {
    switch(fieldType) {
        case 'name':
            document.getElementById('displayName').textContent = value;
            break;
        case 'email':
            const emailLink = document.getElementById('emailLink');
            if (emailLink) {
                emailLink.textContent = value;
                emailLink.href = `mailto:${value}`;
            }
            break;
        case 'contact':
            const maskedContact = maskContact(value);
            document.getElementById('displayContact').innerHTML = 
                `${maskedContact} <a href="#" class="show-link" onclick="toggleContact(event)">Show</a>`;
            break;
    }
}

// Update all user display elements
function updateUserDisplay() {
    if (!userData) return;
    
    // Update name
    if (userData.name) {
        document.getElementById('displayName').textContent = userData.name;
    }
    
    // Update email
    if (userData.email) {
        const emailLink = document.getElementById('emailLink');
        emailLink.textContent = userData.email;
        emailLink.href = `mailto:${userData.email}`;
    }
    
    // Update contact (masked)
    if (userData.contact) {
        const maskedContact = maskContact(userData.contact);
        document.getElementById('displayContact').innerHTML = 
            `${maskedContact} <a href="#" class="show-link" onclick="toggleContact(event)">Show</a>`;
    }
    
    // Update avatar
    if (userData.avatar && document.getElementById('avatarPreview')) {
        const avatarSrc = userData.avatar.includes('http') ? 
            userData.avatar : 
            `uploads/avatars/${userData.avatar}`;
        document.getElementById('avatarPreview').innerHTML = 
            `<img src="${avatarSrc}" alt="Profile Avatar" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`;
    }
}

// Mask contact number
function maskContact(contact) {
    if (!contact || contact.length < 4) return 'Not set';
    const prefix = contact.substring(0, 2);
    const suffix = contact.substring(contact.length - 4);
    const masked = '*'.repeat(contact.length - 6);
    return `(+63) ${prefix}${masked}${suffix}`;
}

// Toggle contact visibility
function toggleContact(event) {
    event.preventDefault();
    const link = event.target;
    const showText = link.textContent === 'Show';
    
    link.textContent = showText ? 'Hide' : 'Show';
    const contact = showText ? userData.contact : maskContact(userData.contact);
    document.getElementById('displayContact').innerHTML = 
        `${contact} <a href="#" class="show-link" onclick="toggleContact(event)">${showText ? 'Hide' : 'Show'}</a>`;
}

// Validation functions
function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateContact(contact) {
    return /^09[0-9]{9}$/.test(contact);
}

// Show alert messages
function showAlert(message, type) {
    const alertId = 'alert-' + Date.now();
    const alertContainer = document.getElementById('alertContainer');
    
    alertContainer.innerHTML += `
        <div id="${alertId}" class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    
    setTimeout(() => {
        const alert = document.getElementById(alertId);
        if (alert) alert.remove();
    }, 5000);
}

// Toggle password visibility helper
function setupPasswordToggle(buttonId, inputId) {
    $(buttonId).click(function() {
        const passwordField = $(inputId);
        const type = passwordField.attr('type') === 'password' ? 'text' : 'password';
        passwordField.attr('type', type);
        $(this).find('i').toggleClass('fa-eye fa-eye-slash');
    });
}

// Password strength indicator
function setupPasswordStrength() {
    $('#newPassword').on('input', function() {
        const password = $(this).val();
        const checks = [
            password.length >= 8,
            /[a-z]+/.test(password),
            /[A-Z]+/.test(password),
            /[0-9]+/.test(password),
            /[$@#&!]+/.test(password)
        ];
        
        const strength = checks.filter(Boolean).length;
        const bar = $('#passwordStrengthBar');
        const text = $('#passwordStrengthText');
        
        if (strength <= 2) {
            bar.css('width', '25%').removeClass('bg-warning bg-success').addClass('bg-danger');
            text.text('Weak');
        } else if (strength <= 4) {
            bar.css('width', '60%').removeClass('bg-danger bg-success').addClass('bg-warning');
            text.text('Medium');
        } else {
            bar.css('width', '100%').removeClass('bg-danger bg-warning').addClass('bg-success');
            text.text('Strong');
        }
    });
}

// Initialize when document is ready
$(document).ready(function() {
    loadUserData();
    
    // Password visibility toggles
    setupPasswordToggle('#toggleCurrentPassword', '#currentPassword');
    setupPasswordToggle('#toggleNewPassword', '#newPassword');
    setupPasswordToggle('#toggleConfirmPassword', '#confirmPassword');
    
    // Password strength indicator
    setupPasswordStrength();
    
    // Change password form submission
    $('#changePasswordForm').submit(function(e) {
        e.preventDefault();
        
        const currentPassword = $('#currentPassword').val();
        const newPassword = $('#newPassword').val();
        const confirmPassword = $('#confirmPassword').val();
        
        // Validation
        if (!currentPassword || !newPassword || !confirmPassword) {
            showError('All fields are required');
            return;
        }
        
        if (newPassword.length < 8) {
            showError('New password must be at least 8 characters long');
            return;
        }
        
        if (newPassword !== confirmPassword) {
            showError('New password and confirmation do not match');
            return;
        }
        
        // Show loading
        const submitBtn = $('#changePasswordBtn');
        const originalText = submitBtn.html();
        submitBtn.prop('disabled', true)
                .html('<span class="spinner-border spinner-border-sm"></span> Processing...');
        
        // Send AJAX request
        $.ajax({
            url: 'change_password.php', //tbl_users
            type: 'POST',
            data: { 
                currentPassword, 
                newPassword, 
                confirmPassword, 
                user_id: userData.user_id 
            },
            dataType: 'json',
            success: response => {
                if (response.success) {
                    $('#changePasswordModal').modal('hide');
                    $('#changePasswordForm')[0].reset();
                    $('#passwordStrengthBar').css('width', '25%')
                                           .removeClass('bg-warning bg-success')
                                           .addClass('bg-danger');
                    $('#passwordStrengthText').text('Weak');
                    
                    setTimeout(() => $('#successModal').modal('show'), 300);
                } else {
                    showError(response.message || 'Password change failed');
                }
            },
            error: () => showError('Unable to connect to server. Please try again.'),
            complete: () => submitBtn.prop('disabled', false).html(originalText)
        });
    });
    
    function showError(message) {
        $('#errorMessage').text(message);
        $('#errorModal').modal('show');
    }
    
    // Reset form when modal is closed
    $('#changePasswordModal').on('hidden.bs.modal', function() {
        $('#changePasswordForm')[0].reset();
        $('#passwordStrengthBar').css('width', '25%')
                               .removeClass('bg-warning bg-success')
                               .addClass('bg-danger');
        $('#passwordStrengthText').text('Weak');
        
        // Reset eye icons and password fields
        $('[id^="toggle"]').find('i').removeClass('fa-eye-slash').addClass('fa-eye');
        $('#currentPassword, #newPassword, #confirmPassword').attr('type', 'password');
    });
    
    // Avatar upload
    $('#uploadLink').click(function(e) {
        e.preventDefault();
        
        const fileInput = $('<input type="file" accept="image/*" style="display: none;">');
        $('body').append(fileInput);
        
        fileInput.click().change(function() {
            if (!this.files || !this.files[0]) return;
            
            const file = this.files[0];
            
            if (!file.type.match('image.*')) {
                showAlert('Please select an image file.', 'danger');
                return;
            }
            
            if (file.size > 2 * 1024 * 1024) {
                showAlert('Image size should be less than 2MB.', 'danger');
                return;
            }
            
            const formData = new FormData();
            formData.append('avatar', file);
            formData.append('user_id', userData.user_id);
            
            const uploadLink = $('#uploadLink');
            const originalText = uploadLink.html();
            uploadLink.html('<span class="spinner-border spinner-border-sm"></span> Uploading...');
            
            $.ajax({
                url: 'upload_avatar.php', //tbl_students
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                dataType: 'json',
                success: response => {
                    if (response.success) {
                        const avatarSrc = response.avatar_url.includes('http') ? 
                            response.avatar_url : 
                            `../../${response.avatar_url}`;
                        
                        $('#avatarPreview').html(
                            `<img src="${avatarSrc}" alt="Profile Avatar" 
                                  style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`
                        );
                        
                        const sidebarProfileImg = document.querySelector('.profile-section .profile-image');
                        if (sidebarProfileImg) sidebarProfileImg.src = avatarSrc;
                        
                        showAlert('Profile picture updated successfully!', 'success');
                        userData.avatar = response.avatar_filename;
                    } else {
                        showAlert(response.message || 'Failed to upload avatar', 'danger');
                    }
                },
                error: () => showAlert('An error occurred during upload', 'danger'),
                complete: () => uploadLink.html(originalText)
            });
        });
    });
});