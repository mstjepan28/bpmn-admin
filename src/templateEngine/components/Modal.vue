<template>
<div 
  :id="id" 
  class="modal-background"
  @click="closeModal"
>
  <div class="modal" @click.stop>
    <div class="modal-header">
      <button type="button" @click="closeModal">X</button>
    </div>
    
    <div class="modal-body">
      <slot></slot>
    </div>
  </div>
</div>
</template>

<script>

export default {
  props: {
    id: {
      required: true,
      type: String
    }
  },
  data() {
    return {
      isModalOpen: false,

      providerData: {
        message: "",
        style: "",
        data: {},
      }
    }
  },
  // this function handles provided data from the parent component and makes sure it's reactive to changes
  // should be replaced with a computed property in Vue3 https://vuejs.org/guide/components/provide-inject.html#working-with-reactivity
  provide() {
    const data = {}

    Object.defineProperty(data, "providerData", {
      enumerable: true,
      get: () => this.providerData,
    })

    return {
      data
    }
  },
  methods: {
    resetData() {
      this.providerData = {
        message: "",
        style: "",
        data: {},
      }
    },

    openModal(modalData, customMessage=null, customStyle=null) {
      this.providerData.data = modalData;
      this.providerData.message = customMessage;
      this.providerData.style = customStyle;

      this.isModalOpen = true;
      document.getElementById(this.id).style.display = "block";
    },

    closeModal() {
      this.resetData();

      this.isModalOpen = false;
      document.getElementById(this.id).style.display = "none";
    },
  },
}
</script>

<style lang="scss" scoped>

.modal-background {
  width: 100%;
  height: 100vh;

  display: none;

  cursor: pointer;

  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
  
  background-color: rgba(0, 0, 0, 0.5);
}


.modal {
  width: 50%;
  max-width: 600px;

  cursor: default;

  display: flex;
  flex-direction: column;

  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}

.modal-header {
  display: flex;
  justify-content: flex-end;
  align-items: center;

  padding: 0.5rem 1rem;
}

.modal-body{
  display: flex;
  flex: 1;

  padding: 1rem;
  padding-top: 0;

  & > * {
    flex: 1;
  }
}
</style>