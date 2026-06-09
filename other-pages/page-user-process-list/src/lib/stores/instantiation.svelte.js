import { tick } from 'svelte';
import { get } from 'svelte/store';
import { _ } from 'svelte-i18n';
import { fetchProcessByNameAndVersion, instantiateProcess } from '../api/processApi.js';
import { hasInstantiationForm } from '../api/formApi.js';
import { alerts } from './alerts.js';
import {
    readTopSearch,
    getDeepLinkProcess,
    getRedirect,
    clearDeepLinkParamsFromTop,
    buildInstantiationFormSearch,
    buildRedirectUrl,
} from '../utils/url.js';

/**
 * Instantiation orchestration — view dispatch (list ↔ iframe ↔ confirm modal),
 * deep-link handling, redirect-on-success, and keyboard focus restoration.
 *
 * Extracted from App.svelte so the page shell stays declarative and the flow
 * is independently unit-testable. State is exposed via the `instantiationState`
 * proxy; consumers read it directly in Svelte 5 templates (`instantiationState.view`)
 * and Svelte tracks the access for reactivity.
 *
 * The state proxy is the public reactive surface; mutations happen only inside
 * the action functions below.
 *
 * Lifetime: this is a module-level `$state` singleton — its values persist for
 * the lifetime of the page (across component remounts, route changes within the
 * Svelte tree, etc). Tests MUST call `_resetInstantiation()` between cases or
 * state will leak across test cases. The page only ever has one active flow,
 * so a singleton matches the actual usage shape.
 */
export const instantiationState = $state({
    /** @type {'list' | 'instantiation'} */
    view: 'list',
    /** Props handed to the Instantiation iframe view. */
    params: /** @type {{processName: string, processVersion: string, search: string} | null} */ (null),
    confirmShown: false,
    /** Process awaiting confirmation in the no-form modal. */
    processToConfirm: /** @type {object | null} */ (null),
    /** Set on the deep-link path; gates redirect-on-success so a stale
        `?redirect=` from a previous flow never affects a manual click. */
    redirectTargetOnSuccess: /** @type {string | null} */ (null),
});

// Element to refocus when the instantiation overlay is dismissed — preserves
// keyboard-user context (the row that was activated regains focus).
let focusReturnTarget = null;

// Request-id guard for handleProcessStart / checkDeepLink: rapid clicks on
// different rows could otherwise leave both the iframe overlay AND the confirm
// modal open if Row A's `hasInstantiationForm` resolves true while Row B's
// resolves false. Each call captures its id; only the latest may commit to
// component state.
let lastStartId = 0;

function setFocusReturnTarget(el) {
    focusReturnTarget = el;
}

function restoreFocus() {
    const target = focusReturnTarget;
    focusReturnTarget = null;
    if (!target || typeof target.focus !== 'function') return;
    tick().then(() => {
        try { target.focus(); } catch { /* element no longer attached */ }
    });
}

async function showInstantiationForm(process, search, reqId) {
    const hasForm = await hasInstantiationForm(process.id);
    // Stale-request guard: a newer row click may have superseded this one.
    if (reqId !== lastStartId) return;
    if (hasForm) {
        instantiationState.params = {
            processName: process.name,
            processVersion: process.version,
            search,
        };
        instantiationState.view = 'instantiation';
    } else {
        instantiationState.processToConfirm = process;
        instantiationState.confirmShown = true;
    }
}

export async function handleProcessStart(process) {
    const reqId = ++lastStartId;
    setFocusReturnTarget(document.activeElement);
    instantiationState.redirectTargetOnSuccess = null;
    const search = buildInstantiationFormSearch(process, window.location.search, { keepRedirect: false });
    await showInstantiationForm(process, search, reqId);
}

export async function confirmInstantiation() {
    if (!instantiationState.processToConfirm) return;
    const proc = instantiationState.processToConfirm;
    // Snapshot the redirect BEFORE the await — an interleaved manual click
    // (handleProcessStart) clears `redirectTargetOnSuccess` to null, and
    // reading after the await would silently drop the deep-link redirect.
    const redirect = instantiationState.redirectTargetOnSuccess;
    instantiationState.confirmShown = false;
    instantiationState.processToConfirm = null;
    try {
        const response = await instantiateProcess(proc.id);
        if (redirect) {
            try {
                const url = buildRedirectUrl(redirect);
                if (url) {
                    window.top.location.href = url;
                    return;
                }
                // Invalid/unsafe redirect target — fall through to in-page success.
            } catch {
                // fall through to in-page success
            }
        }
        const t = get(_);
        alerts.success(
            t('The case {caseId} has been started successfully.', { values: { caseId: response.caseId } }),
        );
    } catch {
        const t = get(_);
        alerts.error(t('Error while starting the case.'));
    } finally {
        instantiationState.redirectTargetOnSuccess = null;
        restoreFocus();
    }
}

export function cancelInstantiation() {
    instantiationState.view = 'list';
    instantiationState.params = null;
    instantiationState.redirectTargetOnSuccess = null;
    restoreFocus();
}

export function dismissConfirm() {
    instantiationState.confirmShown = false;
    instantiationState.processToConfirm = null;
    instantiationState.redirectTargetOnSuccess = null;
    restoreFocus();
}

export async function checkDeepLink() {
    const reqId = ++lastStartId;
    const topSearch = readTopSearch();
    const deepLink = getDeepLinkProcess(topSearch);
    if (!deepLink) return;
    const process = await fetchProcessByNameAndVersion(deepLink.processName, deepLink.processVersion);
    if (!process) {
        // Process is missing/disabled/wrong version. Strip the deep-link params
        // so a refresh doesn't silently re-trigger the same lookup, and tell
        // the user why the auto-launch did nothing.
        clearDeepLinkParamsFromTop();
        const t = get(_);
        alerts.warning(
            t('error.processNotFound', {
                values: { processName: deepLink.processName, processVersion: deepLink.processVersion },
            }),
        );
        return;
    }
    // Capture redirect BEFORE clearing the URL params (clearDeepLinkParamsFromTop
    // only strips processName/processVersion, but a future change might widen it).
    instantiationState.redirectTargetOnSuccess = getRedirect(topSearch);
    clearDeepLinkParamsFromTop();
    const search = buildInstantiationFormSearch(process, topSearch, { keepRedirect: true });
    await showInstantiationForm(process, search, reqId);
}

// Test seam: clear all state and pending focus restoration between tests.
export function _resetInstantiation() {
    instantiationState.view = 'list';
    instantiationState.params = null;
    instantiationState.confirmShown = false;
    instantiationState.processToConfirm = null;
    instantiationState.redirectTargetOnSuccess = null;
    focusReturnTarget = null;
    lastStartId = 0;
}
