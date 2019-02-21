import _ from 'lodash';

export class Wordlist {
  constructor() {
    this.set = new Set;
    this.ordered = [];
    this.validities = {};
  }
  add(entry) {
    if (false === this.set.has(entry)) {
      this.set.add(entry);
      /*
      const index = _.sortedIndex(this.ordered, entry);
      this.ordered.splice(index, 0, entry);
      */
     this.ordered.unshift(entry);
      this.validities[entry] = undefined; // not yet known
      return true; // added
    }
    return false; // not added
  }
  with(entry) {
    this.add(entry);
    return this;
  }
  map(f) {
    return this.ordered.map(f);
  }
  setStatus(entry, isOk) {
    this.validities[entry] = isOk;
  }
  status(entry) {
    // active, success, or danger result in blue, green, or red coloration
    return this.validities[entry];
  }
  isEmpty() {
    return this.ordered.length === 0;
  }
}
