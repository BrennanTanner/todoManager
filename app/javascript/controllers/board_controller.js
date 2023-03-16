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
            'id': get(item, 'id'),
            'title': get(item, 'attributes.title'),
            'list-id': get(item, 'attributes.list_id'),
            'bs-toggle': "modal",
            'bs-target': "#staticBackdrop",
         };
      });

   }

   buildBoards(boardData) {
      return map(boardData['data'], (board) => {
         return {
            'id': get(board, 'id'),
            'title': get(board, 'attributes.title'),
            'item': this.buildItems(get(board, 'attributes.items.data')),
         };
      });
   }

   updateListPosition(el) {
      axios.put(`${this.element.dataset.listPositionsApiUrl }/${el.dataset.id}`, {
         position: el.dataset.order - 1
      }, {
         headers: this.HEADERS
      }).then((response) => {

      });
   }

   buildItemData(items){
      return map(items, (item) => {
         return {
            id: item.dataset.eid,
            position: item.dataset.position,
            list_id: item.dataset.listId
         }
      })
   }

   itemPositioningApiCall(itemData){
      axios.put(this.element.dataset.itemPositionsApiUrl, {
         items: itemData
      }, {
         headers: this.HEADERS
      }).then((response) => {

      });
   }

   updateItemPosition(target, source){
      const targetItems = Array.from(target.getElementsByClassName('kanban-item'));
      const sourceItems = Array.from(source.getElementsByClassName('kanban-item'));

      targetItems.forEach((item, i) => {
         item.dataset.position = i;
         item.dataset.listId = target.closest('.kanban-board').dataset.id;
      });
      sourceItems.forEach((item, i) => {
         item.dataset.position = i;
         item.dataset.listId = source.closest('.kanban-board').dataset.id;
      });

      this.itemPositioningApiCall(this.buildItemData(targetItems));
      this.itemPositioningApiCall(this.buildItemData(sourceItems));

   }

   buildKanban(boards) {
      new jKanban({
         element: `#${this.element.id}`,
         boards: boards,
         itemAddOptions: {
            enabled: true,
         },
         click: (el) => {
            
         },
         buttonClick: (el, boardId) => {
            Turbo.visit(`/lists/${boardId}/items/new`);
         },
         dragendBoard: (el) => {
            this.updateListPosition(el);
         },                                                
         dragEl: (el, source) => {

         },                    
         dragendEl: (el) => {

         },                             
         dropEl: (el, target, source, sibling) => {
          this.updateItemPosition(target, source);
         },
         
      });
      console.log(boards);
   }
}
