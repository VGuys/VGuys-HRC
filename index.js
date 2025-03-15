document.getElementById("riskForm").addEventListener("submit", function (event) {
  event.preventDefault();

  const age = parseInt(document.getElementById("age").value);
  const height = parseInt(document.getElementById("height").value);
  const weight = parseInt(document.getElementById("weight").value);
  const systolic = parseInt(document.getElementById("systolic").value);
  const diastolic = parseInt(document.getElementById("diastolic").value);

  const familyHistory = [];
  if (document.getElementById("diabetes").checked) familyHistory.push("diabetes");
  if (document.getElementById("cancer").checked) familyHistory.push("cancer");
  if (document.getElementById("alzheimers").checked) familyHistory.push("alzheimers");

  const data = { age, height, weight, systolic, diastolic, familyHistory };

  fetch("https://vguys-hrc-cwc0cpe8fgf9bvdd.uaenorth-01.azurewebsites.net/api/calculate-risk", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((result) => {
      document.getElementById("result").style.display = "block";
      document.getElementById("riskCategory").innerText = `Risk Category: ${result.riskCategory}`;
      document.getElementById("totalRisk").innerText = `Total Risk Score: ${result.totalRisk}`;
      document.getElementById("bmiResult").innerText = `BMI: ${result.bmi}`;
    })
    .catch((err) => {
      console.error("Error calculating risk:", err);
    });
});
