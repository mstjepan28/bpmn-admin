<template>
<div class="elementList">
    <h2 v-if="title">{{title}}</h2>

    <div class="listWrapper">
        <ul v-if="elementList" class="list">
            <li :key="element.id" v-for="element in elementList">
                <button class="element" :class="{active: element.id == activeElemId}" @click="selectElement(element)">
                    {{element.name}}
                </button>
            </li>
        </ul>
    </div>

</div>
</template>

<script>
export default {
    props:{
        title: {
            type: String,
            required: false,
        },
        elementList: {
            type: Array,
            required: true,
        },
    },
    data(){
        return{
            activeElemId: null
        }
    },
    methods:{
        selectElement(element){
            this.activeElemId = element.id;
            this.$emit("elementSelected", element);
        },
    }
}
</script>

<style lang="scss" scoped>
@import "./styles/style.scss";

.active{
    border: 1px solid $highlightColor !important;
    }

.listWrapper{
    max-height: 7rem;
    overflow-y: auto;

    .list{
        @include flex(column, center, initial);
        
        row-gap: 0.25rem;
        list-style-type: none;
    
        margin-top: 0.5rem;
    
        & > li{
            @include flex(row, flex-start, center);
        }
    }
}

.element{
    background: red;

    &.active{
        color: $primaryColor;
        background: $blueHighlight;
    }
}


</style>