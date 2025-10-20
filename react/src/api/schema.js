import instance from './axios';
import { load } from 'js-yaml';

export async function fetchApiSchemaYAML() {
  const res = await instance.get('/api/schema', {
    responseType: 'text',
    headers: { Accept: 'application/x-yaml' }
  });
  return res.data;
}

export async function fetchApiSchema() {
  const yamlText = await fetchApiSchemaYAML();
  try {
    const parsed = load(yamlText);
    return parsed;
  } catch (err) {
    return { error: 'YamlParseError', message: err?.message, raw: yamlText };
  }
}
