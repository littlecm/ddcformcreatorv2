// pages/api/form/[formId]/embed.js
import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const { formId } = req.query;
  const filePath = path.join(process.cwd(), 'data', `${formId}.json`);

  if (fs.existsSync(filePath)) {
    const formData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const formHtml = `
      <form id="custom-form-${formId}">
        ${formData.fields.map(field => `
          <label>${field.name}</label>
          <input type="${field.type}" name="${field.name}" required />
        `).join('')}
        <button type="submit">Submit</button>
      </form>
      <script>
        document.getElementById('custom-form-${formId}').addEventListener('submit', function(event) {
          event.preventDefault();
          const formData = new FormData(event.target);
          fetch('${formData.webhookUrl}', {
            method: 'POST',
            body: JSON.stringify(Object.fromEntries(formData)),
            headers: { 'Content-Type': 'application/json' },
          });
        });
      </script>
    `;
    res.setHeader('Content-Type', 'text/javascript');
    res.status(200).send(formHtml);
  } else {
    res.status(404).json({ message: 'Form not found' });
  }
}
