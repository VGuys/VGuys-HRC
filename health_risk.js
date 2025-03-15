function calculateHealthRisk(data) {
    const { age, height, weight, systolic, diastolic, familyHistory } = data;

    // Ensure required fields are provided
    if (!age || !height || !weight || (!systolic && !diastolic) || !Array.isArray(familyHistory)) {
        throw new Error('Missing required fields');
    }

    // Calculate BMI
    const heightInMeters = height / 100; // Convert height to meters
    const bmi = weight / (heightInMeters * heightInMeters); // BMI formula

    let riskScore = 0;

    // Age points
    if (age < 30) riskScore += 0;
    else if (age < 45) riskScore += 10;
    else if (age < 60) riskScore += 20;
    else riskScore += 30;

    // BMI points
    if (bmi >= 30) riskScore += 75;  // Obesity
    else if (bmi >= 25) riskScore += 30;  // Overweight

    // Blood pressure points (use systolic and diastolic correctly)
    if ((systolic > 180) || (diastolic > 120)) {
        riskScore += 100; // Hypertensive Crisis
    } else if ((systolic >= 140) || (diastolic >= 90)) {
        riskScore += 75; // Stage 2 Hypertension
    } else if ((systolic >= 130 && systolic <= 139) || (diastolic >= 80 && diastolic <= 89)) {
        riskScore += 30; // Stage 1 Hypertension
    } else if ((systolic >= 120 && systolic <= 129) && diastolic < 80) {
        riskScore += 15; // Elevated
    } else if (systolic < 120 && diastolic < 80) {
        riskScore += 0; // Normal
    }    

    // Family history points
    if (familyHistory.includes("diabetes")) riskScore += 10;
    if (familyHistory.includes("cancer")) riskScore += 10;
    if (familyHistory.includes("heart disease")) riskScore += 10;

    // Determine risk category
    let riskCategory = 'Low Risk';
    if (riskScore > 75) riskCategory = 'Uninsurable';
    else if (riskScore > 50) riskCategory = 'High Risk';
    else if (riskScore > 20) riskCategory = 'Moderate Risk';

    return { riskCategory, riskScore, bmi: bmi.toFixed(2) }; // Return bmi as a string with 2 decimals
}

module.exports = calculateHealthRisk;
