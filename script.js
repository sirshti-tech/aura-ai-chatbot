const chatForm = document.getElementById("chat-form");
const messageInput = document.getElementById("message-input");
const sendButton = document.getElementById("send-button");
const messages = document.getElementById("messages");
const welcome = document.getElementById("welcome");

function scrollToLatest() {
  messages.scrollIntoView({ behavior: "smooth", block: "end" });
}

function createMessage(text, sender) {
  const message = document.createElement("article");
  message.className = `message ${sender}`;

  const avatar = document.createElement("div");
  avatar.className = "avatar";
  avatar.setAttribute("aria-hidden", "true");
  if (sender === "assistant") {
    avatar.innerHTML = '<span class="brand-mark"><span></span><span></span><span></span><span></span></span>';
  } else {
    avatar.textContent = "Y";
  }

  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.textContent = text;
  message.append(avatar, bubble);
  messages.append(message);
  return { message, bubble };
}

function showTypingIndicator() {
  const { message, bubble } = createMessage("", "assistant");
  bubble.setAttribute("aria-label", "Aura AI is typing");
  bubble.innerHTML = '<span class="typing" aria-hidden="true"><span></span><span></span><span></span></span>';
  return message;
}

// Demo response logic is isolated here for an easy future API integration.
function getDemoResponse(userText) {
  const text = userText.toLowerCase();
  if (/\b(hello|hi|hey)\b/.test(text)) {
    return "Hi there! What would you like to explore today?";
  }
  if (text.includes("help")) {
    return "I can help you brainstorm ideas, explain a topic, or plan your next steps. What are you working on?";
  }
  if (text.includes("thank")) {
    return "You're welcome! Let me know if there's anything else I can help with.";
  }
  return `That's a great question. Here's a place to start: break “${userText}” into a few smaller parts, then tackle the one that matters most first. Want to explore it together?`;
}

function resizeInput() {
  messageInput.style.height = "auto";
  messageInput.style.height = `${Math.min(messageInput.scrollHeight, 140)}px`;
}

async function sendMessage(event) {
  event.preventDefault();
  const userText = messageInput.value.trim();
  if (!userText || sendButton.disabled) return;

  welcome.hidden = true;
  createMessage(userText, "user");
  messageInput.value = "";
  resizeInput();
  sendButton.disabled = true;
  scrollToLatest();

  const typingMessage = showTypingIndicator();
  scrollToLatest();

  // A short delay makes the demo feel conversational. Replace this block with an API call later.
  await new Promise((resolve) => window.setTimeout(resolve, 850));
  const response = getDemoResponse(userText);
  typingMessage.remove();
  createMessage(response, "assistant");
  sendButton.disabled = false;
  messageInput.focus();
  scrollToLatest();
}

chatForm.addEventListener("submit", sendMessage);
messageInput.addEventListener("input", resizeInput);
messageInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    chatForm.requestSubmit();
  }
});
