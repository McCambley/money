// @ts-nocheck
// Get references to the input elements
const hourlyWageInput = document.getElementById("hourly-wage");

const monthlyNecessities = document.getElementById("necessities-month");
const monthlyDiscretionary = document.getElementById("discretionary-month");
const monthlySavings = document.getElementById("savings-month");
const monthlyTotal = document.getElementById("total-month");

const annualNecessities = document.getElementById("necessities-annual");
const annualDiscretionary = document.getElementById("discretionary-annual");
const annualSavings = document.getElementById("savings-annual");
const annualTotal = document.getElementById("total-annual");

let savingsPercent = 20;
let necessitiesPercent = 50;
let discretionaryPercent = 30;

function addCommasToNumber(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function calculateTaxPercentage(annualWage) {
  let taxPercentage;

  switch (true) {
    case annualWage < 10275:
      taxPercentage = 0.9;
      break;
    case annualWage >= 10275 && annualWage < 41775:
      taxPercentage = 0.88;
      break;
    case annualWage >= 41775 && annualWage < 89075:
      taxPercentage = 0.78;
      break;
    default:
      taxPercentage = 0.76;
      break;
  }
  return taxPercentage;
}

// Add event listeners to the input elements
hourlyWageInput.addEventListener("input", updateValues);

// Define the updateValues function
function updateValues() {
  const taxPercentage = calculateTaxPercentage(hourlyWageInput.value * 40 * 4 * 12);
  // Get the values from the input elements
  const hourlyWage = parseFloat(hourlyWageInput.value * taxPercentage) || 0;
  // Calculate the monthly income based on hourly wage
  const monthlyIncome = hourlyWage * 40 * 4;
  // Calculate the annual income based on hourly wage
  const annualIncome = monthlyIncome * 12;

  //   console.log({ hourlyWage, monthlyIncome, annualIncome });

  // Calculate the values for the other inputs
  const fiftyPercent = (monthlyIncome * 0.5) / hourlyWage;
  const thirtyPercent = (monthlyIncome * 0.3) / hourlyWage;
  const twentyPercent = (monthlyIncome * 0.2) / hourlyWage;

  // Update the values of the other inputs
  monthlyNecessities.textContent = "$" + addCommasToNumber(((monthlyIncome * necessitiesPercent) / 100).toFixed(2));
  monthlyDiscretionary.textContent = "$" + addCommasToNumber(((monthlyIncome * discretionaryPercent) / 100).toFixed(2));
  monthlySavings.textContent = "$" + addCommasToNumber(((monthlyIncome * savingsPercent) / 100).toFixed(2));
  monthlyTotal.textContent = "$" + addCommasToNumber(monthlyIncome.toFixed(2));

  annualNecessities.textContent = "$" + addCommasToNumber(((annualIncome * necessitiesPercent) / 100).toFixed(2));
  annualDiscretionary.textContent = "$" + addCommasToNumber(((annualIncome * discretionaryPercent) / 100).toFixed(2));
  annualSavings.textContent = "$" + addCommasToNumber(((annualIncome * savingsPercent) / 100).toFixed(2));
  annualTotal.textContent = "$" + addCommasToNumber(annualIncome.toFixed(2));
}

const slider = document.getElementById("slider");
const sliderOutput = document.getElementById("slider-output");
const calculationOutput1 = document.getElementById("calculation-output1");
const calculationOutput2 = document.getElementById("calculation-output2");

slider.addEventListener("input", updateOutputs);

function updateOutputs() {
  savingsPercent = parseInt(slider.value);

  // Display the slider value
  sliderOutput.textContent = `Savings: ${savingsPercent.toFixed()}%`;

  // Calculate and display the first calculation
  necessitiesPercent = (100 - savingsPercent) * (5 / 8);
  calculationOutput1.textContent = `Necessities: ${necessitiesPercent.toFixed()}%`;

  // Calculate and display the second calculation
  discretionaryPercent = (100 - savingsPercent) * (3 / 8);
  calculationOutput2.textContent = `Discretionary: ${discretionaryPercent.toFixed()}%`;
  updateValues();
}

const definitionToggle = document.getElementById("definitions-toggle");

definitionToggle.addEventListener("click", () => {
  const definitions = document.getElementById("definitions-table");
  const definitionsHeading = document.querySelector(".definitions-heading");
  definitions.style.display = definitions.style.display === "block" ? "none" : "block";
  definitionToggle.src = definitions.style.display === "none" ? "./public/down.svg" : "./public/up.svg";
  definitionsHeading.style.marginBottom = definitions.style.display === "none" ? "0rem" : "1rem";
  //   button.classList.toggle("section-expanded");
});

updateValues();

// Prevent the calculator form from submitting
const calculatorForm = document.getElementById("calculator-form");
calculatorForm.addEventListener("submit", (event) => {
  event.preventDefault();
});

// ---
// Chat integration
// ---
const userInput = document.getElementById("user-input");
const formButton = document.getElementById("form-button");
const chatForm = document.getElementById("chat-form");
const chatHistory = document.getElementById("chat-history");

const apiUrl = "";
const apiUrlV2 = "";

const disableForm = () => {
  chatForm.style.setProperty("display", "none");
  userInput.disabled = true;
  formButton.disabled = true;
};

const enableForm = () => {
  chatForm.style.setProperty("display", "grid");
  userInput.disabled = false;
  formButton.disabled = false;
};

let messages = [
  {
    role: "system",
    content:
      "You are a financial expert. Target audience for this response is a high school student. You are not allowed to answer questions that do not pertain to personal finance in some manner. If you are asked a question that does not pertain to personal finance, politely explain that you are only designed to answer questions about personal finance. Provider answers in as few sentences as possible. Use appropriate analogies to explain complex topics. Answer questions in a concise, comprehensive, and approachable manner",
  },
  {
    role: "assistant",
    content: "Hey there! I'm a chatbot and an expert in all things personal finance. What can I help you with?",
  },
];

async function sendMessage(message) {
  return;
  // Disable the form while the message is being sent
  messages = [...messages, { role: "user", content: message }];
  const response = await fetch(apiUrlV2, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messages: messages,
    }),
  });

  const data = await response.json();
  const generatedMessage = data.response;
  messages = [...messages, { role: "assistant", content: generatedMessage }];

  // Display the generated message in the chat interface
  displayMessage(generatedMessage);
}

chatForm.addEventListener("submit", async (event) => {
  return;
  event.preventDefault();
  disableForm();
  // Display the user's message in the chat interface
  const userMessage = document.createElement("p");
  userMessage.classList.add("chat-message", "user");
  userMessage.textContent = userInput.value;
  chatHistory.appendChild(userMessage);

  // Display a placeholder for the bot's message in the chat interface
  const botMessagePlaceholder = document.createElement("p");
  botMessagePlaceholder.classList.add("chat-message", "bot", "pulse");
  botMessagePlaceholder.textContent = "...";
  chatHistory.appendChild(botMessagePlaceholder);

  const message = userInput.value;
  userInput.placeholder = "Loading...";
  userInput.value = "";
  try {
    await sendMessage(message);
  } catch (error) {
    console.log(error);
    enableForm();
    displayMessage("Something went wrong...");
  }
  userInput.placeholder = "Ask another question...";
  enableForm();
});

function displayMessage(message) {
  return;
  // Create the response element
  const botMessage = document.createElement("p");
  botMessage.classList.add("chat-message", "bot");
  botMessage.textContent = message;

  // Remove the placeholder element
  const botResponses = chatHistory?.querySelectorAll("p.bot");
  const placeholderResponse = botResponses[botResponses?.length - 1];
  placeholderResponse.remove();

  // Display the message in the chat interface
  chatHistory.appendChild(botMessage);
}

// Modal integration
const modal = document.getElementById("modal");
const openModalButton = document.getElementById("modal-open");
const closeModalButton = document.getElementById("modal-close");

openModalButton.addEventListener("click", () => {
  modal.classList.add("open");
});

closeModalButton.addEventListener("click", () => {
  modal.classList.remove("open");
});

// Get all the <a> elements inside the div
const links = document.querySelectorAll(".modal-links a");

// Add click event listener to each link
links.forEach((link) => {
  link.addEventListener("click", () => {
    modal.classList.remove("open");
  });
});
