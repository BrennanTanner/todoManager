import { Controller } from '@hotwired/stimulus';
import { enter, leave, toggle } from 'el-transition';

export default class extends Controller {
   static targets = ['closeButton'];

   connect() {
      document
         .getElementById(`modal-wrapper`)
         .addEventListener('click', (e) => {
            this.closeModal(e);
         });
      this.closeButtonTarget.addEventListener('click', () => {
         leave(document.getElementById('modal-wrapper'));
         leave(document.getElementById('modal-backdrop'));
         leave(document.getElementById('modal-panel'));
      });
   }

   closeModal(e) {
      const modalPanelClicked = document
         .getElementById('modal-panel')
         .contains(e.target);

      if (modalPanelClicked) {
         leave(document.getElementById('modal-wrapper'));
         leave(document.getElementById('modal-backdrop'));
         leave(document.getElementById('modal-panel'));
      }
   }

   showModal() {
      const myModal = document.getElementById('myModal');
      const myInput = document.getElementById('myInput');

      myModal.addEventListener('shown.bs.modal', () => {
         myInput.focus();
      });

      enter(document.getElementById('modal-wrapper'));
      enter(document.getElementById('modal-backdrop'));
      enter(document.getElementById('modal-panel'));
   }
}
