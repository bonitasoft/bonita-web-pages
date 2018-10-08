import assignIn from 'lodash.assignin'; // deep assign

class Url {
  constructor(url, overridingProps = {}) {
    let props = url;

    if (typeof url === 'string') {
      const parser = document.createElement('a');
      parser.href = url;

      props = ['pathname'].reduce(
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
    const { pathname } = this;

    return pathname;
  }

  static parseQueries(str) {
    return str
      .replace('?', '')
      .replace(/\+/g, ' ')
      .split('&')
      .filter(param => param) // to have empty array if split on empty str
      .map(param => param.split('='))
      .map(([key, value]) => [key, value])
      .reduce((queries, [key, value]) => {
        queries[key] =
          typeof queries[key] === 'undefined'
            ? value
            : [].concat(queries[key], value);

        return queries;
      }, {});
  }

  static stringifyQueries(obj) {
    const str = Object.keys(obj)
      .map(key => [key, obj[key]])
      .filter(([key, value]) => typeof value !== 'undefined')
      .map(
        ([key, value]) =>
          !Array.isArray(value)
            ? `${key}=${value}`
            : value.map(element => `${key}=${element}`).join('&')
      )
      .join('&');

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
