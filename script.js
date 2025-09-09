const API_KEY = 'AIzaSyDYhhfhD-_tw5F5niwpTeyxtpFbU0kqcdo'; 
const API_URL = 'https://https://aistudio.google.com/apikey?_gl=1*zg40x0*_ga*MTY2MTU2OTU2Ni4xNzU3NDI4ODc4*_ga_P1DBVKWT6V*czE3NTc0Mjg4OTckbzIkZzEkdDE3NTc0MjkwNDckajE4JGwwJGg3OTcyMDkyOTg..google.com/apikey?_gl=1*zg40x0*_ga*MTY2MTU2OTU2Ni4xNzU3NDI4ODc4*_ga_P1DBVKWT6V*czE3NTc0Mjg4OTckbzIkZzEkdDE3NTc0MjkwNDckajE4JGwwJGg3OTcyMDkyOTg.://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=GEMINI_API_KEY';

const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');

async function generateResponse(prompt) {
    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
        })
    });

    if (!response.ok) throw new Error('Failed to generate response');

    const data = await response.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't understand that.";
}

function addMessage(message, isUser) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', isUser ? 'user-message' : 'bot-message');

    const profileImage = document.createElement('img');
    profileImage.classList.add('profile-image');
    profileImage.src = isUser ? 'user.jpg' : 'bot.jpg';
    profileImage.alt = isUser ? 'User' : 'Bot';

    const messageContent = document.createElement('div');
    messageContent.classList.add('message-content');
    messageContent.textContent = message;

    messageElement.appendChild(profileImage);
    messageElement.appendChild(messageContent);
    chatMessages.appendChild(messageElement);
    
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function addTypingIndicator() {
    const typingIndicator = document.createElement('div');
    typingIndicator.classList.add('typing-indicator');
    typingIndicator.id = 'typing-indicator';
    typingIndicator.textContent = 'Bot is typing...';
    chatMessages.appendChild(typingIndicator);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) typingIndicator.remove();
}

async function handleUserInput() {
    const userMessage = userInput.value.trim();
    if (!userMessage) return;

    addMessage(userMessage, true);
    userInput.value = '';
    sendButton.disabled = true;
    userInput.disabled = true;

    addTypingIndicator(); // Show bot typing indicator

    try {
        const botMessage = await generateResponse(userMessage);
        removeTypingIndicator(); // Remove typing indicator
        addMessage(botMessage, false);
    } catch (error) {
        console.error('Error:', error);
        removeTypingIndicator();
        addMessage('Sorry, there was an error. Please try again.', false);
    } finally {
        sendButton.disabled = false;
        userInput.disabled = false;
        userInput.focus();
    }
}

sendButton.addEventListener('click', handleUserInput);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleUserInput();
    }
});
