<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WA' REEZ - Event Booking System</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <nav>
        <button class="mobile-menu-toggle" onclick="toggleMobileMenu()">Menu</button>
        <h1>WA' REEZ</h1>
        <ul id="navMenu">
            <li><a href="index.php" class="active">Home</a></li>
            <li><a href="admin.php">Admin</a></li>
        </ul>
        <button><a href="admin.php">Admin Panel</a></button>
    </nav>

    <section class="body1">
        <h1>Event Registration & Participant Tracking System</h1>
        <hr>
        <h3>Simplify your event management with our all in-one platform.</h3>
        <div class="btn">
            <button class="btn1" onclick="scrollToEvents()">Browse Events</button>
            <button class="btn2" onclick="showHowTo()">How To</button>
        </div>
    </section>

    <!-- Events Section -->
    <section class="events-container" id="eventsSection">
        <h2 style="text-align: center; font-size: 2rem; margin-bottom: 30px;">Upcoming Events</h2>
        
        <!-- Search Bar -->
        <div class="search-container">
            <input type="text" class="search-input" id="searchInput" placeholder="Search events by title or location..." onkeyup="searchEvents()">
        </div>

        <!-- Events Grid -->
        <div class="events-grid" id="eventsGrid">
            <?php
            // Database connection
            $conn = new mysqli('localhost', 'root', '', 'event_booking');
            
            if ($conn->connect_error) {
                die("Connection failed: " . $conn->connect_error);
            }
            
            // Fetch events
            $sql = "SELECT * FROM events WHERE event_date >= CURDATE() ORDER BY event_date ASC";
            $result = $conn->query($sql);
            
            if ($result->num_rows > 0) {
                while($row = $result->fetch_assoc()) {
                    $event_date = date('F j, Y', strtotime($row['event_date']));
                    $event_time = date('g:i A', strtotime($row['event_time']));
                    $price = $row['price'] > 0 ? '$' . number_format($row['price'], 2) : 'Free';
                    
                    echo '<div class="event-card" onclick="viewEvent(' . $row['id'] . ')">';
                    echo '<h3>' . htmlspecialchars($row['title']) . '</h3>';
                    echo '<div class="event-date">Date: ' . $event_date . ' at ' . $event_time . '</div>';
                    echo '<div class="event-date">Location: ' . htmlspecialchars($row['location']) . '</div>';
                    echo '<div class="event-seats">' . $row['available_seats'] . ' seats available</div>';
                    echo '<div class="event-price">' . $price . '</div>';
                    echo '<div class="event-description">' . htmlspecialchars(substr($row['description'], 0, 100)) . '...</div>';
                    echo '<button class="btn1" style="width: 100%; margin-top: 10px;">View Details</button>';
                    echo '</div>';
                }
            } else {
                echo '<div style="text-align: center; grid-column: 1 / -1; padding: 40px;">';
                echo '<h3>No upcoming events found</h3>';
                echo '<p>Check back later for new events!</p>';
                echo '</div>';
            }
            
            $conn->close();
            ?>
        </div>
    </section>

    <section class="body2">
        <div class="box">
            <div class="box1">
                <img src="/assets/images/events.png" alt="event image">
                <p><b>Easy Registration</b></p>
                <span>Quick and simple sign-up <br> for your events</span>
            </div>
            <div class="box2">
                <img src="/assets/images/reports.png" alt="">
                <p><b>Detailed Reports</b></p>
                <span>Get in-depth analytics<br>and reports</span>
            </div>
        </div>
    </section>

    <section class="body3">
        <hr id="hr1">
        <h2>Join Us Today</h2>
        <hr id="hr2">
        <p>Sign up now and streamline your event management</p>
        <div class="footer">
            <input type="text" placeholder="Enter Your email" id="emailInput">
            <button class="signup" onclick="handleSignup()">Sign Up</button>
        </div>
    </section>

    <script src="script.js"></script>
    <script>
        // Mobile menu toggle
        function toggleMobileMenu() {
            const navMenu = document.getElementById('navMenu');
            navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
        }

        // Scroll to events section
        function scrollToEvents() {
            document.getElementById('eventsSection').scrollIntoView({ behavior: 'smooth' });
        }

        // Show how to guide
        function showHowTo() {
            alert('How to use:\n1. Browse events below\n2. Click on any event to view details\n3. Book your seat\n4. Receive your ticket via email');
        }

        // View event details
        function viewEvent(eventId) {
            window.location.href = 'event.php?id=' + eventId;
        }

        // Search events
        function searchEvents() {
            const searchInput = document.getElementById('searchInput').value.toLowerCase();
            const eventCards = document.querySelectorAll('.event-card');
            
            eventCards.forEach(card => {
                const text = card.textContent.toLowerCase();
                if (text.includes(searchInput)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        }

        // Handle signup
        function handleSignup() {
            const email = document.getElementById('emailInput').value;
            if (email && validateEmail(email)) {
                // Store in localStorage for demo
                localStorage.setItem('signupEmail', email);
                alert('Thank you for signing up! We\'ll keep you updated with our latest events.');
                document.getElementById('emailInput').value = '';
            } else {
                alert('Please enter a valid email address.');
            }
        }

        // Email validation
        function validateEmail(email) {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(email);
        }

        // Initialize mobile menu
        document.addEventListener('DOMContentLoaded', function() {
            // Hide mobile menu on desktop
            if (window.innerWidth > 768) {
                document.getElementById('navMenu').style.display = 'flex';
            } else {
                document.getElementById('navMenu').style.display = 'none';
            }
        });

        // Handle window resize
        window.addEventListener('resize', function() {
            const navMenu = document.getElementById('navMenu');
            if (window.innerWidth > 768) {
                navMenu.style.display = 'flex';
            } else {
                navMenu.style.display = 'none';
            }
        });
    </script>
</body>
</html>
