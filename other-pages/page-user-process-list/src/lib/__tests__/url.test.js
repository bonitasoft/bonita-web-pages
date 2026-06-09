import { describe, it, expect } from 'vitest';
import {
    getDeepLinkProcess,
    getRedirect,
    buildInstantiationFormSearch,
    buildRedirectUrl,
} from '../utils/url.js';

describe('getDeepLinkProcess', () => {
    it('returns the parsed process when both processName and processVersion are present', () => {
        expect(getDeepLinkProcess('?processName=Foo&processVersion=1.0'))
            .toEqual({ processName: 'Foo', processVersion: '1.0' });
    });

    it('handles search strings without a leading "?"', () => {
        expect(getDeepLinkProcess('processName=Foo&processVersion=1.0'))
            .toEqual({ processName: 'Foo', processVersion: '1.0' });
    });

    it('returns null when processVersion is missing', () => {
        expect(getDeepLinkProcess('?processName=Foo')).toBeNull();
    });

    it('returns null when processName is missing', () => {
        expect(getDeepLinkProcess('?processVersion=1.0')).toBeNull();
    });

    it('returns null on empty/missing input', () => {
        expect(getDeepLinkProcess('')).toBeNull();
        expect(getDeepLinkProcess(null)).toBeNull();
        expect(getDeepLinkProcess(undefined)).toBeNull();
    });

    it('decodes URL-encoded process names with spaces', () => {
        expect(getDeepLinkProcess('?processName=My%20Process&processVersion=1.0'))
            .toEqual({ processName: 'My Process', processVersion: '1.0' });
    });
});

describe('getRedirect', () => {
    it('returns the redirect param when present', () => {
        expect(getRedirect('?redirect=case-list')).toBe('case-list');
    });

    it('returns null when no redirect param exists', () => {
        expect(getRedirect('?app=userAppBonita')).toBeNull();
    });

    it('returns null on empty input', () => {
        expect(getRedirect('')).toBeNull();
        expect(getRedirect(null)).toBeNull();
    });

    it('decodes URL-encoded values', () => {
        expect(getRedirect('?redirect=%2Fcase-list')).toBe('/case-list');
    });
});

describe('buildInstantiationFormSearch', () => {
    const process = { id: '12345' };

    it('always includes id and autoInstantiate=false', () => {
        const search = buildInstantiationFormSearch(process, '');
        expect(search).toContain('id=12345');
        expect(search).toContain('autoInstantiate=false');
    });

    it('preserves the app param from the source URL', () => {
        const search = buildInstantiationFormSearch(process, '?app=userAppBonita');
        expect(search).toContain('app=userAppBonita');
    });

    it('drops the redirect param when keepRedirect is false (manual click path)', () => {
        const search = buildInstantiationFormSearch(process, '?redirect=case-list', { keepRedirect: false });
        expect(search).not.toContain('redirect=');
    });

    it('preserves the redirect param when keepRedirect is true (deep-link path)', () => {
        const search = buildInstantiationFormSearch(process, '?redirect=case-list', { keepRedirect: true });
        expect(search).toContain('redirect=case-list');
    });

    it('form-encodes spaces in the process id as `+` (URLSearchParams default)', () => {
        // URLSearchParams.toString() uses application/x-www-form-urlencoded
        // encoding, which represents spaces as `+`, not `%20`. Bonita's form
        // page accepts both, but pinning the actual emitted shape here so a
        // future change to a different encoder surfaces explicitly.
        const search = buildInstantiationFormSearch({ id: 'a b' }, '');
        expect(search).toContain('id=a+b');
    });

    it('returns a string starting with "?"', () => {
        const search = buildInstantiationFormSearch(process, '');
        expect(search.startsWith('?')).toBe(true);
    });

    it('treats keepRedirect=true as no-op when no redirect is in source', () => {
        const search = buildInstantiationFormSearch(process, '?app=userAppBonita', { keepRedirect: true });
        expect(search).not.toContain('redirect=');
        expect(search).toContain('app=userAppBonita');
    });
});

describe('buildRedirectUrl', () => {
    it('appends a safe relative path to the parent location', () => {
        // jsdom default is "http://localhost/" — origin "http://localhost", pathname "/"
        const url = buildRedirectUrl('case-list');
        expect(url).toContain('http://localhost');
        expect(url).toContain('case-list');
    });

    it('returns null for an empty/missing redirect', () => {
        expect(buildRedirectUrl('')).toBeNull();
        expect(buildRedirectUrl(undefined)).toBeNull();
    });

    it('rejects an absolute URL (open-redirect guard)', () => {
        expect(buildRedirectUrl('https://evil.example.com')).toBeNull();
        expect(buildRedirectUrl('javascript:alert(1)')).toBeNull();
    });

    it('rejects a protocol-relative target', () => {
        expect(buildRedirectUrl('//evil.example.com/phish')).toBeNull();
    });

    it('rejects a root-absolute path', () => {
        expect(buildRedirectUrl('/admin')).toBeNull();
    });

    it('rejects parent-directory traversal', () => {
        expect(buildRedirectUrl('../../somewhere')).toBeNull();
        expect(buildRedirectUrl('a/../../b')).toBeNull();
    });
});
