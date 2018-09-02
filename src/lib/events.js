import {inject}          from 'aurelia-dependency-injection';
import {EventAggregator} from 'aurelia-event-aggregator';

@inject(EventAggregator)

/**
 * Provides event aggregation methods.
 *
 * @requires EventAggregator
 */
export class Events {

  /**
   * Create a new instance of Events.
   *
   * @param {EventAggregator} EventAggregator
   *   EventAggregator instance.
   */
  constructor(EventAggregator) {
    this.eventAggregator = EventAggregator;
  }

  /**
   * Publish an event.
   *
   * @memberof Events
   * @method publish
   *
   * @param {String} name
   *   Event name.
   *
   * @param {*} data
   *   Event data.
   *
   * @emits Events:publish
   * @return {EventAggregator|void}
   */
  publish(name, data = null) {
    return this.eventAggregator
      .publish(name, data);
  }

  /**
   * Subscribe an event.
   *
   * @memberof Events
   * @method subscribe
   *
   * @param {String} name
   *   Event name.
   *
   * @param {*} data
   *   Event data.
   *
   * @listens Events:subscribe
   * @return {EventAggregator|dispose}
   */
  subscribe(name, data = null) {
    return this.eventAggregator
      .subscribe(name, data);
  }
}
