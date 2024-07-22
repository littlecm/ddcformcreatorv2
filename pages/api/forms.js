import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { fields, webhookUrl } = req.body;

    // Debugging information
    console.log('Received fields:', fields);
    console.log('Received webhookUrl:', webhookUrl);

    if (!fields || !Array.isArray(fields) || !webhookUrl) {
      console.error('Invalid input');
      return res.status(400).json({ message: 'Invalid input' });
    }

    const formId = uuidv4();
    const formData = { fields, webhookUrl };

    const filePath = path.join(process.cwd(), 'data', `${formId}.json`);
    console.log('File path:', filePath);

    try {
      fs.writeFileSync(filePath, JSON.stringify(formData));
      res.status(200).json({ formId });
    } catch (error) {
      console.error('Error writing file:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
