import { get } from './client.js';

export async function fetchSession() {
    const response = await get('../API/system/session/unusedId');
    return response.json();
}
