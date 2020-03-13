<template>
  <div>
    <dist-class-left-side-component
      v-model="searchText"
    ></dist-class-left-side-component>
      <div class="d-flex">
        <div class="flex-grow-1">
          {{data.length}} total
        </div>
        <button type="button" class="btn btn-secondary" @click="addDistClass">
          Add Dist. Class
        </button>
      </div>
      <div class="flex-table">
        <div class="flex-table__header">
          <div class="flex-table__header-item col-6 sortable">
            NAME
          </div>
          <div class="flex-table__header-item col-6">
            Distribution to date
          </div>         
        </div>
        <div is="draggable" v-model="data" tag="div"
          handle=".list-components__item-move"
          @change="onSortChange">
          <div class="position-relative mb-2" v-for="item in data"
            :key="item.id">
            <span class="list-components__item-move">
              <i class="icon-move-dots"></i>
            </span>
            <div class="flex-table__row w-shadow"
              @click="viewItem(item)"
              :class="{'active': currentItem && currentItem.id === item.id}">
              <div class="flex-table__row-item col-4 font-weight-bold"
                  tabindex="0">
                  {{ item.name }}
              </div>
              <div class="flex-table__row-item col-4"
                  tabindex="0">
              </div>
            </div>
          </div>
        </div>
      </div>      
      <dist-class-side-bar-component
        :current-item="currentItem"
        :is-shown="isViewPanel"
        :mode="viewPanelMode"
        @hidepanel="hidePanel"
        @update="getData"
        @add-new="addDistClass"
      ></dist-class-side-bar-component>   
  </div>
</template>

<script>
import draggable from 'vuedraggable';
import DistClassLeftSideComponent from './DistClassPage/DistClassLeftSideComponent';
import DistClassSideBarComponent from './DistClassPage/DistClassSideBarComponent';
import SortOrderMixin from '../mixins/sort-order';

export default {
  components: {
    draggable,
    DistClassLeftSideComponent,
    DistClassSideBarComponent,
  },

  mixins: [
    SortOrderMixin,
  ],

  data() {
    return {
      isViewPanel: false,
      viewPanelMode: 'edit',
      currentItem: null,
      searchText: '',
      sortOrderActionName: 'DistClasses/setSortOrder',
    };
  },

  computed: {
    data: {
      get() {
        let { data } = this.$store.state.DistClasses;
        if (this.searchText) {
          const searchString = this.searchText.toLowerCase();
          data = data
            .filter(item => item.name.toLowerCase().indexOf(searchString) !== -1
              || item.note.toLowerCase().indexOf(searchString) !== -1);
        }
        return data;
      },
      async set(data) {
        console.log('we here', data);
        await this.$store.commit('DistClasses/setData', data);
      },
    },
  },

  created() {
    this.getData();
  },

  methods: {
    getData() {
      this.$store.dispatch('DistClasses/getData');
    },

    addDistClass() {
      this.currentItem = null;
      this.viewPanelMode = 'new';
      this.isViewPanel = true;
    },

    hidePanel() {
      this.isViewPanel = false;
      this.currentItem = null;
    },

    viewItem(item) {
      this.currentItem = item;
      this.viewPanelMode = 'edit';
      this.isViewPanel = true;
    },
  },
};
</script>

<style>

</style>