// pages/create-form.js

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';

export default function CreateForm() {
  const { register, handleSubmit } = useForm();
  const [fields, setFields] = useState([{ name: '', type: 'text' }]);
  const [formId, setFormId] = useState(null);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [script, setScript] = useState('');

  const addField = () => {
    setFields([...fields, { name: '', type: 'text' }]);
  };

  const onSubmit = async (data) => {
    const response = await axios.post('/api/forms', {
      fields: data.fields,
      webhookUrl: data.webhookUrl,
    });
    setFormId(response.data.formId);
    setScript(`<script src="${window.location.origin}/api/form/${response.data.formId}/embed.js"></script>`);
  };

  return (
    <div>
      <h1>Create a New Form</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        {fields.map((field, index) => (
          <div key={index}>
            <input
              {...register(`fields[${index}].name`)}
              placeholder="Field Name"
              required
            />
            <select {...register(`fields[${index}].type`)} defaultValue="text">
              <option value="text">Text</option>
              <option value="email">Email</option>
              <option value="number">Number</option>
            </select>
          </div>
        ))}
        <button type="button" onClick={addField}>Add Field</button>
        <input
          {...register('webhookUrl')}
          placeholder="Webhook URL"
          value={webhookUrl}
          onChange={(e) => setWebhookUrl(e.target.value)}
          required
        />
        <button type="submit">Create Form</button>
      </form>
      {script && (
        <div>
          <h2>Embed Code</h2>
          <textarea readOnly value={script} />
        </div>
      )}
    </div>
  );
}
