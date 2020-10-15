/*jshint esversion: 6 */
// Code here will be linted with JSHint.
/* jshint ignore:start */

import Vue from 'vue'
import Vuex from 'vuex'
import layout from './modules/layout';
import roles from './modules/roles';
import menus from './modules/menus';
import taxaentrega from './modules/taxasentrega';

import permissions from './modules/permissions';

import VuexPersist from 'vuex-persist';


const vuexLocalStorage = new VuexPersist({
  key: 'vuex', // The key to store the state on in the storage provider.
  storage: window.localStorage, // or window.sessionStorage or localForage
  // Function that passes the state and returns the state with only the objects you want to store.
  // reducer: state => state,
  // Function that passes a mutation and lets you decide if it should update the state in localStorage.
  // filter: mutation => (true)
})

Vue.use(Vuex)
const createStore = () => {
  return new Vuex.Store({
    plugins: [vuexLocalStorage.plugin],
    modules: {
      layout,
      roles,
      menus,
      permissions,
      taxaentrega
    }
  })
}
export default createStore
/* jshint ignore:end */