document.addEventListener("DOMContentLoaded", () => {
  const chatInput = document.querySelector(".chat-input textarea");
  const chatInputArea = document.querySelector(".chat-input");
  const sendChatBtn = document.querySelector(".chat-input span");
  const chatbox = document.querySelector(".chatbox");
  const chatbotToggler = document.querySelector(".chatbot-toggler");
  const chatbotCloseBtn = document.querySelector(".close-btn");

  let userMessage;
  const inputInitHeight = chatInput.scrollHeight;

  const createChatLi = (message, className) => {
    // Create a chat <li> element with passed message and className
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);
    let chatContent =
      className === "outgoing"
        ? `<p></p>`
        : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi;
  };

  const createButton = (text, url) => {
    const button = document.createElement("button");
    button.textContent = text;
    button.style.margin = "5px";
    button.style.bordeRadius = "10px";
    button.style.cursor = "pointer";
    button.style.transition = "background-color 0.3s";
    button.style.padding = "2px";

    button.addEventListener("mouseover", () => {
      button.style.backgroundColor = "#ccc";
    });

    // // Change color on hover });
    // button.addEventListener('mouseout', () => {
    //   button.style.backgroundColor = "";
    //   // Revert to original color on mouse out
    // });

    // button.addEventListener('click', () => handleButtonClick(url));
    // return button;

    button.onclick = () => window.open(url, "_blank");
    return button;
  };

  const generateResponse = async (incomingChatLi) => {
    const API_URL = "http://localhost:3001/chat";
    const messageElement = incomingChatLi.querySelector("p");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();
      if (data.links) {
        messageElement.textContent = data.message;
        const buttonsDiv = document.createElement("div");
        Object.keys(data.links).forEach((key) => {
          buttonsDiv.appendChild(
            createButton(
              key.charAt(0).toUpperCase() + key.slice(1),
              data.links[key]
            )
          );
        });
        messageElement.appendChild(buttonsDiv);
      } else {
        messageElement.textContent = data.message;
      }

      // const data = await response.json();
      // const message = data.message || "Here is the data:";
      // chatbox.appendChild(createChatLi(message, "incoming"));
      // if (data.openSlots || data.bookedAppointments) {
      //   if (data.openSlots) {
      //     const openSlotsMessage =
      //       "Open Slots:\n" +
      //       data.openSlots.map((slot) => `${slot.time}`).join("\n");
      //     chatbox.appendChild(createChatLi(openSlotsMessage, "incoming"));
      //   }
      //   if (data.bookedAppointments) {
      //     const bookedSlotsMessage =
      //       "Booked Slots:\n" +
      //       data.bookedAppointments
      //         .map((app) => `${app.time} - ${app.patientName}`)
      //         .join("\n");
      //     chatbox.appendChild(createChatLi(bookedSlotsMessage, "incoming"));
      //   }
      // } else {
      //   const dataMessage = JSON.stringify(data, null, 2);
      //   chatbox.appendChild(createChatLi(dataMessage, "incoming"));
      // }
    } catch (error) {
      console.log(error);
      messageElement.classList.add("error");
      messageElement.textContent =
        "Oops! Something went wrong. Please try again.";
    } finally {
      chatbox.scrollTo(0, chatbox.scrollHeight);
    }
  };

  const handleChat = () => {
    userMessage = chatInput.value.trim();
    if (!userMessage) return;

    // Append user's message to the chatbox
    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);

    setTimeout(() => {
      // Display "Thinking..." message while waiting for the response
      const incomingChatLi = createChatLi("Thinking...", "incoming");
      chatbox.appendChild(incomingChatLi);
      chatbox.scrollTo(0, chatbox.scrollHeight);
      generateResponse(incomingChatLi);
    }, 600);

    // chatInput.disabled = true;
    // sendChatBtn.disabled = true;
    chatInputArea.style.display = "none";
  };

  chatInput.addEventListener("input", () => {
    // Adjust the height of input textarea based on its content
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
  });

  sendChatBtn.addEventListener("click", handleChat);

  chatbotCloseBtn.addEventListener("click", () =>
    document.body.classList.remove("show-chatbot")
  );

  chatbotToggler.addEventListener("click", () =>
    document.body.classList.toggle("show-chatbot")
  );

  chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleChat();
    }
  });
});
