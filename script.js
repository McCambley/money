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

updateValues();
