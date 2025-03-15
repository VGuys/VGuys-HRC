document.getElementById("riskForm").addEventListener("submit", function (event) {
  event.preventDefault();

  const submitBtn = document.getElementById("submitBtn");
  submitBtn.innerText = "Calculating...";
  submitBtn.style.opacity = "0.7";

  const age = parseInt(document.getElementById("age").value);
  const height = parseInt(document.getElementById("height").value);
  const weight = parseInt(document.getElementById("weight").value);
  const systolic = parseInt(document.getElementById("systolic").value);
  const diastolic = parseInt(document.getElementById("diastolic").value);

  // Collect family history checkboxes
  const familyHistory = [];
  document.querySelectorAll('input[name="familyHistory"]:checked').forEach((checkbox) => {
    familyHistory.push(checkbox.value);
  });

  // Validate inputs before sending request
  if (isNaN(age) || isNaN(height) || isNaN(weight) || isNaN(systolic) || isNaN(diastolic)) {
    alert("Please enter valid numbers for all fields.");
    submitBtn.innerText = "Calculate Risk";
    submitBtn.style.opacity = "1";
    return;
  }

  const data = { age, height, weight, systolic, diastolic, familyHistory };

  fetch("https://vguys-hrc-cwc0cpe8fgf9bvdd.uaenorth-01.azurewebsites.net/api/calculate-risk", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((result) => {
      document.getElementById("result").style.display = "block";
      document.getElementById("riskCategory").innerText = result.riskCategory;
      document.getElementById("totalRisk").innerText = result.totalRisk;
      document.getElementById("bmiResult").innerText = result.bmi;
      document.getElementById("riskForm").reset();
    })
    .catch(() => alert("Failed to calculate risk. Please try again."))
    .finally(() => {
      submitBtn.innerText = "Calculate Risk";
      submitBtn.style.opacity = "1";
    });
});
