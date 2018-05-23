export default class Pagination {
  constructor(page, size, total) {
    this.page = page;
    this.size = size; // = bonita `c` parameter (count)
    this.total = total;
  }

  static from(contentRange) {
    const match = /(\d+)-(\d+)\/(\d+)/g.exec(contentRange);
    if (!match || match.length < 4) {
      return {};
    }
    return new Pagination(
      parseInt(match[1], 10),
      parseInt(match[2], 10),
      parseInt(match[3], 10)
    );
  }
}
