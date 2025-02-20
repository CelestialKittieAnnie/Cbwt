// Handle profile form submission
document.getElementById('profile-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const profileImage = document.getElementById('profile-image').files[0];
    const profileName = document.getElementById('profile-name').value;

    if(profileImage && profileName) {
        localStorage.setItem('profileImage', URL.createObjectURL(profileImage));
        localStorage.setItem('profileName', profileName);
        alert('Profile saved successfully!');
        console.log('Profile saved:', { profileImage, profileName });
    } else {
        alert('Please provide a profile image and name.');
    }
});

// Handle delete local data
document.getElementById('delete-data').addEventListener('click', function() {
    localStorage.clear();
    alert('Local save data deleted.');
    console.log('Local save data deleted.');
});

// Handle chatbot generation form submission
document.getElementById('generator-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const botName = document.getElementById('bot-name').value;
    const botDescription = document.getElementById('bot-description').value;
    const botImage = document.getElementById('bot-image').files[0];

    if(botName && botDescription && botImage) {
        const personalityTraits = extractPersonalityTraits(botDescription);

        const chatbot = {
            name: botName,
            description: botDescription,
            traits: personalityTraits,
            image: URL.createObjectURL(botImage),
            messages: []
        };

let chatbots = JSON.parse(localStorage.getItem('chatbots')) || [];
        chatbots.push(chatbot);
        localStorage.setItem('chatbots', JSON.stringify(chatbots));
        alert('Chatbot generated successfully!');
        console.log('Chatbot generated:', chatbot);
        displayChatbots();
    } else {
        alert('Please provide all required information.');
    }
});

// Extract personality traits from description
function extractPersonalityTraits(description) {
    const possibleTraits = ["friendly", "sarcastic", "curious", "enthusiastic", "empathetic", "funny", "serious", "supportive", "thoughtful", "witty"];
    const descriptionKeywords = description.split(" ");
    let extractedTraits = [];

    descriptionKeywords.forEach(keyword => {
        if(possibleTraits.includes(keyword.toLowerCase())) {
            extractedTraits.push(keyword.toLowerCase());
        }
    });

    return extractedTraits;
}

// Display chatbots in chat list
function displayChatbots() {
    const chatList = document.getElementById('chat-list');
    chatList.innerHTML = '';

    let chatbots = JSON.parse(localStorage.getItem('chatbots')) || [];
    chatbots.forEach((chatbot, index) => {
        const chatDiv = document.createElement('div');
        chatDiv.classList.add('chat-item');
        chatDiv.innerHTML = `<img src="${chatbot.image}" alt="Profile Image" class="profile-icon"> ${chatbot.name}`;
        chatDiv.addEventListener('click', function() {
            openChat(index);
        });
        chatList.appendChild(chatDiv);
    });
}

// Open chat window
function openChat(index) {
    document.getElementById('chats-popup').style.display = 'block';

    let chatbots = JSON.parse(localStorage.getItem('chatbots')) || [];
    const chatbot = chatbots[index];

    document.getElementById('chatbot-name').textContent = `Chat with: ${chatbot.name}`;
    displayMessages(chatbot.messages);

    document.getElementById('chat-form').onsubmit = function(event) {
        event.preventDefault();

        const userMessage = document.getElementById('user-message').value;
        if(userMessage) {
            chatbot.messages.push({ sender: 'user', text: userMessage });
            chatbot.messages.push({ sender: 'chatbot', text: generateResponse(userMessage, chatbot.traits, chatbot.messages) });
            localStorage.setItem('chatbots', JSON.stringify(chatbots));
            displayMessages(chatbot.messages);
            document.getElementById('user-message').value = '';
        }
    };
}

// Show chat list
function showChatList() {
    document.getElementById('chats-popup').style.display = 'block';
}

// Display chat messages
function displayMessages(messages) {
    const chatMessages = document.getElementById('chat-messages');
    chatMessages.innerHTML = '';

    messages.forEach(message => {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        messageDiv.classList.add(message.sender === 'user' ? 'user' : 'bot');
        messageDiv.innerHTML = `<img src="${message.sender === 'user' ? localStorage.getItem('profileImage') : chatbots[index].image}" alt="Profile Image"> <span>${message.text}</span>`;
        chatMessages.appendChild(messageDiv);
    });

    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Generate chatbot response based on user input, chatbot personality traits, and conversation history
function generateResponse(userMessage, botTraits, chatHistory) {
    const keywords = ["hello", "help", "weather", "food", "sports", "music", "movie", "book", "travel", "joke", "game", "school", "work", "weekend", "hobby", "family", "friends", "holiday", "plan", "news"];
    const responses = {
        friendly: [
            "Hey there! How can I help?",
            "Hello! I'm here to assist you.",
            "Hi! Let's chat!",
            "Hey! How can I make your day better?"
        ],
        sarcastic: [
            "Oh, really? You need help?",
            "What a surprise, someone needs help.",
            "Wow, didn't see that coming. How can I assist?",
            "Sure, because I have nothing better to do."
        ],
        curious: [
            "Oh, interesting! Tell me more.",
            "Fascinating! What else?",
            "That's so intriguing! Can you elaborate?",
            "Wow! How did that happen?"
        ],
        enthusiastic: [
            "Awesome! Let's get started!",
            "Fantastic! How can I assist?",
            "Great! I'm excited to help!",
            "Super! What can I do for you?"
        ],
        empathetic: [
            "I understand. How can I help?",
            "That sounds tough. Let me assist.",
            "I'm here for you. What do you need?",
            "I get it. How can I make things easier?"
        ],
        funny: [
            "Why don't scientists trust atoms? Because they make up everything!",
            "I could tell you a joke, but I'd rather help.",
            "Let's have some fun while we work!",
            "I'm here to help, and maybe make you laugh."
        ],
        serious: [
            "Let's get to business. How can I help?",
            "No time for jokes. What do you need?",
            "I'm here to assist, seriously.",
            "Let's handle this efficiently."
        ],
        supportive: [
            "I'm here for you. How can I assist?",
            "You've got this. How can I help?",
            "I'm on your team. What do you need?",
            "Let's tackle this together."
        ],
        thoughtful: [
            "Let me think... How can I assist?",
            "I'm considering all options. How can I help?",
            "I'm pondering your request. What do you need?",
            "Let me reflect on that. How can I assist?"
        ],
        witty: [
            "I'm here to help, and I promise not to be too clever.",
            "Let's get this done with a touch of wit.",
            "I'm here to assist, with a dash of humor.",
            "Let's solve this, and I'll try to be entertaining."
        ]
    };

    let matchingResponse = "I see you mentioned something interesting.";
    const lowerCaseMessage = userMessage.toLowerCase();

    for (let i = 0; i < keywords.length; i++) {
        if (lowerCaseMessage.includes(keywords[i])) {
            if (botTraits.includes("friendly")) {
                matchingResponse = responses.friendly[Math.floor(Math.random() * responses.friendly.length)];
            } else if (botTraits.includes("sarcastic")) {
                matchingResponse = responses.sarcastic[Math.floor(Math.random() * responses.sarcastic.length)];
            } else if (botTraits.includes("curious")) {
                matchingResponse = responses.curious[Math.floor(Math.random() * responses.curious.length)];
            } else if (botTraits.includes("enthusiastic")) {
                matchingResponse = responses.enthusiastic[Math.floor(Math.random() * responses.enthusiastic.length)];
            } else if (botTraits.includes("empathetic")) {
                matchingResponse = responses.empathetic[Math.floor(Math.random() * responses.empathetic.length)];
            } else if (botTraits.includes("funny")) {
                matchingResponse = responses.funny[Math.floor(Math.random() * responses.funny.length)];
            } else if (botTraits.includes("serious")) {
                matchingResponse = responses.serious[Math.floor(Math.random() * responses.serious.length)];
            } else if (botTraits.includes("supportive")) {
                matchingResponse = responses.supportive[Math.floor(Math.random() * responses.supportive.length)];
            } else if (botTraits.includes("thoughtful")) {
                matchingResponse = responses.thoughtful[Math.floor(Math.random() * responses.thoughtful.length)];
            } else if (botTraits.includes("witty")) {
                matchingResponse = responses.witty[Math.floor(Math.random() * responses.witty.length)];
            }
            break;
        }
    }

    // Reference previous conversations if relevant
    for (let i = chatHistory.length - 1; i >= 0; i--) {
        const chatMessage = chatHistory[i].text.toLowerCase();
        if (chatMessage.includes("weather") && lowerCaseMessage.includes("weather")) {
            matchingResponse += " Remember we talked about the weather last time!";
            break;
        } else if (chatMessage.includes("food") && lowerCaseMessage.includes("food")) {
            matchingResponse += " I remember you mentioned your favorite dish before!";
            break;
        } else if (chatMessage.includes("movie") && lowerCaseMessage.includes("movie")) {
            matchingResponse += " I recall you talked about a movie you liked!";
            break;
        }
    }

    return matchingResponse;
}

// Open popup window
function openPopup(popupId) {
    document.getElementById(popupId).style.display = 'block';
}

// Close popup window
function closePopup(popupId) {
    document.getElementById(popupId).style.display = 'none';
}

// Initial setup
displayChatbots();
