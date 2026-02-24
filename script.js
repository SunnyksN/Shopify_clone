// Theme Toggle Functionality
const themeToggle = document.getElementById('theme-toggle');
const htmlElement = document.documentElement;
const body = document.body;

// Check for saved theme preference or default to light mode
const currentTheme = localStorage.getItem('theme') || 'light-mode';
body.classList.add(currentTheme);
updateThemeIcon();

themeToggle.addEventListener('click', () => {
    if (body.classList.contains('light-mode')) {
        body.classList.remove('light-mode');
        body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark-mode');
    } else {
        body.classList.remove('dark-mode');
        body.classList.add('light-mode');
        localStorage.setItem('theme', 'light-mode');
    }
    updateThemeIcon();
});

function updateThemeIcon() {
    const icon = themeToggle.querySelector('i');
    if (body.classList.contains('dark-mode')) {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
}

// Chatbot Functionality
const chatbotToggle = document.getElementById('chatbot-toggle');
const chatbotWidget = document.getElementById('chatbot-widget');
const closeChatbot = document.getElementById('close-chatbot');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const chatbotMessages = document.getElementById('chatbot-messages');
const cartCount = document.querySelector('.cart-count');

// Toggle chatbot visibility
chatbotToggle.addEventListener('click', () => {
    chatbotWidget.classList.toggle('active');
});

closeChatbot.addEventListener('click', () => {
    chatbotWidget.classList.remove('active');
});

// AI Chatbot Responses Database
const botResponses = {
    'hello': 'Good Morning! 👋 How can I assist you today?',
    'hi': 'Hi there! 👋 How can I help you find the perfect product?',
    'help': 'I can help you with:\n- Product recommendations\n- Order information\n- Shipping details\n- Return policies\n- Payment methods\n\nWhat would you like to know?',
    'products': 'We have a wide range of products including headphones, smartwatches, cameras, and laptops. Each offers excellent quality and value. Would you like to know more about a specific category?',
    'price': 'Our products range from affordable to premium. Here are some examples:\n- Wireless Headphones: $79.99\n- Smart Watch: $199.99\n- Digital Camera: $599.99\n- Laptop: $999.99',
    'shipping': 'We offer free shipping on all orders! Delivery typically takes 5-7 business days. Track your order anytime from your account.',
    'return': 'We offer a 30-day money-back guarantee! If you\'re not satisfied, simply return the product for a full refund. No questions asked!',
    'payment': 'We accept all major payment methods including credit cards, debit cards, PayPal, and digital wallets for your convenience.',
    'headphones': 'Our Wireless Headphones are priced at $79.99. They feature premium sound quality, noise cancellation, and 30-hour battery life. Would you like to add them to your cart?',
    'smartwatch': 'Our Smart Watch is $199.99. Track your fitness, receive notifications, and stay connected. Perfect for active lifestyles!',
    'camera': 'Our Digital Camera is $599.99. Capture stunning photos with 4K video, advanced autofocus, and weather-resistant design.',
    'laptop': 'Our Laptop is $999.99. Powerful processor, 16GB RAM, 512GB SSD, perfect for work, gaming, and content creation.',
    'contact': 'You can reach our customer service team at:\n- Email: support@shophub.com\n- Phone: 1-800-SHOP-HUB\n- Chat: Available 24/7',
    'discount': 'Check out our current promotions and special offers in the Products section. New offers are updated weekly!',
    'account': 'you can manage your account, view order history, and update preferences in your profile settings.',
    'default': 'Thanks for your question! I didn\'t quite understand that. Could you ask about our products, shipping, returns, or any other store information?'
};

// Send message function
function sendMessage() {
    const userMessage = userInput.value.trim();
    if (userMessage === '') return;

    // Display user message
    addMessageToChat(userMessage, 'user');
    userInput.value = '';

    // Get bot response
    setTimeout(() => {
        const botResponse = generateBotResponse(userMessage);
        addMessageToChat(botResponse, 'bot');
    }, 500);
}

// Add message to chat display
function addMessageToChat(message, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    messageDiv.classList.add(sender === 'user' ? 'user-message' : 'bot-message');
    messageDiv.textContent = message;
    chatbotMessages.appendChild(messageDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

// Generate bot response based on user input
function generateBotResponse(userMessage) {
    const message = userMessage.toLowerCase();
    
    // Check for keyword matches
    for (const [key, response] of Object.entries(botResponses)) {
        if (message.includes(key)) {
            return response;
        }
    }
    
    return botResponses.default;
}

// Event listeners for sending messages
sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Add initial welcome message
window.addEventListener('load', () => {
    addMessageToChat('Welcome to ShopHub! How can I help you today? 😊', 'bot');
});

// Cart functionality with localStorage
const addToCartButtons = document.querySelectorAll('.add-to-cart');

// Load cart from localStorage on page load
function loadCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

// Initialize cart count
loadCartCount();

addToCartButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        const productCard = e.target.closest('.product-card');
        const productName = productCard.querySelector('h3').textContent;
        const productPrice = productCard.querySelector('.price').textContent.replace('$', '');
        const productId = productCard.querySelector('h3').textContent.replace(/\s+/g, '_').toLowerCase();
        
        // Get existing cart
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        // Check if product already exists
        const existingItem = cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({
                id: productId,
                name: productName,
                price: parseFloat(productPrice),
                quantity: 1
            });
        }
        
        // Save to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Update cart count
        loadCartCount();
        
        // Show success message in chat
        const successMessage = `Great! I've added "${productName}" ($${productPrice}) to your cart!`;
        if (chatbotWidget.classList.contains('active')) {
            addMessageToChat(successMessage, 'bot');
        } else {
            // Show notification
            showNotification(`Added ${productName} to cart`);
        }
    });
});

// Show notification function
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #28a745;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Contact form submission
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        showNotification('Thank you! Your message has been sent.');
        contactForm.reset();
    });
}
