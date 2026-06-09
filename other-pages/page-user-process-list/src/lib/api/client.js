/**
 * HTTP client for Bonita REST API with CSRF token handling.
 *
 * Uses ../API/* relative paths, same as other Bonita custom pages.
 * In dev mode, Vite proxy rewrites these to the Bonita runtime.
 */

function getCookie(name) {
    const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
    return match ? match[1] : null;
}

function buildHeaders() {
    const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    };
    const csrfToken = getCookie('X-Bonita-API-Token');
    if (csrfToken) {
        headers['X-Bonita-API-Token'] = csrfToken;
    }
    return headers;
}

async function handleResponse(response) {
    if (response.ok) {
        return response;
    }
    if (response.status === 401 || response.status === 503) {
        // Only reload if embedded in Bonita (iframe). In standalone dev mode,
        // window.parent === window — reloading would cause an infinite loop.
        if (window.parent !== window) {
            window.parent.location.reload();
            // Return a never-resolving Promise so the caller does NOT continue
            // into `.json()` (or any subsequent chain) while the parent frame
            // tears this iframe down for the reload. The Promise is GC'd with
            // the iframe. Standard Bonita custom-page pattern.
            return new Promise(() => {});
        }
    }
    const error = new Error(`API error: ${response.status} ${response.statusText}`);
    error.status = response.status;
    error.response = response;
    throw error;
}

export async function get(url) {
    const response = await fetch(url, {
        method: 'GET',
        credentials: 'same-origin',
        headers: buildHeaders(),
    });
    return handleResponse(response);
}

export async function post(url, body) {
    const options = {
        method: 'POST',
        credentials: 'same-origin',
        headers: buildHeaders(),
    };
    if (body !== undefined) {
        options.body = JSON.stringify(body);
    }
    const response = await fetch(url, options);
    return handleResponse(response);
}

export async function put(url, body) {
    const response = await fetch(url, {
        method: 'PUT',
        credentials: 'same-origin',
        headers: buildHeaders(),
        body: JSON.stringify(body),
    });
    return handleResponse(response);
}

export async function del(url) {
    const response = await fetch(url, {
        method: 'DELETE',
        credentials: 'same-origin',
        headers: buildHeaders(),
    });
    return handleResponse(response);
}
