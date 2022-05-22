<template>
  <button 
    type="button"  
    class="toggleSwitch toggleWrapper" 
    :class="{active: toggleState}"
    @click="toggle()" 
  >
    <h4 
      v-if="labels" 
      class="switchLabel" 
      :class="{active: toggleState}"
    >
      {{toggleLabel}}
    </h4>

    <div 
      class="switch" 
      :class="{active: toggleState}"
    >
      <span 
        :id="'circle' + toggleID"
        class="circle"
        :class="{active: toggleState}"
      ></span>
    </div>
  </button>
</template>

<script>
export default {
    props: {
      labels: {
        type: Array,
        required: true
      },
      toggleID: {
        type: String,
        required: false
      },
      isDisabled: {
        type: Boolean,
        required: true
      },
    },
    data(){
      return{
        toggleState: false, // current state of the toggle
        toggleEnabled: false, // can the user interact 
      }
    },
    computed:{
      toggleLabel(){
        return this.toggleState? this.labels[0]: this.labels[1];
      },
    },
    methods:{
      toggle(){
        if(!this.toggleEnabled) return;
        
        this.disableToggle();
        this.changeState();

        this.$emit("toggled");
      },

      // Disable the toggle for 0.4s / duration of the animation
      disableToggle(){
        this.toggleEnabled = false;
        setTimeout(() => this.toggleEnabled = true, 400);
      },
      
      // Change the visuals and internal state
      changeState(automaticTrigger=false){
        const toggleSwitch  = document.getElementById("circle" + this.toggleID);
        if(automaticTrigger) this.toggleTransition(toggleSwitch);
        
        this.toggleState = !this.toggleState;
        toggleSwitch.style.left = this.toggleState? "18px": "3px";
      },

      toggleTransition(toggleSwitch){
        toggleSwitch.style.transition = "0s";
        setTimeout(() => toggleSwitch.style.transition = "", 400)
      }
    },
    // If the initial state is 'enabled' trigger the toggle function
    mounted(){
      if(!this.isDisabled) this.changeState(true);
      this.toggleEnabled = true;
    }
}
</script>

<style lang="scss" scoped>
// **** Change colors here **** //
@import "../styles/style.scss";

$primary: $primaryColor;
$secondary: $primaryColor;
$activeColor: $blueHighlight;
$disabled: $highlightColor;
// *************************** //

$SliderSize: 15px;

$SwitchWidth: 36px;
$SwitchHeight: 20px;

$borderWidth: 1.5px;

.toggleWrapper{
  @include flex(row, space-between, center);
  width: 100%;

  &:first-child{
    margin: 0.5rem 0;
  }
}

.toggleSwitch{
  padding: 0.25rem 0.5rem;

  border-radius: 5px;
  border: $borderWidth solid $disabled;

  background-color: $primary;

  &:hover, &:focus{
    border: $borderWidth solid $activeColor;
  }
  
  &.active{
    border: $borderWidth solid $activeColor;
    background-color: $activeColor;
  }
}

.switchLabel{
  color: $disabled;
  font-weight: 500;
  margin-right: 1rem;

  &.active{
    color: $primary !important;
  }
}

.switch{
  width: $SwitchWidth;
  height: $SwitchHeight;

  position: relative;

  border-radius: 9999px;

  background-color: $disabled;

  &.active{
    background-color: $primary;
  }
}

.circle{
  $top: 50%;
  $left: 3px;

  width: $SliderSize;
  height: $SliderSize;

  position: absolute;
  top: $top;
  left: $left;

  transition: .4s;
  transform: translateY(-$top);

  border-radius: 9999px;

  background: $primary;

  &.active{
    background-color: $activeColor;
  }
}


</style>