document.getElementById('riskForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const age = parseInt(document.getElementById('age').value);
    const height = parseFloat(document.getElementById('height').value);
    const weight = parseFloat(document.getElementById('weight').value);
    const systolic = parseInt(document.getElementById('systolic').value) || null;
    const diastolic = parseInt(document.getElementById('diastolic').value) || null;

    const familyHistory = Array.from(document.querySelectorAll('input[name="familyHistory"]:checked')).map(input => input.value);

    const data = { age, height, weight, systolic, diastolic, familyHistory };

    const errorMsg = document.getElementById('errorMsg');
    const resultDiv = document.getElementById('result');

    try {
        errorMsg.textContent = '';
        resultDiv.textContent = 'Calculating...';

        const response = await fetch('/api/calculate-risk', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            resultDiv.innerHTML = `
                <strong>Risk Category:</strong> ${result.riskCategory}<br/>
                <strong>Risk Score:</strong> ${result.riskScore}<br/>
                <strong>BMI:</strong> ${result.bmi}
            `;
        } else {
            throw new Error(result.error || 'Something went wrong.');
        }
    } catch (err) {
        errorMsg.textContent = err.message;
        resultDiv.textContent = '';
    }
});
