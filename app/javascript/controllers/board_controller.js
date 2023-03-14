import { Controller } from '@hotwired/stimulus';
import axios from 'axios';
import { get, map, isNull, sample } from 'lodash';

export default class extends Controller {
   HEADERS = { ACCEPT: 'application/json' };
   BACKGROUND_COLORS = ['blue', 'red', 'green', 'yellow'];

   getHeaderTitles(){
      return Array.from(document.getElementsByClassName('kanban-title-board'));
   }

   addPointer(){
      this.getHeaderTitles().forEach((headerTitle) => {
         headerTitle.classList.add('cursor-pointer');
      });
   }

   addHeaderDeleteButtons(boards) {
      this.getHeaderTitles().forEach((headerTitle, index) => {
         headerTitle.addEventListener('click', () =>{
            turbo
         })
      })
   }

   buildDeleteButton(boardId) {
      const button = document.createElement('button');
      button.classList.add('kanban-title-button');
      button.textContent = 'x';
      button.addEventListener('click', (e) => {
         e.preventDefault();
         axios.delete(`${this.element.dataset.boardListUrl}/${boardId}`, {
            headers: this.HEADERS 
         }).then((_) => {
            Turbo.visit(window.location.href);
         });
      });
      return button;
   
   }

   addLinkToHeaderTitles(boards) {
      this.getHeaderTitles().forEach((headerTitle, index) => {
         headerTitle.appendChild(this.buildDeleteButton(boards[index].id));
      });
   }

   connect() {
      axios
         .get(this.element.dataset.apiUrl, { headers: this.HEADERS })
         .then((response) => {
            this.buildKanban(this.buildBoards(response['data']));
            this.addPointer();
            this.addLinkToHeaderTitles(this.buildBoards(response['data']));
            this.addHeaderDeleteButtons(this.buildBoards(response['data']))
         });
   }

   buildItems(items) {
      return map(items, (item) => {
         return {
            id: get(item, 'id'),
            title: get(item, 'attributes.title'),
         };
      });

   }

   buildBoards(boardData) {
      return map(boardData['data'], (board) => {
         return {
            id: get(board, 'id'),
            title: get(board, 'attributes.title'),
            item: this.buildItems(get(board, 'attributes.items.data')),
         };
      });
   }

   updateListPosition(el) {
      axios.put(`${this.element.dataset.listPositionsApiUrl }_positions/${el.dataset.id}`, {
         position: el.dataset.order - 1
      }, {
         headers: this.HEADERS
      }).then((response) => {

      });
   }

   buildKanban(boards) {
      new jKanban({
         element: `#${this.element.id}`,
         boards: boards,
         itemAddOptions: {
            enabled: true,
         },
         buttonClick: (el, boardId) => {
            Turbo.visit(`/lists/${boardId}/items/new`);
         },
         dragendBoard: (el) => {
            this.updateListPosition(el);
         },
         
      });
      console.log(boards);
   }
}
