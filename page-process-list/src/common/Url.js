import assignIn from 'lodash.assignin'; // deep assign
import queryString from 'query-string';

class Url {
  constructor(url, overridingProps = {}) {
    let props = url;

    if (typeof url === 'string') {
      const parser = document.createElement('a');
      parser.href = url;

      props = ['protocol', 'hostname', 'port', 'pathname'].reduce(
        (buffer, key) => {
          buffer[key] = parser[key];
          return buffer;
        },
        {
          queries: Url.parseQueries(parser.search),
          fragments: Url.parseFragments(parser.hash)
        }
      );
    }

    assignIn(this, props, overridingProps);
  }

  set(props) {
    return Object.assign(this, props);
  }

  get() {
    const { queries, fragments } = this;

    const url = [
      this.getPath(),
      Url.stringifyQueries(queries),
      Url.stringifyFragments(fragments)
    ];

    return url.join('');
  }

  getPath() {
    const { protocol, hostname, port, pathname } = this;

    return `${protocol}//${hostname}:${port}${pathname}`;
  }

  static parseQueries(str) {
    return queryString.parse(str);
  }

  static stringifyQueries(obj) {
    const str = queryString.stringify(obj);

    return !str ? null : `?${str}`;
  }

  static parseFragments(str) {
    const parsedStr = str
      .replace('#', '')
      .replace(/([a-zA-Z0-9_]*):/g, '"$1":')
      .replace(/:([a-zA-Z0-9._]*)/g, (match, p1) => (p1 ? `:"${p1}"` : ':'))
      .replace(/([[,])([a-zA-Z0-9._]*)([\],])/g, '$1"$2"$3')
      .replace(/,([a-zA-Z0-9._]*),/g, ',"$1",')
      .replace(/.*/, '{$&}');

    return JSON.parse(parsedStr);
  }

  static stringifyFragments(obj) {
    const str = JSON.stringify(obj)
      .replace(/"/g, '') // remove all "
      .slice(1, -1); // remove the two { and } that wrap the string

    return !str ? null : `#${str}`;
  }
}

export default Url;
