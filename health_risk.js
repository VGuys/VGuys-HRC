function calculateHealthRisk(data) {
    const { age, bmi, smoker, activityLevel } = data;

    if (!age || !bmi || typeof smoker === 'undefined' || !activityLevel) {
        throw new Error('Missing required fields');
    }

    let riskScore = 0;

    if (age > 45) riskScore += 2;
    if (bmi > 30) riskScore += 2;
    if (smoker) riskScore += 3;

    switch (activityLevel.toLowerCase()) {
        case 'low':
            riskScore += 2;
            break;
        case 'medium':
            riskScore += 1;
            break;
        case 'high':
            break;
        default:
            throw new Error('Invalid activity level');
    }

    let riskCategory = 'Low';
    if (riskScore >= 7) riskCategory = 'High';
    else if (riskScore >= 4) riskCategory = 'Moderate';

    return riskCategory;
}

module.exports = calculateHealthRisk;
