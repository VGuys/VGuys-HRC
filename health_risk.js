module.exports = async function (context, req) {
  const riskCategories = {
    low: "Low Risk",
    moderate: "Moderate Risk",
    high: "High Risk",
    uninsurable: "Uninsurable",
  };

  function calculateBMI(height, weight) {
    const heightInMeters = height / 100;
    return (weight / (heightInMeters * heightInMeters)).toFixed(2);
  }

  function calculateAgePoints(age) {
    if (age < 30) return 0;
    if (age < 45) return 10;
    if (age < 60) return 20;
    return 30;
  }

  function calculateBPPoints(systolic, diastolic) {
    if (systolic < 120 && diastolic < 80) return 0;
    if (systolic < 130 && diastolic < 80) return 15;
    if (systolic < 140 || diastolic < 90) return 30;
    if (systolic < 180 || diastolic < 120) return 75;
    return 100;
  }

  function calculateFamilyHistoryPoints(history) {
    let points = 0;
    if (history.includes("diabetes")) points += 10;
    if (history.includes("cancer")) points += 10;
    if (history.includes("alzheimers")) points += 10;
    return points;
  }

  const { age, height, weight, systolic, diastolic, familyHistory } = req.body;

  const bmi = calculateBMI(height, weight);
  const agePoints = calculateAgePoints(age);
  const bmiPoints = bmi < 25 ? 0 : bmi < 30 ? 30 : 75;
  const bpPoints = calculateBPPoints(systolic, diastolic);
  const familyPoints = calculateFamilyHistoryPoints(familyHistory);

  const totalRisk = agePoints + bmiPoints + bpPoints + familyPoints;

  let riskCategory = "";
  if (totalRisk <= 20) riskCategory = riskCategories.low;
  else if (totalRisk <= 50) riskCategory = riskCategories.moderate;
  else if (totalRisk <= 75) riskCategory = riskCategories.high;
  else riskCategory = riskCategories.uninsurable;

  context.res = {
    body: {
      riskCategory,
      totalRisk,
      bmi,
    },
  };
};
