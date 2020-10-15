

/*jshint esversion: 6 */

/* jshint ignore:start */
import Vue from 'vue';

const state = {
  taxas:[],
  bairros:[]
};
// getters
const getters = {
    GET_TAXAS_DATA(state){
        console.log(state.bairros)
        return  state.bairros.map(b => {
            let taxa = state.taxas.filter(t => {
                return t.bairro_id == b.id;
            }); 
            if(taxa.length){
                if(taxa[0]['status'] == '01'){
                    b['status'] = true;
                }
                b['valor'] = parseFloat(taxa[0]['valor']).toFixed(2)
            }else{
                b['status'] = false;
                b['valor'] = 0.00;
            }
            return b;
        });
    }
};
// mutations
const mutations = {
    SET_BAIRROS(state, payload){
        state.bairros = payload;
    },
    SET_TAXAS(state, payload){
        state.taxas = payload;
    },
    SET_STATUS_TAXA(state, payload){
        state.bairros = payload;
        console.log(state.bairros)
        // let status = false;
        // console.log(state.bairros[payload].status)
        // if(state.bairros[payload].status){
        //     status  = true;
        // }
        // let bairro =  
        // {
        //     cidade: state.bairros[payload].cidade,
        //     cidade_id:state.bairros[payload].cidade_id,
        //     created_at:state.bairros[payload].created_at,
        //     id: state.bairros[payload].id,
        //     nome: state.bairros[payload].nome,
        //     status: status,
        //     updated_at: state.bairros[payload].updated_at,
        //     valor: state.bairros[payload].valor
        // }//state.bairros[payload]
        // console.log(bairro)
        // console.log(bairro.status)
        // Vue.set(state.bairros, payload, bairro);
    }
};
// actions
const actions = {
    async SET_TAXA({commit}, payload){
        try {
            let response;
            if(!payload.taxa_id){
                response = await this.$axios.post('/v1/estabelecimento/taxasentrega', {
                    "estabelecimento_id": payload.estabelecimento_id,
                    "bairro_id": payload.bairro_id,
                    "valor": payload.valor,
                    "status": payload.status
                });
            }else{
                response = await this.$axios.patch('/v1/estabelecimento/taxasentrega/'+payload.taxa_id, {
                    "estabelecimento_id": payload.estabelecimento_id,
                    "bairro_id": payload.bairro_id,
                    "valor": payload.valor,
                    "status": payload.status
                });
            }
            return {
                status:  true,
                error: null,
                data: response.data
            };
        } catch (error) {
            return {
                status:  false,
                error:  error.response ? error.response.message : error,
                data: []
            };
        }
    },
    SET_STATUS_TAXA({commit, state}, payload){
        let status = false;
      
        if(state.bairros[payload].status){
            status  = true;
        }
        let bairro =  
        {
            cidade: state.bairros[payload].cidade,
            cidade_id:state.bairros[payload].cidade_id,
            created_at:state.bairros[payload].created_at,
            id: state.bairros[payload].id,
            nome: state.bairros[payload].nome,
            status: status,
            updated_at: state.bairros[payload].updated_at,
            valor: state.bairros[payload].valor
        }//state.bairros[payload]
        let bairros = state.bairros;
        bairros[payload] = bairro;
        commit('SET_STATUS_TAXA', bairros)
    },
    async GET_BAIRROS({commit}, CIDADE_ID)
    {
        try {
            let bairros = await this.$axios.get(`/v1/admin/bairros/by-cidade/${CIDADE_ID}`);  
            commit('SET_BAIRROS',bairros.data.original.data)
            return bairros.data.original.data;
        } catch (error) {
            commit('SET_BAIRROS', [])
        }

    }, 
    async GET_TAXAS({commit}, ESTABELECIMENTO_ID)
    {
        try {
            let taxas = await this.$axios.get(`/v1/estabelecimento/taxasentrega/findByEstabelecimento/${ESTABELECIMENTO_ID}`)
            commit('SET_TAXAS',taxas.data.original.data);
            return taxas.data.original.data;
        } catch (error) {
            commit('SET_TAXAS',[]);
        }
    }
};
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
/* jshint ignore:end */