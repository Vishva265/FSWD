const express = require('express');
const session = require('express-session');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Set up EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Session configuration
app.use(session({
    secret: 'library-portal-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false, // Set to true in production with HTTPS
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Authentication middleware
function isAuthenticated(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
}

// Routes
app.get('/', (req, res) => {
    if (req.session.user) {
        res.redirect('/profile');
    } else {
        res.redirect('/login');
    }
});

app.get('/login', (req, res) => {
    res.render('login', { 
        error: null,
        title: 'Library Portal - Login'
    });
});

app.post('/login', (req, res) => {
    const { username } = req.body;
    
    if (!username || username.trim() === '') {
        return res.render('login', { 
            error: 'Please enter your name',
            title: 'Library Portal - Login'
        });
    }

    // Create user session
    req.session.user = {
        name: username.trim(),
        loginTime: new Date().toLocaleString()
    };

    res.redirect('/profile');
});

app.get('/profile', isAuthenticated, (req, res) => {
    res.render('profile', { 
        user: req.session.user,
        title: 'Library Portal - Profile'
    });
});

app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
        }
        res.redirect('/login');
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Library Portal running on http://localhost:${PORT}`);
});
