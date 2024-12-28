// document.addEventListener("DOMContentLoaded", () => {
//   const chatInput = document.querySelector(".chat-input textarea");
//   const chatInputArea = document.querySelector(".chat-input");
//   const sendChatBtn = document.querySelector(".chat-input span");
//   const chatbox = document.querySelector(".chatbox");
//   const chatbotToggler = document.querySelector(".chatbot-toggler");
//   const chatbotCloseBtn = document.querySelector(".close-btn");
//   let userMessage;
//   const inputInitHeight = chatInput.scrollHeight;

//   // Initialize event listeners
//   const initEventListeners = () => {
//     chatInput.addEventListener("input", adjustTextareaHeight);
//     sendChatBtn.addEventListener("click", handleChat);
//     chatbotCloseBtn.addEventListener("click", closeChatbot);
//     chatbotToggler.addEventListener("click", toggleChatbot);
//     // chatInput.addEventListener("keydown", handleEnterKey);
//     document.body.addEventListener("click", handleBodyClick);
//   };

//   // Adjust the height of the textarea dynamically
//   const adjustTextareaHeight = () => {
//     chatInput.style.height = `${inputInitHeight}px`;
//     chatInput.style.height = `${chatInput.scrollHeight}px`;
//   };

//   // Handle the "Enter" key press in the chat input
//   const handleEnterKey = (e) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       handleChat();
//     }
//   };

//   // Toggle the chatbot visibility
//   const toggleChatbot = () => {
//     document.body.classList.toggle("show-chatbot");
//   };

//   // Close the chatbot
//   const closeChatbot = () => {
//     document.body.classList.remove("show-chatbot");
//   };

//   // Create a chat message <li> element
//   const createChatLi = (message, className) => {
//     const chatLi = document.createElement("li");
//     chatLi.classList.add("chat", className);
//     const chatContent =
//       className === "outgoing"
//         ? `<p></p>`
//         : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
//     chatLi.innerHTML = chatContent;
//     chatLi.querySelector("p").textContent = message;
//     return chatLi;
//   };

//   // Create a button element
//   const createButton = (label, url) => {
//     const button = document.createElement("button");
//     button.textContent = label;
//     button.style.cssText = `
//       margin: 5px;
//       border-radius: 10px;
//       cursor: pointer;
//       transition: background-color 0.3s;
//       padding: 8px 16px;
//       border: none;
//       box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
//       background-color: #007BFF;
//       color: white;
//     `;
//     button.setAttribute("id", label.replace(/\s+/g, "").toLowerCase() + "Btn");
//     button.addEventListener(
//       "mouseover",
//       () => (button.style.backgroundColor = "#0056b3")
//     );
//     button.addEventListener(
//       "mouseout",
//       () => (button.style.backgroundColor = "#007BFF")
//     );
//     button.onclick = () => window.open(url, "_blank");
//     return button;
//   };

//   // Handle chat submission
//   const handleChat1 = () => {
//     userMessage = chatInput.value.trim();
//     if (!userMessage) return;

//     chatbox.appendChild(createChatLi(userMessage, "outgoing"));
//     chatbox.scrollTo(0, chatbox.scrollHeight);

//     setTimeout(() => {
//       const incomingChatLi = createChatLi("Thinking...", "incoming");
//       chatbox.appendChild(incomingChatLi);
//       chatbox.scrollTo(0, chatbox.scrollHeight);
//       generateResponse(incomingChatLi);
//     }, 600);

//     chatInputArea.style.display = "none";
//   };

//   // Fetch response from the chat API
//   const generateResponse = async (incomingChatLi) => {
//     const API_URL = "http://localhost:3000/chat";
//     const messageElement = incomingChatLi.querySelector("p");

//     try {
//       const response = await fetch(API_URL, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ message: userMessage }),
//       });

//       const data = await response.json();
//       if (data.links) {
//         messageElement.textContent = data.message;
//         const buttonsDiv = document.createElement("div");
//         Object.keys(data.links).forEach((key) => {
//           buttonsDiv.appendChild(
//             createButton(
//               key.charAt(0).toUpperCase() + key.slice(1),
//               data.links[key]
//             )
//           );
//         });
//         messageElement.appendChild(buttonsDiv);
//       } else {
//         messageElement.textContent = data.message;
//       }
//     } catch (error) {
//       console.error(error);
//       messageElement.classList.add("error");
//       messageElement.textContent =
//         "Oops! Something went wrong. Please try again.";
//     } finally {
//       chatbox.scrollTo(0, chatbox.scrollHeight);
//     }
//   };

//   // Handle dynamic "Appointment Status" button clicks
//   const handleBodyClick = (event) => {
//     if (event.target && event.target.id === "appointmentstatusBtn") {
//       handleAppointmentStatusClick();
//     }
//   };

//   // Handle the "Appointment Status" button click
//   const handleAppointmentStatusClick = () => {
//     chatInputArea.style.display = "block";
//     chatInput.disabled = false;
//     chatInput.placeholder = "Enter Appointment ID...";
//     chatInput.focus();

//     sendChatBtn.addEventListener("click", async () => {
//       const appointmentId = chatInput.value.trim();
//       if (!appointmentId) {
//         alert("Please enter an Appointment ID.");
//         return;
//       }
//       // Make POST request with appointment ID
//       await generateAppointmentStatus(appointmentId);
//     });
//   };

//   const generateAppointmentStatus = async (appointmentId) => {
//     const API_URL2 = "http://localhost:3000/appointment-status";

//     try {
//       const response = await fetch(API_URL2, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ appointment_id: appointmentId }),
//       });

//       if (!response.ok) {
//         throw new Error("Failed to fetch appointment data.");
//       }

//       const data = await response.json();
//       displayAppointmentDetails(data);
//     } catch (error) {
//       console.error(error);
//       alert("An error occurred while fetching appointment details.");
//     }
//   };

//   // Function to display appointment details
//   const displayAppointmentDetails = (data) => {
//     // Clear chat input and display area
//     chatInput.value = "";
//     chatInputArea.style.display = "none";

//     const appointmentContainer = document.querySelector("#appointmentDetails");
//     appointmentContainer.innerHTML = ""; // Clear old details

//     // Create elements to display the appointment details
//     const appointmentHtml = `
//     <div class="appointment-card">
//       <h3>Appointment Details</h3>
//       <p><strong>Patient Name:</strong> ${data.patient_name}</p>
//       <p><strong>Doctor Name:</strong> ${data.doctor_name}</p>
//       <p><strong>Appointment Time:</strong> ${new Date(
//         data.appointment_time
//       ).toLocaleString()}</p>
//       <p><strong>Status:</strong> ${data.status}</p>
//     </div>
//   `;

//     appointmentContainer.innerHTML = appointmentHtml;
//   };

//   // Initialize all event listeners
//   initEventListeners();
// });

//--------

document.addEventListener("DOMContentLoaded", () => {
  const chatInput = document.querySelector(".chat-input textarea");
  const chatInputArea = document.querySelector(".chat-input");
  const sendChatBtn = document.querySelector(".chat-input span");
  const chatbox = document.querySelector(".chatbox");
  const chatbotToggler = document.querySelector(".chatbot-toggler");
  const chatbotCloseBtn = document.querySelector(".close-btn");
  let userMessage;
  const inputInitHeight = chatInput.scrollHeight;

  // Initialize event listeners
  const initEventListeners = () => {
    chatInput.addEventListener("input", adjustTextareaHeight);
    sendChatBtn.addEventListener("click", handleSendMessage);
    chatbotCloseBtn.addEventListener("click", closeChatbot);
    chatbotToggler.addEventListener("click", toggleChatbot);
    document.body.addEventListener("click", handleBodyClick);
  };

  // Adjust the height of the textarea dynamically
  const adjustTextareaHeight = () => {
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
  };

  // Handle the "Enter" key press in the chat input
  const handleEnterKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Toggle the chatbot visibility
  const toggleChatbot = () => {
    document.body.classList.toggle("show-chatbot");
  };

  // Close the chatbot
  const closeChatbot = () => {
    document.body.classList.remove("show-chatbot");
  };

  // Create a chat message <li> element
  const createChatLi = (message, className) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);
    const chatContent =
      className === "outgoing"
        ? `<p></p>`
        : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi;
  };

  // Create a button element
  const createButton = (label, url) => {
    const button = document.createElement("button");
    button.textContent = label;
    button.style.cssText = `
      margin: 5px;
      border-radius: 10px;
      cursor: pointer;
      transition: background-color 0.3s;
      padding: 8px 16px;
      border: none;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      background-color: #007BFF;
      color: white;
    `;
    button.setAttribute("id", label.replace(/\s+/g, "").toLowerCase() + "Btn");
    button.addEventListener(
      "mouseover",
      () => (button.style.backgroundColor = "#0056b3")
    );
    button.addEventListener(
      "mouseout",
      () => (button.style.backgroundColor = "#007BFF")
    );
    button.onclick = () => window.open(url, "_blank");
    return button;
  };

  // Handle chat submission
  const handleSendMessage = () => {
    userMessage = chatInput.value.trim();
    if (!userMessage) return;

    // Check if the chat is for appointment status or general chat
    if (chatInput.placeholder.includes("Appointment ID")) {
      generateAppointmentStatus(userMessage);
    } else {
      handleChat();
    }
  };

  const handleChat = () => {
    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);

    setTimeout(() => {
      const incomingChatLi = createChatLi("Thinking...", "incoming");
      chatbox.appendChild(incomingChatLi);
      chatbox.scrollTo(0, chatbox.scrollHeight);
      generateResponse(incomingChatLi);
    }, 600);

    chatInputArea.style.display = "none";
  };

  // Fetch response from the chat API
  const generateResponse = async (incomingChatLi) => {
    const API_URL = "http://localhost:3000/chat";
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
    } catch (error) {
      console.error(error);
      messageElement.classList.add("error");
      messageElement.textContent =
        "Oops! Something went wrong. Please try again.";
    } finally {
      chatbox.scrollTo(0, chatbox.scrollHeight);
    }
  };

  // Handle dynamic "Appointment Status" button clicks
  const handleBodyClick = (event) => {
    if (event.target && event.target.id === "appointmentstatusBtn") {
      handleAppointmentStatusClick();
    }
  };

  // Handle the "Appointment Status" button click
  const handleAppointmentStatusClick = () => {
    chatInputArea.style.display = "block";
    chatInput.disabled = false;
    chatInput.placeholder = "Enter Appointment ID...";
    chatInput.focus();
    return false;
  };

  const generateAppointmentStatus = async (appointmentId) => {
    const API_URL2 = "http://localhost:3000/appointment-status";

    try {
      const response = await fetch(API_URL2, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ appointment_id: appointmentId }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch appointment data.");
      }

      const data = await response.json();
      displayAppointmentDetails(data);
    } catch (error) {
      console.error(error);
      alert("An error occurred while fetching appointment details.");
      displayAppointmentDetails(data);
    }
  };

  // Function to display appointment details
  const displayAppointmentDetails = (data) => {
    // Clear chat input and display area
    chatInput.value = "";
    chatInputArea.style.display = "none";

    const appointmentContainer = document.querySelector("#appointmentDetails");
    appointmentContainer.innerHTML = ""; // Clear old details

    // Create elements to display the appointment details
    const appointmentHtml = `
    <div class="appointment-card">
      <h3>Appointment Details</h3>
      <p><strong>Patient Name:</strong> ${data.patient_name}</p>
      <p><strong>Doctor Name:</strong> ${data.doctor_name}</p>
      <p><strong>Appointment Time:</strong> ${new Date(
        data.appointment_time
      ).toLocaleString()}</p>
      <p><strong>Status:</strong> ${data.status}</p>
    </div>
  `;

    appointmentContainer.innerHTML = appointmentHtml;
  };

  // Initialize all event listeners
  initEventListeners();
});
