function calculateHealthRisk(data) {
    const { age, height, weight, systolic, diastolic, familyDiseases } = data;

    if (
        typeof age === 'undefined' || 
        typeof height === 'undefined' || 
        typeof weight === 'undefined' ||
        typeof systolic === 'undefined' ||
        typeof diastolic === 'undefined' ||
        !Array.isArray(familyDiseases)
    ) {
        throw new Error('Missing or invalid fields');
    }

    let riskScore = 0;

    // Age points
    if (age < 30) riskScore += 0;
    else if (age < 45) riskScore += 10;
    else if (age < 60) riskScore += 20;
    else riskScore += 30;

    // BMI Calculation
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    if (bmi >= 18.5 && bmi <= 24.9) riskScore += 0;
    else if (bmi >= 25 && bmi <= 29.9) riskScore += 30;
    else riskScore += 75;

    // Blood Pressure points
    if (systolic < 120 && diastolic < 80) riskScore += 0;
    else if (systolic < 130 && diastolic < 80) riskScore += 15;
    else if (systolic < 140 || diastolic < 90) riskScore += 30;
    else if (systolic < 180 || diastolic < 120) riskScore += 75;
    else riskScore += 100;

    // Family diseases
    const diseasePoints = {
        diabetes: 10,
        cancer: 10,
        'alzheimer’s': 10
    };

    for (const disease of familyDiseases) {
        const key = disease.toLowerCase();
        if (diseasePoints[key]) riskScore += diseasePoints[key];
    }

    // Risk Category
    let riskCategory = 'Low';
    if (riskScore >= 150) riskCategory = 'High';
    else if (riskScore >= 75) riskCategory = 'Moderate';

    return {
        riskScore,
        riskCategory,
        bmi: bmi.toFixed(1)
    };
}

module.exports = calculateHealthRisk;
