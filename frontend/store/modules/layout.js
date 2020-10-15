import VuexPersistence from 'vuex-persist'
const vuexLocal = new VuexPersistence({
    storage: window.localStorage
})


const state = {
    Sidebar_drawer: null,
    Customizer_drawer: false,
    SidebarColor: 'white', //Change Sidebar Color || 'white', | "#2b2b2b" | "rgb(44, 59, 164)" | "rgb(96, 44, 164)" | "rgb(151, 210, 219)" | "rgb(77, 86, 100)"
    SidebarBg: '',
    Dart_theme: false,
    MenusSystem:[],
    estabelecimento:null,
    cidade: null,
    estabelecimentos:[],
    role:{},
    abilities:[],
    user_token: null,
}
// getters
const getters = {
    GET_DARk_THEME(state){
        return state.Dart_theme;
    },
    GET_APP_TOKEN(state){
      return state.user_token;
    },
    GET_CIDADE(state){
        return state.cidade;
    },
    GET_ACTIVE_ESTABELECIMENTO(){
        return state.estabelecimento;
    },
    GET_ROLE(state){
        return state.role;
    },
    GET_MENUS(state){

        let menu = state.MenusSystem.map(m => {
            return {
                group: '',
                icon: m.icone,
                title: m.titulo,
                to: m.href,
            }
        })
        return menu;
    }
}
// mutations
const mutations = {
    CLEAR_MENUS(state){
      state.MenusSystem = [];
    },
    SET_APP_TOKEN(state, payload){
      state.user_token = payload
    },
    SET_SIDEBAR_DRAWER(state, payload) {
        state.Sidebar_drawer = payload;
    },
    SET_CIDADE(state, payload){
        state.cidade = payload;
    },
    SET_CUSTOMIZER_DRAWER(state, payload) {
        state.Customizer_drawer = payload;
    },
    SET_SIDEBAR_COLOR(state, payload) {
        state.SidebarColor = payload;
    },
    SET_ACTIVE_ESTABELECIMENTO(state, payload){
        console.log('------ SET ESTABELECIMENTO ------')
        console.log(payload)
        console.log('------ SET ESTABELECIMENTO ------')
        console.log(payload)
        state.estabelecimento = payload;
    },
    SET_DARk_THEME(state, payload){
        console.log('setando theme:', this.$store);
       // this.$vuetify = payload;
        state.Dart_theme = payload;
    },

    SET_MENUS(state, payload){
        state.MenusSystem = payload;
    },
    SET_ROLES_ABILLITES(state, payload){

        if(payload.roles[0]){
            state.role = payload.roles[0];
        }
        state.abilities = payload.abilities;
    }
}
// actions
const actions = {
    SET_DARk_THEME({commit}, payload){
       commit('SET_DARk_THEME',  payload);
    },
    SET_APP_TOKEN({commit}, payload){
      commit('SET_APP_TOKEN', payload);
    },
    CLEAR_MENUS({commit}){
      commit('CLEAR_MENUS', []);
    },
    async GET_ROLES_ABILLITES({commit}, payload){
        let { data } = await this.$axios.get('/v1/get/roles-and-abilities');
        commit('SET_ROLES_ABILLITES', data.success);
    },
    async GET_CIDADE({commit, state}, payload){
        let { data } = await this.$axios.get('/v1/admin/estabelecimentos/getone/'+state.estabelecimento);
        console.log('------------- CIDADE -------------')
        console.log(data);
        console.log('------------- CIDADE -------------')
        commit('SET_CIDADE', data.success.cidade_id);
    },
    SET_ACTIVE_ESTABELECIMENTO({commit}, payload){
        this.$router.push('dashboard');
        console.log('----- setando estabelecimento ---------');
        commit('SET_ACTIVE_ESTABELECIMENTO', payload);
    },
    async GET_MENUS({commit}, payload){
        let menus = [
            {
                href: '/dashboard',
                icone: 'mdi-gauge',
                id: 0,
                titulo: 'Dashboards'
            },
            {
                href: '/property',
                icone: 'mdi-home-map-marker',
                id: 0,
                titulo: 'Propriedades'
            },
            {
                href: '/contract',
                icone: 'mdi-clipboard-text-multiple-outline',
                id: 0,
                titulo: 'Contratos'
            }
        ];
       
        commit('SET_MENUS', menus);
    }
}
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
  plugins: [vuexLocal.plugin]
}
