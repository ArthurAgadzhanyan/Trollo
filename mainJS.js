document.addEventListener("DOMContentLoaded", function () {
class MainController {
    constructor(){
        this.blocks = [];
        this.blocks.id ='';
        this.htmlItem = document.getElementsByClassName("blocks-folder")[0];
        this.createBlockItem = document.getElementsByClassName("block_unused_droppable")[0];
        this.createBlockItem.addEventListener('click', this.addBlock.bind(this));

    }

    addBlock() {
        var htmlBlock = document.createElement("div");
        htmlBlock.className = "blocks-folder__block blocks-folder__block_droppable";
        var BlockWrapper = document.createElement("div");
        BlockWrapper.className = "Block__wrapper";


        this.htmlItem.appendChild(BlockWrapper);
        BlockWrapper.appendChild(htmlBlock);



        var newBlock = new Block(htmlBlock);

    }
}

class Block {
    constructor(htmlItem){
        console.log(htmlItem);
        this.tasks = [];
        this.htmlItem = htmlItem;
        this.taskID = 1;
        this.tasks.id ='';
        this.init();
    }

    init() {
        this.TaskWrapper = document.createElement('div');
        this.TaskWrapper.className = "TaskWrapper";

        this.BlockName = document.createElement('div');
        this.BlockName.className = 'blocks-folder__block__name';
        this.BlockName.innerHTML = 'Введите название блока';
        var BlockButtons = document.createElement("div");
        BlockButtons.className = "Block__Buttons";
        var htmlBlockDeleteButton = document.createElement("img");
        htmlBlockDeleteButton.className = "blocks-folder__block__deletebutton";
/*        htmlBlockDeleteButton.innerHTML = "X";
        console.log(this.htmlItem);*/
        htmlBlockDeleteButton.src = 'https://img.icons8.com/carbon-copy/100/000000/clear-symbol.png';
        var htmlCreateTaskButton = document.createElement("div");
        htmlCreateTaskButton.className = "blocks-folder__block__button";
        var ButtonCreateText = document.createElement("p");
        ButtonCreateText.innerHTML = "Добавить задачу";
        ButtonCreateText.className = "Block__Buttons__CreateButton";


        this.htmlItem.appendChild(this.BlockName);
        this.htmlItem.appendChild(BlockButtons);
        BlockButtons.appendChild(htmlBlockDeleteButton);
        BlockButtons.appendChild(htmlCreateTaskButton);
        htmlCreateTaskButton.appendChild(ButtonCreateText);
        this.htmlItem.appendChild(this.TaskWrapper);

        this.BlockName.addEventListener('click', this.EditBlockName.bind(this));
        htmlBlockDeleteButton.addEventListener('click', this.removeBlock.bind(this));
        htmlCreateTaskButton.addEventListener('click', this.addTask.bind(this));
    }
    removeBlock() {
        this.htmlItem.remove();
    }
    EditBlockName(){
        this.innerHTML = "Введите название блока";
        console.log(this.BlockName.innerHTML);
        EditorController.show(this.innerHTML, this.BlockName);
    }

    addTask() {

        var htmlTask = document.createElement("div");
        htmlTask.className = "list__item";
        htmlTask.setAttribute('data-id', htmlTask.id);
        var TasknameDiv = document.createElement("div");
        TasknameDiv.innerHTML = "Задача";
        TasknameDiv.id = 'TaskName№' + this.taskID;
        TasknameDiv.className = "list__item__name_div";

        this.TaskWrapper.appendChild(htmlTask);
        htmlTask.appendChild(TasknameDiv);

        var deleteTask = document.createElement("div");
        deleteTask.className = "list__item__deletebutton";
        deleteTask.innerHTML = "x";
        deleteTask.dataset.id = "" + this.taskID;

        htmlTask.appendChild(deleteTask);

        var newTask = new Task(htmlTask);

        this.tasks.push(htmlTask.id);
        this.tasks[this.taskID] = newTask;


        this.taskID++;


        deleteTask.addEventListener('click', this.removeTask.bind(this));

    }

    removeTask(event) {
        var dataId = event.target.dataset.id;
        var task = this.tasks[dataId];
        this.TaskWrapper.removeChild(task.htmlItem);
        this.tasks[dataId] = "";
    }
}

class Task {
    constructor(htmlItem){
        this.htmlItem = htmlItem;
        this.TaskName = this.htmlItem.getElementsByClassName("list__item__name_div")[0];
        this.init();
        this.dragObject ={};
        this.htmlItem.getElementsByClassName('list__item__name_div')[0].onmousedown = this.Drag.bind(this);


    }

    init() {
        var editNameButton = document.createElement("div");
        editNameButton.className = "list__item__namebutton";
        editNameButton.innerHTML = "N";
        editNameButton.addEventListener('click', this.editName.bind(this));

        var editDescription = document.createElement("div");
        editDescription.className = "list__item__descriptionbutton";
        editDescription.innerHTML = "D";

        this.Description = document.createElement('div');
        this.Description.className = 'list__item__description';

        this.htmlItem.setAttribute('draggble', true);



        this.htmlItem.appendChild(editNameButton);
        this.htmlItem.appendChild(editDescription);
        this.htmlItem.appendChild(this.Description);
        this.editName.bind(this);

        editDescription.addEventListener('click', this.editDescription.bind(this));
        this.TaskName.addEventListener('click', this.showDescription.bind(this));
    }

    editName() {
        this.InnerHTML = 'Введите название таска';
        EditorController.show(this.InnerHTML, this.TaskName);
    }

    editDescription() {
        this.EditNameHTML = 'Введите описание таска';
        EditorController.show(this.EditNameHTML, this.Description);
    }

    showDescription(){

       // console.log(this.Description.style.display);
        if(!this.Description.style.display == 'none'){return }

        this.Description.style.display = 'block';
        this.overflow = document.createElement('div');
        this.overflow.className = 'Descrption__overflow';

        document.body.appendChild(this.overflow);
        this.overflow.addEventListener('click', this.closeDescription.bind(this));
    }
    closeDescription(){
        this.Description.style.display = 'none';
        this.overflow.remove();
    }

    Drag(e){
        if (e.which != 1) {return}



        this.dragObject.elem = this.htmlItem;
        console.log("DragElement is ", this.htmlItem);

        this.dragObject.downX = e.pageX;
        this.dragObject.downY = e.pageY;
        console.log(this.dragObject.elem, "elem");

        document.onmousemove = this.onMouseMove.bind(this);
        document.onmouseup = this.onMouseUp.bind(this);

        this.onDragCancel = function (dragObject) {
            console.log("Cancel", this.CreatedAvatar.rollback(this.dragObject.elem));
        }

    }
    onMouseUp(e){
        if (this.dragObject.avatar) {
            this.finishDrag(e);
        }
        this.dragObject = {};

    }

    finishDrag(){
        this.dropElem = this.findDroppable();
        if (this.dropElem.elemBefore) {
            console.log(this.dropElem.elem);
            this.dragObject.elem.style = null;
            this.dropElem.elem.insertBefore(this.dragObject.elem, this.dropElem.elemBefore);
            console.log(this.dragObject.elem, this.dropElem.elemBefore,'finish')
        } else if(this.dropElem.elem){
            this.dragObject.elem.style = null;
            this.dropElem.elem.appendChild(this.dragObject.elem)
        } else {
            this.onDragCancel();
        }
    }
    findDroppable(e){
        this.dragObject.avatar.hidden = true;

        this.elem = document.elementFromPoint(event.clientX, event.clientY);
        this.elemBefore = document.elementFromPoint(event.clientX, event.clientY);

        this.dragObject.avatar.hidden = false;

        if (this.elem == null) {
            return null;
        }

        return {
            elem : this.elem.closest('.blocks-folder__block_droppable'),
            elemBefore: this.elemBefore.closest('.list__item')
        };
    }

    onMouseMove(e){
        if (!this.dragObject.elem) return; // элемент не зажат

        if (!this.dragObject.avatar) { // если перенос не начат...
            this.moveX = e.pageX - this.dragObject.downX;
            this.moveY = e.pageY - this.dragObject.downY;

            // если мышь передвинулась в нажатом состоянии недостаточно далеко
            if (Math.abs(this.moveX) < 3 && Math.abs(this.moveY) < 3) {
                return;
            }

            // начинаем перенос
            this.dragObject.avatar = this.createAvatar(e);
            if (!this.dragObject.avatar) { // отмена переноса, нельзя "захватить" за эту часть элемента
                this.dragObject = {};
                return;
            }

            // аватар создан успешно
            // создать вспомогательные свойства shiftX/shiftY
            this.coords = this.getCoords(this.dragObject.avatar);
            this.dragObject.shiftX = this.dragObject.downX - this.coords.left;
            this.dragObject.shiftY = this.dragObject.downY - this.coords.top;

            this.startDrag(e); // отобразить начало переноса
        }

        // отобразить перенос объекта при каждом движении мыши
        this.CreatedAvatar.style.left = e.pageX - this.dragObject.shiftX + 'px';
        this.CreatedAvatar.style.top = e.pageY - this.dragObject.shiftY + 'px';
        return false;
    }
    createAvatar(e){
            this.CreatedAvatar = this.dragObject.elem;
            var old = {
                parent: this.CreatedAvatar.parentNode,
                nextSibling: this.CreatedAvatar.nextSibling,
                position: this.CreatedAvatar.position ,
                left: this.CreatedAvatar.left,
                top: this.CreatedAvatar.top ,
                zIndex: this.CreatedAvatar.zIndex
            };

            console.log(this.dragObject.elem.style,"nextSib");

            this.CreatedAvatar.rollback = function(elem) {

               old.parent.insertBefore(elem, old.nextSibling);
               elem.style = null;
                /*elem.style.position = old.position;
                elem.style.left = old.left;
                elem.style.top = old.top;
                elem.style.zIndex = old.zIndex*/
            };
            return this.CreatedAvatar;
    }

    startDrag(e){
        this.CreatedAvatar = this.dragObject.avatar;

        document.body.appendChild(this.CreatedAvatar);
        this.CreatedAvatar.style.zIndex = 11101;
        this.CreatedAvatar.style.position = 'absolute';
    }



     getCoords(elem){
         this.box = elem.getBoundingClientRect();
         return {
             top: this.box.top + pageYOffset ,
             left: this.box.left + pageXOffset
         }
     }



}

class Editor {
    constructor(){
        this.ModalButton = document.createElement('div');
        this.ButtonHeight = this.ModalButton.offsetHeight;
        this.ModalWrapper = document.createElement("div");
        this.TaskNameTextArea = document.createElement("textarea");
        this.TNTAheight = this.TaskNameTextArea.offsetHeight;
        this.modal = document.createElement("div");
        this.ModalName = document.createElement('div');
        this.init();

    }

  show(title, htmlelement) {
       this.modal.style.display = 'block';
       this.ModalWrapper.style.display ='block';
       this.ModalName.innerHTML = title;
       this.targetHtmlItem = htmlelement;
       this.ModalButton = document.getElementsByClassName('ModalWrapper__ModalButton')[0];

  }
    init(){
        this.ModalName.className = "ModalWrapper__ModalName";
        this.ModalButton.className = 'ModalWrapper__ModalButton';
        this.ModalButton.style.marginTop = - this.ButtonHeight+80/ 2 +'px';
        this.ModalButton.style.top = "50%";
        this.ModalButton.innerHTML = 'готово';
        this.ModalButton.style.color = 'white';
        this.ModalWrapper.className = "ModalWrapper";
        this.TaskNameTextArea.className = "list__item__name";
        this.TaskNameTextArea.style.marginTop = - this.TNTAheight / 2 + "px";
        this.TaskNameTextArea.style.top = "50%";
        this.modal.className = "overflow";
        document.body.appendChild(this.modal);
        document.body.appendChild(this.ModalWrapper);

        this.ModalWrapper.appendChild(this.ModalName);
        this.ModalWrapper.appendChild(this.TaskNameTextArea);
        this.ModalWrapper.appendChild(this.ModalButton);

        this.inputElement = this.TaskNameTextArea;

        this.modal.addEventListener('click',this.CloseEditName.bind(this));
        this.ModalButton.addEventListener('click', this.ApplyEditName.bind(this));

    }
    ApplyEditName(){
        console.log(this.inputElement.value);
        if(this.inputElement.value == ''){ this.targetHtmlItem.InnerHTML = 'Без названия'} else{
            this.targetHtmlItem.innerHTML = this.inputElement.value;
        }
      this.CloseEditName();
        // this.htmlItem.getElementsByClassName("list__item__name_div")[0].innerHTML = this.TaskName;
        // this.TaskName = TextValue;
    }
    CloseEditName(){
        this.modal.style.display = "none";
        this.ModalWrapper.style.display = "none";
        this.inputElement.value = '';
    }
}


    var MainCotroller = new MainController();
    var EditorController = new Editor();


});


