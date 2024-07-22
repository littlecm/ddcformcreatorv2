import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { fields, webhookUrl } = req.body;
    
    // Add server-side validation for fields and webhookUrl
    if (!fields || !Array.isArray(fields) || !webhookUrl) {
      return res.status(400).json({ message: 'Invalid input' });
    }

    const formId = uuidv4();
    const formData = { fields, webhookUrl };

    const filePath = path.join(process.cwd(), 'data', `${formId}.json`);

    try {
      fs.writeFileSync(filePath, JSON.stringify(formData));
      res.status(200).json({ formId });
    } catch (error) {
      console.error('Error writing file', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
