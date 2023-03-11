import { Controller } from '@hotwired/stimulus';
import axios from 'axios';
import { get, map, isNull, sample } from 'lodash';

export default class extends Controller {
   HEADERS = { ACCEPT: 'application/json' };
   BACKGROUND_COLORS = ['blue', 'red', 'green', 'yellow']
   connect() {
      axios
         .get(this.element.dataset.apiUrl, { headers: this.HEADERS })

         
         .then((response) => {
            console.log(response);
            this.buildKanban(this.buildBoards(response['data']));
         });
   }

   buildClassList(classList) {
      //return sample(this.BACKGROUND_COLORS);

      if (isNull(classList)) {
         return '';
      }

      return classList.split(' ').join(', ');
   }

   buildItems(items) {
      return map(items, (item) => {
         return {
            'id': get(item, 'id'),
            'title': get(item, 'attributes.title'),
            'class': this.buildClassList(get(item, 'attributes.class_list')),
         };
      });
   }

   buildBoards(boardData) {
      return map(boardData['data'], (board) => {
         return {
            'id': get(board, 'id'),
            'title': get(board, 'attributes.title'),
            'class': this.buildClassList(get(board, 'attributes.class_list')),
            'item': this.buildItems(get(board, 'attributes.items.data')),
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
      });
   }
}
