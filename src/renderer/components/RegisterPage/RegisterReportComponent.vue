<template>
  <div>
    <div class="position-relative mb-2" v-for="item in reportData" :key="item.id">
      <div class="reports-filter"
        @click="toggleCollapse(item)"
        :aria-expanded="item.isExpanded"
        :aria-controls="`register-report-${item.id}`"
        :class="{'sorted-up': item.isExpanded, 'sorted-down': !item.isExpanded}"
      >
        {{item.name}}
        <i class="icon icon-triangle-down"></i>
      </div>
      <b-collapse :id="`register-report-${item.id}`" v-model="item.isExpanded">
        <div class="reports-filter reports-filter--inside mt-1 ml-2" v-for="reportItem in item.data"
          :key="reportItem.id"
          :class="{negative: reportItem.amount < 0, positive: reportItem.amount > 0}"
          >
          <div class="reports-filter__name" tabindex="0"
            v-b-tooltip="{trigger: $root.tooltipTrigger, title: reportItem.name}"
            ischecktooltip="true"
          >
            <span>{{reportItem.name}}</span>
          </div>
          <div tabindex="0">
            <amount-info-component
              :amount="reportItem.amount"
              :is-colored="false"
            ></amount-info-component>
          </div>
        </div>
      </b-collapse>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      default: null,
    },
    searchReport: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      expandedIdsBeforeSearching: null,
    };
  },

  computed: {
    reportData() {
      if (this.searchReport) {
        let { data } = this;
        data = data || [];
        if (!this.expandedIdsBeforeSearching) {
          this.expandedIdsBeforeSearching = data
            .filter(item => item.isExpanded)
            .map(item => item.id);
        }
        this.searchReport.split(' ').forEach((searchItem) => {
          const searchString = searchItem.toLowerCase();
          data = data.map(item => ({
            ...item,
            data: item.data.filter(item => item.name.toLowerCase().indexOf(searchString) !== -1),
          }));
        });
        data = data.filter(item => item.data.length);
        this.$nextTick(() => this.expandAll());
        return data;
      } else if (this.expandedIdsBeforeSearching) {
        for (let i = 0; i < this.data.length; i += 1) {
          this.data[i].isExpanded = this.expandedIdsBeforeSearching.includes(this.data[i].id);
        }
        this.expandedIdsBeforeSearching = null;
      }
      return this.data;
    },
  },

  methods: {
    toggleCollapse(item) {
      const index = _.findIndex(this.data, { id: item.id });
      if (index !== -1) {
        this.data[index].isExpanded = !item.isExpanded;
      }
    },

    expandAll() {
      this.reportData.forEach((item) => {
        if (!item.isExpanded && item.data.length) {
          this.toggleCollapse(item);
        }
      });
    },
  },
};
</script>
