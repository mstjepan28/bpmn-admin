<template>
  <div>
    <div v-if="selection">
        <h2>Selection properties:</h2>

        <h3 class="sectionTitle">Position data</h3>
        <div class="positionData">
          <div class="elementX">
            <label for="positionDataX">X</label>
            <input type="number" id="positionDataX" @change="updateElementPosition" :value="positionData.x">
          </div>

          <div class="elementY">
            <label for="positionDataY">Y</label>
            <input type="number" id="positionDataY" @change="updateElementPosition" :value="positionData.y">
          </div>

          <div class="elementW">
            <label for="positionDataWidth">W</label>
            <input type="number" id="positionDataWidth" @change="updateElementPosition" :value="positionData.width">
          </div>

          <div class="elementH">
            <label for="positionDataHeight">H</label>
            <input type="number" id="positionDataHeight" @change="updateElementPosition" :value="positionData.height">
          </div>
        </div>

        <div class="toggleSwitchContainer">
          <ToggleSwitch
            ref="movementToggle"
            :labels="['Movement enabled', 'Movement disabled']" 
            :isDisabled="!isMovable" 
            :toggleID="'movementToggle'"
            @toggled="toggleMovement"
          />

          <ToggleSwitch
            ref="staticToggle"
            :labels="['Static content', 'Static content']" 
            :isDisabled="!selection.isStatic" 
            :toggleID="'staticToggle'"
            @toggled="toggleStaticContent"
          />
        </div>

        <div v-if="selection.isStatic">
          <h3 class="sectionTitle">Data type: </h3>
          <div class="dataTypeSelection">
            <label for="elementText" class="primaryButton typeButton-text" :class="{activeType: selectionType == 'singlelineText'}"> 
              Text <input type="radio" id="elementText" name="selectionType" value="singlelineText" v-model="selectionType">
            </label>

            <label for="elementParagraph" class="primaryButton typeButton-paragraph" :class="{activeType: selectionType == 'paragraph'}"> 
              Paragraph <input type="radio" id="elementParagraph" name="selectionType" value="paragraph" v-model="selectionType">
            </label>

            <label for="elementImage" class="primaryButton typeButton-image" :class="{activeType: selectionType == 'image'}"> 
              Image <input type="radio" id="elementImage" name="selectionType" value="image" v-model="selectionType">
            </label>
          </div>

          <div v-if="selection.type == 'singlelineText'" class="staticInput">
            <h3 class="sectionTitle">
              <label for="singleLineTextInput">Input text: </label>
            </h3>
            <input id="singleLineTextInput" type="text" v-model="staticContent" placeholder="Write single line text here..."/>
          </div>

          <div v-if="selection.type == 'paragraph'" class="staticInput">
            <h3 class="sectionTitle">
              <label for="paragraphInput">Input text: </label>
            </h3>
            <textarea id="paragraphInput" v-model="staticContent" placeholder="Write your paragraph here..."></textarea>
          </div>
          
          <div v-if="selection.type == 'image'" class="staticInput">
            <h3 class="sectionTitle">
              <label for="imageURLInput">Image URL: </label>
            </h3>
            <textarea id="imageURLInput" v-model="staticContent" placeholder="Insert link to an image here..."></textarea>
          </div>
        </div>
        <div v-else class="variableDropdown">
          <h3 class="sectionTitle">
            <label for="variables">Choose a variable:</label>
          </h3>

          <select 
            id="variables"
            @change="variableChange"
            :value="selection.variable.name"
          >
            <option 
              :key="variable.name"
              :value="variable.name"
              v-for="variable in variableList" 
            >
              {{variable.name}}
            </option>
          </select>
        </div>

        <DeleteButton 
          class="deleteButton"
          :confirmBeforeDelete="false"
          @delete="deleteElement"
        />
    </div>
    
    <div v-else class="nothingSelected">
      <h2>No elements selected</h2>
    </div>

  </div>
</template>

<script>
import ImageUpload from "./ImageUpload.vue";
import ToggleSwitch from "./ToggleSwitch.vue";
import DeleteButton from "./DeleteButton.vue";

import Vue from "vue"

export default {
  props:{
    selection: {
      type: Object,
      required: false
    },
    minElementSize: {
      type: Number,
      required: true,
    },
    variableList: {
      type: Array,
      required: false
    },
    previewEnabled: {
      type: Boolean,
      required: false
    }
  },
  //eslint-disable-next-line
  components: { ImageUpload, ToggleSwitch, DeleteButton },
  data(){
    return{
      pdfTemplate: null,

      isMovable: null,
      positionData: {},
      
      staticContent: "",
      selectionType: "",
    }
  },
  computed:{
    /* ------------------------------------------------------------ */

    xCordMax(){
      const xCordMax = this.pdfTemplate.offsetWidth - this.positionData.width || 0;
      return  xCordMax < 0? 0: xCordMax; 
    },
    yCordMax(){
      const yCordMax = this.pdfTemplate.offsetHeight - this.positionData.height || 0;
      return  yCordMax < 0? 0: yCordMax; 
    },
    widthDimMax(){
      return this.pdfTemplate.offsetWidth - this.positionData.x || 0;
    },
    heightDimMax(){
      return this.pdfTemplate.offsetHeight - this.positionData.y || 0;
    },

    /* ------------------------------------------------------------ */
  },
  methods:{
    variableChange(event) {
      const varName = event.target.value
      const variable = this.variableList.find(_variable => _variable.name === varName);

      this.selection.variable = {...variable};

      if(this.previewEnabled) {
        const previewValue = this.selection.variable.example;

        if(this.selection.variable.type === "image") {
          this.setImagePreview(this.selection, previewValue);
        }
        else {
          this.selection.elementRef.innerText = previewValue || "";
        }
      }
    },

    // ************************************************************ //

    // If selection has class 'draggable' then its draggable
    checkIfMovable(){
      if(!this.selection.elementRef) {
        return;
      }
      const newMovementState = this.selection.elementRef.classList.contains("draggable");

      // If the movement state has change, trigger the movement button to change its internal state
      if(this.isMovable != newMovementState) 
        this.$refs.movementToggle.changeState(true);

      this.isMovable = newMovementState
    },
    
    // Add/remove the 'draggable' class from selection and in that way toggle its movement
    toggleMovement(){
      const elemRef = this.selection.elementRef;
      this.isMovable = !this.isMovable;
      
      const toggle ={
        true: () => elemRef.classList.add("draggable"),
        false: () => elemRef.classList.remove("draggable")
      }
      toggle[this.isMovable]();
    },

    // ************************************************************ //

    modifyPositionData(modifyBy){
      if(!this.isMovable) {
        return;
      }
      
      Object.keys(modifyBy).forEach(key => 
        this.positionData[key] += modifyBy[key]
      );

      this.validatePositionData();
      this.applyPositionUpdate();
    },

    updatePositionData(target) {
      const updatePositionValue = {
          positionDataX: "x",
          positionDataY: "y",
          positionDataWidth: "width",
          positionDataHeight: "height"
      }
      const posKey = updatePositionValue[target.id]; // get the key of the position value is being updated
      this.positionData[posKey] = target.value; // update the value 
    },

    // Validate inputted position data. If its not valid set the value to the upper/lower bound.
    validatePositionData(){
      const  clamp = (num, min, max) => Math.min(Math.max(num, min), max);
      let {x, y, width, height} = this.positionData;
      
      this.positionData.x = clamp(x, 0, this.xCordMax);
      this.positionData.y = clamp(y, 0, this.yCordMax);
      this.positionData.width = clamp(width, this.minElementSize, this.widthDimMax);
      this.positionData.height = clamp(height, this.minElementSize, this.heightDimMax);
    },

    applyPositionUpdate() {
      const domElement = this.selection.elementRef;
      let {x, y, width, height} = this.positionData;

      domElement.style.width = `${width}px`;
      domElement.style.height = `${height}px`;
      domElement.style.transform = `translate(${x}px, ${y}px)`;
  
      domElement.dataset.x = x;
      domElement.dataset.y = y;
    },
    
    // Update elements position based on the input values
    updateElementPosition({ target }){
      if(!this.isMovable) return;

      target.value = target.value == ""? "0": parseInt(target.value); // make sure the input is not empty 

      this.updatePositionData(target);
      this.validatePositionData();
      this.applyPositionUpdate();
    },

    // ************************************************************ //

    // sets the state of the "Static content" switch
    toggleStaticContent(newElement=null){
      // internal state of the toggle switch
      const newIsStatic = this.$refs.staticToggle.toggleState;

      if(this.selection.isStatic == newIsStatic) {
        return;
      }
      else if(newElement) {
        this.$refs.staticToggle.changeState(true);
        return;
      }

      // because of the internal component image static content has to be handled differently
      if(this.selection.type === "image") {
        if(newIsStatic) {
          this.selectionTypeImage();
          this.selection.isStatic = true;
        }
        else {
          this.destroyComponent();
          this.selection.isStatic = false;
        }
        
        return;
      }

      if(!newIsStatic && !this.selection.variable) {
        this.selection.variable = {...this.variableList[0]};
      }

      this.selection.isStatic = newIsStatic;
      this.selection.staticContent = "";
      this.selection.elementRef.innerText = "";
      this.selection.elementRef.style.backgroundImage = "";
    },

    updateStaticContent(){
      this.selection.staticContent = this.staticContent;

      if(this.selectionType == "image") {
        return this.selection.internalComponent.setImageURL(this.staticContent);
      }

      this.selection.elementRef.innerText = this.staticContent || "";
    },

    // ************************************************************ //

    setImagePreview(selection, previewValue) {
      selection.elementRef.style.backgroundImage = previewValue? `url(${previewValue})`: "";
      selection.elementRef.style.backgroundSize = "cover";
    },

    // Dynamically create an instance of the ImageUpload component and mount it as a child
    //  of the selected selection
    selectionTypeImage(){
      // console.log("CREATE COMPONENT: ", !this.selection.internalComponent, this.selectionType === "image")
      const shouldCreateComponent = !this.selection.internalComponent && this.selectionType === "image";
      if(!shouldCreateComponent) {
        return;
      }
      
      this.createComponent(this.selection);
    },

    // separated from selectionTypeImage() so it can be called trough $refs and skip the if statement
    createComponent(selection) {
      const child = document.createElement("div");
      selection.elementRef.appendChild(child)

      const imageUploadConstructor = Vue.extend(ImageUpload)
      const imageUploadInstance = new imageUploadConstructor({ 
        propsData: { 
          id: selection.id 
        } 
      })

      selection.internalComponent = imageUploadInstance.$mount(child);

      return imageUploadInstance;
    },

    // Destroy the internal component of the selection and remove it from the DOM 
    destroyComponent(){
      // console.log("DESTROY COMPONENT: ", !!this.selection.internalComponent)
      if(!this.selection.internalComponent) {
        return;
      }

      document.getElementById(this.selection.id).remove();
      
      this.selection.internalComponent.$destroy();
      this.selection.internalComponent = null;

      this.selection.staticContent = "";
      this.selection.elementRef.innerText = "";
    },

    // ************************************************************ //

    deleteElement(){
      this.$emit("deleteElement", this.selection);
    },
  },
  mounted(){
    this.pdfTemplate = document.getElementById("pdfTemplate");
  },
  watch:{
    selection(){
      if(!this.selection) {
        return;
      }

      this.newElementMounted = true;
      
      this.selectionType = this.selection.type;
      this.staticContent = this.selection.staticContent;
      this.positionData = this.selection.positionData;

      setTimeout(() => {
        this.newElementMounted = false;

        this.checkIfMovable();
        this.toggleStaticContent(true);
      }, 100)
    },

    selectionType(){
      if(!this.selectionType || this.newElementMounted) {
        return;
      }
      if(this.selectionType != "image") {
        this.destroyComponent();
      }

      this.staticContent = ""
      this.selection.type = this.selectionType;
      this.selection.elementRef.innerText = ""

      const typeHandler = {
        image: () => this.selectionTypeImage(),
        singlelineText: () => this.selection.elementRef.style.wordBreak = "keep-all",
        paragraph: () => this.selection.elementRef.style.wordBreak = "break-all",
        "": () => {}, // fallback
      }
      typeHandler[this.selectionType]();
    },

    staticContent(){
      if(this.newElementMounted) {
        return;
      }
      this.updateStaticContent();
    }
  },
}
</script>

<style lang="scss" scoped>
@import "../styles/style.scss";

.activeType{
  color: $primaryColor;
  font-weight: 500;

  border: none;
  background-color: $blueHighlight !important;
}

.positionData{
  width: 100%;

  display: grid;
  grid-template: repeat(2, 1fr);
  gap: 1rem;

  padding: 0.5rem;
  
  border-radius: 8px;
  background: $secondaryColor;
  
  .elementX { 
    grid-area: 1 / 1 / 2 / 2; 
  }
  .elementY { 
    grid-area: 1 / 2 / 2 / 3;
  }
  .elementW { 
    grid-area: 2 / 1 / 3 / 2;
  }
  .elementH { 
    grid-area: 2 / 2 / 3 / 3;
  }

  & > div{
    display: flex;
    gap: 0.25rem;

    font-weight: bold;

    label{
      width: 1.5rem;
      font-size: 14px;
    }

    input{
      width: 100%;

      font-size: 14px;
      font-weight: bold;

      padding: 0;

      border-radius: 0;
      border: none;
      border-bottom: 1px solid black ;
      
      background: none;
    }
  }
}
.dataTypeSelection{
  @include flex(row, space-between, initial);
  column-gap: 0.25rem;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;

  .primaryButton{
    @include flex(row, center, center);

    flex: 1;
    padding: 0.25rem 0;

    & > input{
      display: none !important;
    }

    &.typeButton-paragraph {
      padding: 0.25rem 0.5rem;
    }
  }
}

.variableDropdown{
  select {
    width: 100%;

    padding: 0.25rem 0.5rem;

    border-radius: 8px;
    border: 1px solid $blueHighlight;
    background-color: $primaryColor;

    &:hover, &:focus {
      color: $primaryColor;
      font-weight: bold;

      outline: none;
      background-color: $blueHighlight;
    }
  }
}

.deleteButton{
  margin-top: 0.75rem;
}

.nothingSelected{
  @include flex(row, center, center);
  width: 100%;

  padding: 6rem 0;

  border-radius: 8px;
  background: $secondaryColor;

  h2{
    margin: 0;
    font-size: 16px;
  }
}
</style>