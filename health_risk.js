const http = require('http');
const fs = require('fs');

function calculateRisk(data) {
  const { age, height, weight, systolic, diastolic, familyHistory } = data;
  let score = 0;

  // Age
  if (age < 30) score += 0;
  else if (age < 45) score += 10;
  else if (age < 60) score += 20;
  else score += 30;

  // BMI
  const bmi = weight / (height * height);
  if (bmi < 18.5 || bmi > 34.9) score += 75; // considered high risk if very low or obese
  else if (bmi >= 30) score += 75;
  else if (bmi >= 25) score += 30;
  else score += 0;

  // Blood Pressure
  if (systolic < 120 && diastolic < 80) score += 0;
  else if (systolic < 130 && diastolic < 80) score += 15;
  else if ((systolic < 140) || (diastolic < 90)) score += 30;
  else if ((systolic < 180) || (diastolic < 120)) score += 75;
  else score += 100;

  // Family History
  if (familyHistory.includes("diabetes")) score += 10;
  if (familyHistory.includes("cancer")) score += 10;
  if (familyHistory.includes("alzheimer")) score += 10;

  // Risk Level
  let risk = "uninsurable";
  if (score <= 20) risk = "low risk";
  else if (score <= 50) risk = "moderate risk";
  else if (score <= 75) risk = "high risk";

  return { score, risk };
}

// Backend server
const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/assess') {
    let body = '';
    req.on('data', chunk => (body += chunk));
    req.on('end', () => {
      const data = JSON.parse(body);
      const result = calculateRisk(data);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    });
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
