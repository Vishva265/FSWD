const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        // Generate unique filename with original extension
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, `resume-${uniqueSuffix}${ext}`);
    }
});

// File filter to accept only PDF files
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Only PDF files are allowed'), false);
    }
};

// Configure upload middleware with 2MB limit
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 2 * 1024 * 1024 // 2MB in bytes
    }
});

// Middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle file upload
app.post('/upload', upload.single('resume'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded or file validation failed'
            });
        }

        // File upload successful
        res.json({
            success: true,
            message: 'Resume uploaded successfully',
            filename: req.file.filename,
            originalName: req.file.originalname,
            size: (req.file.size / 1024 / 1024).toFixed(2) + ' MB'
        });
    } catch (error) {
        // Handle multer errors
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'File size exceeds 2MB limit'
            });
        }
        
        if (error.message === 'Only PDF files are allowed') {
            return res.status(400).json({
                success: false,
                message: 'Only PDF files are allowed'
            });
        }

        // Handle other errors
        res.status(500).json({
            success: false,
            message: 'An error occurred during file upload'
        });
    }
});

// Error handling middleware
app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'File size exceeds 2MB limit'
            });
        }
    }
    
    res.status(500).json({
        success: false,
        message: 'An error occurred'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Job Portal running on http://localhost:${PORT}`);
    console.log(`Upload directory: ${uploadsDir}`);
});

