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

   addLinkToHeaderTitles(boards) {
      this.getHeaderTitles().forEach((headerTitle, index) => {
         headerTitle.addEventListener('click', () => {
            Turbo.visit(`${this.element.dataset.boardListUrl}/${boards[index].id}/edit`);
         });
      });
   }

   connect() {
      axios
         .get(this.element.dataset.apiUrl, { headers: this.HEADERS })
         .then((response) => {
            this.buildKanban(this.buildBoards(response['data']));
            this.addPointer();
            this.addLinkToHeaderTitles(this.buildBoards(response['data']));
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

   buildKanban(boards) {
      new jKanban({
         element: `#${this.element.id}`,
         boards: boards,
         itemAddOptions: {
            enabled: true,
         },
         //buttonClick(click, boards);
         
      });
      console.log(boards);
   }
}
