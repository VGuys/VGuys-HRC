const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Middleware for parsing JSON bodies
app.use(express.json());

// Risk categories based on score
const riskCategories = {
    low: "Low Risk",
    moderate: "Moderate Risk",
    high: "High Risk",
    uninsurable: "Uninsurable"
};

// Function to calculate BMI
function calculateBMI(height, weight) {
    const heightInMeters = height / 100; // Convert height from cm to meters
    return (weight / (heightInMeters * heightInMeters)).toFixed(2);
}

// Function to calculate age points
function calculateAgePoints(age) {
    if (age < 30) return 0;
    if (age < 45) return 10;
    if (age < 60) return 20;
    return 30;
}

// Function to calculate blood pressure points
function calculateBPPoints(systolic, diastolic) {
    if (systolic < 120 && diastolic < 80) return 0; // Normal
    if (systolic < 130 && diastolic < 80) return 15; // Elevated
    if (systolic < 140 || diastolic < 90) return 30; // Stage 1
    if (systolic < 180 || diastolic < 120) return 75; // Stage 2
    return 100; // Crisis
}

// Function to calculate family history points
function calculateFamilyHistoryPoints(familyHistory) {
    let points = 0;
    if (familyHistory.includes('diabetes')) points += 10;
    if (familyHistory.includes('cancer')) points += 10;
    if (familyHistory.includes('alzheimers')) points += 10;
    return points;
}

// API endpoint for calculating health risk
app.post('/calculate-risk', (req, res) => {
    const { age, height, weight, systolic, diastolic, familyHistory } = req.body;

    // Calculate BMI
    const bmi = calculateBMI(height, weight);

    // Calculate points
    const agePoints = calculateAgePoints(age);
    const bmiPoints = bmi < 25 ? 0 : (bmi < 30 ? 30 : 75);
    const bpPoints = calculateBPPoints(systolic, diastolic);
    const familyHistoryPoints = calculateFamilyHistoryPoints(familyHistory);

    // Total risk score
    const totalRisk = agePoints + bmiPoints + bpPoints + familyHistoryPoints;

    // Determine risk category
    let riskCategory = "";
    if (totalRisk <= 20) riskCategory = riskCategories.low;
    else if (totalRisk <= 50) riskCategory = riskCategories.moderate;
    else if (totalRisk <= 75) riskCategory = riskCategories.high;
    else riskCategory = riskCategories.uninsurable;

    // Return the calculated results
    res.json({
        riskCategory,
        totalRisk,
        bmi
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
