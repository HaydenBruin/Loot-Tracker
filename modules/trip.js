class Trip {
  constructor() {
    this._trip = {
      people: []
    };
  }

  getTripData() {
    return this._trip;
  }

  return {
    getTripData
  }
}

module.exports = Trip;