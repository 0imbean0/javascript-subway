import StateManager from '../core/StateManager.js';
import fetchGetSubwayState from '../api/fetchGetSubwayState.js';
import Station from '../model/station.js';
import Line from '../model/Line.js';

class SubwayStateManager extends StateManager {
  constructor() {
    super();
    this.subwayState = {
      stations: [],
      lines: [],
    };
  }

  async updateSubwayState(accessToken) {
    const state = await fetchGetSubwayState(accessToken);

    this.setSubwayState(state);
    this.notify();
  }

  setSubwayState(state) {
    const { stations, lines } = state;

    this.subwayState.stations = stations.map((station) => new Station(station));
    this.subwayState.lines = lines.map((line) => {
      line.stations.forEach(({ id }) => {
        const targetStation = this.subwayState.stations.find(
          (station) => station.id === id
        );

        targetStation.addUsedLine({
          id: line.id,
          name: line.name,
          color: line.color,
        });
      });

      return new Line(line);
    });

    console.log(this.subwayState);
  }

  getSubwayState() {
    return this.subwayState;
  }
}

export default SubwayStateManager;
