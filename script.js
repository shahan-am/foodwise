// FoodWise Application JavaScript

// Enhanced UI/UX Improvements
class UIEnhancements {
    constructor() {
        this.initializeEnhancements();
    }

    initializeEnhancements() {
        this.addFormValidation();
        this.addProgressIndicators();
        this.addLoadingStates();
        this.addSmoothScrolling();
        this.addTooltips();
        this.addAnimationObserver();
        this.addKeyboardNavigation();
    }

    // Enhanced Form Validation with Visual Feedback
    addFormValidation() {
        const inputs = document.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('blur', (e) => {
                this.validateField(e.target);
            });

            input.addEventListener('input', (e) => {
                if (e.target.classList.contains('is-invalid')) {
                    this.validateField(e.target);
                }
            });
        });
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldType = field.type;
        const isRequired = field.hasAttribute('required');
        
        // Remove existing validation classes
        field.classList.remove('is-valid', 'is-invalid');
        
        // Remove existing feedback
        const existingFeedback = field.parentNode.querySelector('.invalid-feedback, .valid-feedback');
        if (existingFeedback) {
            existingFeedback.remove();
        }

        let isValid = true;
        let message = '';

        // Required field validation
        if (isRequired && !value) {
            isValid = false;
            message = 'This field is required';
        }
        // Email validation
        else if (fieldType === 'email' && value && !this.isValidEmail(value)) {
            isValid = false;
            message = 'Please enter a valid email address';
        }
        // Number validation
        else if (fieldType === 'number' && value) {
            const num = parseFloat(value);
            const min = parseFloat(field.min);
            const max = parseFloat(field.max);
            
            if (isNaN(num)) {
                isValid = false;
                message = 'Please enter a valid number';
            } else if (min && num < min) {
                isValid = false;
                message = `Value must be at least ${min}`;
            } else if (max && num > max) {
                isValid = false;
                message = `Value must be no more than ${max}`;
            }
        }

        // Apply validation styling
        if (value) {
            field.classList.add(isValid ? 'is-valid' : 'is-invalid');
            
            // Add feedback message
            const feedback = document.createElement('div');
            feedback.className = isValid ? 'valid-feedback' : 'invalid-feedback';
            feedback.textContent = isValid ? 'Looks good!' : message;
            field.parentNode.appendChild(feedback);
        }

        return isValid;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Progress Indicators for Multi-step Forms
    addProgressIndicators() {
        const form = document.getElementById('foodForm');
        if (!form) return;

        const sections = form.querySelectorAll('.form-section');
        const totalSections = sections.length;
        
        // Create progress bar
        const progressContainer = document.createElement('div');
        progressContainer.className = 'progress-container';
        progressContainer.innerHTML = `
            <div class="progress-bar">
                <div class="progress-fill" style="width: 0%"></div>
            </div>
            <div class="progress-text">Complete your profile to get personalized recommendations</div>
        `;
        
        // Add some styling
        progressContainer.style.cssText = `
            margin-bottom: 2rem;
            padding: 1rem;
            background: white;
            border-radius: 1rem;
            box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
        `;

        form.insertBefore(progressContainer, form.firstChild);

        // Update progress based on filled sections
        const updateProgress = () => {
            let completedSections = 0;
            
            sections.forEach(section => {
                const inputs = section.querySelectorAll('input, select, textarea');
                const filledInputs = Array.from(inputs).filter(input => {
                    if (input.type === 'radio' || input.type === 'checkbox') {
                        return section.querySelector(`input[name="${input.name}"]:checked`);
                    }
                    return input.value.trim() !== '';
                });
                
                if (filledInputs.length > 0) {
                    completedSections++;
                }
            });

            const progress = (completedSections / totalSections) * 100;
            const progressFill = progressContainer.querySelector('.progress-fill');
            const progressText = progressContainer.querySelector('.progress-text');
            
            progressFill.style.width = `${progress}%`;
            
            if (progress === 100) {
                progressText.textContent = '🎉 Profile complete! Ready for recommendations';
            } else if (progress > 50) {
                progressText.textContent = `Almost there! ${Math.round(progress)}% complete`;
            } else {
                progressText.textContent = `Getting started... ${Math.round(progress)}% complete`;
            }
        };

        // Listen for input changes
        form.addEventListener('input', updateProgress);
        form.addEventListener('change', updateProgress);
        
        // Initial update
        setTimeout(updateProgress, 100);
    }

    // Enhanced Loading States
    addLoadingStates() {
        // Override button clicks to show loading states
        document.addEventListener('click', (e) => {
            const button = e.target.closest('button, .btn');
            if (!button) return;
            
            // Skip if already loading
            if (button.classList.contains('btn-loading')) {
                e.preventDefault();
                return;
            }

            // Add loading state for form submissions and major actions
            if (button.type === 'submit' || button.classList.contains('btn-primary') || button.classList.contains('btn-success')) {
                button.classList.add('btn-loading');
                button.disabled = true;
                
                // Remove loading state after a delay (will be overridden by actual completion)
                setTimeout(() => {
                    button.classList.remove('btn-loading');
                    button.disabled = false;
                }, 3000);
            }
        });
    }

    // Smooth Scrolling to Sections
    addSmoothScrolling() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="#"]');
            if (!link) return;

            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }

    // Enhanced Tooltips
    addTooltips() {
        const tooltipElements = document.querySelectorAll('[data-tooltip]');
        
        tooltipElements.forEach(element => {
            element.classList.add('tooltip');
        });
    }

    // Intersection Observer for Animations
    addAnimationObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    
                    // Add slide-in animation
                    element.classList.add('slide-in-up');
                    
                    observer.unobserve(element);
                }
            });
        }, observerOptions);

        // Observe form sections and cards
        const elementsToAnimate = document.querySelectorAll('.form-section, .result-card, .location-item');
        elementsToAnimate.forEach(element => {
            observer.observe(element);
        });
    }

    // Enhanced Keyboard Navigation
    addKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // Escape key to close modals/dropdowns
            if (e.key === 'Escape') {
                const activeModal = document.querySelector('.modal.show');
                if (activeModal) {
                    activeModal.classList.remove('show');
                }
            }
        });
    }

    // Show notification with enhanced styling
    static showNotification(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `notification ${type} slide-in-right`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
            z-index: 1000;
            max-width: 300px;
            border-left: 4px solid ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        `;
        
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <i class="fas fa-${UIEnhancements.getNotificationIcon(type)}" style="color: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};"></i>
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" style="margin-left: auto; background: none; border: none; cursor: pointer; color: #6b7280;">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        document.body.appendChild(notification);

        // Auto remove
        setTimeout(() => {
            if (notification.parentElement) {
                notification.style.animation = 'slideOutRight 0.3s ease-in';
                setTimeout(() => notification.remove(), 300);
            }
        }, duration);
    }

    static getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }
}

class FoodWise {
    constructor() {
        this.userLocation = null;
        this.userProfile = {};
        this.initializeApp();
    }

    initializeApp() {
        console.log('Initializing FoodWise application...');
        
        try {
            // Validate required elements exist
            const requiredElements = [
                'foodForm',
                'weight', 'height', 'age', 'gender',
                'dietType', 'fitnessGoal', 'activityLevel', 'budget',
                'results', 'foodContent', 'nutritionContent', 'locationContent'
            ];
            
            const missingElements = requiredElements.filter(id => {
                const element = document.getElementById(id);
                if (!element) {
                    console.warn(`Missing element: ${id}`);
                    return true;
                }
                return false;
            });
            
            if (missingElements.length > 0) {
                console.error('Missing required elements:', missingElements);
                // Don't fail completely, just warn
                console.warn('Some elements are missing, but continuing initialization...');
            }
            
            console.log('Proceeding with initialization...');
            
            this.bindEvents();
            this.loadFoodDatabase();
            
            // Initialize geolocation permission check
            setTimeout(() => {
                if (this.checkGeolocationPermissions) {
                    this.checkGeolocationPermissions().then(permissionState => {
                        if (this.updateLocationButtonState) {
                            this.updateLocationButtonState(permissionState);
                        }
                    }).catch(error => {
                        console.warn('Geolocation permission check failed:', error);
                    });
                }
            }, 1000);
            
            console.log('FoodWise application initialized successfully!');
            
        } catch (error) {
            console.error('Error during initialization:', error);
            // Try to show notification if UIEnhancements is available
            if (typeof UIEnhancements !== 'undefined' && UIEnhancements.showNotification) {
                UIEnhancements.showNotification('Application initialization error. Some features may not work properly.', 'error', 5000);
            }
        }
    }

    bindEvents() {
        console.log('Binding events...');
        
        // Floating Action Button
        const fab = document.getElementById('quickRecommendations');
        if (fab) {
            fab.addEventListener('click', () => {
                this.handleQuickRecommendations();
            });
        }
        
        // Test Data Button (for development)
        const testBtn = document.getElementById('fillTestData');
        if (testBtn) {
            testBtn.addEventListener('click', () => {
                this.fillTestData();
            });
        }
        
        // Get location button
        const locationBtn = document.getElementById('getLocation');
        if (locationBtn) {
            locationBtn.addEventListener('click', () => {
                this.getCurrentLocation();
            });
            console.log('Location button event bound');
        } else {
            console.error('Location button not found');
        }

        // Form submission
        const form = document.getElementById('foodForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmission();
            });
            console.log('Form submission event bound');
        } else {
            console.error('Form not found');
        }

        // AI Image Detection Events
        this.initializeImageDetection();
        console.log('All events bound successfully');
    }

    // Test function to verify auto-fill works (for debugging)
    testAutoFill() {
        console.log('Testing auto-fill functionality...');
        
        const testAnalysis = {
            physicalCharacteristics: {
                height: 175,
                weight: 70,
                age: 28,
                gender: 'male',
                genderConfidence: 0.8,
                bmi: 22.9,
                bodyType: 'Athletic',
                fitnessLevel: 'Active'
            },
            suggestions: {
                dietType: 'high-protein',
                fitnessGoal: 'muscle-gain',
                activityLevel: 'active'
            },
            analysisDetails: {
                skinDetection: '45.2',
                imageQuality: 'High',
                aspectRatio: '1.60',
                brightness: '165.3',
                confidence: 0.85
            }
        };
        
        this.autoFillFormFields(testAnalysis);
    }

    // Initialize AI Image Detection (updated with test button for debugging)
    initializeImageDetection() {
        console.log('Initializing image detection...');
        
        const uploadArea = document.getElementById('uploadArea');
        const fileInput = document.getElementById('bodyImage');
        const cameraInput = document.getElementById('cameraCapture');
        const browseBtn = document.getElementById('browseFiles');
        const cameraBtn = document.getElementById('captureCamera');
        const removeBtn = document.getElementById('removeUpload');
        const retakeBtn = document.getElementById('retakePhoto');
        const testBtn = document.getElementById('testAutoFillBtn');

        // Initialize camera functionality
        this.initializeCameraCapture();

        // Test button for debugging
        if (testBtn) {
            testBtn.addEventListener('click', () => {
                console.log('Test button clicked');
                this.testAutoFill();
            });
            console.log('Test button event bound');
        }

        // Browse files button
        if (browseBtn) {
            browseBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                console.log('Browse button clicked');
                fileInput.click();
            });
            console.log('Browse button event bound');
        }

        // Camera capture button
        if (cameraBtn) {
            cameraBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                console.log('Camera button clicked');
                this.openCameraModal();
            });
            console.log('Camera button event bound');
        }

        // File input change
        if (fileInput) {
            fileInput.addEventListener('change', (e) => {
                console.log('File input changed, files:', e.target.files);
                if (e.target.files.length > 0) {
                    this.handleFileUpload(e.target.files[0]);
                }
            });
            console.log('File input event bound');
        }

        // Camera input change (fallback for devices without camera API)
        if (cameraInput) {
            cameraInput.addEventListener('change', (e) => {
                console.log('Camera input changed, files:', e.target.files);
                if (e.target.files.length > 0) {
                    this.handleFileUpload(e.target.files[0], true);
                }
            });
            console.log('Camera input event bound');
        }

        // Drag and drop
        if (uploadArea) {
            uploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadArea.classList.add('dragover');
            });

            uploadArea.addEventListener('dragleave', () => {
                uploadArea.classList.remove('dragover');
            });

            uploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadArea.classList.remove('dragover');
                
                const files = e.dataTransfer.files;
                console.log('Files dropped:', files);
                if (files.length > 0) {
                    this.handleFileUpload(files[0]);
                }
            });
            console.log('Drag and drop events bound');
        }

        // Remove upload
        if (removeBtn) {
            removeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.removeUpload();
            });
            console.log('Remove button event bound');
        }

        // Retake photo
        if (retakeBtn) {
            retakeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.openCameraModal();
            });
            console.log('Retake button event bound');
        }
        
        console.log('Image detection initialized successfully');
    }

    // Handle file upload (for body analysis and auto-fill)
    handleFileUpload(file, fromCamera = false) {
        console.log('File upload started:', file.name, file.type, file.size);
        
        // Validate file type - only images for body analysis
        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            alert('Please upload a valid image file (JPEG, PNG, GIF, WebP)');
            return;
        }

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            alert('File size must be less than 10MB');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            console.log('File loaded successfully, starting analysis...');
            this.displayPreview(file, e.target.result, fromCamera);
            this.analyzeBodyFromImage(file, e.target.result);
        };
        reader.onerror = (e) => {
            console.error('Error reading file:', e);
            alert('Error reading the uploaded file. Please try again.');
        };
        reader.readAsDataURL(file);
    }

    // Analyze body characteristics from image and auto-fill form
    async analyzeBodyFromImage(file, dataUrl) {
        console.log('Starting body analysis...');
        
        const aiAnalysis = document.getElementById('aiAnalysis');
        const analysisSpinner = document.getElementById('analysisSpinner');
        const analysisResults = document.getElementById('analysisResults');

        // Show analysis section
        aiAnalysis.style.display = 'block';
        analysisSpinner.style.display = 'block';
        analysisResults.innerHTML = '<p>🔍 Analyzing your photo to detect physical characteristics...</p>';

        try {
            // Simulate AI processing delay
            await new Promise(resolve => setTimeout(resolve, 2000));

            console.log('Performing image analysis...');
            // Perform actual image analysis for body detection
            const imageAnalysis = await this.performImageAnalysis(dataUrl);
            console.log('Image analysis completed:', imageAnalysis);
            
            const bodyAnalysis = this.generateBodyAnalysisFromImage(imageAnalysis, file.name);
            console.log('Body analysis generated:', bodyAnalysis);
            
            analysisSpinner.style.display = 'none';
            this.displayBodyAnalysisResults(bodyAnalysis);
            
            // Automatically fill form fields immediately
            console.log('Starting auto-fill process...');
            this.autoFillFormFields(bodyAnalysis);
            
            this.aiAnalysisResults = bodyAnalysis;
            
        } catch (error) {
            console.error('Error during analysis:', error);
            analysisSpinner.style.display = 'none';
            analysisResults.innerHTML = '<p style="color: red;">❌ Error analyzing image. Please try again.</p>';
        }
    }

    // Generate body analysis based on image characteristics (simplified and more reliable)
    generateBodyAnalysisFromImage(imageAnalysis, filename) {
        console.log('Generating body analysis from image data...');
        
        // Generate realistic but varied estimates
        const heightOptions = [155, 160, 165, 170, 175, 180, 185];
        const weightOptions = [50, 55, 60, 65, 70, 75, 80, 85];
        const ageOptions = [20, 22, 25, 28, 30, 32, 35, 38, 40];
        const genderOptions = ['male', 'female'];
        
        // Use image characteristics to influence selection
        const brightness = (imageAnalysis.avgColors.r + imageAnalysis.avgColors.g + imageAnalysis.avgColors.b) / 3;
        const aspectRatio = imageAnalysis.aspectRatio;
        const skinRatio = imageAnalysis.skinRatio;
        
        // Height estimation based on aspect ratio
        let heightIndex = Math.floor(aspectRatio * 2) % heightOptions.length;
        if (aspectRatio > 1.5) heightIndex = Math.min(heightIndex + 2, heightOptions.length - 1);
        const height = heightOptions[heightIndex];
        
        // Weight estimation based on height and other factors
        let weightIndex = Math.floor(height / 25) % weightOptions.length;
        if (brightness > 150) weightIndex = Math.max(0, weightIndex - 1); // Brighter images suggest lighter weight
        const weight = weightOptions[weightIndex];
        
        // Age estimation based on image quality and texture
        let ageIndex = Math.floor(imageAnalysis.textureComplexity / 20) % ageOptions.length;
        if (imageAnalysis.totalPixels > 1000000) ageIndex = Math.max(0, ageIndex - 1); // Higher quality suggests younger
        const age = ageOptions[ageIndex];
        
        // Gender estimation (simplified)
        const genderIndex = height > 170 ? 0 : 1; // Taller suggests male, shorter suggests female
        const gender = genderOptions[genderIndex];
        
        // Calculate BMI
        const bmi = (weight / ((height / 100) ** 2)).toFixed(1);
        
        // Determine body type and fitness level
        let bodyType = 'Average';
        let fitnessLevel = 'Moderate';
        
        if (bmi < 18.5) {
            bodyType = 'Slim';
            fitnessLevel = 'Beginner';
        } else if (bmi >= 18.5 && bmi < 25) {
            bodyType = 'Athletic';
            fitnessLevel = skinRatio > 0.3 ? 'Active' : 'Moderate';
        } else if (bmi >= 25 && bmi < 30) {
            bodyType = 'Stocky';
            fitnessLevel = 'Moderate';
        } else {
            bodyType = 'Heavy';
            fitnessLevel = 'Beginner';
        }
        
        // Determine suggested diet and fitness goals
        let suggestedDiet = 'balanced';
        let suggestedGoal = 'maintenance';
        
        if (bmi < 18.5) {
            suggestedDiet = 'high-protein';
            suggestedGoal = 'weight-gain';
        } else if (bmi >= 25) {
            suggestedDiet = 'low-carb';
            suggestedGoal = 'weight-loss';
        } else if (fitnessLevel === 'Active') {
            suggestedDiet = 'high-protein';
            suggestedGoal = 'muscle-gain';
        }
        
        const result = {
            physicalCharacteristics: {
                height: height,
                weight: weight,
                age: age,
                gender: gender,
                genderConfidence: 0.75,
                bmi: parseFloat(bmi),
                bodyType: bodyType,
                fitnessLevel: fitnessLevel
            },
            suggestions: {
                dietType: suggestedDiet,
                fitnessGoal: suggestedGoal,
                activityLevel: this.getActivityLevelFromFitness(fitnessLevel)
            },
            analysisDetails: {
                skinDetection: (skinRatio * 100).toFixed(1),
                imageQuality: imageAnalysis.totalPixels > 500000 ? 'High' : 'Medium',
                aspectRatio: aspectRatio.toFixed(2),
                brightness: brightness.toFixed(1),
                confidence: 0.85
            }
        };
        
        console.log('Generated body analysis:', result);
        return result;
    }

    // Auto-fill form fields with detected characteristics (improved with better error handling)
    autoFillFormFields(analysis) {
        console.log('Auto-filling form fields with:', analysis);
        
        const characteristics = analysis.physicalCharacteristics;
        const suggestions = analysis.suggestions;
        
        // Show auto-fill status immediately
        const autoFillStatus = document.getElementById('autoFillStatus');
        if (autoFillStatus) {
            autoFillStatus.style.display = 'block';
        }
        
        // Auto-fill physical characteristics with staggered animation
        const fillSequence = [
            { field: 'height', value: characteristics.height, delay: 200 },
            { field: 'weight', value: characteristics.weight, delay: 400 },
            { field: 'age', value: characteristics.age, delay: 600 },
            { field: 'gender', value: characteristics.gender, delay: 800 },
            { field: 'dietType', value: suggestions.dietType, delay: 1000 },
            { field: 'fitnessGoal', value: suggestions.fitnessGoal, delay: 1200 },
            { field: 'activityLevel', value: suggestions.activityLevel, delay: 1400 }
        ];
        
        fillSequence.forEach(item => {
            setTimeout(() => {
                console.log(`Filling field ${item.field} with value ${item.value}`);
                this.animateFieldUpdate(item.field, item.value);
            }, item.delay);
        });
        
        // Show success notification
        setTimeout(() => {
            console.log('Showing auto-fill notification');
            this.showAutoFillNotification();
        }, 1600);
    }

    // Animate field updates for better UX (improved with better error handling)
    animateFieldUpdate(fieldId, value) {
        console.log(`Animating field update: ${fieldId} = ${value}`);
        
        const field = document.getElementById(fieldId);
        if (!field) {
            console.error(`Field with ID '${fieldId}' not found`);
            return;
        }

        // Add highlight animation
        field.classList.add('field-updating');
        
        setTimeout(() => {
            try {
                field.value = value;
                field.classList.remove('field-updating');
                field.classList.add('field-updated');
                
                console.log(`Successfully updated field ${fieldId} with value ${value}`);
                
                // Trigger change event to ensure any listeners are notified
                const event = new Event('change', { bubbles: true });
                field.dispatchEvent(event);
                
                // Remove updated class after animation
                setTimeout(() => {
                    field.classList.remove('field-updated');
                }, 1000);
                
            } catch (error) {
                console.error(`Error updating field ${fieldId}:`, error);
            }
        }, 300);
    }

    // Show auto-fill notification (improved)
    showAutoFillNotification() {
        console.log('Showing auto-fill notification');
        
        // Remove any existing notifications first
        const existingNotifications = document.querySelectorAll('.auto-fill-notification');
        existingNotifications.forEach(notification => notification.remove());
        
        const notification = document.createElement('div');
        notification.className = 'auto-fill-notification';
        notification.innerHTML = `
            <i class="fas fa-magic"></i>
            <div class="notification-content">
                <strong>✅ Form Auto-Filled Successfully!</strong>
                <p>Your profile has been automatically completed based on AI analysis of your photo.</p>
            </div>
            <button class="notification-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        const form = document.getElementById('foodForm');
        if (form) {
            form.insertBefore(notification, form.firstChild);
            
            // Auto-remove notification after 10 seconds
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 10000);
        } else {
            console.error('Form element not found');
        }
    }

    // Display body analysis results
    displayBodyAnalysisResults(analysis) {
        const analysisResults = document.getElementById('analysisResults');
        const characteristics = analysis.physicalCharacteristics;
        const details = analysis.analysisDetails;
        
        let html = '<div class="body-analysis-summary">';
        html += `<h5><i class="fas fa-user-md"></i> Detected Physical Characteristics</h5>`;
        html += `<div class="characteristics-grid">`;
        html += `<div class="characteristic-item auto-filled">`;
        html += `<i class="fas fa-ruler-vertical"></i>`;
        html += `<div class="char-info">`;
        html += `<span class="char-label">Height</span>`;
        html += `<span class="char-value">${characteristics.height} cm</span>`;
        html += `</div>`;
        html += `<i class="fas fa-check-circle auto-fill-check"></i>`;
        html += `</div>`;
        
        html += `<div class="characteristic-item auto-filled">`;
        html += `<i class="fas fa-weight"></i>`;
        html += `<div class="char-info">`;
        html += `<span class="char-label">Weight</span>`;
        html += `<span class="char-value">${characteristics.weight} kg</span>`;
        html += `</div>`;
        html += `<i class="fas fa-check-circle auto-fill-check"></i>`;
        html += `</div>`;
        
        html += `<div class="characteristic-item auto-filled">`;
        html += `<i class="fas fa-birthday-cake"></i>`;
        html += `<div class="char-info">`;
        html += `<span class="char-label">Age</span>`;
        html += `<span class="char-value">${characteristics.age} years</span>`;
        html += `</div>`;
        html += `<i class="fas fa-check-circle auto-fill-check"></i>`;
        html += `</div>`;
        
        html += `<div class="characteristic-item auto-filled">`;
        html += `<i class="fas fa-venus-mars"></i>`;
        html += `<div class="char-info">`;
        html += `<span class="char-label">Gender</span>`;
        html += `<span class="char-value">${characteristics.gender.charAt(0).toUpperCase() + characteristics.gender.slice(1)}</span>`;
        html += `</div>`;
        html += `<i class="fas fa-check-circle auto-fill-check"></i>`;
        html += `</div>`;
        
        html += `<div class="characteristic-item">`;
        html += `<i class="fas fa-chart-line"></i>`;
        html += `<div class="char-info">`;
        html += `<span class="char-label">BMI</span>`;
        html += `<span class="char-value">${characteristics.bmi}</span>`;
        html += `</div>`;
        html += `</div>`;
        
        html += `<div class="characteristic-item">`;
        html += `<i class="fas fa-dumbbell"></i>`;
        html += `<div class="char-info">`;
        html += `<span class="char-label">Body Type</span>`;
        html += `<span class="char-value">${characteristics.bodyType}</span>`;
        html += `</div>`;
        html += `</div>`;
        html += `</div></div>`;

        html += '<div class="analysis-details">';
        html += `<h5><i class="fas fa-microscope"></i> Analysis Details</h5>`;
        html += `<div class="detail-metrics">`;
        html += `<span class="detail-metric">👤 Skin Detection: ${details.skinDetection}%</span>`;
        html += `<span class="detail-metric">📐 Aspect Ratio: ${details.aspectRatio}</span>`;
        html += `<span class="detail-metric">💡 Brightness: ${details.brightness}</span>`;
        html += `<span class="detail-metric">🔍 Image Quality: ${details.imageQuality}</span>`;
        html += `<span class="detail-metric">🎯 Confidence: ${Math.round(details.confidence * 100)}%</span>`;
        html += `</div></div>`;

        html += '<div class="auto-suggestions">';
        html += `<h5><i class="fas fa-lightbulb"></i> AI Suggestions (Also Auto-Filled)</h5>`;
        html += `<div class="suggestion-items">`;
        html += `<div class="suggestion-item auto-filled">`;
        html += `<strong>Diet Type:</strong> ${this.formatDietType(analysis.suggestions.dietType)}`;
        html += `<i class="fas fa-check-circle auto-fill-check"></i>`;
        html += `</div>`;
        html += `<div class="suggestion-item auto-filled">`;
        html += `<strong>Fitness Goal:</strong> ${this.formatFitnessGoal(analysis.suggestions.fitnessGoal)}`;
        html += `<i class="fas fa-check-circle auto-fill-check"></i>`;
        html += `</div>`;
        html += `<div class="suggestion-item auto-filled">`;
        html += `<strong>Activity Level:</strong> ${this.formatActivityLevel(analysis.suggestions.activityLevel)}`;
        html += `<i class="fas fa-check-circle auto-fill-check"></i>`;
        html += `</div>`;
        html += `</div></div>`;

        html += '<div class="accuracy-note">';
        html += '<p><i class="fas fa-info-circle"></i> <strong>Note:</strong> These estimates are based on image analysis. You can manually adjust any auto-filled values if needed.</p>';
        html += '</div>';

        analysisResults.innerHTML = html;
    }

    // Initialize camera capture functionality
    initializeCameraCapture() {
        this.currentStream = null;
        this.currentFacingMode = 'user'; // Start with front camera for selfies
        
        // Camera modal controls
        document.getElementById('closeCameraModal').addEventListener('click', () => {
            this.closeCameraModal();
        });

        document.getElementById('capturePhoto').addEventListener('click', () => {
            this.capturePhotoFromCamera();
        });

        document.getElementById('switchCamera').addEventListener('click', () => {
            this.switchCamera();
        });

        document.getElementById('cancelCapture').addEventListener('click', () => {
            this.closeCameraModal();
        });

        // Close modal on background click
        document.getElementById('cameraModal').addEventListener('click', (e) => {
            if (e.target.id === 'cameraModal') {
                this.closeCameraModal();
            }
        });
    }

    // Open camera modal
    async openCameraModal() {
        const modal = document.getElementById('cameraModal');
        modal.style.display = 'flex';
        
        try {
            await this.startCamera();
        } catch (error) {
            console.error('Camera error:', error);
            this.showCameraError(error);
        }
    }

    // Close camera modal
    closeCameraModal() {
        const modal = document.getElementById('cameraModal');
        modal.style.display = 'none';
        this.stopCamera();
    }

    // Start camera stream
    async startCamera() {
        const video = document.getElementById('cameraStream');
        const container = document.querySelector('.camera-container');
        
        // Remove any existing error messages
        const existingError = container.querySelector('.camera-permission-notice');
        if (existingError) {
            existingError.remove();
        }

        try {
            // Stop existing stream
            if (this.currentStream) {
                this.stopCamera();
            }

            // Request camera access
            const constraints = {
                video: {
                    facingMode: this.currentFacingMode,
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                }
            };

            this.currentStream = await navigator.mediaDevices.getUserMedia(constraints);
            video.srcObject = this.currentStream;
            video.style.display = 'block';
            
            // Show camera controls
            document.getElementById('switchCamera').style.display = 'flex';
            
        } catch (error) {
            console.error('Error accessing camera:', error);
            throw error;
        }
    }

    // Stop camera stream
    stopCamera() {
        if (this.currentStream) {
            this.currentStream.getTracks().forEach(track => track.stop());
            this.currentStream = null;
        }
        
        const video = document.getElementById('cameraStream');
        video.srcObject = null;
    }

    // Switch between front and back camera
    async switchCamera() {
        this.currentFacingMode = this.currentFacingMode === 'environment' ? 'user' : 'environment';
        
        try {
            await this.startCamera();
        } catch (error) {
            console.error('Error switching camera:', error);
            // Switch back if failed
            this.currentFacingMode = this.currentFacingMode === 'environment' ? 'user' : 'environment';
        }
    }

    // Capture photo from camera
    capturePhotoFromCamera() {
        const video = document.getElementById('cameraStream');
        const canvas = document.getElementById('captureCanvas');
        const container = document.querySelector('.camera-container');
        
        // Set canvas dimensions to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Draw video frame to canvas
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0);
        
        // Add flash effect
        const flash = document.createElement('div');
        flash.className = 'capture-flash';
        container.appendChild(flash);
        setTimeout(() => flash.remove(), 300);
        
        // Convert canvas to blob
        canvas.toBlob((blob) => {
            // Create file from blob
            const file = new File([blob], `camera-capture-${Date.now()}.jpg`, {
                type: 'image/jpeg'
            });
            
            // Close camera modal
            this.closeCameraModal();
            
            // Process the captured image
            this.handleCameraCapture(file);
        }, 'image/jpeg', 0.9);
    }

    // Handle camera capture
    handleCameraCapture(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            this.displayPreview(file, e.target.result, true);
            this.analyzeImage(file, e.target.result);
        };
        reader.readAsDataURL(file);
    }

    // Show camera error
    showCameraError(error) {
        const container = document.querySelector('.camera-container');
        const video = document.getElementById('cameraStream');
        video.style.display = 'none';
        
        let errorMessage = 'Unable to access camera.';
        let errorDetails = 'Please check your camera permissions and try again.';
        
        if (error.name === 'NotAllowedError') {
            errorMessage = 'Camera access denied';
            errorDetails = 'Please allow camera access in your browser settings and refresh the page.';
        } else if (error.name === 'NotFoundError') {
            errorMessage = 'No camera found';
            errorDetails = 'Please make sure your device has a camera connected.';
        } else if (error.name === 'NotSupportedError') {
            errorMessage = 'Camera not supported';
            errorDetails = 'Your browser or device doesn\'t support camera access.';
        }
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'camera-permission-notice';
        errorDiv.innerHTML = `
            <i class="fas fa-camera-slash"></i>
            <h4>${errorMessage}</h4>
            <p>${errorDetails}</p>
            <button class="retry-camera-btn" onclick="this.parentElement.remove(); document.querySelector('#captureCamera').click();">
                <i class="fas fa-redo"></i> Try Again
            </button>
        `;
        
        container.appendChild(errorDiv);
        
        // Hide camera controls
        document.getElementById('switchCamera').style.display = 'none';
    }

    // Handle file upload (enhanced for mood analysis)
    handleFileUpload(file, fromCamera = false) {
        // Validate file type - only images for mood analysis
        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            alert('Please upload a valid image file (JPEG, PNG, GIF, WebP)');
            return;
        }

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            alert('File size must be less than 10MB');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            this.displayPreview(file, e.target.result, fromCamera);
            this.analyzeMoodFromImage(file, e.target.result);
        };
        reader.readAsDataURL(file);
    }

    // Display preview (for person images only)
    displayPreview(file, dataUrl, fromCamera = false) {
        const uploadContent = document.querySelector('.upload-content');
        const uploadPreview = document.getElementById('uploadPreview');
        const previewImage = document.getElementById('previewImage');
        const retakeBtn = document.getElementById('retakePhoto');

        uploadContent.style.display = 'none';
        uploadPreview.style.display = 'block';

        // Only handle images for person analysis
        previewImage.src = dataUrl;
        previewImage.style.display = 'block';

        // Show retake button only for camera captures
        retakeBtn.style.display = fromCamera ? 'flex' : 'none';
    }

    // Handle file upload
    handleFileUpload(file) {
        // Validate file type
        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm', 'video/ogg'];
        if (!validTypes.includes(file.type)) {
            alert('Please upload a valid image or video file (JPEG, PNG, GIF, WebP, MP4, WebM, OGG)');
            return;
        }

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            alert('File size must be less than 10MB');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            this.displayPreview(file, e.target.result);
            this.analyzeImage(file, e.target.result);
        };
        reader.readAsDataURL(file);
    }

    // Display preview
    displayPreview(file, dataUrl) {
        const uploadContent = document.querySelector('.upload-content');
        const uploadPreview = document.getElementById('uploadPreview');
        const previewImage = document.getElementById('previewImage');
        const previewVideo = document.getElementById('previewVideo');

        uploadContent.style.display = 'none';
        uploadPreview.style.display = 'block';

        if (file.type.startsWith('image/')) {
            previewImage.src = dataUrl;
            previewImage.style.display = 'block';
            previewVideo.style.display = 'none';
        } else if (file.type.startsWith('video/')) {
            previewVideo.src = dataUrl;
            previewVideo.style.display = 'block';
            previewImage.style.display = 'none';
        }
    }

    // Remove upload
    removeUpload() {
        const uploadContent = document.querySelector('.upload-content');
        const uploadPreview = document.getElementById('uploadPreview');
        const aiAnalysis = document.getElementById('aiAnalysis');
        const fileInput = document.getElementById('foodImage');

        uploadContent.style.display = 'flex';
        uploadPreview.style.display = 'none';
        aiAnalysis.style.display = 'none';
        fileInput.value = '';

        this.aiAnalysisResults = null;
    }

    // Analyze mood from image using AI
    async analyzeMoodFromImage(file, dataUrl) {
        const aiAnalysis = document.getElementById('aiAnalysis');
        const analysisSpinner = document.getElementById('analysisSpinner');
        const analysisResults = document.getElementById('analysisResults');

        // Show analysis section
        aiAnalysis.style.display = 'block';
        analysisSpinner.style.display = 'block';
        analysisResults.innerHTML = '<p>Analyzing your facial expression and mood...</p>';

        // Simulate AI processing delay
        await new Promise(resolve => setTimeout(resolve, 2500));

        // Perform actual image analysis for mood detection
        const imageAnalysis = await this.performImageAnalysis(dataUrl);
        const moodAnalysis = this.generateMoodAnalysisFromImage(imageAnalysis, file.name);
        
        analysisSpinner.style.display = 'none';
        this.displayMoodAnalysisResults(moodAnalysis);
        this.aiAnalysisResults = moodAnalysis;
    }

    // Generate mood analysis based on image characteristics
    generateMoodAnalysisFromImage(imageAnalysis, filename) {
        // Analyze image characteristics to determine mood
        const brightness = (imageAnalysis.avgColors.r + imageAnalysis.avgColors.g + imageAnalysis.avgColors.b) / 3;
        const colorVariance = imageAnalysis.textureComplexity;
        const skinRatio = imageAnalysis.skinRatio;
        
        // Determine primary mood based on image analysis
        let primaryMood = 'neutral';
        let moodConfidence = 0.7;
        let energyLevel = 'moderate';
        let stressLevel = 'low';
        
        // Brightness-based mood detection
        if (brightness > 180) {
            primaryMood = Math.random() > 0.5 ? 'happy' : 'excited';
            energyLevel = 'high';
            moodConfidence = 0.8;
        } else if (brightness < 100) {
            primaryMood = Math.random() > 0.5 ? 'tired' : 'sad';
            energyLevel = 'low';
            moodConfidence = 0.75;
        } else {
            // Mid-range brightness - analyze other factors
            if (colorVariance > 40) {
                primaryMood = 'stressed';
                stressLevel = 'high';
                energyLevel = 'moderate';
            } else if (skinRatio > 0.3) {
                primaryMood = 'content';
                energyLevel = 'moderate';
            }
        }
        
        // Add some randomness to simulate real mood detection
        const moodOptions = ['happy', 'sad', 'excited', 'tired', 'stressed', 'content', 'hungry', 'satisfied'];
        if (Math.random() > 0.7) {
            primaryMood = moodOptions[Math.floor(Math.random() * moodOptions.length)];
        }
        
        // Determine secondary emotions
        const secondaryEmotions = this.getSecondaryEmotions(primaryMood);
        
        // Generate food cravings based on mood
        const foodCravings = this.getMoodBasedFoodCravings(primaryMood, energyLevel, stressLevel);
        
        // Generate recommended foods
        const recommendedFoods = this.getRecommendedFoodsForMood(primaryMood, energyLevel);
        
        return {
            primaryMood: primaryMood,
            confidence: moodConfidence,
            energyLevel: energyLevel,
            stressLevel: stressLevel,
            secondaryEmotions: secondaryEmotions,
            foodCravings: foodCravings,
            recommendedFoods: recommendedFoods,
            moodDescription: this.getMoodDescription(primaryMood),
            nutritionalNeeds: this.getNutritionalNeedsForMood(primaryMood, energyLevel, stressLevel),
            imageAnalysisData: {
                brightness: brightness.toFixed(1),
                colorComplexity: colorVariance.toFixed(1),
                faceDetection: skinRatio > 0.2 ? 'Good' : 'Limited',
                analysisConfidence: Math.min(0.6 + skinRatio * 0.4, 0.95)
            }
        };
    }

    // Get secondary emotions based on primary mood
    getSecondaryEmotions(primaryMood) {
        const emotionMap = {
            'happy': ['content', 'energetic', 'social'],
            'sad': ['lonely', 'tired', 'reflective'],
            'excited': ['energetic', 'social', 'adventurous'],
            'tired': ['sluggish', 'unmotivated', 'comfort-seeking'],
            'stressed': ['anxious', 'overwhelmed', 'tense'],
            'content': ['peaceful', 'satisfied', 'balanced'],
            'hungry': ['eager', 'anticipating', 'focused'],
            'satisfied': ['content', 'relaxed', 'fulfilled']
        };
        
        return emotionMap[primaryMood] || ['neutral', 'calm'];
    }

    // Get food cravings based on mood
    getMoodBasedFoodCravings(mood, energy, stress) {
        const cravingMap = {
            'happy': ['fresh fruits', 'light salads', 'colorful vegetables', 'smoothies'],
            'sad': ['comfort foods', 'warm soups', 'chocolate', 'ice cream'],
            'excited': ['spicy foods', 'exotic cuisines', 'energy bars', 'protein shakes'],
            'tired': ['caffeine', 'energy-rich foods', 'nuts', 'dark chocolate'],
            'stressed': ['comfort foods', 'herbal teas', 'magnesium-rich foods', 'calming snacks'],
            'content': ['balanced meals', 'home-cooked food', 'seasonal produce', 'moderate portions'],
            'hungry': ['protein-rich foods', 'filling meals', 'complex carbs', 'satisfying snacks'],
            'satisfied': ['light foods', 'digestive teas', 'fresh fruits', 'minimal portions']
        };
        
        return cravingMap[mood] || ['balanced nutrition', 'regular meals'];
    }

    // Get recommended foods for specific mood
    getRecommendedFoodsForMood(mood, energy) {
        const foodMap = {
            'happy': [
                { name: 'Rainbow Salad Bowl', reason: 'Colorful foods match your bright mood', type: 'healthy' },
                { name: 'Fresh Fruit Smoothie', reason: 'Light and refreshing for positive energy', type: 'energizing' },
                { name: 'Grilled Fish with Vegetables', reason: 'Omega-3s support continued happiness', type: 'nutritious' }
            ],
            'sad': [
                { name: 'Warm Chicken Soup', reason: 'Comfort food to lift your spirits', type: 'comfort' },
                { name: 'Dark Chocolate', reason: 'Natural mood booster with endorphins', type: 'mood-boosting' },
                { name: 'Banana Oatmeal', reason: 'Serotonin-boosting ingredients', type: 'therapeutic' }
            ],
            'excited': [
                { name: 'Spicy Thai Curry', reason: 'Bold flavors match your energy', type: 'adventurous' },
                { name: 'Protein Energy Bowl', reason: 'Sustain your high energy levels', type: 'energizing' },
                { name: 'Green Tea Matcha Latte', reason: 'Focused energy without crash', type: 'stimulating' }
            ],
            'tired': [
                { name: 'Espresso with Almond Croissant', reason: 'Quick energy boost you need', type: 'energizing' },
                { name: 'Iron-Rich Spinach Salad', reason: 'Combat fatigue with nutrients', type: 'revitalizing' },
                { name: 'Greek Yogurt with Berries', reason: 'Protein and natural sugars for energy', type: 'nourishing' }
            ],
            'stressed': [
                { name: 'Chamomile Tea with Honey', reason: 'Calming properties to reduce stress', type: 'calming' },
                { name: 'Avocado Toast', reason: 'Healthy fats support stress management', type: 'soothing' },
                { name: 'Magnesium-Rich Nuts', reason: 'Natural stress relief minerals', type: 'therapeutic' }
            ],
            'content': [
                { name: 'Balanced Buddha Bowl', reason: 'Perfect harmony for your balanced mood', type: 'balanced' },
                { name: 'Seasonal Vegetable Stir-fry', reason: 'Fresh, wholesome nutrition', type: 'wholesome' },
                { name: 'Herbal Tea Blend', reason: 'Maintain your peaceful state', type: 'harmonious' }
            ]
        };
        
        return foodMap[mood] || [
            { name: 'Mixed Green Salad', reason: 'Light and nutritious option', type: 'neutral' },
            { name: 'Grilled Chicken', reason: 'Lean protein for sustained energy', type: 'balanced' }
        ];
    }

    // Get mood description
    getMoodDescription(mood) {
        const descriptions = {
            'happy': 'You appear cheerful and positive! Your bright energy suggests you\'re in a great mood.',
            'sad': 'You seem a bit down today. Let\'s find some comfort foods to help lift your spirits.',
            'excited': 'You look energetic and enthusiastic! Your excitement is contagious.',
            'tired': 'You appear fatigued and could use an energy boost. Let\'s find foods to revitalize you.',
            'stressed': 'You seem tense and overwhelmed. Let\'s focus on calming, stress-reducing foods.',
            'content': 'You look peaceful and satisfied. You\'re in a balanced, harmonious state.',
            'hungry': 'You appear eager and ready to eat! Let\'s find something satisfying.',
            'satisfied': 'You look content and fulfilled. Light, digestive foods would be perfect.'
        };
        
        return descriptions[mood] || 'You have a neutral expression. Let\'s find balanced nutrition for you.';
    }

    // Get nutritional needs based on mood
    getNutritionalNeedsForMood(mood, energy, stress) {
        const needs = {
            'happy': ['Vitamin C for immune support', 'Antioxidants to maintain energy', 'Light, fresh foods'],
            'sad': ['Omega-3 fatty acids for mood', 'Vitamin D supplements', 'Comfort foods in moderation'],
            'excited': ['B-vitamins for sustained energy', 'Protein for muscle support', 'Hydration'],
            'tired': ['Iron for energy', 'Caffeine in moderation', 'Complex carbohydrates'],
            'stressed': ['Magnesium for relaxation', 'Avoid excess caffeine', 'Anti-inflammatory foods'],
            'content': ['Balanced macronutrients', 'Seasonal, whole foods', 'Mindful eating']
        };
        
        return needs[mood] || ['Balanced nutrition', 'Regular meal timing', 'Adequate hydration'];
    }

    // Display mood analysis results
    displayMoodAnalysisResults(analysis) {
        const analysisResults = document.getElementById('analysisResults');
        
        let html = '<div class="mood-analysis-summary">';
        html += `<h5><i class="fas fa-smile"></i> Mood Detection Results</h5>`;
        html += `<div class="mood-display">`;
        html += `<div class="primary-mood">`;
        html += `<span class="mood-emoji">${this.getMoodEmoji(analysis.primaryMood)}</span>`;
        html += `<div class="mood-info">`;
        html += `<h6>Primary Mood: <strong>${analysis.primaryMood.charAt(0).toUpperCase() + analysis.primaryMood.slice(1)}</strong></h6>`;
        html += `<p class="mood-description">${analysis.moodDescription}</p>`;
        html += `<span class="confidence-score">${Math.round(analysis.confidence * 100)}% confident</span>`;
        html += `</div></div>`;
        html += `<div class="mood-metrics">`;
        html += `<span class="mood-metric energy-${analysis.energyLevel}">⚡ Energy: ${analysis.energyLevel}</span>`;
        html += `<span class="mood-metric stress-${analysis.stressLevel}">😰 Stress: ${analysis.stressLevel}</span>`;
        html += `</div></div></div>`;

        html += '<div class="secondary-emotions">';
        html += `<h5><i class="fas fa-heart"></i> Secondary Emotions</h5>`;
        html += `<div class="emotion-tags">`;
        analysis.secondaryEmotions.forEach(emotion => {
            html += `<span class="emotion-tag">${emotion}</span>`;
        });
        html += `</div></div>`;

        html += '<div class="food-cravings">';
        html += `<h5><i class="fas fa-cookie-bite"></i> What You're Craving</h5>`;
        html += `<div class="craving-list">`;
        analysis.foodCravings.forEach(craving => {
            html += `<div class="craving-item">🍽️ ${craving}</div>`;
        });
        html += `</div></div>`;

        html += '<div class="recommended-foods">';
        html += `<h5><i class="fas fa-utensils"></i> Recommended Foods for Your Mood</h5>`;
        analysis.recommendedFoods.forEach(food => {
            html += `<div class="food-recommendation">`;
            html += `<div class="food-header">`;
            html += `<h6>${food.name}</h6>`;
            html += `<span class="food-type-badge ${food.type}">${food.type}</span>`;
            html += `</div>`;
            html += `<p class="food-reason">${food.reason}</p>`;
            html += `</div>`;
        });
        html += `</div>`;

        html += '<div class="nutritional-needs">';
        html += `<h5><i class="fas fa-pills"></i> Nutritional Recommendations</h5>`;
        analysis.nutritionalNeeds.forEach(need => {
            html += `<div class="nutrition-need">💊 ${need}</div>`;
        });
        html += `</div>`;

        html += '<div class="image-analysis-info">';
        html += `<h5><i class="fas fa-camera"></i> Image Analysis Details</h5>`;
        html += `<div class="analysis-metrics">`;
        html += `<span class="analysis-metric">💡 Brightness: ${analysis.imageAnalysisData.brightness}</span>`;
        html += `<span class="analysis-metric">🎨 Color Complexity: ${analysis.imageAnalysisData.colorComplexity}</span>`;
        html += `<span class="analysis-metric">👤 Face Detection: ${analysis.imageAnalysisData.faceDetection}</span>`;
        html += `<span class="analysis-metric">🎯 Confidence: ${Math.round(analysis.imageAnalysisData.analysisConfidence * 100)}%</span>`;
        html += `</div></div>`;

        analysisResults.innerHTML = html;
    }

    // Get mood emoji
    getMoodEmoji(mood) {
        const emojiMap = {
            'happy': '😊',
            'sad': '😢',
            'excited': '🤩',
            'tired': '😴',
            'stressed': '😰',
            'content': '😌',
            'hungry': '🤤',
            'satisfied': '😋'
        };
        return emojiMap[mood] || '😐';
    }

    // Show mood-based food suggestions
    showMoodBasedFoodSuggestions() {
        if (!this.aiAnalysisResults) return;

        // Create a modal or section to show detailed food suggestions
        const modal = document.createElement('div');
        modal.className = 'food-suggestions-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-utensils"></i> Personalized Food Suggestions</h3>
                    <button class="close-modal" onclick="this.parentElement.parentElement.parentElement.remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <p>Based on your <strong>${this.aiAnalysisResults.primaryMood}</strong> mood, here are some perfect food matches:</p>
                    ${this.aiAnalysisResults.recommendedFoods.map(food => `
                        <div class="suggestion-card">
                            <h4>${food.name}</h4>
                            <p>${food.reason}</p>
                            <span class="food-type-badge ${food.type}">${food.type}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }
    async analyzePersonImage(file, dataUrl) {
        const aiAnalysis = document.getElementById('aiAnalysis');
        const analysisSpinner = document.getElementById('analysisSpinner');
        const analysisResults = document.getElementById('analysisResults');

        // Show analysis section
        aiAnalysis.style.display = 'block';
        analysisSpinner.style.display = 'block';
        analysisResults.innerHTML = '<p>Analyzing your photo for body composition and health metrics...</p>';

        // Simulate AI processing delay
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Perform actual image analysis
        const imageAnalysis = await this.performImageAnalysis(dataUrl);
        const mockAnalysis = this.generatePersonAnalysisFromImage(imageAnalysis, file.name);
        
        analysisSpinner.style.display = 'none';
        this.displayPersonAnalysisResults(mockAnalysis);
        this.aiAnalysisResults = mockAnalysis;

        // Auto-prefill form fields immediately after analysis
        this.autoPrefillFormFields(mockAnalysis);
    }

    // Auto-prefill form fields with analysis results
    autoPrefillFormFields(analysis) {
        const physicalMetrics = analysis.physicalMetrics;
        const suggestions = analysis.suggestions;
        
        // Prefill physical measurements with smooth animation
        this.animateFieldUpdate('weight', physicalMetrics.weight);
        this.animateFieldUpdate('height', physicalMetrics.height);
        this.animateFieldUpdate('age', physicalMetrics.estimatedAge);
        
        // Estimate and prefill gender based on image analysis
        const estimatedGender = this.estimateGender(analysis);
        this.animateFieldUpdate('gender', estimatedGender);
        
        // Prefill AI suggestions
        setTimeout(() => {
            this.animateFieldUpdate('dietType', suggestions.dietType);
            this.animateFieldUpdate('fitnessGoal', suggestions.fitnessGoal);
            this.animateFieldUpdate('activityLevel', suggestions.activityLevel);
        }, 500); // Slight delay for better UX

        // Show auto-prefill notification
        this.showAutoPrefillNotification();
        
        // Add visual feedback to the form
        const form = document.getElementById('foodForm');
        form.classList.add('auto-filled');
        setTimeout(() => form.classList.remove('auto-filled'), 2000);
    }

    // Animate field updates for better UX
    animateFieldUpdate(fieldId, value) {
        const field = document.getElementById(fieldId);
        if (!field) return;

        // Add highlight animation
        field.classList.add('field-updating');
        
        setTimeout(() => {
            field.value = value;
            field.classList.remove('field-updating');
            field.classList.add('field-updated');
            
            // Remove updated class after animation
            setTimeout(() => {
                field.classList.remove('field-updated');
            }, 1000);
        }, 200);
    }

    // Estimate gender based on image analysis (simplified approach)
    estimateGender(analysis) {
        // This is a simplified estimation - in a real AI system, this would use
        // more sophisticated computer vision techniques
        const imageData = analysis.imageAnalysisData;
        const physicalMetrics = analysis.physicalMetrics;
        
        // Use statistical tendencies (not stereotypes) for estimation
        // This is just for demo purposes - real systems would use facial recognition
        let genderScore = 0;
        
        // Height-based statistical tendency
        if (physicalMetrics.height > 175) genderScore += 1;
        if (physicalMetrics.height < 165) genderScore -= 1;
        
        // Body composition tendencies
        if (physicalMetrics.bodyFatPercentage < 15) genderScore += 0.5;
        if (physicalMetrics.bodyFatPercentage > 25) genderScore -= 0.5;
        
        // Random factor to simulate AI uncertainty
        genderScore += (Math.random() - 0.5) * 2;
        
        // Return estimation (with disclaimer that this is not always accurate)
        return genderScore > 0 ? 'male' : 'female';
    }

    // Show auto-prefill notification
    showAutoPrefillNotification() {
        const notification = document.createElement('div');
        notification.className = 'auto-prefill-notification';
        notification.innerHTML = `
            <i class="fas fa-magic"></i>
            <div class="notification-content">
                <strong>Form Auto-Filled!</strong>
                <p>Your profile has been automatically filled based on AI analysis of your photo.</p>
            </div>
            <button class="notification-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        const form = document.getElementById('foodForm');
        form.insertBefore(notification, form.firstChild);
        
        // Auto-remove notification after 8 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 8000);
    }

    // Perform actual image analysis using canvas
    async performImageAnalysis(dataUrl) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                // Set canvas size
                canvas.width = img.width;
                canvas.height = img.height;
                
                // Draw image to canvas
                ctx.drawImage(img, 0, 0);
                
                // Get image data
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imageData.data;
                
                // Analyze image properties
                const analysis = this.analyzeImageData(data, canvas.width, canvas.height);
                resolve(analysis);
            };
            img.src = dataUrl;
        });
    }

    // Analyze image data to extract meaningful information
    analyzeImageData(data, width, height) {
        let totalPixels = width * height;
        let skinPixels = 0;
        let darkPixels = 0;
        let brightPixels = 0;
        let colorVariance = 0;
        let avgRed = 0, avgGreen = 0, avgBlue = 0;
        
        // Analyze pixel data
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            
            avgRed += r;
            avgGreen += g;
            avgBlue += b;
            
            // Detect skin tones (simplified)
            if (this.isSkinTone(r, g, b)) {
                skinPixels++;
            }
            
            // Brightness analysis
            const brightness = (r + g + b) / 3;
            if (brightness < 80) darkPixels++;
            if (brightness > 180) brightPixels++;
            
            // Color variance for texture analysis
            colorVariance += Math.abs(r - g) + Math.abs(g - b) + Math.abs(b - r);
        }
        
        avgRed /= totalPixels;
        avgGreen /= totalPixels;
        avgBlue /= totalPixels;
        
        const skinRatio = skinPixels / totalPixels;
        const darkRatio = darkPixels / totalPixels;
        const brightRatio = brightPixels / totalPixels;
        const textureComplexity = colorVariance / totalPixels;
        
        // Aspect ratio analysis (height vs width can indicate body type)
        const aspectRatio = height / width;
        
        return {
            skinRatio,
            darkRatio,
            brightRatio,
            textureComplexity,
            aspectRatio,
            avgColors: { r: avgRed, g: avgGreen, b: avgBlue },
            dimensions: { width, height },
            totalPixels
        };
    }

    // Simple skin tone detection
    isSkinTone(r, g, b) {
        // Simplified skin tone detection algorithm
        return (r > 95 && g > 40 && b > 20 && 
                Math.max(r, g, b) - Math.min(r, g, b) > 15 &&
                Math.abs(r - g) > 15 && r > g && r > b);
    }

    // Generate person analysis based on actual image analysis
    generatePersonAnalysisFromImage(imageAnalysis, filename) {
        // Use image analysis to make educated estimates
        
        // Height estimation based on aspect ratio and image composition
        let heightCm;
        if (imageAnalysis.aspectRatio > 1.5) {
            // Tall/vertical image suggests full body shot
            heightCm = Math.floor(160 + (imageAnalysis.aspectRatio - 1.5) * 40); // 160-200cm
        } else {
            // More square image, might be upper body
            heightCm = Math.floor(155 + Math.random() * 25); // 155-180cm
        }
        heightCm = Math.min(Math.max(heightCm, 150), 195); // Clamp between 150-195cm
        
        // Weight estimation based on skin ratio and image brightness
        let weightKg;
        const skinFactor = Math.min(imageAnalysis.skinRatio * 10, 1); // Normalize skin ratio
        const brightnessFactor = (imageAnalysis.avgColors.r + imageAnalysis.avgColors.g + imageAnalysis.avgColors.b) / (3 * 255);
        
        // More skin visible might indicate lighter clothing or athletic build
        // Brightness can indicate lighting conditions and photo quality
        const baseWeight = 60 + (heightCm - 160) * 0.8; // Base weight relative to height
        const variationFactor = (skinFactor * 0.3 + brightnessFactor * 0.2 + Math.random() * 0.5);
        weightKg = Math.floor(baseWeight + (variationFactor - 0.5) * 30);
        weightKg = Math.min(Math.max(weightKg, 45), 120); // Clamp between 45-120kg
        
        // Age estimation based on image quality and texture complexity
        let estimatedAge;
        const textureScore = Math.min(imageAnalysis.textureComplexity / 50, 1);
        const qualityScore = imageAnalysis.totalPixels / (1920 * 1080); // Relative to HD
        
        // Higher texture complexity might indicate older age (more facial details)
        // Better quality images might be from younger, tech-savvy users
        estimatedAge = Math.floor(25 + textureScore * 20 + (1 - Math.min(qualityScore, 1)) * 15);
        estimatedAge = Math.min(Math.max(estimatedAge, 18), 65); // Clamp between 18-65
        
        // Calculate BMI and determine categories
        const bmi = (weightKg / ((heightCm / 100) ** 2)).toFixed(1);
        
        // Determine BMI category and related suggestions
        let bmiCategory = 'Normal';
        let fitnessLevel = 'Moderate';
        let suggestedGoal = 'maintenance';
        
        if (bmi < 18.5) {
            bmiCategory = 'Underweight';
            fitnessLevel = 'Beginner';
            suggestedGoal = 'weight-gain';
        } else if (bmi >= 25 && bmi < 30) {
            bmiCategory = 'Overweight';
            fitnessLevel = 'Moderate';
            suggestedGoal = 'weight-loss';
        } else if (bmi >= 30) {
            bmiCategory = 'Obese';
            fitnessLevel = 'Beginner';
            suggestedGoal = 'weight-loss';
        } else if (bmi >= 18.5 && bmi < 22) {
            fitnessLevel = 'Active';
            suggestedGoal = 'muscle-gain';
        }

        // Adjust fitness level based on image analysis
        if (imageAnalysis.skinRatio > 0.3) {
            // More skin visible might indicate athletic/active lifestyle
            if (fitnessLevel === 'Beginner') fitnessLevel = 'Moderate';
            else if (fitnessLevel === 'Moderate') fitnessLevel = 'Active';
        }

        // Determine suggested diet based on analysis
        let suggestedDiet = 'balanced';
        if (suggestedGoal === 'weight-loss') {
            suggestedDiet = Math.random() > 0.5 ? 'low-carb' : 'high-protein';
        } else if (suggestedGoal === 'weight-gain') {
            suggestedDiet = 'high-protein';
        } else if (suggestedGoal === 'muscle-gain') {
            suggestedDiet = 'high-protein';
        }

        // Body composition estimates based on BMI and fitness level
        let bodyFatPercentage, muscleMass;
        if (fitnessLevel === 'Active') {
            bodyFatPercentage = Math.floor(10 + Math.random() * 10); // 10-20%
            muscleMass = Math.floor(40 + Math.random() * 15); // 40-55%
        } else if (fitnessLevel === 'Moderate') {
            bodyFatPercentage = Math.floor(15 + Math.random() * 10); // 15-25%
            muscleMass = Math.floor(30 + Math.random() * 15); // 30-45%
        } else {
            bodyFatPercentage = Math.floor(20 + Math.random() * 15); // 20-35%
            muscleMass = Math.floor(25 + Math.random() * 15); // 25-40%
        }

        return {
            physicalMetrics: {
                height: heightCm,
                weight: weightKg,
                bmi: parseFloat(bmi),
                bmiCategory: bmiCategory,
                estimatedAge: estimatedAge,
                bodyFatPercentage: bodyFatPercentage,
                muscleMassPercentage: muscleMass
            },
            fitnessAssessment: {
                level: fitnessLevel,
                confidence: 0.75 + (imageAnalysis.skinRatio * 0.2), // Higher confidence with more visible body
                recommendations: this.getFitnessRecommendations(fitnessLevel, bmiCategory)
            },
            suggestions: {
                dietType: suggestedDiet,
                fitnessGoal: suggestedGoal,
                activityLevel: this.getActivityLevel(fitnessLevel),
                dailyCalories: this.calculateRecommendedCalories(weightKg, heightCm, estimatedAge, suggestedGoal)
            },
            healthInsights: this.getHealthInsights(bmi, bmiCategory, bodyFatPercentage),
            imageAnalysisData: {
                skinRatio: (imageAnalysis.skinRatio * 100).toFixed(1),
                aspectRatio: imageAnalysis.aspectRatio.toFixed(2),
                imageQuality: imageAnalysis.totalPixels > 500000 ? 'High' : 'Medium',
                analysisConfidence: Math.min(0.6 + imageAnalysis.skinRatio * 0.4, 0.95)
            }
        };
    }

    // Get fitness recommendations based on assessment
    getFitnessRecommendations(level, bmiCategory) {
        const recommendations = {
            'Beginner': ['Start with light cardio', 'Focus on basic strength training', 'Gradually increase activity'],
            'Moderate': ['Mix cardio and strength training', 'Aim for 150 minutes weekly activity', 'Include flexibility exercises'],
            'Active': ['High-intensity interval training', 'Advanced strength training', 'Sport-specific activities']
        };
        
        return recommendations[level] || recommendations['Moderate'];
    }

    // Get activity level based on fitness assessment
    getActivityLevel(fitnessLevel) {
        const activityMap = {
            'Beginner': 'light',
            'Moderate': 'moderate',
            'Active': 'active'
        };
        return activityMap[fitnessLevel] || 'moderate';
    }

    // Calculate recommended daily calories
    calculateRecommendedCalories(weight, height, age, goal) {
        // Simplified BMR calculation (Mifflin-St Jeor)
        const bmr = 10 * weight + 6.25 * height - 5 * age + 5; // Assuming male for simplicity
        let calories = bmr * 1.55; // Moderate activity
        
        if (goal === 'weight-loss') {
            calories -= 500;
        } else if (goal === 'weight-gain') {
            calories += 500;
        } else if (goal === 'muscle-gain') {
            calories += 300;
        }
        
        return Math.round(calories);
    }

    // Get health insights based on metrics
    getHealthInsights(bmi, category, bodyFat) {
        const insights = [];
        
        if (category === 'Normal') {
            insights.push('Your BMI is in the healthy range');
            insights.push('Maintain current lifestyle with balanced nutrition');
        } else if (category === 'Underweight') {
            insights.push('Consider increasing caloric intake');
            insights.push('Focus on strength training to build muscle');
        } else if (category === 'Overweight' || category === 'Obese') {
            insights.push('Consider a calorie-controlled diet');
            insights.push('Increase physical activity gradually');
        }
        
        if (bodyFat > 25) {
            insights.push('Consider cardio exercises to reduce body fat');
        } else if (bodyFat < 15) {
            insights.push('Excellent body composition - maintain current routine');
        }
        
        return insights;
    }

    // Display person analysis results with auto-prefill indication
    displayPersonAnalysisResults(analysis) {
        const analysisResults = document.getElementById('analysisResults');
        
        let html = '<div class="auto-prefill-status">';
        html += `<div class="status-header">`;
        html += `<i class="fas fa-check-circle"></i>`;
        html += `<span><strong>Auto-Prefill Complete!</strong> Your form has been automatically filled with the analysis results.</span>`;
        html += `</div></div>`;
        
        html += '<div class="image-analysis-info">';
        html += `<h5><i class="fas fa-camera"></i> Image Analysis Details</h5>`;
        html += `<div class="analysis-metrics">`;
        html += `<span class="analysis-metric">📊 Body Coverage: ${analysis.imageAnalysisData.skinRatio}%</span>`;
        html += `<span class="analysis-metric">📐 Aspect Ratio: ${analysis.imageAnalysisData.aspectRatio}</span>`;
        html += `<span class="analysis-metric">🔍 Image Quality: ${analysis.imageAnalysisData.imageQuality}</span>`;
        html += `<span class="analysis-metric">🎯 Confidence: ${Math.round(analysis.imageAnalysisData.analysisConfidence * 100)}%</span>`;
        html += `</div>`;
        html += `<div class="analysis-explanation">`;
        html += `<p><i class="fas fa-info-circle"></i> <strong>How we analyzed your photo:</strong></p>`;
        html += `<ul>`;
        html += `<li>🔍 <strong>Body Detection:</strong> Found ${analysis.imageAnalysisData.skinRatio}% body coverage in the image</li>`;
        html += `<li>📏 <strong>Height Estimation:</strong> Based on image proportions (${analysis.imageAnalysisData.aspectRatio} ratio)</li>`;
        html += `<li>⚖️ <strong>Weight Estimation:</strong> Calculated from body proportions and image composition</li>`;
        html += `<li>🎂 <strong>Age Estimation:</strong> Analyzed image texture and quality patterns</li>`;
        html += `<li>👤 <strong>Gender Estimation:</strong> Based on statistical analysis of physical characteristics</li>`;
        html += `</ul>`;
        html += `</div></div>`;
        
        html += '<div class="person-analysis-summary">';
        html += `<h5><i class="fas fa-user-md"></i> Physical Assessment (Auto-Filled)</h5>`;
        html += `<div class="metrics-grid">`;
        html += `<div class="metric-item auto-filled-metric">📏 Height: <strong>${analysis.physicalMetrics.height} cm</strong> <i class="fas fa-check"></i></div>`;
        html += `<div class="metric-item auto-filled-metric">⚖️ Weight: <strong>${analysis.physicalMetrics.weight} kg</strong> <i class="fas fa-check"></i></div>`;
        html += `<div class="metric-item auto-filled-metric">🎂 Age: <strong>${analysis.physicalMetrics.estimatedAge} years</strong> <i class="fas fa-check"></i></div>`;
        html += `<div class="metric-item auto-filled-metric">👤 Gender: <strong>${this.estimateGender(analysis) === 'male' ? 'Male' : 'Female'}</strong> <i class="fas fa-check"></i></div>`;
        html += `<div class="metric-item">📊 BMI: <strong>${analysis.physicalMetrics.bmi} (${analysis.physicalMetrics.bmiCategory})</strong></div>`;
        html += `<div class="metric-item">💪 Muscle Mass: <strong>${analysis.physicalMetrics.muscleMassPercentage}%</strong></div>`;
        html += `<div class="metric-item">📈 Body Fat: <strong>${analysis.physicalMetrics.bodyFatPercentage}%</strong></div>`;
        html += `</div></div>`;

        html += '<div class="fitness-assessment">';
        html += `<h5><i class="fas fa-dumbbell"></i> Fitness Assessment (Auto-Filled)</h5>`;
        html += `<div class="fitness-level">`;
        html += `<span class="level-badge level-${analysis.fitnessAssessment.level.toLowerCase()}">${analysis.fitnessAssessment.level} Level</span>`;
        html += `<span class="confidence-score">${Math.round(analysis.fitnessAssessment.confidence * 100)}% confident</span>`;
        html += `</div>`;
        html += `<div class="recommendations">`;
        analysis.fitnessAssessment.recommendations.forEach(rec => {
            html += `<div class="recommendation-item">✓ ${rec}</div>`;
        });
        html += `</div></div>`;

        html += '<div class="ai-suggestions-section">';
        html += '<h5><i class="fas fa-lightbulb"></i> Personalized Recommendations (Auto-Filled)</h5>';
        html += `<div class="suggestion-grid">`;
        html += `<div class="suggestion-item auto-filled-metric">`;
        html += `<strong>Diet Type:</strong> ${this.formatDietType(analysis.suggestions.dietType)} <i class="fas fa-check"></i>`;
        html += `</div>`;
        html += `<div class="suggestion-item auto-filled-metric">`;
        html += `<strong>Fitness Goal:</strong> ${this.formatFitnessGoal(analysis.suggestions.fitnessGoal)} <i class="fas fa-check"></i>`;
        html += `</div>`;
        html += `<div class="suggestion-item auto-filled-metric">`;
        html += `<strong>Activity Level:</strong> ${this.formatActivityLevel(analysis.suggestions.activityLevel)} <i class="fas fa-check"></i>`;
        html += `</div>`;
        html += `<div class="suggestion-item">`;
        html += `<strong>Daily Calories:</strong> ${analysis.suggestions.dailyCalories} kcal`;
        html += `</div>`;
        html += `</div></div>`;

        html += '<div class="health-insights">';
        html += '<h5><i class="fas fa-heart"></i> Health Insights</h5>';
        analysis.healthInsights.forEach(insight => {
            html += `<div class="insight-item">💡 ${insight}</div>`;
        });
        html += '</div>';

        // Add accuracy disclaimer
        html += '<div class="accuracy-disclaimer">';
        html += '<p><i class="fas fa-exclamation-triangle"></i> <strong>Note:</strong> These estimates are based on image analysis and may not be 100% accurate. You can manually adjust any auto-filled values if needed.</p>';
        html += '</div>';

        analysisResults.innerHTML = html;
    }

    // Format activity level for display
    formatActivityLevel(level) {
        const formats = {
            'sedentary': 'Sedentary (little/no exercise)',
            'light': 'Light (1-3 days/week)',
            'moderate': 'Moderate (3-5 days/week)',
            'active': 'Active (6-7 days/week)',
            'very-active': 'Very Active (2x/day)'
        };
        return formats[level] || level;
    }

    // Apply AI analysis to form (now optional since auto-prefill is active)
    applyAIAnalysis() {
        if (!this.aiAnalysisResults) return;

        const suggestions = this.aiAnalysisResults.suggestions;
        const physicalMetrics = this.aiAnalysisResults.physicalMetrics;
        
        // Re-apply all values (in case user changed them)
        document.getElementById('weight').value = physicalMetrics.weight;
        document.getElementById('height').value = physicalMetrics.height;
        document.getElementById('age').value = physicalMetrics.estimatedAge;
        
        const estimatedGender = this.estimateGender(this.aiAnalysisResults);
        document.getElementById('gender').value = estimatedGender;
        
        document.getElementById('dietType').value = suggestions.dietType;
        document.getElementById('fitnessGoal').value = suggestions.fitnessGoal;
        document.getElementById('activityLevel').value = suggestions.activityLevel;

        // Show manual application notification
        this.showManualApplicationNotification();
        
        // Add visual feedback
        const form = document.getElementById('foodForm');
        form.classList.add('success-flash');
        setTimeout(() => form.classList.remove('success-flash'), 600);
    }

    // Show manual application notification
    showManualApplicationNotification() {
        const notification = document.createElement('div');
        notification.className = 'ai-suggestion';
        notification.innerHTML = `
            <i class="fas fa-redo"></i>
            <span>AI suggestions re-applied! All form fields have been updated with the latest analysis.</span>
        `;
        
        const form = document.getElementById('foodForm');
        form.insertBefore(notification, form.firstChild);
        
        // Remove notification after 5 seconds
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }

    // Format diet type for display
    formatDietType(dietType) {
        const formats = {
            'balanced': 'Balanced Diet',
            'vegetarian': 'Vegetarian',
            'vegan': 'Vegan',
            'keto': 'Ketogenic',
            'paleo': 'Paleo',
            'mediterranean': 'Mediterranean',
            'low-carb': 'Low Carb',
            'high-protein': 'High Protein'
        };
        return formats[dietType] || dietType;
    }

    // Format fitness goal for display
    formatFitnessGoal(goal) {
        const formats = {
            'weight-loss': 'Weight Loss',
            'weight-gain': 'Weight Gain',
            'muscle-gain': 'Muscle Gain',
            'maintenance': 'Maintain Weight',
            'endurance': 'Build Endurance'
        };
        return formats[goal] || goal;
    }

    // Check geolocation permissions and provide guidance
    async checkGeolocationPermissions() {
        if (!navigator.permissions) {
            console.log('Permissions API not supported');
            return 'unknown';
        }
        
        try {
            const permission = await navigator.permissions.query({ name: 'geolocation' });
            console.log('Geolocation permission status:', permission.state);
            
            // Listen for permission changes
            permission.addEventListener('change', () => {
                console.log('Geolocation permission changed to:', permission.state);
                this.updateLocationButtonState(permission.state);
            });
            
            return permission.state;
        } catch (error) {
            console.error('Error checking geolocation permissions:', error);
            return 'unknown';
        }
    }
    
    // Update location button based on permission state
    updateLocationButtonState(permissionState) {
        const locationBtn = document.getElementById('getLocation');
        const locationStatus = document.getElementById('locationStatus');
        
        if (!locationBtn || !locationStatus) return;
        
        switch (permissionState) {
            case 'granted':
                locationBtn.innerHTML = '<i class="fas fa-check"></i> Location Access Granted';
                locationBtn.classList.add('success');
                locationStatus.innerHTML = '<i class="fas fa-check-circle"></i> Location access is enabled. Click "Get My Location" to find nearby restaurants.';
                locationStatus.className = 'location-status success';
                break;
                
            case 'denied':
                locationBtn.innerHTML = '<i class="fas fa-times"></i> Location Access Denied';
                locationBtn.classList.add('error');
                locationStatus.innerHTML = `
                    <i class="fas fa-exclamation-circle"></i> 
                    Location access is blocked. To enable:
                    <br><small>
                    • Click the location icon in your browser's address bar
                    <br>• Select "Allow" for location access
                    <br>• Refresh the page and try again
                    </small>
                `;
                locationStatus.className = 'location-status error';
                break;
                
            case 'prompt':
            default:
                locationBtn.innerHTML = '<i class="fas fa-location-arrow"></i> Get My Location';
                locationBtn.classList.remove('success', 'error', 'loading');
                locationStatus.innerHTML = '';
                locationStatus.className = 'location-status';
                break;
        }
    }
    
    // Enhanced Geolocation functionality
    async getCurrentLocation() {
        console.log('Getting current location...');
        const locationBtn = document.getElementById('getLocation');
        const locationStatus = document.getElementById('locationStatus');
        
        if (!locationBtn) {
            console.error('Location button not found!');
            return;
        }
        
        if (!locationStatus) {
            console.error('Location status element not found!');
            return;
        }

        // Check permissions first
        const permissionState = await this.checkGeolocationPermissions();
        
        if (permissionState === 'denied') {
            this.showLocationError(
                'Location access is blocked.',
                'Please enable location access in your browser settings and refresh the page.'
            );
            return;
        }

        // Update button to loading state
        locationBtn.innerHTML = '<div class="geo-loading"></div> Getting Location...';
        locationBtn.disabled = true;
        locationBtn.classList.add('loading');
        
        // Show loading status
        locationStatus.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Requesting location access...';
        locationStatus.className = 'location-status loading';

        // Check if geolocation is supported
        if (!navigator.geolocation) {
            this.showLocationError('Geolocation is not supported by this browser. Please use a modern browser or enable location services.');
            return;
        }

        // Request location with enhanced options
        navigator.geolocation.getCurrentPosition(
            (position) => {
                console.log('Location found:', position.coords);
                this.userLocation = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy
                };
                
                // Show success status
                locationStatus.innerHTML = `
                    <i class="fas fa-check-circle"></i> 
                    Location found successfully! 
                    <small>(Accuracy: ${Math.round(position.coords.accuracy)}m)</small>
                `;
                locationStatus.className = 'location-status success';
                
                // Update button to success state
                locationBtn.innerHTML = '<i class="fas fa-check"></i> Location Found';
                locationBtn.classList.remove('loading');
                locationBtn.classList.add('success');
                locationBtn.disabled = false;
                
                // Show success notification
                UIEnhancements.showNotification('Location found! You\'ll now see nearby restaurants in your recommendations.', 'success', 4000);
                
                // Auto-generate recommendations if form is filled
                this.checkAndAutoGenerateRecommendations();
            },
            (error) => {
                console.error('Geolocation error:', error);
                let errorMessage = 'Unable to retrieve location.';
                let helpText = '';
                
                switch(error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = 'Location access denied.';
                        helpText = 'Please enable location access in your browser settings and try again.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = 'Location information unavailable.';
                        helpText = 'Your device cannot determine your location. Try moving to an area with better GPS signal.';
                        break;
                    case error.TIMEOUT:
                        errorMessage = 'Location request timed out.';
                        helpText = 'The location request took too long. Please try again.';
                        break;
                    default:
                        errorMessage = 'An unknown error occurred.';
                        helpText = 'Please try again or check your browser settings.';
                        break;
                }
                
                this.showLocationError(errorMessage, helpText);
            },
            {
                enableHighAccuracy: true,
                timeout: 15000, // Increased timeout
                maximumAge: 300000 // 5 minutes cache
            }
        );
    }

    showLocationError(message, helpText = '') {
        console.log('Location error:', message);
        const locationBtn = document.getElementById('getLocation');
        const locationStatus = document.getElementById('locationStatus');
        
        if (!locationBtn || !locationStatus) {
            console.error('Location elements not found for error display');
            return;
        }
        
        // Show error status with help text
        locationStatus.innerHTML = `
            <i class="fas fa-exclamation-circle"></i> 
            ${message}
            ${helpText ? `<br><small>${helpText}</small>` : ''}
        `;
        locationStatus.className = 'location-status error';
        
        // Reset button to try again state
        locationBtn.innerHTML = '<i class="fas fa-crosshairs"></i> Try Again';
        locationBtn.disabled = false;
        locationBtn.classList.remove('loading', 'success');
        locationBtn.classList.add('error');
        
        // Remove error class after a delay
        setTimeout(() => {
            locationBtn.classList.remove('error');
        }, 3000);
        
        // Show error notification
        UIEnhancements.showNotification(`Location Error: ${message}`, 'error', 5000);
    }
    
    // Check if form is filled and auto-generate recommendations
    checkAndAutoGenerateRecommendations() {
        const form = document.getElementById('foodForm');
        if (!form) return;
        
        const requiredFields = ['weight', 'height', 'age', 'gender', 'dietType', 'fitnessGoal', 'activityLevel', 'budget'];
        const filledFields = requiredFields.filter(fieldName => {
            const field = document.getElementById(fieldName);
            return field && field.value.trim() !== '';
        });
        
        if (filledFields.length === requiredFields.length) {
            UIEnhancements.showNotification('Form is complete! Generating updated recommendations with your location...', 'info', 3000);
            setTimeout(() => {
                this.handleFormSubmission();
            }, 1000);
        }
    }

    // Form handling
    handleFormSubmission() {
        console.log('Form submission started');
        
        // Remove loading states from buttons
        const loadingButtons = document.querySelectorAll('.btn-loading');
        const removeLoadingStates = () => {
            loadingButtons.forEach(btn => {
                btn.classList.remove('btn-loading');
                btn.disabled = false;
            });
        };
        
        try {
            console.log('Step 1: Collecting user data...');
            this.collectUserData();
            console.log('User data collected:', this.userProfile);
            
            console.log('Step 2: Calculating nutrition goals...');
            this.calculateNutritionGoals();
            console.log('Nutrition goals calculated:', this.userProfile.nutritionGoals);
            
            console.log('Step 3: Generating food recommendations...');
            this.generateFoodRecommendations();
            console.log('Food recommendations generated:', this.userProfile.recommendations?.length || 0, 'items');
            
            console.log('Step 4: Finding nearby locations...');
            this.findNearbyLocations();
            console.log('Nearby locations found:', this.userProfile.nearbyLocations?.length || 0, 'locations');
            
            console.log('Step 5: Displaying results...');
            this.displayResults();
            console.log('Results displayed successfully');
            
            // Show success notification
            if (typeof UIEnhancements !== 'undefined' && UIEnhancements.showNotification) {
                UIEnhancements.showNotification('Recommendations generated successfully!', 'success', 3000);
            }
            
            // Remove loading states
            setTimeout(removeLoadingStates, 1000);
            
        } catch (error) {
            console.error('Error in form submission:', error);
            console.error('Error stack:', error.stack);
            
            // Show error notification
            if (typeof UIEnhancements !== 'undefined' && UIEnhancements.showNotification) {
                UIEnhancements.showNotification(`Error generating recommendations: ${error.message}`, 'error', 5000);
            } else {
                alert(`Error generating recommendations: ${error.message}`);
            }
            
            // Remove loading states on error
            removeLoadingStates();
        }
    }

    // Quick Recommendations for Floating Action Button
    handleQuickRecommendations() {
        // Check if form has any data
        const form = document.getElementById('foodForm');
        const inputs = form.querySelectorAll('input, select');
        const hasData = Array.from(inputs).some(input => input.value.trim() !== '');
        
        if (!hasData) {
            UIEnhancements.showNotification('Please fill out your profile first to get personalized recommendations!', 'warning', 4000);
            
            // Scroll to form
            form.scrollIntoView({ behavior: 'smooth', block: 'start' });
            
            // Highlight the first empty required field
            const firstEmptyRequired = form.querySelector('input[required]:not([value]), select[required]:not([value])');
            if (firstEmptyRequired) {
                firstEmptyRequired.focus();
                firstEmptyRequired.style.animation = 'pulse 1s ease-in-out 3 alternate';
            }
            return;
        }
        
        // Show loading notification
        UIEnhancements.showNotification('Generating your personalized recommendations...', 'info', 2000);
        
        // Trigger form submission
        setTimeout(() => {
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.click();
            }
        }, 500);
    }

    // Fill form with test data for development
    fillTestData() {
        console.log('Filling form with test data...');
        
        // Fill personal information
        document.getElementById('weight').value = '70';
        document.getElementById('height').value = '175';
        document.getElementById('age').value = '30';
        document.getElementById('gender').value = 'male';
        
        // Fill diet and goals
        document.getElementById('dietType').value = 'balanced';
        document.getElementById('fitnessGoal').value = 'muscle-gain';
        document.getElementById('activityLevel').value = 'moderate';
        document.getElementById('budget').value = 'medium';
        
        // Show notification
        UIEnhancements.showNotification('Test data filled! You can now get recommendations.', 'success', 3000);
        
        // Trigger form validation for visual feedback
        const inputs = document.querySelectorAll('#foodForm input, #foodForm select');
        inputs.forEach(input => {
            if (input.value) {
                input.classList.add('is-valid');
            }
        });
    }

    collectUserData() {
        const formData = new FormData(document.getElementById('foodForm'));
        
        this.userProfile = {
            weight: parseInt(formData.get('weight')),
            height: parseInt(formData.get('height')),
            age: parseInt(formData.get('age')),
            gender: formData.get('gender'),
            dietType: formData.get('dietType'),
            fitnessGoal: formData.get('fitnessGoal'),
            activityLevel: formData.get('activityLevel'),
            budget: formData.get('budget'),
            allergies: formData.getAll('allergies')
        };
    }

    // Calculate BMR and daily calorie needs
    calculateNutritionGoals() {
        const { weight, height, age, gender, activityLevel, fitnessGoal } = this.userProfile;
        
        // Calculate BMR using Mifflin-St Jeor Equation
        let bmr;
        if (gender === 'male') {
            bmr = 10 * weight + 6.25 * height - 5 * age + 5;
        } else {
            bmr = 10 * weight + 6.25 * height - 5 * age - 161;
        }

        // Activity multipliers
        const activityMultipliers = {
            'sedentary': 1.2,
            'light': 1.375,
            'moderate': 1.55,
            'active': 1.725,
            'very-active': 1.9
        };

        let dailyCalories = bmr * activityMultipliers[activityLevel];

        // Adjust based on fitness goal
        switch (fitnessGoal) {
            case 'weight-loss':
                dailyCalories -= 500; // 500 calorie deficit
                break;
            case 'weight-gain':
                dailyCalories += 500; // 500 calorie surplus
                break;
            case 'muscle-gain':
                dailyCalories += 300; // Moderate surplus
                break;
        }

        // Calculate macronutrients based on diet type
        const macros = this.calculateMacros(dailyCalories, this.userProfile.dietType);

        this.userProfile.nutritionGoals = {
            calories: Math.round(dailyCalories),
            protein: Math.round(macros.protein),
            carbs: Math.round(macros.carbs),
            fat: Math.round(macros.fat),
            fiber: Math.round(dailyCalories / 1000 * 14), // 14g per 1000 calories
            water: Math.round(weight * 35) // 35ml per kg body weight
        };
    }

    calculateMacros(calories, dietType) {
        let proteinPercent, carbPercent, fatPercent;

        switch (dietType) {
            case 'keto':
                proteinPercent = 0.25;
                carbPercent = 0.05;
                fatPercent = 0.70;
                break;
            case 'high-protein':
                proteinPercent = 0.35;
                carbPercent = 0.35;
                fatPercent = 0.30;
                break;
            case 'low-carb':
                proteinPercent = 0.30;
                carbPercent = 0.20;
                fatPercent = 0.50;
                break;
            default: // balanced, vegetarian, vegan, paleo, mediterranean
                proteinPercent = 0.25;
                carbPercent = 0.45;
                fatPercent = 0.30;
        }

        return {
            protein: (calories * proteinPercent) / 4, // 4 calories per gram
            carbs: (calories * carbPercent) / 4,
            fat: (calories * fatPercent) / 9 // 9 calories per gram
        };
    }

    // Food recommendation system
    generateFoodRecommendations() {
        console.log('Generating food recommendations...');
        const { dietType, fitnessGoal, allergies } = this.userProfile;
        console.log('Diet type:', dietType, 'Fitness goal:', fitnessGoal, 'Allergies:', allergies);
        
        let recommendations = [];
        
        // Check if food database is loaded
        if (!this.foodDatabase || this.foodDatabase.length === 0) {
            console.error('Food database not loaded!');
            this.loadFoodDatabase();
        }
        
        console.log('Food database size:', this.foodDatabase.length);
        
        // Filter foods based on diet type and allergies
        let suitableFoods = this.foodDatabase.filter(food => {
            // Check diet compatibility
            const dietMatch = food.dietTypes.includes(dietType) || food.dietTypes.includes('all') || food.dietTypes.includes('balanced');
            
            // Check allergies
            const allergyMatch = !allergies || allergies.length === 0 || !allergies.some(allergy => food.allergens.includes(allergy));
            
            return dietMatch && allergyMatch;
        });

        console.log('Suitable foods found:', suitableFoods.length);

        // If no suitable foods found, use all foods as fallback
        if (suitableFoods.length === 0) {
            console.log('No suitable foods found, using all foods as fallback');
            suitableFoods = this.foodDatabase.slice();
        }

        // Prioritize foods based on fitness goal
        const goalPriority = {
            'weight-loss': ['low-calorie', 'high-fiber', 'high-protein'],
            'weight-gain': ['high-calorie', 'healthy-fats', 'complex-carbs'],
            'muscle-gain': ['high-protein', 'complex-carbs', 'healthy-fats'],
            'maintenance': ['balanced', 'nutrient-dense'],
            'endurance': ['complex-carbs', 'antioxidants', 'electrolytes']
        };

        const priorities = goalPriority[fitnessGoal] || ['balanced', 'nutrient-dense'];
        console.log('Goal priorities:', priorities);
        
        // Score and sort foods
        suitableFoods.forEach(food => {
            let score = Math.random() * 10; // Base random score
            priorities.forEach((priority, index) => {
                if (food.benefits && food.benefits.includes(priority)) {
                    score += (priorities.length - index) * 10;
                }
            });
            food.score = score;
        });

        // Get top recommendations
        recommendations = suitableFoods
            .sort((a, b) => b.score - a.score)
            .slice(0, 8);

        console.log('Final recommendations:', recommendations);
        this.userProfile.recommendations = recommendations;
        
        // Ensure we have at least some recommendations
        if (recommendations.length === 0) {
            console.log('No recommendations generated, using default foods');
            this.userProfile.recommendations = this.foodDatabase.slice(0, 6);
        }
    }

    // Find nearby restaurants/locations
    findNearbyLocations() {
        const { dietType, budget } = this.userProfile;
        
        // Generate realistic nearby locations with coordinates
        const mockLocations = [
            {
                name: "Green Garden Cafe",
                type: "Vegetarian Restaurant",
                distance: "0.3 miles",
                rating: 4.5,
                priceRange: "medium",
                dietTypes: ["vegetarian", "vegan", "balanced"],
                address: "123 Health Street, Downtown",
                phone: "(555) 123-4567",
                coordinates: this.generateNearbyCoordinates(0.3)
            },
            {
                name: "Protein Palace",
                type: "Health Food Store",
                distance: "0.5 miles",
                rating: 4.2,
                priceRange: "high",
                dietTypes: ["high-protein", "keto", "paleo"],
                address: "456 Fitness Ave, City Center",
                phone: "(555) 234-5678",
                coordinates: this.generateNearbyCoordinates(0.5)
            },
            {
                name: "Mediterranean Delights",
                type: "Mediterranean Restaurant",
                distance: "0.7 miles",
                rating: 4.7,
                priceRange: "medium",
                dietTypes: ["mediterranean", "balanced"],
                address: "789 Olive Branch Rd, Midtown",
                phone: "(555) 345-6789",
                coordinates: this.generateNearbyCoordinates(0.7)
            },
            {
                name: "Keto Kitchen",
                type: "Specialty Restaurant",
                distance: "0.8 miles",
                rating: 4.3,
                priceRange: "high",
                dietTypes: ["keto", "low-carb"],
                address: "321 Low Carb Lane, Uptown",
                phone: "(555) 456-7890",
                coordinates: this.generateNearbyCoordinates(0.8)
            },
            {
                name: "Fresh Market",
                type: "Grocery Store",
                distance: "1.2 miles",
                rating: 4.0,
                priceRange: "low",
                dietTypes: ["all"],
                address: "654 Market Square, Shopping District",
                phone: "(555) 567-8901",
                coordinates: this.generateNearbyCoordinates(1.2)
            },
            {
                name: "Organic Oasis",
                type: "Organic Food Store",
                distance: "0.9 miles",
                rating: 4.6,
                priceRange: "high",
                dietTypes: ["vegetarian", "vegan", "balanced"],
                address: "987 Organic Way, Green Valley",
                phone: "(555) 678-9012",
                coordinates: this.generateNearbyCoordinates(0.9)
            },
            {
                name: "Paleo Paradise",
                type: "Paleo Restaurant",
                distance: "1.1 miles",
                rating: 4.4,
                priceRange: "high",
                dietTypes: ["paleo", "balanced"],
                address: "147 Caveman Court, Stone Age Plaza",
                phone: "(555) 789-0123",
                coordinates: this.generateNearbyCoordinates(1.1)
            },
            {
                name: "Balanced Bites",
                type: "Healthy Fast Food",
                distance: "0.4 miles",
                rating: 4.1,
                priceRange: "medium",
                dietTypes: ["balanced", "vegetarian"],
                address: "258 Quick Healthy St, Fast Lane",
                phone: "(555) 890-1234",
                coordinates: this.generateNearbyCoordinates(0.4)
            }
        ];

        // Filter locations based on diet type and budget
        const suitableLocations = mockLocations.filter(location => {
            const budgetMatch = this.checkBudgetMatch(location.priceRange, budget);
            const dietMatch = location.dietTypes.includes(dietType) || location.dietTypes.includes("all");
            return budgetMatch && dietMatch;
        });

        // Sort by distance and take top 5
        const sortedLocations = suitableLocations.sort((a, b) => {
            const distanceA = parseFloat(a.distance);
            const distanceB = parseFloat(b.distance);
            return distanceA - distanceB;
        });

        this.userProfile.nearbyLocations = sortedLocations.slice(0, 5);
    }

    // Generate realistic nearby coordinates based on distance
    generateNearbyCoordinates(distanceMiles) {
        if (!this.userLocation) {
            // Default coordinates (San Francisco) if no user location
            return {
                lat: 37.7749 + (Math.random() - 0.5) * 0.02,
                lng: -122.4194 + (Math.random() - 0.5) * 0.02
            };
        }

        // Convert miles to approximate degrees (rough conversion)
        const degreeOffset = distanceMiles * 0.0145; // Approximately 1 mile = 0.0145 degrees
        
        // Generate random direction
        const angle = Math.random() * 2 * Math.PI;
        const latOffset = Math.cos(angle) * degreeOffset * (0.8 + Math.random() * 0.4);
        const lngOffset = Math.sin(angle) * degreeOffset * (0.8 + Math.random() * 0.4);

        return {
            lat: this.userLocation.latitude + latOffset,
            lng: this.userLocation.longitude + lngOffset
        };
    }

    // Generate Google Maps URL
    generateGoogleMapsUrl(location) {
        const { lat, lng } = location.coordinates;
        const query = encodeURIComponent(`${location.name}, ${location.address}`);
        
        // Create Google Maps URL with the location
        return `https://www.google.com/maps/search/?api=1&query=${query}&center=${lat},${lng}`;
    }

    checkBudgetMatch(locationPrice, userBudget) {
        const priceMapping = {
            'low': ['low'],
            'medium': ['low', 'medium'],
            'high': ['low', 'medium', 'high'],
            'premium': ['low', 'medium', 'high', 'premium']
        };
        
        return priceMapping[userBudget]?.includes(locationPrice) || false;
    }

    // Display results
    displayResults() {
        this.displayNutritionGoals();
        this.displayFoodRecommendations();
        this.displayNearbyLocations();
        
        // Show results section
        document.getElementById('results').style.display = 'block';
        document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
        
        // Show separate nearby restaurants section if there are locations
        if (this.userProfile.nearbyLocations && this.userProfile.nearbyLocations.length > 0) {
            const restaurantsSection = document.getElementById('nearbyRestaurantsSection');
            if (restaurantsSection) {
                restaurantsSection.style.display = 'block';
                
                // Scroll to restaurants section after a delay
                setTimeout(() => {
                    restaurantsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 1500);
            }
        }
    }

    displayNutritionGoals() {
        const container = document.getElementById('nutritionContent'); // Fixed: use nutritionContent instead of nutritionGoals
        const goals = this.userProfile.nutritionGoals;
        
        if (!goals) {
            console.error('Nutrition goals not calculated!');
            container.innerHTML = '<p>Error calculating nutrition goals.</p>';
            return;
        }
        
        container.innerHTML = `
            <div class="nutrition-item">
                <span class="nutrition-label">Daily Calories</span>
                <span class="nutrition-value">${goals.calories} kcal</span>
            </div>
            <div class="nutrition-item">
                <span class="nutrition-label">Protein</span>
                <span class="nutrition-value">${goals.protein}g</span>
            </div>
            <div class="nutrition-item">
                <span class="nutrition-label">Carbohydrates</span>
                <span class="nutrition-value">${goals.carbs}g</span>
            </div>
            <div class="nutrition-item">
                <span class="nutrition-label">Fats</span>
                <span class="nutrition-value">${goals.fats}g</span>
            </div>
            <div class="nutrition-summary">
                <p><strong>BMR:</strong> ${goals.bmr} kcal/day</p>
                <p><strong>Goal:</strong> ${this.formatFitnessGoal(this.userProfile.fitnessGoal)}</p>
            </div>

            <div class="nutrition-item">
                <span class="nutrition-label">Protein</span>
                <span class="nutrition-value">${goals.protein}g</span>
            </div>
            <div class="nutrition-item">
                <span class="nutrition-label">Carbohydrates</span>
                <span class="nutrition-value">${goals.carbs}g</span>
            </div>
            <div class="nutrition-item">
                <span class="nutrition-label">Fat</span>
                <span class="nutrition-value">${goals.fat}g</span>
            </div>
            <div class="nutrition-item">
                <span class="nutrition-label">Fiber</span>
                <span class="nutrition-value">${goals.fiber}g</span>
            </div>
            <div class="nutrition-item">
                <span class="nutrition-label">Water</span>
                <span class="nutrition-value">${goals.water}ml</span>
            </div>
        `;
    }

    displayFoodRecommendations() {
        console.log('Displaying food recommendations...');
        const container = document.getElementById('foodContent'); // Fixed: use foodContent instead of foodRecommendations
        const recommendations = this.userProfile.recommendations;
        
        console.log('Container found:', !!container);
        console.log('Recommendations:', recommendations);
        
        if (!container) {
            console.error('Food content container not found!');
            return;
        }
        
        if (!recommendations || recommendations.length === 0) {
            console.log('No recommendations available, showing empty state');
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-utensils"></i>
                    <h4>No Food Recommendations Available</h4>
                    <p>Complete your profile to get personalized food suggestions.</p>
                </div>
            `;
            return;
        }
        
        console.log(`Displaying ${recommendations.length} recommendations`);
        
        // Group recommendations by category
        const categories = {
            'high-protein': { name: 'High Protein Foods', icon: 'fas fa-dumbbell', color: 'protein', description: 'Perfect for muscle building and recovery' },
            'low-calorie': { name: 'Low Calorie Options', icon: 'fas fa-leaf', color: 'lowcal', description: 'Great for weight management and healthy eating' },
            'healthy-fats': { name: 'Healthy Fats', icon: 'fas fa-heart', color: 'healthy', description: 'Essential fats for brain and heart health' },
            'complex-carbs': { name: 'Complex Carbohydrates', icon: 'fas fa-seedling', color: 'carbs', description: 'Sustained energy for your active lifestyle' },
            'nutrient-dense': { name: 'Nutrient Dense Foods', icon: 'fas fa-star', color: 'nutrient', description: 'Maximum nutrition in every bite' },
            'antioxidants': { name: 'Antioxidant Rich', icon: 'fas fa-shield-alt', color: 'antioxidant', description: 'Powerful protection against free radicals' }
        };
        
        // Group foods by their primary benefit
        const groupedFoods = {};
        recommendations.forEach(food => {
            const primaryBenefit = food.benefits[0] || 'nutrient-dense';
            if (!groupedFoods[primaryBenefit]) {
                groupedFoods[primaryBenefit] = [];
            }
            groupedFoods[primaryBenefit].push(food);
        });
        
        // If no grouped foods, create a default category
        if (Object.keys(groupedFoods).length === 0) {
            groupedFoods['nutrient-dense'] = recommendations;
        }
        
        let html = `
            <div class="food-recommendations-header">
                <div class="recommendations-title">
                    <h3>Personalized for Your Goals</h3>
                    <p>Based on your ${this.formatDietType(this.userProfile.dietType)} diet and ${this.formatFitnessGoal(this.userProfile.fitnessGoal)} goal</p>
                </div>
                <div class="recommendations-stats">
                    <div class="stat-item">
                        <span class="stat-number">${recommendations.length}</span>
                        <span class="stat-label">Foods</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number">${Object.keys(groupedFoods).length}</span>
                        <span class="stat-label">Categories</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number">${this.userProfile.nutritionGoals?.calories || 2000}</span>
                        <span class="stat-label">Daily Calories</span>
                    </div>
                </div>
            </div>
        `;
        
        // Create collapsible sections
        html += '<div class="food-categories-accordion">';
        
        Object.entries(groupedFoods).forEach(([categoryKey, foods], index) => {
            const category = categories[categoryKey] || categories['nutrient-dense'];
            const isFirstOpen = index === 0; // First category open by default
            
            html += `
                <div class="food-category-section ${category.color}" data-category="${categoryKey}">
                    <div class="category-header ${isFirstOpen ? 'active' : ''}" onclick="foodWise.toggleFoodCategory('${categoryKey}')">
                        <div class="category-info">
                            <i class="${category.icon}"></i>
                            <div>
                                <h4>${category.name}</h4>
                                <p>${category.description}</p>
                            </div>
                        </div>
                        <div class="category-toggle">
                            <span class="food-count">${foods.length}</span>
                            <i class="fas fa-chevron-down"></i>
                        </div>
                    </div>
                    <div class="category-content ${isFirstOpen ? 'active' : ''}">
                        <div class="food-grid">
            `;
            
            foods.forEach(food => {
                html += `
                    <div class="food-recommendation-card" data-food="${food.name}">
                        <div class="food-header">
                            <h5>${food.name}</h5>
                            <div class="food-score">${Math.round(food.score || 75)}</div>
                        </div>
                        <p class="food-description">${food.description}</p>
                        <div class="food-benefits">
                            ${food.benefits.slice(0, 3).map(benefit => 
                                `<span class="benefit-tag">${benefit.replace('-', ' ')}</span>`
                            ).join('')}
                        </div>
                        <div class="food-actions">
                            <button class="add-to-plan-btn" onclick="foodWise.addToMealPlan('${food.name}')">
                                <i class="fas fa-plus"></i> Add to Plan
                            </button>
                        </div>
                    </div>
                `;
            });
            
            html += `
                        </div>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        
        container.innerHTML = html;
        console.log('Food recommendations displayed successfully');
        
        // Animate cards in
        setTimeout(() => {
            const cards = container.querySelectorAll('.food-recommendation-card');
            cards.forEach((card, index) => {
                setTimeout(() => {
                    card.classList.add('animate-in');
                }, index * 100);
            });
        }, 100);
    
        
        // Create collapsible sections
        html += '<div class="food-categories-accordion">';
        
        Object.entries(groupedFoods).forEach(([categoryKey, foods], index) => {
            const category = categories[categoryKey] || categories['nutrient-dense'];
            const isFirstOpen = index === 0; // First category open by default
            
            html += `
                <div class="food-category-section ${category.color}" data-category="${categoryKey}">
                    <div class="category-header ${isFirstOpen ? 'active' : ''}" onclick="foodWise.toggleFoodCategory('${categoryKey}')">
                        <div class="category-info">
                            <div class="category-icon ${category.color}">
                                <i class="${category.icon}"></i>
                            </div>
                            <div class="category-details">
                                <h3>${category.name}</h3>
                                <p>${category.description}</p>
                                <span class="food-count">${foods.length} food${foods.length !== 1 ? 's' : ''}</span>
                            </div>
                        </div>
                        <div class="category-toggle">
                            <i class="fas fa-chevron-down"></i>
                        </div>
                    </div>
                    
                    <div class="category-content ${isFirstOpen ? 'expanded' : ''}" id="category-${categoryKey}">
                        <div class="category-foods-grid">
                            ${foods.map((food, foodIndex) => {
                                const isVegetarian = food.dietTypes && (food.dietTypes.includes('vegetarian') || food.dietTypes.includes('vegan'));
                                const isKeto = food.dietTypes && food.dietTypes.includes('keto');
                                const isPaleo = food.dietTypes && food.dietTypes.includes('paleo');
                                
                                return `
                                    <div class="food-recommendation-card ${category.color}" data-index="${foodIndex}">
                                        <div class="food-card-header">
                                            <div class="food-diet-badges">
                                                ${isVegetarian ? '<span class="diet-badge vegetarian"><i class="fas fa-leaf"></i></span>' : ''}
                                                ${isKeto ? '<span class="diet-badge keto">KETO</span>' : ''}
                                                ${isPaleo ? '<span class="diet-badge paleo">PALEO</span>' : ''}
                                            </div>
                                            <div class="compatibility-score-mini">
                                                <span class="score-number">${this.calculateFoodScore(food)}%</span>
                                            </div>
                                        </div>
                                        
                                        <div class="food-card-content">
                                            <h4 class="food-name">${food.name}</h4>
                                            <p class="food-description">${food.description}</p>
                                            
                                            <div class="food-benefits-section">
                                                <div class="benefits-list">
                                                    ${(food.benefits || []).slice(0, 3).map(benefit => `
                                                        <span class="benefit-tag">
                                                            <i class="fas fa-check"></i>
                                                            ${this.formatBenefit(benefit)}
                                                        </span>
                                                    `).join('')}
                                                </div>
                                            </div>
                                            
                                            ${food.allergens && food.allergens.length > 0 ? `
                                                <div class="allergen-warning">
                                                    <i class="fas fa-exclamation-triangle"></i>
                                                    <span>Contains: ${food.allergens.join(', ')}</span>
                                                </div>
                                            ` : ''}
                                        </div>
                                        
                                        <div class="food-card-footer">
                                            <button class="add-to-plan-btn" onclick="foodWise.addToMealPlan('${food.name}')">
                                                <i class="fas fa-plus"></i>
                                                Add to Plan
                                            </button>
                                        </div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        
        // Add meal planning section
        html += `
            <div class="meal-planning-section">
                <div class="meal-plan-header">
                    <h3><i class="fas fa-calendar-alt"></i> Quick Meal Ideas</h3>
                    <p>Combine these foods for balanced meals throughout your day</p>
                </div>
                <div class="meal-ideas-grid">
                    ${this.generateMealIdeas(recommendations).map(meal => `
                        <div class="meal-idea-card">
                            <div class="meal-time">
                                <i class="${meal.icon}"></i>
                                <span>${meal.time}</span>
                            </div>
                            <h4>${meal.name}</h4>
                            <div class="meal-ingredients">
                                ${meal.ingredients.map(ingredient => `
                                    <span class="ingredient-tag">${ingredient}</span>
                                `).join('')}
                            </div>
                            <div class="meal-nutrition">
                                <span class="nutrition-stat">
                                    <i class="fas fa-fire"></i>
                                    ${meal.calories} cal
                                </span>
                                <span class="nutrition-stat">
                                    <i class="fas fa-dumbbell"></i>
                                    ${meal.protein}g protein
                                </span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
        container.innerHTML = html;
        
        // Add animation to the first category (which is open by default)
        setTimeout(() => {
            const firstCategoryCards = container.querySelectorAll('.food-category-section:first-child .food-recommendation-card');
            firstCategoryCards.forEach((card, index) => {
                setTimeout(() => {
                    card.classList.add('animate-in');
                }, index * 100);
            });
        }, 100);
    }

    // Toggle food category accordion
    toggleFoodCategory(categoryKey) {
        const header = document.querySelector(`[data-category="${categoryKey}"] .category-header`);
        const content = document.getElementById(`category-${categoryKey}`);
        const chevron = header.querySelector('.fa-chevron-down');
        
        if (!header || !content || !chevron) {
            console.error('Could not find category elements for:', categoryKey);
            return;
        }
        
        // Close all other categories
        document.querySelectorAll('.category-header.active').forEach(activeHeader => {
            if (activeHeader !== header) {
                activeHeader.classList.remove('active');
                const activeContent = activeHeader.parentElement.querySelector('.category-content');
                const activeChevron = activeHeader.querySelector('.fa-chevron-down');
                if (activeContent) activeContent.classList.remove('expanded');
                if (activeChevron) activeChevron.style.transform = 'rotate(0deg)';
            }
        });
        
        // Toggle current category
        const isExpanded = content.classList.contains('expanded');
        
        if (isExpanded) {
            // Collapse
            header.classList.remove('active');
            content.classList.remove('expanded');
            chevron.style.transform = 'rotate(0deg)';
        } else {
            // Expand
            header.classList.add('active');
            content.classList.add('expanded');
            chevron.style.transform = 'rotate(180deg)';
            
            // Animate cards in
            setTimeout(() => {
                const cards = content.querySelectorAll('.food-recommendation-card');
                cards.forEach((card, index) => {
                    card.classList.remove('animate-in');
                    setTimeout(() => {
                        card.classList.add('animate-in');
                    }, index * 50);
                });
            }, 100);
        }
    }

    // Calculate food compatibility score
    calculateFoodScore(food) {
        let score = 70; // Base score
        
        const userDiet = this.userProfile.dietType;
        const userGoal = this.userProfile.fitnessGoal;
        const userAllergies = this.userProfile.allergies || [];
        
        // Diet compatibility
        if (food.dietTypes.includes(userDiet)) {
            score += 15;
        }
        
        // Goal alignment
        const goalBenefits = {
            'weight-loss': ['low-calorie', 'fiber', 'high-protein'],
            'weight-gain': ['high-calorie', 'healthy-fats', 'complex-carbs'],
            'muscle-gain': ['high-protein', 'complete-amino', 'muscle-building'],
            'maintenance': ['balanced', 'nutrient-dense'],
            'endurance': ['complex-carbs', 'antioxidants', 'energy-boost']
        };
        
        const relevantBenefits = goalBenefits[userGoal] || [];
        const matchingBenefits = food.benefits.filter(benefit => relevantBenefits.includes(benefit));
        score += matchingBenefits.length * 5;
        
        // Allergy penalty
        if (food.allergens && food.allergens.some(allergen => userAllergies.includes(allergen))) {
            score -= 30;
        }
        
        return Math.min(Math.max(score, 0), 100);
    }

    // Format benefit names for display
    formatBenefit(benefit) {
        const benefitMap = {
            'high-protein': 'High Protein',
            'low-calorie': 'Low Calorie',
            'healthy-fats': 'Healthy Fats',
            'complex-carbs': 'Complex Carbs',
            'nutrient-dense': 'Nutrient Dense',
            'antioxidants': 'Rich in Antioxidants',
            'fiber': 'High Fiber',
            'iron': 'Iron Rich',
            'vitamin-e': 'Vitamin E',
            'omega-3': 'Omega-3 Fatty Acids',
            'probiotics': 'Probiotic Benefits',
            'complete-amino': 'Complete Amino Acids',
            'muscle-building': 'Muscle Building',
            'energy-boost': 'Energy Boosting',
            'heart-healthy': 'Heart Healthy',
            'brain-food': 'Brain Food',
            'immune-boost': 'Immune Support'
        };
        
        return benefitMap[benefit] || benefit.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
    }

    // Generate meal ideas based on recommended foods
    generateMealIdeas(foods) {
        const mealTemplates = [
            {
                time: 'Breakfast',
                icon: 'fas fa-sun',
                name: 'Power Start Bowl',
                baseCalories: 350,
                baseProtein: 20
            },
            {
                time: 'Lunch',
                icon: 'fas fa-clock',
                name: 'Balanced Energy Plate',
                baseCalories: 450,
                baseProtein: 25
            },
            {
                time: 'Dinner',
                icon: 'fas fa-moon',
                name: 'Recovery Feast',
                baseCalories: 550,
                baseProtein: 30
            }
        ];
        
        return mealTemplates.map(template => {
            // Select 3-4 foods for each meal
            const mealFoods = foods.slice(0, 4).map(food => food.name);
            
            return {
                ...template,
                ingredients: mealFoods,
                calories: template.baseCalories + Math.floor(Math.random() * 100),
                protein: template.baseProtein + Math.floor(Math.random() * 10)
            };
        });
    }

    // Add food to meal plan (placeholder function)
    addToMealPlan(foodName) {
        // Create a visual feedback
        const notification = document.createElement('div');
        notification.className = 'meal-plan-notification';
        notification.innerHTML = `
            <i class="fas fa-check"></i>
            <span>${foodName} added to your meal plan!</span>
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    displayNearbyLocations() {
        console.log('Displaying nearby locations...');
        const container = document.getElementById('locationContent'); // Fixed: use locationContent instead of nearbyLocations
        const locations = this.userProfile.nearbyLocations;
        
        console.log('Location container found:', !!container);
        console.log('User location:', this.userLocation);
        console.log('Nearby locations:', locations);
        
        if (!container) {
            console.error('Location content container not found!');
            return;
        }
        
        if (!this.userLocation) {
            container.innerHTML = `
                <div class="location-notice">
                    <div class="location-notice-icon">
                        <i class="fas fa-map-marker-alt"></i>
                    </div>
                    <div class="location-notice-content">
                        <h4>Enable Location for Personalized Restaurant Recommendations</h4>
                        <p>Get nearby restaurants and food stores with Google Maps integration, plus personalized menu recommendations based on your dietary preferences.</p>
                        <div class="location-benefits">
                            <div class="benefit-item">
                                <i class="fas fa-utensils"></i>
                                <span>Restaurant recommendations near you</span>
                            </div>
                            <div class="benefit-item">
                                <i class="fas fa-route"></i>
                                <span>Directions via Google Maps</span>
                            </div>
                            <div class="benefit-item">
                                <i class="fas fa-star"></i>
                                <span>Top dishes for your diet goals</span>
                            </div>
                        </div>
                        <button onclick="document.getElementById('getLocation').click()" class="enable-location-btn">
                            <i class="fas fa-crosshairs"></i> Enable Location Access
                        </button>
                        <p class="privacy-note">
                            <i class="fas fa-shield-alt"></i>
                            Your location is only used locally and never stored or shared.
                        </p>
                    </div>
                </div>
            `;
            return;
        }
        
        if (!locations || locations.length === 0) {
            container.innerHTML = `
                <div class="location-notice">
                    <div class="location-notice-icon">
                        <i class="fas fa-search"></i>
                    </div>
                    <div class="location-notice-content">
                        <h4>No Suitable Locations Found</h4>
                        <p>We couldn't find restaurants matching your preferences nearby. Try:</p>
                        <ul>
                            <li>Adjusting your budget preferences</li>
                            <li>Selecting a different diet type</li>
                            <li>Expanding your search radius</li>
                        </ul>
                        <button onclick="foodWise.findNearbyLocations(); foodWise.displayNearbyLocations();" class="retry-search-btn">
                            <i class="fas fa-redo"></i> Search Again
                        </button>
                    </div>
                </div>
            `;
            return;
        }
        
        console.log(`Displaying ${locations.length} nearby locations`);
        
        let html = `
            <div class="locations-header">
                <h3>
                    <i class="fas fa-map-marker-alt"></i>
                    Found ${locations.length} locations near you
                </h3>
                <p>Personalized recommendations based on your ${this.formatDietType(this.userProfile.dietType)} diet</p>
            </div>
            <div class="locations-grid">
        `;
        
        html += locations.map((location, index) => {
            const topDishes = this.getTopDishesForLocation(location.name);
            
            return `
                <div class="location-item" data-index="${index}">
                    <div class="location-header">
                        <div class="location-info">
                            <div class="location-name">${location.name}</div>
                            <div class="location-type">${location.type}</div>
                        </div>
                        <div class="location-rating">
                            <span class="rating-stars">${'★'.repeat(Math.floor(location.rating))}${'☆'.repeat(5-Math.floor(location.rating))}</span>
                            <span class="rating-number">${location.rating}/5</span>
                        </div>
                    </div>
                    
                    <div class="location-details">
                        <div class="location-address">
                            <i class="fas fa-map-marker-alt"></i>
                            ${location.address}
                        </div>
                        <div class="location-contact">
                            <i class="fas fa-phone"></i>
                            ${location.phone}
                        </div>
                        <div class="location-distance">
                            <i class="fas fa-walking"></i>
                            ${location.distance} away
                        </div>
                        <div class="location-price">
                            <i class="fas fa-dollar-sign"></i>
                            ${location.priceRange.charAt(0).toUpperCase() + location.priceRange.slice(1)} price range
                        </div>
                    </div>
                    
                    ${topDishes.length > 0 ? `
                        <div class="recommended-dishes">
                            <h4><i class="fas fa-star"></i> Top Recommended Dishes for You</h4>
                            <div class="dishes-grid">
                                ${topDishes.map(dish => `
                                    <div class="dish-card">
                                        <div class="dish-header">
                                            <div class="dish-name">${dish.name}</div>
                                            <div class="dish-price">${dish.price}</div>
                                            ${dish.popular ? '<span class="popular-badge">Popular</span>' : ''}
                                        </div>
                                        <div class="dish-description">${dish.description}</div>
                                        <div class="dish-nutrition">
                                            <span class="nutrition-item">
                                                <i class="fas fa-fire"></i> ${dish.calories} cal
                                            </span>
                                            <span class="nutrition-item">
                                                <i class="fas fa-dumbbell"></i> ${dish.protein}g protein
                                            </span>
                                            <span class="dish-rating">⭐ ${dish.rating}</span>
                                        </div>
                                        <div class="dish-benefits">
                                            ${dish.benefits ? dish.benefits.slice(0, 2).map(benefit => 
                                                `<span class="benefit-tag">${this.formatBenefit(benefit)}</span>`
                                            ).join('') : ''}
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}
                    
                    <div class="location-actions">
                        <a href="${this.generateGoogleMapsUrl(location)}" 
                           target="_blank" 
                           class="maps-btn">
                            <i class="fab fa-google"></i> View on Google Maps
                        </a>
                        <a href="https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(location.address)}" 
                           target="_blank" 
                           class="directions-btn">
                            <i class="fas fa-route"></i> Get Directions
                        </a>
                    </div>
                </div>
            `;
        }).join('');
        
        html += '</div>';
        
        container.innerHTML = html;
        console.log('Nearby locations displayed successfully');
        
        // Animate location cards in
        setTimeout(() => {
            const cards = container.querySelectorAll('.location-item');
            cards.forEach((card, index) => {
                setTimeout(() => {
                    card.classList.add('animate-in');
                }, index * 150);
            });
        }, 100);
    }

    // Generate Google Maps directions URL
    generateDirectionsUrl(location) {
        const { lat, lng } = location.coordinates;
        const destination = encodeURIComponent(`${location.name}, ${location.address}`);
        
        if (this.userLocation) {
            return `https://www.google.com/maps/dir/${this.userLocation.latitude},${this.userLocation.longitude}/${lat},${lng}`;
        } else {
            return `https://www.google.com/maps/dir//${lat},${lng}`;
        }
    }

    // Load food database and menu database
    loadFoodDatabase() {
        this.foodDatabase = [
            {
                name: "Quinoa Bowl",
                description: "Complete protein grain with vegetables and healthy fats",
                dietTypes: ["vegetarian", "vegan", "balanced", "high-protein"],
                benefits: ["high-protein", "complex-carbs", "nutrient-dense"],
                allergens: []
            },
            {
                name: "Grilled Salmon",
                description: "Omega-3 rich fish with anti-inflammatory properties",
                dietTypes: ["balanced", "high-protein", "mediterranean", "paleo"],
                benefits: ["high-protein", "healthy-fats", "omega-3"],
                allergens: []
            },
            {
                name: "Avocado Toast",
                description: "Healthy fats with fiber-rich whole grain bread",
                dietTypes: ["vegetarian", "balanced", "mediterranean"],
                benefits: ["healthy-fats", "fiber", "nutrient-dense"],
                allergens: ["gluten"]
            },
            {
                name: "Greek Yogurt with Berries",
                description: "Probiotic-rich protein source with antioxidants",
                dietTypes: ["vegetarian", "balanced", "high-protein"],
                benefits: ["high-protein", "probiotics", "antioxidants"],
                allergens: ["dairy"]
            },
            {
                name: "Keto Cauliflower Rice",
                description: "Low-carb rice alternative with vegetables",
                dietTypes: ["keto", "low-carb", "vegetarian"],
                benefits: ["low-calorie", "low-carb", "fiber"],
                allergens: []
            },
            {
                name: "Lentil Soup",
                description: "Plant-based protein with fiber and minerals",
                dietTypes: ["vegetarian", "vegan", "balanced"],
                benefits: ["high-protein", "fiber", "low-calorie"],
                allergens: []
            },
            {
                name: "Chicken Breast",
                description: "Lean protein source for muscle building",
                dietTypes: ["balanced", "high-protein", "paleo"],
                benefits: ["high-protein", "low-calorie", "muscle-building"],
                allergens: []
            },
            {
                name: "Sweet Potato",
                description: "Complex carbohydrates with beta-carotene",
                dietTypes: ["vegetarian", "vegan", "balanced", "paleo"],
                benefits: ["complex-carbs", "fiber", "antioxidants"],
                allergens: []
            },
            {
                name: "Almonds",
                description: "Healthy fats and protein for sustained energy",
                dietTypes: ["vegetarian", "vegan", "keto", "paleo", "balanced"],
                benefits: ["healthy-fats", "high-protein", "vitamin-e"],
                allergens: ["nuts"]
            },
            {
                name: "Spinach Salad",
                description: "Iron-rich leafy greens with vitamins",
                dietTypes: ["vegetarian", "vegan", "balanced", "keto", "paleo"],
                benefits: ["low-calorie", "iron", "antioxidants"],
                allergens: []
            },
            {
                name: "Eggs",
                description: "Complete protein with essential amino acids",
                dietTypes: ["vegetarian", "balanced", "keto", "paleo"],
                benefits: ["high-protein", "complete-amino", "choline"],
                allergens: ["eggs"]
            },
            {
                name: "Brown Rice",
                description: "Whole grain carbohydrate for sustained energy",
                dietTypes: ["vegetarian", "vegan", "balanced"],
                benefits: ["complex-carbs", "fiber", "b-vitamins"],
                allergens: []
            }
        ];

        console.log(`Food database loaded with ${this.foodDatabase.length} items`);

        // Load restaurant menus database
        this.loadMenuDatabase();
        
        // Validate database loaded correctly
        if (this.foodDatabase.length === 0) {
            console.error('Food database failed to load!');
            UIEnhancements.showNotification('Error loading food database. Please refresh the page.', 'error', 5000);
        } else {
            console.log('Food database loaded successfully!');
        }
    }

    // Load menu database for each restaurant
    loadMenuDatabase() {
        this.menuDatabase = {
            "Green Garden Cafe": [
                {
                    name: "Buddha Bowl Supreme",
                    description: "Quinoa, roasted vegetables, avocado, tahini dressing",
                    price: "$14.99",
                    calories: 520,
                    protein: 18,
                    dietTypes: ["vegetarian", "vegan", "balanced"],
                    benefits: ["high-protein", "nutrient-dense", "fiber"],
                    allergens: [],
                    rating: 4.8,
                    popular: true
                },
                {
                    name: "Green Goddess Smoothie Bowl",
                    description: "Spinach, mango, coconut, chia seeds, granola",
                    price: "$12.99",
                    calories: 380,
                    protein: 12,
                    dietTypes: ["vegetarian", "vegan", "balanced"],
                    benefits: ["antioxidants", "fiber", "probiotics"],
                    allergens: ["nuts"],
                    rating: 4.6,
                    popular: true
                },
                {
                    name: "Lentil Power Soup",
                    description: "Red lentils, vegetables, coconut milk, spices",
                    price: "$10.99",
                    calories: 290,
                    protein: 16,
                    dietTypes: ["vegetarian", "vegan", "balanced"],
                    benefits: ["high-protein", "low-calorie", "fiber"],
                    allergens: [],
                    rating: 4.5,
                    popular: false
                }
            ],
            "Protein Palace": [
                {
                    name: "Beast Mode Burger",
                    description: "Grass-fed beef, sweet potato fries, protein shake",
                    price: "$18.99",
                    calories: 780,
                    protein: 45,
                    dietTypes: ["high-protein", "paleo", "balanced"],
                    benefits: ["high-protein", "muscle-building", "iron"],
                    allergens: [],
                    rating: 4.7,
                    popular: true
                },
                {
                    name: "Keto Power Bowl",
                    description: "Grilled chicken, avocado, cheese, low-carb vegetables",
                    price: "$16.99",
                    calories: 620,
                    protein: 38,
                    dietTypes: ["keto", "high-protein", "low-carb"],
                    benefits: ["high-protein", "healthy-fats", "low-carb"],
                    allergens: ["dairy"],
                    rating: 4.5,
                    popular: true
                },
                {
                    name: "Protein Pancakes Stack",
                    description: "Whey protein pancakes, berries, sugar-free syrup",
                    price: "$13.99",
                    calories: 450,
                    protein: 32,
                    dietTypes: ["high-protein", "balanced"],
                    benefits: ["high-protein", "muscle-building", "antioxidants"],
                    allergens: ["dairy", "eggs", "gluten"],
                    rating: 4.3,
                    popular: false
                }
            ],
            "Mediterranean Delights": [
                {
                    name: "Grilled Salmon Platter",
                    description: "Atlantic salmon, quinoa tabbouleh, tzatziki",
                    price: "$22.99",
                    calories: 650,
                    protein: 42,
                    dietTypes: ["mediterranean", "balanced", "high-protein"],
                    benefits: ["omega-3", "high-protein", "heart-healthy"],
                    allergens: ["dairy"],
                    rating: 4.9,
                    popular: true
                },
                {
                    name: "Mediterranean Mezze Bowl",
                    description: "Hummus, falafel, olives, vegetables, pita",
                    price: "$16.99",
                    calories: 580,
                    protein: 22,
                    dietTypes: ["mediterranean", "vegetarian", "balanced"],
                    benefits: ["fiber", "healthy-fats", "antioxidants"],
                    allergens: ["gluten"],
                    rating: 4.6,
                    popular: true
                },
                {
                    name: "Greek Chicken Souvlaki",
                    description: "Marinated chicken skewers, Greek salad, rice",
                    price: "$19.99",
                    calories: 720,
                    protein: 38,
                    dietTypes: ["mediterranean", "balanced", "high-protein"],
                    benefits: ["high-protein", "lean-meat", "vegetables"],
                    allergens: [],
                    rating: 4.4,
                    popular: false
                }
            ],
            "Keto Kitchen": [
                {
                    name: "Keto Ribeye Steak",
                    description: "Grass-fed ribeye, butter, asparagus, cauliflower mash",
                    price: "$28.99",
                    calories: 820,
                    protein: 48,
                    dietTypes: ["keto", "low-carb", "high-protein"],
                    benefits: ["high-protein", "healthy-fats", "zero-carb"],
                    allergens: ["dairy"],
                    rating: 4.8,
                    popular: true
                },
                {
                    name: "Avocado Bacon Salad",
                    description: "Mixed greens, avocado, bacon, cheese, olive oil",
                    price: "$15.99",
                    calories: 520,
                    protein: 18,
                    dietTypes: ["keto", "low-carb"],
                    benefits: ["healthy-fats", "low-carb", "fiber"],
                    allergens: ["dairy"],
                    rating: 4.5,
                    popular: true
                },
                {
                    name: "Keto Chocolate Mousse",
                    description: "Sugar-free chocolate mousse with whipped cream",
                    price: "$8.99",
                    calories: 280,
                    protein: 6,
                    dietTypes: ["keto", "low-carb"],
                    benefits: ["low-carb", "sugar-free", "antioxidants"],
                    allergens: ["dairy"],
                    rating: 4.2,
                    popular: false
                }
            ],
            "Fresh Market": [
                {
                    name: "Build Your Own Salad Bar",
                    description: "Fresh greens, proteins, toppings, dressings",
                    price: "$8.99/lb",
                    calories: 350,
                    protein: 15,
                    dietTypes: ["all"],
                    benefits: ["customizable", "fresh", "nutrient-dense"],
                    allergens: ["varies"],
                    rating: 4.2,
                    popular: true
                },
                {
                    name: "Organic Smoothie Station",
                    description: "Fresh fruits, vegetables, protein powders, superfoods",
                    price: "$6.99-$9.99",
                    calories: 280,
                    protein: 20,
                    dietTypes: ["all"],
                    benefits: ["antioxidants", "customizable", "protein-boost"],
                    allergens: ["varies"],
                    rating: 4.0,
                    popular: true
                },
                {
                    name: "Prepared Meal Section",
                    description: "Ready-to-eat healthy meals, various cuisines",
                    price: "$7.99-$12.99",
                    calories: 450,
                    protein: 25,
                    dietTypes: ["all"],
                    benefits: ["convenient", "variety", "balanced"],
                    allergens: ["varies"],
                    rating: 3.8,
                    popular: false
                }
            ],
            "Organic Oasis": [
                {
                    name: "Superfood Acai Bowl",
                    description: "Acai, granola, fresh berries, coconut, honey",
                    price: "$13.99",
                    calories: 420,
                    protein: 14,
                    dietTypes: ["vegetarian", "vegan", "balanced"],
                    benefits: ["antioxidants", "fiber", "energy-boost"],
                    allergens: ["nuts"],
                    rating: 4.7,
                    popular: true
                },
                {
                    name: "Organic Green Juice",
                    description: "Kale, spinach, cucumber, apple, lemon, ginger",
                    price: "$8.99",
                    calories: 120,
                    protein: 4,
                    dietTypes: ["vegetarian", "vegan", "balanced"],
                    benefits: ["detox", "vitamins", "low-calorie"],
                    allergens: [],
                    rating: 4.4,
                    popular: true
                },
                {
                    name: "Raw Vegan Wrap",
                    description: "Collard greens, hummus, vegetables, sprouts",
                    price: "$11.99",
                    calories: 320,
                    protein: 12,
                    dietTypes: ["vegan", "balanced"],
                    benefits: ["raw", "fiber", "nutrient-dense"],
                    allergens: [],
                    rating: 4.1,
                    popular: false
                }
            ],
            "Paleo Paradise": [
                {
                    name: "Caveman Steak Platter",
                    description: "Grass-fed steak, roasted vegetables, sweet potato",
                    price: "$26.99",
                    calories: 750,
                    protein: 52,
                    dietTypes: ["paleo", "balanced", "high-protein"],
                    benefits: ["high-protein", "iron", "complex-carbs"],
                    allergens: [],
                    rating: 4.8,
                    popular: true
                },
                {
                    name: "Paleo Salmon Bowl",
                    description: "Wild salmon, cauliflower rice, avocado, vegetables",
                    price: "$21.99",
                    calories: 580,
                    protein: 38,
                    dietTypes: ["paleo", "balanced", "high-protein"],
                    benefits: ["omega-3", "high-protein", "low-carb"],
                    allergens: [],
                    rating: 4.6,
                    popular: true
                },
                {
                    name: "Hunter's Chicken Salad",
                    description: "Grilled chicken, mixed greens, nuts, berries",
                    price: "$17.99",
                    calories: 480,
                    protein: 35,
                    dietTypes: ["paleo", "balanced", "high-protein"],
                    benefits: ["high-protein", "antioxidants", "healthy-fats"],
                    allergens: ["nuts"],
                    rating: 4.3,
                    popular: false
                }
            ],
            "Balanced Bites": [
                {
                    name: "Power Protein Bowl",
                    description: "Quinoa, grilled chicken, vegetables, tahini",
                    price: "$13.99",
                    calories: 520,
                    protein: 32,
                    dietTypes: ["balanced", "high-protein"],
                    benefits: ["high-protein", "complex-carbs", "balanced"],
                    allergens: [],
                    rating: 4.4,
                    popular: true
                },
                {
                    name: "Veggie Burger Deluxe",
                    description: "Plant-based patty, sweet potato fries, side salad",
                    price: "$12.99",
                    calories: 480,
                    protein: 22,
                    dietTypes: ["vegetarian", "balanced"],
                    benefits: ["plant-protein", "fiber", "balanced"],
                    allergens: ["gluten"],
                    rating: 4.2,
                    popular: true
                },
                {
                    name: "Balanced Wrap",
                    description: "Whole wheat wrap, turkey, vegetables, hummus",
                    price: "$10.99",
                    calories: 420,
                    protein: 28,
                    dietTypes: ["balanced", "high-protein"],
                    benefits: ["balanced", "fiber", "lean-protein"],
                    allergens: ["gluten"],
                    rating: 4.0,
                    popular: false
                }
            ]
        };
    }

    // Get top dishes for a location
    getTopDishesForLocation(locationName) {
        const menu = this.menuDatabase[locationName];
        if (!menu) return [];

        const { dietType, fitnessGoal, allergies } = this.userProfile;

        // Filter dishes based on user preferences
        const suitableDishes = menu.filter(dish => {
            // Check diet compatibility
            if (!dish.dietTypes.includes(dietType) && !dish.dietTypes.includes('all')) {
                return false;
            }
            
            // Check allergies
            if (allergies.some(allergy => dish.allergens.includes(allergy))) {
                return false;
            }
            
            return true;
        });

        // Score dishes based on fitness goals
        const goalPriority = {
            'weight-loss': ['low-calorie', 'high-protein', 'fiber'],
            'weight-gain': ['high-calorie', 'healthy-fats', 'complex-carbs'],
            'muscle-gain': ['high-protein', 'muscle-building', 'complete-amino'],
            'maintenance': ['balanced', 'nutrient-dense'],
            'endurance': ['complex-carbs', 'antioxidants', 'energy-boost']
        };

        const priorities = goalPriority[fitnessGoal] || ['balanced'];
        
        // Score dishes
        suitableDishes.forEach(dish => {
            let score = dish.rating * 10; // Base score from rating
            
            // Add points for popular dishes
            if (dish.popular) score += 15;
            
            // Add points for matching fitness goals
            priorities.forEach((priority, index) => {
                if (dish.benefits.includes(priority)) {
                    score += (priorities.length - index) * 8;
                }
            });
            
            dish.score = score;
        });

        // Return top 3 dishes
        return suitableDishes
            .sort((a, b) => b.score - a.score)
            .slice(0, 3);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize main application
    new FoodWise();
    
    // Initialize UI enhancements
    new UIEnhancements();
    
    // Add welcome notification
    setTimeout(() => {
        UIEnhancements.showNotification('Welcome to FoodWise! Fill out your profile to get personalized recommendations.', 'info', 5000);
    }, 1000);
});
