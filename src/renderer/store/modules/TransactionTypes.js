import Vue from 'vue';

const transferId = 11;

export default {
  namespaced: true,
  // -----------------------------------------------------------------
  state: {
    data: [],
  },
  // -----------------------------------------------------------------
  getters: {
    data: state => state.data,
    getItem: state => id => _.find(state.data, { id }),
    transferTypeId: () => transferId,
  },
  // -----------------------------------------------------------------
  mutations: {
    setData(state, data) {
      state.data = data;
    },
  },
  // -----------------------------------------------------------------
  actions: {
    async getData(context) {
      try {
        const data = await Vue.db.all(`SELECT *
        FROM transaction_types
        ORDER BY sort_order`);
        context.commit('setData', data);
      } catch (err) {
        console.log('Error get data: ', err);
      }
    },

  },
};
