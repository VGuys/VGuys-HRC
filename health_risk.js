function calculateHealthRisk(data) {
    const { age, height, weight, systolic, diastolic, familyHistory } = data;

    if (!age || !height || !weight || (!systolic && !diastolic) || !Array.isArray(familyHistory)) {
        throw new Error('Missing required fields');
    }

    // Calculate BMI
    const heightInMeters = height / 100;
    const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(2);

    let riskScore = 0;

    // Age points
    if (age < 30) riskScore += 0;
    else if (age < 45) riskScore += 2;
    else if (age < 60) riskScore += 4;
    else riskScore += 6;

    // BMI points
    if (bmi > 30) riskScore += 2;

    // Blood pressure points (use systolic if available, else diastolic)
    if (systolic && systolic >= 140) riskScore += 3;
    if (systolic && systolic >= 160) riskScore += 5;
    if (!systolic && diastolic && diastolic >= 90) riskScore += 3;
    if (!systolic && diastolic && diastolic >= 100) riskScore += 5;

    // Family history points
    if (familyHistory.includes("diabetes")) riskScore += 2;
    if (familyHistory.includes("cancer")) riskScore += 2;
    if (familyHistory.includes("heart disease")) riskScore += 3;

    // Determine risk category
    let riskCategory = 'Low';
    if (riskScore >= 7) riskCategory = 'High';
    else if (riskScore >= 4) riskCategory = 'Moderate';

    return { riskCategory, riskScore, bmi };
}

module.exports = calculateHealthRisk;
