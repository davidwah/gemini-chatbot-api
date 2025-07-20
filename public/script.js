const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');
const apiUrl = '/api/chat';

chatForm.addEventListener('submit', async function (e) {
  e.preventDefault();

  const userMessage = userInput.value.trim();
  if (!userMessage) return;

  appendMessage('user', userMessage);
  userInput.value = '';

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: userMessage }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.reply || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    appendMessage('bot', data.reply);
  } catch (error) {
    console.error('Error fetching chat response:', error);
    appendMessage('bot', 'Maaf, terjadi kesalahan. Silakan coba lagi.');
  }
});

function appendMessage(sender, text) {
  const msg = document.createElement('div');
  msg.classList.add('message', sender);
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}
