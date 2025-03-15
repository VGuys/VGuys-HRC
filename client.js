document.getElementById("riskForm").addEventListener("submit", async function (e) {
    e.preventDefault();
  
    const age = parseInt(document.getElementById("age").value, 10);
    const height = parseFloat(document.getElementById("height").value);
    const weight = parseFloat(document.getElementById("weight").value);
    const systolic = parseInt(document.getElementById("systolic").value, 10);
    const diastolic = parseInt(document.getElementById("diastolic").value, 10);
  
    const checkboxes = document.querySelectorAll('input[name="familyHistory"]:checked');
    const familyHistory = Array.from(checkboxes).map(cb => cb.value);
  
    const errorMsg = document.getElementById("errorMsg");
    const resultDiv = document.getElementById("result");
    errorMsg.textContent = "";
    resultDiv.innerHTML = "";
  
    // Input validation
    if (isNaN(age) || age <= 0 ||
        isNaN(height) || height < 60 ||
        isNaN(weight) || weight <= 0 ||
        isNaN(systolic) || systolic <= 0 ||
        isNaN(diastolic) || diastolic <= 0) {
      errorMsg.textContent = "Please ensure all values are positive and height is at least 60 cm.";
      return;
    }
  
    // Send to backend
    try {
      const response = await fetch('/api/calculate-risk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ age, height, weight, systolic, diastolic, familyHistory })
      });
  
      const data = await response.json();
  
      if (response.ok) {
        resultDiv.innerHTML = `
          <h3>Summary</h3>
          <ul>
            <li><strong>Age:</strong> ${age}</li>
            <li><strong>BMI:</strong> ${data.bmi}</li>
            <li><strong>Blood Pressure:</strong> ${systolic}/${diastolic} mmHg</li>
            <li><strong>Family History:</strong> ${familyHistory.length ? familyHistory.join(', ') : "None"}</li>
          </ul>
          <h3>Risk Category: <span>${data.riskCategory}</span></h3>
          <p>Risk Score: ${data.riskScore}</p>
        `;
      } else {
        errorMsg.textContent = data.error || "Something went wrong.";
      }
  
    } catch (err) {
      errorMsg.textContent = "Failed to connect to server.";
    }
  });
  