// Function to handle form submission and calculate risk
document.getElementById("riskForm").addEventListener("submit", function (event) {
    event.preventDefault();

    // Collect form data
    const age = document.getElementById("age").value;
    const height = document.getElementById("height").value;
    const weight = document.getElementById("weight").value;
    const systolic = document.getElementById("systolic").value;
    const diastolic = document.getElementById("diastolic").value;

    // Collect family history data (checkboxes)
    const familyHistory = [];
    if (document.getElementById("diabetes").checked) familyHistory.push("diabetes");
    if (document.getElementById("cancer").checked) familyHistory.push("cancer");
    if (document.getElementById("alzheimers").checked) familyHistory.push("alzheimers");

    // Prepare the data to send to the server
    const data = {
        age: parseInt(age),
        height: parseInt(height),
        weight: parseInt(weight),
        systolic: parseInt(systolic),
        diastolic: parseInt(diastolic),
        familyHistory: familyHistory
    };

    // Send the data to the server using fetch
    fetch("https://vguys-healthcalculator-gkdrhvemhphfabf6.uaenorth-01.azurewebsites.net/calculate-risk", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(result => {
        // Display the risk result on the page
        document.getElementById("riskCategory").innerText = `Risk Category: ${result.riskCategory}`;
        document.getElementById("totalRisk").innerText = `Total Risk Score: ${result.totalRisk}`;
        document.getElementById("bmiResult").innerText = `BMI: ${result.bmi}`;
    })
    .catch(error => {
        console.error("Error calculating risk:", error);
    });
});
