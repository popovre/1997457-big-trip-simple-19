import {pointIconMap, pointTitleMap} from '../maps';
import Presenter from './presenter';
import {formatDate, formatNumber, formatTime} from '../utils';


/**
 * @extends {Presenter<ListView>}
 */
export default class ListPresenter extends Presenter {
  constructor() {
    super(...arguments);

    this.updateView();
    this.pointsModel.addEventListener('filter', this.handlePointsModelFilter.bind(this));
    this.pointsModel.addEventListener('sort', this.handlePointsModelSort.bind(this));
  }

  updateView() {
    const points = this.pointsModel.list();
    const pointsViewStates = points.map(this.createPointViewState, this);

    this.view.setItems(pointsViewStates);
  }

  /**
   * @param {PointAdapter} point
   */
  createPointViewState(point) {
    const destination = this.destinationsModel.findById(point.destinationId);
    const offerGroup = this.offerGroupsModel.findById(point.type);

    const offerViewStates = offerGroup.items
      .filter((offer) =>
        point.offerIds.includes(offer.id)
      )
      .map((offer) => ({
        title: offer.title,
        price: formatNumber(offer.price)
      }));

    return {
      date: formatDate(point.startDate),
      icon: pointIconMap[point.type],
      title: `${pointTitleMap[point.type]} ${destination.name}`,
      startTime: formatTime(point.startDate),
      startDate: '',
      endTime: formatTime(point.endDate),
      endDate: '',
      basePrice: formatNumber(point.basePrice),
      offers: offerViewStates
    };
  }

  handlePointsModelFilter() {
    this.updateView();
  }

  handlePointsModelSort() {
    this.updateView();
  }
}
// console.log(ListPresenter.prototype)