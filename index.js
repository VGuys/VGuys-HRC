document.getElementById('riskForm').addEventListener('submit', async function (e) {
    e.preventDefault();
  
    const formData = {
      age: parseInt(document.getElementById('age').value),
      height: parseFloat(document.getElementById('height').value),
      weight: parseFloat(document.getElementById('weight').value),
      systolic: parseInt(document.getElementById('systolic').value),
      diastolic: parseInt(document.getElementById('diastolic').value),
      familyHistory: Array.from(document.querySelectorAll('input[name="history"]:checked')).map(i => i.value)
    };
  
    try {
      const response = await fetch('https://vguys-hrc-cwc0cpe8fgf9bvdd.uaenorth-01.azurewebsites.net/assess', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
  
      const result = await response.json();
      document.getElementById('result').innerText = `Risk Category: ${result.risk} (Score: ${result.score})`;
    } catch (error) {
      console.error('Error:', error);
      document.getElementById('result').innerText = 'Error connecting to server.';
    }
  });
  