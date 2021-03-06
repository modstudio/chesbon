<template>
  <div>
    <left-side-bar-component
      v-model="searchText"
      search-placeholder="Search Pledge"
      :is-filtered="isFiltered"
      @resetfilter="resetFilter"
    >
      <div class="px-4">
        <inactive-filter-component
          v-model="inactiveFilter"
        ></inactive-filter-component>
      </div>
    </left-side-bar-component>
    <div class="d-flex">
      <div class="flex-grow-1">
        {{data.length}}
        <template v-if="isFiltered">results</template>
        <template v-else>total</template>
      </div>
      <button type="button" class="btn btn-secondary btn-sm" @click="addItem">
        Add Pledge
      </button>
    </div>
    <div class="flex-table">
      <div class="flex-table__header">
        <div class="flex-table__header-item col-4" ref="sortName"
          @click="setSortField('name')">
          Contact
          <i class="icon icon-triangle-down"></i>
        </div>
        <div class="flex-table__header-item col-3" ref="sortRelated_category_name"
          @click="setSortField('related_category_name')">
          Cause
          <i class="icon icon-triangle-down"></i>
        </div>
        <div class="flex-table__header-item col-3">
            Metrics
        </div>
        <div class="flex-table__header-item col-2 justify-content-end" ref="sortMetric_balance"
          @click="setSortField('metric_balance')">
            Balance
            <i class="icon icon-triangle-down"></i>
        </div>
      </div>
      <div class="position-relative" v-for="item in data"
        :key="item.id">
        <div class="flex-table__row w-shadow"
          @click="viewItem(item)"
          :class="{'active': currentItem && currentItem.id === item.id}">
          <div class="flex-table__row-item col-4 font-weight-bold"
              tabindex="0">
              <div class="flex-grow-1 d-flex align-items-center">
                <inactive-badge-component v-if="item.is_inactive"></inactive-badge-component>
                <contact-name-field-component
                  :company-name="item.contact_company_name"
                  :first-name="item.contact_first_name"
                  :last-name="item.contact_last_name"
                ></contact-name-field-component>
              </div>
          </div>
          <div class="flex-table__row-item col-3"
              tabindex="0">
            {{item.related_category_name}}
          </div>
          <div class="flex-table__row-item col-3"
              tabindex="0">
            <div class="row flex-grow-1">
              <div class="col-6">
                <metric-info-component
                  metric-name="Pledged"
                  :amount="item.metric_debit"
                ></metric-info-component>
              </div>
              <div class="col-6">
                <metric-info-component
                  metric-name="Paid"
                  :amount="item.metric_kredit"
                ></metric-info-component>
              </div>
            </div>
          </div>
          <div class="flex-table__row-item col-2 justify-content-end"
              tabindex="0">
                <amount-info-component
                  :amount="item.metric_balance"></amount-info-component>
          </div>
        </div>
      </div>
    </div>

    <no-result-found-component v-show="isFiltered && !data.length"></no-result-found-component>

    <pledge-side-bar-component
      :current-item="currentItem"
      :is-shown="isViewPanel"
      :mode="viewPanelMode"
      @hidepanel="hidePanel"
      @update="onUpdate"
      @add-new="addItem"
      @add-new-contact="showContactForm"
      @add-new-cause="showCauseForm"
    ></pledge-side-bar-component>

    <cause-side-bar-component
      :is-shown="isViewCauseForm"
      mode="dialog-add-new"
      @hidepanel="hideCauseForm"
      @update="onUpdateCause"
      @add-new-contact="showContactForm"
    ></cause-side-bar-component>
    <contact-side-bar-component
      :is-shown="isViewContactForm"
      mode="dialog-add-new"
      @hidepanel="hideContactForm"
      @update="onUpdateContact"
    ></contact-side-bar-component>
  </div>
</template>

<script>
import PledgeSideBarComponent from './PledgePage/PledgeSideBarComponent';
import ContactNameFieldComponent from '../common/ContactNameFieldComponent';
import Bus from '../../shared/EventBus';
import ContactSideBarComponent from '../ContactsPage/ContactSideBarComponent';
import CauseSideBarComponent from './CausePage/CauseSideBarComponent';
import addNewContactMixin from '../mixins/add-new-contact';
import addNewCauseMixin from '../mixins/add-new-cause';

const tableSortColumnMixin = require('../mixins/table-sort-column');
export default {
  components: {
    PledgeSideBarComponent,
    ContactNameFieldComponent,
    ContactSideBarComponent,
    CauseSideBarComponent,
  },

  mixins: [
    tableSortColumnMixin,
    addNewContactMixin,
    addNewCauseMixin,
  ],

  activated() {
    Bus.$emit('open-pledge-page');
  },

  data() {
    return {
      isViewPanel: false,
      viewPanelMode: 'edit',
      currentItem: null,
      searchText: '',
      refNameSortCol: ['sortName', 'sortRelated_category_name', 'sortMetric_balance'],
      sortField: 'name',
      sortOrder: 'asc',
      inactiveFilter: 0,
    };
  },

  computed: {
    isFiltered() {
      return !!this.searchText || this.inactiveFilter !== 0;
    },

    data: {
      get() {
        let data = this.$store.getters['Categories/getPledges'];
        if (this.inactiveFilter === 0) {
          data = data.filter(item => item.is_inactive === 0);
        } else if (this.inactiveFilter === 2) {
          data = data.filter(item => item.is_inactive === 1);
        }
        if (this.searchText) {
          const searchString = this.searchText.toLowerCase();
          data = data
            .filter(item => item.contact_company_name.toLowerCase().indexOf(searchString) !== -1
              || item.contact_first_name.toLowerCase().indexOf(searchString) !== -1
              || item.contact_last_name.toLowerCase().indexOf(searchString) !== -1
              || item.related_category_name.toLowerCase().indexOf(searchString) !== -1
              || (item.note && item.note.toLowerCase().indexOf(searchString) !== -1));
        }
        let sortFields = [this.sortField];
        let sortOrders = [this.sortOrder];
        if (this.sortField === 'name') {
          sortFields = [function (item) {
            return item.contact_company_name ? item.contact_company_name
              : `${item.contact_first_name} ${item.contact_last_name}`;
          }];
          sortOrders = [this.sortOrder];
        }

        return _.orderBy(data, sortFields, sortOrders);
      },
    },
  },

  created() {
    this.getData();
  },

  methods: {
    getData() {
      this.$store.dispatch('Categories/getData');
    },

    addItem() {
      this.currentItem = null;
      this.viewPanelMode = 'new';
      this.isViewPanel = true;
    },

    hidePanel() {
      this.isViewPanel = false;
      this.currentItem = null;
    },

    viewItem(item) {
      this.hideContactForm();
      this.currentItem = item;
      this.viewPanelMode = 'edit';
      this.isViewPanel = true;
    },

    onUpdate() {
      this.getData();
      Bus.$emit('update-category');
    },

    resetFilter() {
      this.searchText = '';
      this.inactiveFilter = 0;
    },
  },
};
</script>

<style>

</style>
