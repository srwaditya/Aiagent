// Sample data - In a real app, this would come from a backend
const jobs = [
    {
        id: 1,
        title: 'Senior Frontend Developer',
        company: 'TechCorp',
        location: 'San Francisco, CA',
        type: 'Full-time',
        category: 'Technology',
        salary: '$120,000 - $150,000',
        description: 'Looking for an experienced frontend developer with React expertise.',
        requirements: [
            '5+ years of frontend development experience',
            'Strong proficiency in React, TypeScript, and modern JavaScript',
            'Experience with state management (Redux, MobX)',
            'Understanding of web performance optimization'
        ]
    },
    {
        id: 2,
        title: 'Marketing Manager',
        company: 'GrowthCo',
        location: 'New York, NY',
        type: 'Full-time',
        category: 'Marketing',
        salary: '$90,000 - $120,000',
        description: 'Lead our marketing initiatives and drive growth.',
        requirements: [
            '3+ years of marketing experience',
            'Experience with digital marketing campaigns',
            'Strong analytical and communication skills',
            'Knowledge of SEO and content marketing'
        ]
    },
    {
        id: 3,
        title: 'UI/UX Designer',
        company: 'DesignHub',
        location: 'Remote',
        type: 'Contract',
        category: 'Design',
        salary: '$70,000 - $100,000',
        description: 'Create beautiful and intuitive user interfaces for our products.',
        requirements: [
            'Portfolio demonstrating UI/UX projects',
            'Proficiency in Figma and Adobe Creative Suite',
            'Understanding of user-centered design principles',
            'Experience with design systems'
        ]
    }
];

const mentors = [
    {
        name: 'Sarah Johnson',
        role: 'Tech Lead at Google',
        expertise: ['Web Development', 'System Design', 'Leadership'],
        image: 'https://randomuser.me/api/portraits/women/1.jpg',
        availability: 'Available for 1:1 mentoring',
        rating: 4.9,
        totalMentees: 45
    },
    {
        name: 'Michael Chen',
        role: 'Product Manager at Amazon',
        expertise: ['Product Strategy', 'Agile', 'User Research'],
        image: 'https://randomuser.me/api/portraits/men/2.jpg',
        availability: 'Available for group sessions',
        rating: 4.8,
        totalMentees: 32
    },
    {
        name: 'Emily Rodriguez',
        role: 'Design Director at Apple',
        expertise: ['UI/UX', 'Design Systems', 'Brand Strategy'],
        image: 'https://randomuser.me/api/portraits/women/3.jpg',
        availability: 'Available for 1:1 mentoring',
        rating: 4.9,
        totalMentees: 38
    }
];

const services = [
    {
        title: 'Website Development',
        provider: 'John Smith',
        category: 'Development',
        price: '$500',
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
        description: 'Professional website development with modern technologies',
        deliveryTime: '2 weeks'
    },
    {
        title: 'Logo Design',
        provider: 'Alice Wong',
        category: 'Design',
        price: '$200',
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1572044162444-ad60f128bdea',
        description: 'Custom logo design with unlimited revisions',
        deliveryTime: '1 week'
    },
    {
        title: 'Content Writing',
        provider: 'David Brown',
        category: 'Writing',
        price: '$100',
        rating: 4.7,
        image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a',
        description: 'SEO-optimized content writing for your business',
        deliveryTime: '3 days'
    }
];

// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    // Initialize sections
    const jobListings = document.querySelector('.job-listings');
    const mentorGrid = document.querySelector('.mentor-grid');
    const serviceGrid = document.querySelector('.service-grid');

    if (jobListings) renderJobs(jobs);
    if (mentorGrid) renderMentors(mentors);
    if (serviceGrid) renderServices(services);

    // Setup event listeners
    setupEventListeners();
    
    // Add animation to features
    animateFeatures();
}

// Render Functions
function renderJobs(jobs) {
    const jobListings = document.querySelector('.job-listings');
    jobListings.innerHTML = jobs.map(job => `
        <div class="job-card" data-job-id="${job.id}">
            <h3>${job.title}</h3>
            <p class="company">${job.company}</p>
            <div class="job-details">
                <p class="location"><i class="fas fa-location-dot"></i> ${job.location}</p>
                <p class="type"><i class="fas fa-briefcase"></i> ${job.type}</p>
                <p class="salary"><i class="fas fa-money-bill"></i> ${job.salary}</p>
            </div>
            <p class="description">${job.description}</p>
            <div class="requirements">
                <h4>Requirements:</h4>
                <ul>
                    ${job.requirements.map(req => `<li>${req}</li>`).join('')}
                </ul>
            </div>
            <button class="apply-btn" onclick="openJobApplication(${job.id})">Apply Now</button>
        </div>
    `).join('');
}

function renderMentors(mentors) {
    const mentorGrid = document.querySelector('.mentor-grid');
    mentorGrid.innerHTML = mentors.map(mentor => `
        <div class="mentor-card">
            <img src="${mentor.image}" alt="${mentor.name}">
            <h3>${mentor.name}</h3>
            <p class="role">${mentor.role}</p>
            <div class="mentor-stats">
                <span><i class="fas fa-star"></i> ${mentor.rating}</span>
                <span><i class="fas fa-users"></i> ${mentor.totalMentees} mentees</span>
            </div>
            <p class="availability">${mentor.availability}</p>
            <div class="expertise">
                ${mentor.expertise.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
            </div>
            <button class="connect-btn" onclick="connectWithMentor('${mentor.name}')">Connect</button>
        </div>
    `).join('');
}

function renderServices(services) {
    const serviceGrid = document.querySelector('.service-grid');
    serviceGrid.innerHTML = services.map(service => `
        <div class="service-card">
            <img src="${service.image}" alt="${service.title}">
            <h3>${service.title}</h3>
            <p class="provider">${service.provider}</p>
            <p class="description">${service.description}</p>
            <div class="service-details">
                <p class="price">${service.price}</p>
                <p class="delivery-time"><i class="fas fa-clock"></i> ${service.deliveryTime}</p>
            </div>
            <div class="rating">
                <i class="fas fa-star"></i>
                <span>${service.rating}</span>
            </div>
            <button class="hire-btn" onclick="hireFreelancer('${service.title}')">Hire Now</button>
        </div>
    `).join('');
}

// Event Listeners
function setupEventListeners() {
    // Job search and filter
    const jobSearch = document.querySelector('.job-filters input');
    const jobCategory = document.querySelector('.job-filters select');
    const filterBtn = document.querySelector('.job-filters button');

    if (filterBtn) {
        filterBtn.addEventListener('click', () => {
            const searchTerm = jobSearch.value.toLowerCase();
            const category = jobCategory.value;

            const filteredJobs = jobs.filter(job => {
                const matchesSearch = job.title.toLowerCase().includes(searchTerm) ||
                                    job.company.toLowerCase().includes(searchTerm) ||
                                    job.description.toLowerCase().includes(searchTerm);
                const matchesCategory = category === 'All Categories' || job.category === category;
                return matchesSearch && matchesCategory;
            });

            renderJobs(filteredJobs);
        });
    }

    // Service category filters
    const categoryBtns = document.querySelectorAll('.category-btn');
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const category = btn.textContent;
            const filteredServices = category === 'All' 
                ? services 
                : services.filter(service => service.category === category);
            
            renderServices(filteredServices);
        });
    });

    // Smooth scroll navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
        } else {
            navbar.style.backgroundColor = '#fff';
            navbar.style.backdropFilter = 'none';
        }
    });
}

// Feature Animations
function animateFeatures() {
    const features = document.querySelectorAll('.feature-card');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                entry.target.style.animation = `fadeInUp 0.5s ease-out ${index * 0.1}s forwards`;
            }
        });
    }, { threshold: 0.1 });

    features.forEach(feature => observer.observe(feature));
}

// Show Success Message
function showSuccessMessage(message) {
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.innerHTML = `
        <i class="fas fa-check-circle"></i>
        ${message}
    `;
    document.body.appendChild(successMessage);

    // Remove the message after animation completes
    setTimeout(() => {
        successMessage.remove();
    }, 3000);
}

// Job Application Modal
function openJobApplication(jobId) {
    const job = jobs.find(j => j.id === jobId);
    if (!job) return;

    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h2>Apply for ${job.title}</h2>
            <h3>${job.company}</h3>
            <form id="applicationForm" onsubmit="submitApplication(event, ${jobId})">
                <div class="form-group">
                    <label for="name">Full Name</label>
                    <input type="text" id="name" required>
                </div>
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" required>
                </div>
                <div class="form-group">
                    <label for="phone">Phone</label>
                    <input type="tel" id="phone" required>
                </div>
                <div class="form-group">
                    <label for="resume">Resume/CV</label>
                    <input type="file" id="resume" accept=".pdf,.doc,.docx" required>
                </div>
                <div class="form-group">
                    <label for="coverLetter">Cover Letter</label>
                    <textarea id="coverLetter" rows="4" required></textarea>
                </div>
                <button type="submit" class="submit-application">Submit Application</button>
            </form>
        </div>
    `;

    document.body.appendChild(modal);
    
    // Close modal functionality
    const closeBtn = modal.querySelector('.close-modal');
    closeBtn.onclick = () => modal.remove();
    
    window.onclick = (event) => {
        if (event.target === modal) {
            modal.remove();
        }
    };
}

function submitApplication(event, jobId) {
    event.preventDefault();
    const job = jobs.find(j => j.id === jobId);
    document.querySelector('.modal').remove();
    showSuccessMessage(`Application submitted successfully for ${job.title}! We'll be in touch soon.`);
}

// Mentor Connection
function connectWithMentor(mentorName) {
    showSuccessMessage(`Request sent to connect with ${mentorName}! They will respond to your request soon.`);
}

// Hire Freelancer
function hireFreelancer(serviceTitle) {
    showSuccessMessage(`Thank you for your interest in "${serviceTitle}"! We'll connect you with the service provider to discuss the details.`);
}