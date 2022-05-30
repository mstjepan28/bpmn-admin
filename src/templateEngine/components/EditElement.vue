<template>
  <div>
    <div v-if="element">
        <h2>Element properties:</h2>

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
            :isDisabled="!element.isStatic" 
            :toggleID="'staticToggle'"
            @toggled="toggleStaticContent"
          />
        </div>

        <div v-if="element.isStatic">
          <h3 class="sectionTitle">Data type: </h3>
          <div class="dataTypeSelection">
            <label for="elementText" class="primaryButton typeButton-text" :class="{activeType: elementType == 'singlelineText'}"> 
              Text <input type="radio" id="elementText" name="elementType" value="singlelineText" v-model="elementType">
            </label>

            <label for="elementParagraph" class="primaryButton typeButton-paragraph" :class="{activeType: elementType == 'paragraph'}"> 
              Paragraph <input type="radio" id="elementParagraph" name="elementType" value="paragraph" v-model="elementType">
            </label>

            <label for="elementImage" class="primaryButton typeButton-image" :class="{activeType: elementType == 'image'}"> 
              Image <input type="radio" id="elementImage" name="elementType" value="image" v-model="elementType">
            </label>
          </div>

          <div v-if="element.type == 'singlelineText'" class="staticInput">
            <h3 class="sectionTitle">
              <label for="singleLineTextInput">Input text: </label>
            </h3>
            <input id="singleLineTextInput" type="text" v-model="staticContent" placeholder="Write single line text here..."/>
          </div>

          <div v-if="element.type == 'paragraph'" class="staticInput">
            <h3 class="sectionTitle">
              <label for="paragraphInput">Input text: </label>
            </h3>
            <textarea id="paragraphInput" v-model="staticContent" placeholder="Write your paragraph here..."></textarea>
          </div>
          
          <div v-if="element.type == 'image'" class="staticInput">
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

          <select id="variables" v-model="element.variable" @change="variableChange">
            <option 
              :key="variable.value"
              v-for="variable in variableList" 
              :value="variable.value"
            >{{variable.name}}</option>
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
    apiUrl: {
      type: String,
      required: true
    },
    element: {
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
    preview: {
      type: Object,
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
      elementType: "",
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
    variableChange() {
      if(!this.preview.enabled) {
        return;
      }

      const value = this.preview.previewData[this.element.variable];
      this.element.elementRef.innerText = value || "";
    },

    // ************************************************************ //

    // If element has class 'draggable' then its draggable
    checkIfMovable(){
      if(!this.element.elementRef) return;
      const newMovementState = this.element.elementRef.classList.contains("draggable");

      // If the movement state has change, trigger the movement button to change its internal state
      if(this.isMovable != newMovementState) 
        this.$refs.movementToggle.changeState(true);

      this.isMovable = newMovementState
    },
    
    // Add/remove the 'draggable' class from element and in that way toggle its movement
    toggleMovement(){
      const elemRef = this.element.elementRef;
      this.isMovable = !this.isMovable;
      
      const toggle ={
        true: () => elemRef.classList.add("draggable"),
        false: () => elemRef.classList.remove("draggable")
      }
      toggle[this.isMovable]();
    },

    // ************************************************************ //

    modifyPositionData(modifyBy){
      if(!this.isMovable) return;
      
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
      const element = this.element.elementRef;
      let {x, y, width, height} = this.positionData;

      element.style.width = `${width}px`;
      element.style.height = `${height}px`;
      element.style.transform = `translate(${x}px, ${y}px)`;
  
      element.dataset.x = x;
      element.dataset.y = y;
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
      const internalState = this.$refs.staticToggle.toggleState;

      this.element.staticContent = "";
      
      // if this is applied to an image, it destroys the internal component 
      if(this.element.type != "image" && !this.element.isStatic) this.element.elementRef.innerText = ""; 

      if(this.element.isStatic == internalState)
        return
      else if(newElement)
        this.$refs.staticToggle.changeState(true);
      else
        this.element.isStatic = internalState;
          
      this.destroyComponent();
      this.elementTypeImage();
    },

    updateStaticContent(){
      this.element.staticContent = this.staticContent;

      if(this.elementType == "image") {
        return this.element.internalComponent.setImageURL(this.staticContent);
      }

      this.element.elementRef.innerText = this.staticContent || "";
    },

    // ************************************************************ //

    shouldCreateComponent() {
      return !this.element.internalComponent && // if there is a component present dont create another one
      this.element.isStatic && // if its not static, there is not point in the component since the image is handled on the backend
      this.elementType == "image"
    },

    shouldDestroyComponent() {
      return this.element.internalComponent &&
      this.element.isStatic &&
      this.elementType != "image"
    },

    // Dynamically create an instance of the ImageUpload component and mount it as a child
    //  of the selected element
    elementTypeImage(){
      if(!this.shouldCreateComponent()) {
        return;
      }
      
      this.createComponent(this.element)
    },

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

    // Destroy the internal component of the selected element and remove it from the DOM 
    destroyComponent(){
      if(!this.shouldDestroyComponent()) return;

      document.getElementById(this.element.id).remove();
      
      this.element.internalComponent.$destroy();
      this.element.internalComponent = null;
    },

    // ************************************************************ //

    deleteElement(){
      this.$emit("deleteElement", this.element);
    },
  },
  mounted(){
    this.pdfTemplate = document.getElementById("pdfTemplate");
  },
  watch:{
    element(){
      if(!this.element) return;

      this.newElementMounted = true;
      
      this.elementType = this.element.type;
      this.staticContent = this.element.staticContent;
      this.positionData = this.element.positionData;

      setTimeout(() => {
        this.newElementMounted = false;

        this.checkIfMovable();
        this.toggleStaticContent(true);
      }, 100)
    },

    elementType(){
      if(!this.elementType || this.newElementMounted) {
        return;
      }
      if(this.elementType != "image") {
        this.destroyComponent();
      }

      this.staticContent = ""
      this.element.type = this.elementType;
      this.element.elementRef.innerText = ""

      const elementTypeHandler = {
        image: () => this.elementTypeImage(),
        singlelineText: () => this.element.elementRef.style.wordBreak = "keep-all",
        paragraph: () => this.element.elementRef.style.wordBreak = "break-all",
        "": () => {}, // fallback
      }
      elementTypeHandler[this.elementType]();
    },

    staticContent(){
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
  select{
    width: 100%;

    font-size: 16px;
    font-weight: bold;

    padding: 0.25rem;

    border-radius: 8px;
    border: none;
    background: $secondaryColor;
    
    &>option:hover{
      background: $secondaryColor;
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