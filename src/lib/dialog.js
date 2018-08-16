import {inject}        from 'aurelia-dependency-injection';
import {DialogService} from 'aurelia-dialog';

// Local modules.
import {DialogAlert}    from 'dialog/alert';
import {DialogConfirm}  from 'dialog/confirm';
import {DialogFile}     from 'dialog/file';
import {DialogPassword} from 'dialog/password';

@inject(DialogService)

/**
 * Dialog window handler.
 *
 * @requires DialogService
 */
export class Dialog {

  /**
   * Create a new instance of Dialog.
   *
   * @param {DialogService} DialogService
   *   DialogService instance.
   */
  constructor(DialogService) {
    this.service = DialogService;
  }

  /**
   * Open alert with message.
   *
   * @memberof Dialog
   * @method alert
   *
   * @param {String} message
   *   Message text.
   *
   * @return {Promise|void}
   */
  alert(message) {
    return this._openWindow(DialogAlert, message);
  }

  /**
   * Prompt confirmation with message.
   *
   * @memberof Dialog
   * @method confirm
   *
   * @param {String} message
   *   Message text.
   *
   * @return {Promise|void}
   */
  confirm(message) {
    return this._openWindow(DialogConfirm, message);
  }

  /**
   * Prompt file with message.
   *
   * @memberof Dialog
   * @method file
   *
   * @param {String} message
   *   Message text.
   *
   * @return {Promise|void}
   */
  file(message) {
    return this._openWindow(DialogFile, message);
  }

  /**
   * Prompt password with message.
   *
   * @memberof Dialog
   * @method password
   *
   * @param {Boolean} confirm
   *   Confirm password (optional).
   *
   * @return {Promise|void}
   */
  password(confirm = false) {
    let message = (confirm)
      ? 'Enter the password to protect this wallet'
      : 'Enter your wallet password';

    return this._openWindow(DialogPassword, message, {confirm});
  }

  /**
   * Open window for a given controller.
   *
   * @memberof Dialog
   * @method _openWindow
   * @private
   *
   * @param {DialogController} controller
   *   DialogController instance.
   *
   * @param {String} message
   *   Message text.
   *
   * @param {Object} model
   *   Model data (optional).
   *
   * @return {Promise|void}
   */
  _openWindow(controller, message, model = null) {
    return new Promise(resolve => {
      this.service
        .open({
          viewModel: controller,
          model: {
            message: message,
            ...model
          }
        })
        .whenClosed(response => {
          if (response.wasCancelled === false) {
            resolve(response);
          }
        });
    });
  }
}
