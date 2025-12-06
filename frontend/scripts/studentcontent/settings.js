// Mock user data
const mockUserData = {
    user_id: 1,
    name: "John Lawrence Gabriel",
    email: "JohnlawrenceGabriel@gmail.com",
    contact: "09123456789",
    password: "***********",
    avatar: null,
    avatar_url: null
};

// Simulate database operations
const MockDB = {
    users: [mockUserData],
    
    getUser: function(userId) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const user = this.users.find(u => u.user_id == userId) || mockUserData;
                resolve({
                    success: true,
                    data: {
                        ...user,
                        // Simulate avatar URL
                        avatar_url: user.avatar ? 
                            `../../uploads/avatars/${user.avatar}` : 
                            null
                    }
                });
            }, 300); // Simulate network delay
        });
    },
    
    updateUser: function(userId, field, value) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const user = this.users.find(u => u.user_id == userId);
                if (user) {
                    user[field] = value;
                    resolve({
                        success: true,
                        message: `${field} updated successfully!`
                    });
                } else {
                    resolve({
                        success: false,
                        message: 'User not found'
                    });
                }
            }, 500);
        });
    },
    
    changePassword: function(userId, currentPassword, newPassword) {
        return new Promise((resolve) => {
            setTimeout(() => {
                // Mock password check (always returns true for demo)
                if (currentPassword) {
                    resolve({
                        success: true,
                        message: 'Password changed successfully!'
                    });
                } else {
                    resolve({
                        success: false,
                        message: 'Current password is incorrect'
                    });
                }
            }, 500);
        });
    },
    
    uploadAvatar: function(userId, avatarFile) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const filename = `avatar_${userId}_${Date.now()}.jpg`;
                const user = this.users.find(u => u.user_id == userId);
                if (user) {
                    user.avatar = filename;
                    user.avatar_url = `../../uploads/avatars/${filename}`;
                    resolve({
                        success: true,
                        avatar_filename: filename,
                        avatar_url: user.avatar_url,
                        message: 'Avatar uploaded successfully!'
                    });
                } else {
                    resolve({
                        success: false,
                        message: 'User not found'
                    });
                }
            }, 800);
        });
    }
};

// Mock AJAX functions
function mockAjax(config) {
    if (config.url === 'getuser.php') {
        MockDB.getUser(mockUserData.user_id)
            .then(config.success)
            .catch(config.error);
    }
    else if (config.url === 'updateprofile.php') {
        const { field, value, user_id } = config.data;
        MockDB.updateUser(user_id, field, value)
            .then(config.success)
            .catch(config.error);
    }
    else if (config.url === 'change_password.php') {
        const { currentPassword, newPassword, user_id } = config.data;
        MockDB.changePassword(user_id, currentPassword, newPassword)
            .then(config.success)
            .catch(config.error);
    }
    else if (config.url === 'upload_avatar.php') {
        const formData = config.data;
        const avatar = formData.get('avatar');
        const userId = formData.get('user_id');
        
        MockDB.uploadAvatar(userId, avatar)
            .then(config.success)
            .catch(config.error);
    }
}

// Replace jQuery AJAX with mock for testing
const originalAjax = $.ajax;
$.ajax = function(config) {
    // If we want to use mock
    if (config.url && config.url.includes('mock')) {
        config.url = config.url.replace('-mock', '');
        return mockAjax(config);
    }
    // Otherwise use original (if backend exists)
    return originalAjax.apply(this, arguments);
};