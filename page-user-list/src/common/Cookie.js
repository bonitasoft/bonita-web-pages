class Cookie {
  getValue(name) {
    // from https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie
    const regexp = new RegExp(
      `(?:(?:^|.*;\\s*)${name}\\s*\\=\\s*([^;]*).*$)|^.*$`
    );
    return document.cookie.replace(regexp, '$1');
  }
}

export default new Cookie();
