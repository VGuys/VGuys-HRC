module.exports = async function (context, req) {
  const riskCategories = {
    low: "Low Risk",
    moderate: "Moderate Risk",
    high: "High Risk",
    uninsurable: "Uninsurable",
  };

  function calculateBMI(height, weight) {
    if (height <= 0 || weight <= 0) return null; // Prevent division errors
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
    if (!Array.isArray(history)) return 0;
    let points = 0;
    if (history.includes("diabetes")) points += 10;
    if (history.includes("cancer")) points += 10;
    if (history.includes("alzheimers")) points += 10;
    return points;
  }

  // Extract input data
  const { age, height, weight, systolic, diastolic, familyHistory } = req.body || {};

  // Collect error messages
  let errors = [];
  if (!age || age <= 0) errors.push("Age must be a positive number.");
  if (!height || height <= 0) errors.push("Height must be a positive number.");
  if (!weight || weight <= 0) errors.push("Weight must be a positive number.");
  if (!systolic || systolic <= 0) errors.push("Systolic blood pressure must be a positive number.");
  if (!diastolic || diastolic <= 0) errors.push("Diastolic blood pressure must be a positive number.");
  if (!Array.isArray(familyHistory)) errors.push("Family history must be a valid list.");

  // If there are errors, return them to the user
  if (errors.length > 0) {
    context.res = {
      status: 400,
      body: { errors },
    };
    return;
  }

  // Proceed with calculations if inputs are valid
  const bmi = calculateBMI(height, weight);
  if (!bmi) {
    context.res = {
      status: 400,
      body: { errors: ["Invalid height or weight values."] },
    };
    return;
  }

  const agePoints = calculateAgePoints(age);
  const bmiPoints = bmi < 25 ? 0 : bmi < 30 ? 30 : 75;
  const bpPoints = calculateBPPoints(systolic, diastolic);
  const familyPoints = calculateFamilyHistoryPoints(familyHistory);

  const totalRisk = agePoints + bmiPoints + bpPoints + familyPoints;

  let riskCategory = riskCategories.uninsurable;
  if (totalRisk <= 20) riskCategory = riskCategories.low;
  else if (totalRisk <= 50) riskCategory = riskCategories.moderate;
  else if (totalRisk <= 75) riskCategory = riskCategories.high;

  context.res = {
    status: 200,
    body: {
      riskCategory,
      totalRisk,
      bmi,
    },
  };
};
