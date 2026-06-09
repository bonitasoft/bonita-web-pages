import { get } from './client.js';

/**
 * Fetch the start-form mapping list for a process.
 * Bonita returns a 1-element array (or empty if no mapping exists).
 */
export async function fetchStartFormMapping(processId) {
    const url = `../API/form/mapping?c=10&p=0&f=processDefinitionId%3D${encodeURIComponent(processId)}&f=type%3DPROCESS_START`;
    const response = await get(url);
    return response.json();
}

/**
 * True iff the process has a usable instantiation form.
 * - target === 'INTERNAL' or 'URL' → has a form (iframe instantiation path)
 * - target === 'NONE' or no mapping → no form (confirm-modal + direct API instantiation path)
 */
export async function hasInstantiationForm(processId) {
    const mappings = await fetchStartFormMapping(processId);
    return Boolean(mappings[0] && mappings[0].target !== 'NONE');
}
