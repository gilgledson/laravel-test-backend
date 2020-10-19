
const state = {
  menus:[]
}
// getters
const getters = {
 
}
// mutations
const mutations = {
    setMenus(state, payload){
        state.menus  = payload;
    }
}
// actions
const actions = {
    async getMenus({commit}){
        try {
            let response = await this.$axios.get('/menus/all');
            console.log(response.data)
        } catch (error) {
            
        }
    }
}
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
