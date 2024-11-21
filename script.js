// Advanced Form Generation and Validation System
class DynamicFormGenerator {
    constructor() {
        // Validation rules with custom error messages
        this.validationRules = {
            required: {
                validate: (value) => value !== null && value !== undefined && value.trim() !== '',
                message: (label) => `${label} is required`
            },
            email: {
                validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
                message: () => 'Please enter a valid email address'
            },
            minLength: {
                validate: (value, length) => value.length >= length,
                message: (label, length) => `${label} must be at least ${length} characters`
            },
            maxLength: {
                validate: (value, length) => value.length <= length,
                message: (label, length) => `${label} cannot exceed ${length} characters`
            }
        };
    }

    // Comprehensive field creation with enhanced validation
    createField(field) {
        const fieldContainer = document.createElement('div');
        fieldContainer.classList.add('form-group');

        // Create label with optional required indicator
        const label = document.createElement('label');
        label.textContent = field.label;
        label.setAttribute('for', field.id);
        if (field.required) {
            const requiredSpan = document.createElement('span');
            requiredSpan.classList.add('required-indicator');
            requiredSpan.textContent = ' *';
            label.appendChild(requiredSpan);
        }
        fieldContainer.appendChild(label);

        // Create input element based on field type
        let input;
        switch (field.type) {
            case 'text':
            case 'email':
                input = document.createElement('input');
                input.type = field.type;
                input.placeholder = field.placeholder || '';
                break;
            case 'select':
                input = document.createElement('select');
                field.options.forEach(option => {
                    const optionElement = document.createElement('option');
                    optionElement.value = option.value;
                    optionElement.textContent = option.label;
                    input.appendChild(optionElement);
                });
                break;
            case 'radio':
                input = document.createElement('div');
                input.classList.add('radio-group');
                field.options.forEach(option => {
                    const radioWrapper = document.createElement('div');
                    radioWrapper.classList.add('radio-wrapper');

                    const radioInput = document.createElement('input');
                    radioInput.type = 'radio';
                    radioInput.id = `${field.id}-${option.value}`;
                    radioInput.name = field.id;
                    radioInput.value = option.value;

                    const radioLabel = document.createElement('label');
                    radioLabel.setAttribute('for', `${field.id}-${option.value}`);
                    radioLabel.textContent = option.label;

                    radioWrapper.appendChild(radioInput);
                    radioWrapper.appendChild(radioLabel);
                    input.appendChild(radioWrapper);
                });
                break;
            case 'textarea':
                input = document.createElement('textarea');
                input.placeholder = field.placeholder || '';
                break;
        }

        // Set common attributes
        input.id = field.id;
        input.name = field.id;
        input.required = field.required || false;

        // Add validation attributes if specified
        if (field.minLength) input.minLength = field.minLength;
        if (field.maxLength) input.maxLength = field.maxLength;

        // Create error message container
        const errorMessage = document.createElement('div');
        errorMessage.classList.add('error-message');

        // Add event listeners for real-time validation
        input.addEventListener('blur', () => this.validateField(input, field, errorMessage));

        fieldContainer.appendChild(input);
        fieldContainer.appendChild(errorMessage);

        return fieldContainer;
    }

    // Advanced field validation
    validateField(input, field, errorMessageEl) {
        errorMessageEl.textContent = '';

        // Check required fields
        if (field.required && this.validationRules.required) {
            if (!this.validationRules.required.validate(input.value)) {
                errorMessageEl.textContent = this.validationRules.required.message(field.label);
                return false;
            }
        }

        // Email validation
        if (field.type === 'email' && input.value) {
            if (!this.validationRules.email.validate(input.value)) {
                errorMessageEl.textContent = this.validationRules.email.message();
                return false;
            }
        }

        // Min length validation
        if (field.minLength && input.value) {
            if (!this.validationRules.minLength.validate(input.value, field.minLength)) {
                errorMessageEl.textContent = this.validationRules.minLength.message(field.label, field.minLength);
                return false;
            }
        }

        // Max length validation
        if (field.maxLength && input.value) {
            if (!this.validationRules.maxLength.validate(input.value, field.maxLength)) {
                errorMessageEl.textContent = this.validationRules.maxLength.message(field.label, field.maxLength);
                return false;
            }
        }

        return true;
    }

    // Form generation with advanced features
    generateForm(formData) {
        const form = document.createElement('form');
        form.classList.add('dynamic-form');

        // Add form header
        const formHeader = document.createElement('div');
        formHeader.classList.add('form-header');

        const formTitle = document.createElement('h3');
        formTitle.textContent = formData.formTitle;
        formHeader.appendChild(formTitle);

        if (formData.formDescription) {
            const formDescription = document.createElement('p');
            formDescription.textContent = formData.formDescription;
            formHeader.appendChild(formDescription);
        }

        form.appendChild(formHeader);

        // Generate form fields
        formData.fields.forEach(field => {
            const fieldElement = this.createField(field);
            form.appendChild(fieldElement);
        });

        // Create submit button with advanced styling
        const submitButton = document.createElement('button');
        submitButton.type = 'submit';
        submitButton.textContent = 'Submit Form';
        submitButton.classList.add('submit-button');

        form.appendChild(submitButton);

        // Form submission handler with advanced validation
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            
            let isFormValid = true;
            const formFields = form.querySelectorAll('input, select, textarea');
            
            formFields.forEach(field => {
                const fieldContainer = field.closest('.form-group');
                const errorMessageEl = fieldContainer.querySelector('.error-message');
                const correspondingField = formData.fields.find(f => f.id === field.id);
                
                if (!this.validateField(field, correspondingField, errorMessageEl)) {
                    isFormValid = false;
                }
            });

            if (isFormValid) {
                const formData = new FormData(form);
                const submissionData = Object.fromEntries(formData.entries());
                this.handleSubmit(submissionData);
            }
        });

        return form;
    }

    // Advanced submission handling with modern notification
    handleSubmit(formData) {
        console.log('Form submitted:', formData);
        
        // Create a toast notification
        const notification = document.createElement('div');
        notification.classList.add('notification', 'success');
        notification.textContent = 'Form submitted successfully!';
        document.body.appendChild(notification);

        // Animate notification
        setTimeout(() => {
            notification.classList.add('show');
            
            // Auto-remove notification
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => document.body.removeChild(notification), 300);
            }, 3000);
        }, 10);
    }
}

// Document Ready and Event Binding
document.addEventListener('DOMContentLoaded', () => {
    const jsonEditor = document.getElementById('jsonEditor');
    const jsonError = document.getElementById('jsonError');
    const formPreview = document.getElementById('formPreview');
    const formGenerator = new DynamicFormGenerator();

    // JSON Parsing and Form Generation
    function updateForm() {
        const jsonString = jsonEditor.value;
        try {
            const formData = JSON.parse(jsonString);
            jsonError.textContent = '';
            formPreview.innerHTML = '';
            
            // Generate and append form
            const dynamicForm = formGenerator.generateForm(formData);
            formPreview.appendChild(dynamicForm);
        } catch (error) {
            jsonError.textContent = 'Invalid JSON: ' + error.message;
            formPreview.innerHTML = '';
        }
    }

    // Event Listeners
    jsonEditor.addEventListener('input', updateForm);

    // Initialize with sample JSON
    jsonEditor.value = JSON.stringify({
        formTitle: "Professional Project Survey",
        formDescription: "Help us understand your project requirements",
        fields: [
            {
                id: "fullName",
                type: "text",
                label: "Full Name",
                required: true,
                minLength: 2,
                maxLength: 50,
                placeholder: "Enter your full name"
            },
            {
                id: "email",
                type: "email",
                label: "Corporate Email",
                required: true,
                placeholder: "your.name@company.com"
            },
            {
                id: "companySize",
                type: "select",
                label: "Company Size",
                required: true,
                options: [
                    { value: "startup", label: "Startup (1-50)" },
                    { value: "midsize", label: "Mid-size (51-500)" },
                    { value: "enterprise", label: "Enterprise (500+)" }
                ]
            },
            {
                id: "projectType",
                type: "radio",
                label: "Project Type",
                required: true,
                options: [
                    { value: "web", label: "Web Development" },
                    { value: "mobile", label: "Mobile App" },
                    { value: "cloud", label: "Cloud Solutions" },
                    { value: "other", label: "Other" }
                ]
            },
            {
                id: "projectDetails",
                type: "textarea",
                label: "Project Description",
                required: false,
                maxLength: 500,
                placeholder: "Briefly describe your project requirements..."
            }
        ]
    }, null, 2);

    // Initial form generation
    updateForm();
});

// Additional Styles for Notifications and Form
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #4CAF50;
        color: white;
        padding: 15px;
        border-radius: 4px;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
        z-index: 1000;
    }
    .notification.show {
        opacity: 1;
        transform: translateX(0);
    }
    .required-indicator {
        color: red;
    }
    .error-message {
        color: red;
        font-size: 0.8em;
        margin-top: 5px;
    }
`;
document.head.appendChild(styleSheet);