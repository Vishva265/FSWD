document.addEventListener('DOMContentLoaded', function() {
    const uploadForm = document.getElementById('uploadForm');
    const fileInput = document.getElementById('resume');
    const fileName = document.getElementById('fileName');
    const fileSize = document.getElementById('fileSize');
    const message = document.getElementById('message');
    const uploadBtn = document.getElementById('uploadBtn');
    const clearBtn = document.getElementById('clearBtn');
    const uploadProgress = document.getElementById('uploadProgress');
    const progressBar = uploadProgress.querySelector('.progress-bar');

    // File selection handler
    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            fileName.textContent = file.name;
            fileSize.textContent = formatFileSize(file.size);
            
            // Validate file type
            if (file.type !== 'application/pdf') {
                showMessage('Only PDF files are allowed', 'error');
                fileInput.value = '';
                fileName.textContent = 'No file selected';
                fileSize.textContent = '';
                return;
            }
            
            // Validate file size (2MB = 2 * 1024 * 1024 bytes)
            if (file.size > 2 * 1024 * 1024) {
                showMessage('File size exceeds 2MB limit', 'error');
                fileInput.value = '';
                fileName.textContent = 'No file selected';
                fileSize.textContent = '';
                return;
            }
            
            hideMessage();
        } else {
            fileName.textContent = 'No file selected';
            fileSize.textContent = '';
        }
    });

    // Form submission handler
    uploadForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const file = fileInput.files[0];
        if (!file) {
            showMessage('Please select a PDF file to upload', 'error');
            return;
        }
        
        // Double-check validation
        if (file.type !== 'application/pdf') {
            showMessage('Only PDF files are allowed', 'error');
            return;
        }
        
        if (file.size > 2 * 1024 * 1024) {
            showMessage('File size exceeds 2MB limit', 'error');
            return;
        }
        
        uploadFile(file);
    });

    // Clear button handler
    clearBtn.addEventListener('click', function() {
        fileInput.value = '';
        fileName.textContent = 'No file selected';
        fileSize.textContent = '';
        hideMessage();
        hideProgress();
    });

    function uploadFile(file) {
        const formData = new FormData();
        formData.append('resume', file);
        
        // Show loading state
        uploadBtn.disabled = true;
        uploadBtn.classList.add('loading');
        uploadBtn.textContent = 'Uploading...';
        showProgress();
        
        // Simulate progress (since we can't track actual progress with FormData)
        let progress = 0;
        const progressInterval = setInterval(() => {
            progress += Math.random() * 30;
            if (progress > 90) progress = 90;
            updateProgress(progress);
        }, 200);
        
        fetch('/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            clearInterval(progressInterval);
            updateProgress(100);
            
            setTimeout(() => {
                hideProgress();
                
                if (data.success) {
                    showMessage(
                        `Resume uploaded successfully! File: ${data.originalName} (${data.size})`,
                        'success'
                    );
                } else {
                    showMessage(data.message || 'Upload failed', 'error');
                }
            }, 500);
        })
        .catch(error => {
            clearInterval(progressInterval);
            hideProgress();
            showMessage('An error occurred during upload', 'error');
            console.error('Upload error:', error);
        })
        .finally(() => {
            uploadBtn.disabled = false;
            uploadBtn.classList.remove('loading');
            uploadBtn.textContent = 'Upload Resume';
        });
    }

    function showMessage(text, type) {
        message.textContent = text;
        message.className = `message ${type}`;
        message.style.display = 'block';
    }

    function hideMessage() {
        message.style.display = 'none';
    }

    function showProgress() {
        uploadProgress.style.display = 'block';
        updateProgress(0);
    }

    function hideProgress() {
        uploadProgress.style.display = 'none';
    }

    function updateProgress(percent) {
        progressBar.style.width = percent + '%';
    }

    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    
    
    
});
