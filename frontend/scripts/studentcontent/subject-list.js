// scripts/admincontent/mock-data.js

// Mock data for testing (replace with real API calls)
const MockData = {
    // Mock class data
    classes: [
        { class_id: 1, class_name: "Mathematics 101", year_level: 1 },
        { class_id: 2, class_name: "Physics 201", year_level: 2 },
        { class_id: 3, class_name: "Chemistry 301", year_level: 3 },
        { class_id: 4, class_name: "Biology 101", year_level: 1 },
        { class_id: 5, class_name: "Computer Science 401", year_level: 4 },
        { class_id: 6, class_name: "English Literature", year_level: null },
        { class_id: 7, class_name: "History 202", year_level: 2 },
        { class_id: 8, class_name: "Art 101", year_level: 1 }
    ],

    // Simulate API delay
    delay: function(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    // Get all classes (mock API call)
    getAllClasses: async function() {
        await this.delay(500); // Simulate network delay
        return [...this.classes];
    },

    // Search classes (mock API call)
    searchClasses: async function(searchTerm) {
        await this.delay(300); // Simulate network delay
        if (!searchTerm.trim()) return [...this.classes];
        
        const term = searchTerm.toLowerCase();
        return this.classes.filter(classItem => 
            classItem.class_name.toLowerCase().includes(term)
        );
    },

    // Add new class (mock API call)
    addClass: async function(className, yearLevel) {
        await this.delay(500); // Simulate network delay
        
        const newClass = {
            class_id: this.classes.length + 1,
            class_name: className,
            year_level: yearLevel || null
        };
        
        this.classes.unshift(newClass); // Add to beginning
        return newClass;
    },

    // Get class count
    getClassCount: async function() {
        await this.delay(100); // Simulate network delay
        return this.classes.length;
    }
};

// Make MockData available globally
window.MockData = MockData;