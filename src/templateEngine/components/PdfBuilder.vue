<template>
  <div class="componentContainer">
    <div class="colContent leftCol">
      <TemplateNameEdit
        :template="template"
      />

      <button 
        class="primaryButton drawingToggleButton" 
        :class="{activeDrawing: selectionCreation.drawHandler}"
        @click="drawSelection()" 
      >
        {{drawButtonText}}
      </button>
      
      <SaveTemplateButton 
        :apiUrl="apiUrl"
        :isNewTemplate="isNewTemplate"
        :template="template"
        :pdfTemplateBuffer="pdfTemplateBuffer"
        @openResponse="openResponsePopup"
        @templateSaved="handleTemplateSave"
      />

      <PdfToImage 
        v-if="template.id"
        :apiUrl="apiUrl"
        :templateId="template.id"
        @pdfUploaded="setPdfTemplate"
      />

      <ToggleSwitch
        ref="staticToggle"
        :labels="['Preview enabled', 'Preview disabled']" 
        :isDisabled="!showContentPreview" 
        :toggleID="'previewToggle'"
        @toggled="() => {
          showContentPreview = !showContentPreview;
          toggleContentPreview()
        }"
      />

      <VariableList
        :templateVariables="template.variableList"
        @updateVariables="updateVariableList"
      />
    </div>

    <div class="templateCol">
      <div 
        tabindex="0"
        id="pdfTemplate" 
        class="pdfTemplate"
      ></div>
    </div>

    <div class="colContent rightCol">
      <EditElement
        ref="editElement"
        :apiUrl="apiUrl" 
        :selection="selectedElement"
        :minElementSize="minElementSize"
        :variableList="template.variableList"
        :previewEnabled="showContentPreview"
        @deleteElement="updateList"
        @openResponse="openResponsePopup"
      />
    </div>
  </div>
</template>

<script>
import interact from "interactjs";
import axios from "axios";

import EditElement   from "./EditElement.vue";
import SaveTemplateButton from "./SaveTemplateButton.vue";
import PdfToImage    from "./PdfToImage.vue";
import ToggleSwitch from "./ToggleSwitch.vue";
import VariableList from "./VariableList.vue";
import TemplateNameEdit from "./TemplateNameEdit.vue";

export default {
  props:{
    apiUrl: {
      type: String,
      required: true
    },
    templateInfo: {
      type: Object,
      required: false
    }
  },
  components: { EditElement, PdfToImage, ToggleSwitch, SaveTemplateButton, VariableList, TemplateNameEdit },
  data(){
    return{
      editTemplateName: false,
      pdfTemplate: null, // dom element 
      minElementSize: 15, // minimum size to which an element can be resized
      selectionCreation: { 
          drawHandler: null, // handler for the draw interaction
          selection: null, // selection currently being drawn
      },

      showContentPreview: false, // show the preview or not

      elementToCopy: null, // dom element to be copied
      selectedElement: null, // element being displayed in the edit element component

      isNewTemplate: false, // is the template being created or edited
      pdfTemplateBuffer: null, // the pdf file thats used as a base for the template
      template: {
        id: null,
        pdfDimensions: null,
        name: "New template",
        selectionList: [],
        variableList: []
      }
    }
  },
  computed:{
    drawButtonText(){
      return this.selectionCreation.drawHandler? "Disable drawing": "Enable drawing"
    }
  },
  methods:{
      /* ------------------------------------------------------------ */

      interaction(){
        const thisRef = this;

        interact('.draggable')
        .resizable({
          inertia: false,
          
          // resize from all edges and corners
          edges: { left: true, right: true, bottom: true, top: true },

          modifiers: [
            interact.modifiers.restrictEdges({
              outer: 'parent'
            }),

            // minimum size
            interact.modifiers.restrictSize({
              min: { width: this.minElementSize, height: this.minElementSize }
            })
          ],
          
          listeners: {
            move: (event) => thisRef.resizeHandler(event)
          },
        })
        .draggable({
          inertia: false,
          
          modifiers: [
            interact.modifiers.snap({
              targets: [
                // Snap elements in place when dragged
                interact.snappers.grid({ x: 10, y: 10 })
              ],
              range: Infinity,
              relativePoints: [ { x: 0, y: 0 } ]
            }),

            // Keeps the element inside the parent
            interact.modifiers.restrictRect({ restriction: 'parent' })
          ],

          listeners: {
            move: (event) => thisRef.dragMoveListener(event),
          },
        })
      },
      
      dragMoveListener(event){
        const target = event.target;
        
        // keep the dragged position in the data-x/data-y attributes
        const x = (parseFloat(target.getAttribute('data-x')) || 0) + parseInt(event.dx)
        const y = (parseFloat(target.getAttribute('data-y')) || 0) + parseInt(event.dy)

        // update position data of object
        this.updatePositionData(target, {x, y})
        target.style.transform = `translate(${x}px, ${y}px)`

        // update the position attributes
        target.setAttribute('data-x', x)
        target.setAttribute('data-y', y)
      },

      resizeHandler(event){
        const target = event.target;

        // Get the previous coordinates of the object
        let x = (parseFloat(target.getAttribute('data-x')) || 0)
        let y = (parseFloat(target.getAttribute('data-y')) || 0)

        // translate when resizing from top or left edges
        x += event.deltaRect.left;
        y += event.deltaRect.top;
        
        let width = event.rect.width;
        let height = event.rect.height;

        target.style.width = `${width}px`;
        target.style.height = `${height}px`;

        target.style.transform = `translate(${x}px, ${y}px)`;
        
        this.updatePositionData(target, {
          x: parseInt(x), 
          y: parseInt(y), 
          width: parseInt(width), 
          height: parseInt(height)
        })

        target.setAttribute('data-x', x);
        target.setAttribute('data-y', y);
      },

      /* ------------------------------------------------------------ */

      disableDrawing(){
        if(this.selectionCreation.selection)
          this.selectionCreation.selection.remove();

        this.pdfTemplate.removeEventListener("click", this.selectionCreation.drawHandler);
        this.pdfTemplate.removeEventListener("mousemove", this.selectionCreation.updateHandler);
        this.pdfTemplate.style.cursor = "";
        
        this.togglePointerEvents(this.pdfTemplate, true);
        
        this.selectionCreation.drawHandler = null;
        this.selectionCreation.updateHandler = null;
        this.selectionCreation.selection = null;
      },

      drawSelection(){
        // TODO: separate the function into smaller chunks, maybe even separate files(class for drawing?)
        if(this.selectionCreation.drawHandler) {
          return this.disableDrawing();
        }

        let drawingStarted = false;
        let positionData = { x: 0, y: 0, width: 0, height: 0 };
        
        this.selectionCreation.selection = null;

        const thisRef = this;

        /* ------------------------------------------------------------ */
        function drawSelection(event) {
          let width  = event.offsetX - positionData.x
          let height = event.offsetY - positionData.y
          const selection = thisRef.selectionCreation.selection;
          
          selection.style.left = width < 0? `${width}px` : "";
          selection.style.top = height < 0? `${height}px`: "";

          positionData.width = Math.abs(width);
          positionData.height = Math.abs(height);
          
          selection.style.width  = `${positionData.width}px`;
          selection.style.height = `${positionData.height}px`;
        }

        this.selectionCreation.drawHandler = function (event){
          if(drawingStarted){
            drawingStarted = false;

            thisRef.saveNewSelection(thisRef.selectionCreation.selection, positionData);
            thisRef.selectionCreation.selection = null;

            positionData = { x: 0, y: 0, width: 0, height: 0 };

            thisRef.pdfTemplate.removeEventListener("mousemove", drawSelection);
          }
          else{
            drawingStarted = true;
            
            positionData.x = event.offsetX;
            positionData.y = event.offsetY;

            thisRef.selectionCreation.selection = thisRef.createSelection(positionData);

            thisRef.pdfTemplate.addEventListener('mousemove', drawSelection);
          }
        }
          
        /* ------------------------------------------------------------ */

        this.togglePointerEvents(this.pdfTemplate, false);
        this.pdfTemplate.style.cursor = "crosshair";

        this.pdfTemplate.addEventListener("click", this.selectionCreation.drawHandler)

        /* ------------------------------------------------------------ */
      },

      // parentElement - html element who's children's pointer events will be toggled
      // boolValue - true(active pointer events) or false(inactive pointer events)
      // Used to make a selection over/inside other elements inside parent
      togglePointerEvents(parentElement, boolValue){
        Array.from(parentElement.children).forEach(child => child.style.pointerEvents = boolValue? "auto": "none")
      },

      // positionData - { x: num, y: num, width: num, height: num}
      // Creates a new div, sets its position to the given coordinates inside parent, sets 
      //  its style and adds it to the dom  
      createSelection(positionData){
        const newSelection = document.createElement("div");
        
        this.setCoordinates(newSelection, positionData);

        newSelection.style.position = "absolute";
        newSelection.style.overflow = "hidden";
        newSelection.style.pointerEvents = "none"; // needed when shrinking the selection
        newSelection.style.backgroundColor = "rgba(173,216,230, 0.25)";

        this.pdfTemplate.appendChild(newSelection);

        this.shiftFocus(newSelection)

        return newSelection;
      },

      // selection - html element
      // positionData - { x: num, y: num, width: num, height: num}
      // Set the data-index to the last element of the list and push the selection to the selection list
      saveNewSelection(selection, positionData){
        const id = Date.now() + "" + Math.ceil(Math.random() * 1000)
        selection.classList.add("draggable", "selection");
        
        this.readjustPosition(selection, positionData);

        const newElement = {
          id: id,
          elementRef: selection,
          positionData: positionData,

          type: "singlelineText",
          variable: null,
          isStatic: true,
          staticContent: "",

          internalComponent: null,
        }

        this.template.selectionList.push(newElement)
        this.elementSelected(newElement);

        return newElement;
      },

      // element - html element
      // positionData - { x: num, y: num, width: num, height: num}
      // Calculate the top and left offset into x and y coordinates and update coordinates
      readjustPosition(element, positionData){
        const top = this.getNumValue(element.style.top);
        const left = this.getNumValue(element.style.left);
        const translate = this.getNumValue(element.style.transform, true);

        positionData.x = translate[0] - left;
        positionData.y = translate[1] - top;

        this.setCoordinates(element, positionData)

        element.style.top = ""
        element.style.left = ""
      },

      // element - html element
      // positionData - { x: num, y: num, width: num, height: num}
      // Set the coordinates of a element
      setCoordinates(element, positionData){
        element.dataset.x = positionData.x;
        element.dataset.y = positionData.y;
        
        element.style.transform = `translate(${positionData.x}px, ${positionData.y}px)`;  
      },

      /* ------------------------------------------------------------ */

      // element - js object to remove from dom/list
      // Remove element from dom and from the list. Update the index of each element in the list and because the
      //  element can only be deleted once its selected, set the selected element to null
      updateList(element){
        this.pdfTemplate.removeChild(element.elementRef);
        this.template.selectionList = this.template.selectionList.filter(elem => elem != element);

        this.selectedElement = null;
      },

      getElementFromList(element){
        return this.template.selectionList.filter(elem => elem.elementRef == element)[0];
      },

      // event - click on event
      // click on event handler, if clicked on a selection, open selection in editor, else empty 
      //  selection from editor
      selectElementOnClick(event){
        if(this.selectionCreation.drawHandler) return;
        let element = event.target
        
        if(element.classList.contains("internalComponent")) element = element.parentNode

        const isSelection = element.classList.contains("selection")
        if(!isSelection){
          if(this.selectedElement) this.selectedElement.elementRef.style.boxShadow = "";
          this.selectedElement = null;

          return;
        }

        element = this.getElementFromList(element);
        this.elementSelected(element);
      },

      // element - html element
      // switch out old selected element with new one
      elementSelected(element){  
        if(this.selectedElement) 
          this.selectedElement.elementRef.style.boxShadow = ""
        
        this.selectedElement = element;
        this.selectedElement.elementRef.style.boxShadow = "inset 0px 0px 0px 1px #add8e6"

        this.shiftFocus(element.elementRef)
      },

      // targetElement - html element
      // Sets the zIndex of the target element to be highest in the parent. 
      //  zIndexes of other elements get decreased by 1(lower boundary on 0)
      shiftFocus(element){
        const elementList = document.querySelectorAll("div.pdfTemplate>div");

        Array.from(elementList).forEach(elem => {
          const zIndex = elem.style.zIndex || 0;
          elem.style.zIndex = (zIndex - 1) < 0? 0: (zIndex - 1);
        })

        const topZIndex = elementList.length;
        element.style.zIndex = topZIndex;
      },

      // elem - html element
      // newData - either (x ,y) or (width, height)
      // Get the element from the list based on the data-index attribute. Replace the old (x ,y) or (width, height) with new ones
      updatePositionData(element, newData){
        const elementObj = this.getElementFromList(element);

        Object.keys(newData).forEach(key => {
          elementObj.positionData[key] = newData[key]
        })
      },

      setPdfTemplate(pdfTemplateBuffer, pdfDimensions){
        this.pdfTemplateBuffer = pdfTemplateBuffer;
        this.template.pdfDimensions = pdfDimensions;
        this.template.hasBackground = true;
      },

      openResponsePopup(resultStatus, customMsg=null){
        const popup = this.$store.getters.getModalRefByName("responsePopup");
        popup.setResponseData(resultStatus, customMsg);
      },

      modifyPositionData(modifyBy){
        if(!this.selectedElement) {
          return;
        }
        this.$refs.editElement.modifyPositionData(modifyBy)
      },

      copySelectedElement() {
        if(!this.selectedElement) return;

        this.elementToCopy = {...this.selectedElement};
        this.elementToCopy.elementRef = null;
      },
      
      pasteSelectedElement() {
        if(document.activeElement != this.pdfTemplate) return;

        this.elementToCopy.positionData.x += 10;
        this.elementToCopy.positionData.y += 10;

        this.rebuildElement(this.elementToCopy);
      },

      keyboardSupport(event){
        const modifyBy = 5;

        if(event.shiftKey){
          switch(event.key){
            case "ArrowUp":
              this.modifyPositionData({x: 0, y: 0, width: 0, height: -modifyBy});
              break;
            case "ArrowDown":
              this.modifyPositionData({x: 0, y: 0, width: 0, height: modifyBy});
              break;
            case "ArrowLeft":
              this.modifyPositionData({x: 0, y: 0, width: -modifyBy, height: 0});
              break;
            case "ArrowRight":
              this.modifyPositionData({x: 0, y: 0, width: modifyBy, height: 0});
              break;
          }
        }
        else if(event.ctrlKey){
          switch(event.key){
            case "c":
              this.copySelectedElement();
              break;
            case "v":
              this.pasteSelectedElement();
              break;
          }
        }
        else{
          switch(event.key){
            case "Escape":
              this.disableDrawing();
              break;
            case "ArrowUp":
              this.modifyPositionData({x: 0, y: -modifyBy, width: 0, height: 0});
              break;
            case "ArrowDown":
              this.modifyPositionData({x: 0, y: modifyBy, width: 0, height: 0});
              break;
            case "ArrowLeft":
              this.modifyPositionData({x: -modifyBy, y: 0, width: 0, height: 0});
              break;
            case "ArrowRight":
              this.modifyPositionData({x: modifyBy, y: 0, width: 0, height: 0});
              break;
          }
        }
      },

      // property - String
      // returnArray - Boolean
      // Looks for numbers in string and returns them, if returnArray is true it returns an 
      //  array of numbers else it returns every value concatenated together
      getNumValue(stringValue, returnArray=false){
        if(returnArray){
          return stringValue.match(/\d*/g).reduce((result, value) => {
            if(value) {
              result.push(parseInt(value));
            }
            return result
          }, [])
        }
        return parseInt(stringValue.match(/\d*/g).join("")) || 0
      },
      
      calcPositionData(positionData){
        const pdfTemplate = document.querySelector("div.pdfTemplate")
        const width = pdfTemplate.offsetWidth;
        const height = pdfTemplate.offsetHeight;

        return{
          x: Math.floor(positionData.x * width),
          y: Math.floor(positionData.y * height), 
          width: Math.floor(positionData.width * width), 
          height: Math.floor(positionData.height * height), 
        }
      },

      rebuildElement(instructions, recalcPos) {
        const positionData = instructions.positionData
        const calculatedPositionData = recalcPos? this.calcPositionData(positionData): positionData;

        const selectionDom = this.createSelection(calculatedPositionData);
        selectionDom.style.pointerEvents = "auto";
        selectionDom.style.width = `${calculatedPositionData.width}px`
        selectionDom.style.height = `${calculatedPositionData.height}px`

        const selection = this.saveNewSelection(selectionDom, calculatedPositionData);

        if(instructions.internalComponent) {
          const internalComponent = this.$refs.editElement.createComponent(selection);
          internalComponent.setImageURL(instructions.staticContent);
        }
        else if(instructions.staticContent) {
          selection.staticContent = instructions.staticContent;
          selection.elementRef.innerText = instructions.staticContent;
        }

        selection.isStatic = instructions.isStatic;
        selection.type = instructions.type;
        selection.variable = instructions.variable;
      },

      // if a template is getting edited, the original template has to be built first based on its instructions
      // instructions are a JSON object that describes selections of the template
      async buildTemplate(){
        this.templateInfo.selection_list.forEach(instructions => {
          this.rebuildElement(instructions, true);
        });

        this.template.id = this.templateInfo.id;
        this.template.name = this.templateInfo.name;
        this.template.variableList = this.templateInfo.variable_list;

        const imageUrl = `${this.apiUrl}/public/${this.template.id}/background.png/?dummy=${Math.random()}`;
        this.pdfTemplate.style.backgroundImage = `url(${imageUrl})`;
      },

      async getUUID(){
        try{
          const response = await axios.get(`${this.apiUrl}/generateUUID`);
          this.template.id = response.data.id;
        }catch(error){
          const status = error.message == "Network Error"? 408: 500;
          this.openResponsePopup(status);
        }
      },

      async toggleContentPreview() {
        for(let selection of this.template.selectionList){
          if(selection.isStatic) {
            continue; // only variables have preview
          }
          
          const previewValue = this.showContentPreview? selection.variable.example: "";

          if(selection.variable.type === 'image') {
            this.$refs.editElement.setImagePreview(selection, previewValue);
            continue;
          }

          selection.elementRef.innerText = previewValue;
        }
      },

      handleTemplateSave(processedTemplate) {
        this.isNewTemplate = false;

        // updating the template info but keeping the old selection list since it contains the dom elements
        this.template = {
          ...processedTemplate,
          selectionList: this.template.selectionList
        }
      },

      updateVariableList(variableList) {
        this.template.variableList = variableList;
        this.template.selectionList.forEach(selection => {
          if(selection.isStatic) {
            return;
          }

          const variable = this.template.variableList.find(variable => variable.name === selection.variable.name);
          selection.variable = variable;
        });

        this.toggleContentPreview();
      },

      async cleanupFiles() {
        if(!this.isNewTemplate) {
          return;
        }

        try{
          await axios.delete(`${this.apiUrl}/templates?id=${this.template.id}&isNew=True`);
        }catch(e) {
          console.log(e);
        }
      }
  },
  async mounted(){
    this.interaction();

    this.pdfTemplate = document.getElementById("pdfTemplate");

    if(this.templateInfo) {
      this.buildTemplate();
      this.isNewTemplate = false;
    }
    else {
      await this.getUUID();
      this.isNewTemplate = true;
    }

    document.addEventListener('keydown', this.keyboardSupport);
    this.pdfTemplate.addEventListener("click", this.selectElementOnClick);
  },
  beforeDestroy(){
    document.removeEventListener('keydown', this.keyboardSupport);
    document.removeEventListener("click", this.selectElementOnClick);
    this.cleanupFiles();
  },
}
</script>

<style lang="scss" scoped>
@import "../styles/style.scss";

.selected{
  box-shadow: inset 0px 0px 0px 10px #add8e6;
}

.activeDrawing{
  color: $primaryColor;
  background: $blueHighlight;

  &:hover, &:focus{
    color: $primaryColor;
    background: $blueHighlight;
  }
}

.drawingToggleButton{
  min-height: 45px;
}

.componentContainer{
  @include flex(row, center, stretch);
  width: 100%;

  overflow: hidden;
  background-color: $primaryColor;
}

.templateCol{
  @include section(auto, $primaryColor);
  @include flex(row, center, center);

  flex-grow: 1;

  overflow: hidden;
  
  .pdfTemplate{
    @include boxShadowC();

    max-width: 1500px;
    aspect-ratio: 1/1.414;

    position: relative;

    background-position: center;
    background-repeat: no-repeat; 
    background-size: cover;

    &:hover, &:focus{
      outline: none;
    }
  }
}

.colContent{
  @include section(20%, $primaryColor);
  @include flex(column, initial, initial);

  position: relative;
  row-gap: 1rem;
  
  min-width: 16rem;
  padding: 0.5rem;

  &.leftCol{
    @include boxShadowR();
  }
  &.rightCol{
    @include boxShadowL();
  }
}

@media only screen and (min-width: 1200px) {
  div.pdfTemplate{
    width: 450px;
  }
}
@media only screen and (min-width: 1750px) {
  div.pdfTemplate{
    width: 750px;
  }
}
@media only screen and (min-width: 2000px) {
  div.pdfTemplate{
    width: 800px;
  }
}

</style>