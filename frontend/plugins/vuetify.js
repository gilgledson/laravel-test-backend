import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import '@/scss/variables.scss';
import '@/scss/vuetify/overrides.scss';
import VueI18n from 'vue-i18n';
import VueFileAgent from 'vue-file-agent';
import money from 'v-money';
import VueCurrencyInput from 'vue-currency-input';
import VuetifyMoney from "vuetify-money";
import VueCurrencyFilter from 'vue-currency-filter';


Vue.use(VueCurrencyFilter,
  {
    symbol : 'R$',
    thousandsSeparator: '.',
    fractionCount: 2,
    fractionSeparator: ',',
    symbolPosition: 'front',
    symbolSpacing: true
  })
  
Vue.use(VuetifyMoney);

const pluginOptions = {
  globalOptions: { currency: 'BRL', autoDecimalMode: true}
}
Vue.use(VueCurrencyInput, pluginOptions)

// register directive v-money and component <money>
Vue.use(money, {precision: 4})

Vue.use(VueFileAgent);

Vue.use(Vuetify);

const messages = {
    en: {
      $vuetify: {
        dataTable:{
          itemsPerPageText: 'itens por página'
        },
        dataIterator: {
          rowsPerPageText: 'itens por página:',
          pageText: '{0}-{1} de {2}',
          
        },
      },
    },
    pt: {
      $vuetify: {
        badge: 'Distintivo',
        close: 'Fechar',
        dataIterator: {
          noResultsText: 'Nenhum dado encontrado',
          loadingText: 'Carregando itens...'
        },
        dataTable: {
          itemsPerPageText: 'Linhas por página:',
          rowsPerPageText: 'itens por página:',
          pageText: '{0}-{1} de {2}',
          noDataText: 'Nenhum registro encontrado',
          ariaLabel: {
            sortDescending: 'Ordenado decrescente.',
            sortAscending: 'Ordenado crescente.',
            sortNone: 'Não ordenado.',
            activateNone: 'Ative para remover a ordenação.',
            activateDescending: 'Ative para ordenar decrescente.',
            activateAscending: 'Ative para ordenar crescente.'
          },
          sortBy: 'Ordenar por',
          dataFooter: {
            itemsPerPageText: 'Itens por página:',
            itemsPerPageAll: 'Todos',
            nextPage: 'Próxima página',
            prevPage: 'Página anterior',
            firstPage: 'Primeira página',
            lastPage: 'Última página',
            pageText: '{0}-{1} de {2}'
          }
        },
        dataFooter: {
          itemsPerPageText: 'Itens por página:',
          itemsPerPageAll: 'Todos',
          nextPage: 'Próxima página',
          prevPage: 'Página anterior',
          firstPage: 'Primeira página',
          lastPage: 'Última página',
          pageText: '{0}-{1} de {2}'
        },
        datePicker: {
          itemsSelected: '{0} selecionado(s)',
          nextMonthAriaLabel: 'Próximo mês',
          nextYearAriaLabel: 'Próximo ano',
          prevMonthAriaLabel: 'Mês anterior',
          prevYearAriaLabel: 'Ano anterior'
        },
        noDataText: 'Não há dados disponíveis',
        carousel: {
          prev: 'Visão anterior',
          next: 'Próxima visão',
          ariaLabel: {
            delimiter: 'Slide {0} de {1} do carrossel'
          }
        },
        calendar: {
          moreEvents: 'Mais {0}'
        },
        fileInput: {
          counter: '{0} arquivo(s)',
          counterSize: '{0} arquivo(s) ({1} no total)'
        },
        timePicker: {
          am: 'AM',
          pm: 'PM'
        },
        pagination: {
          ariaLabel: {
            wrapper: 'Navegação de paginação',
            next: 'Próxima página',
            previous: 'Página anterior',
            page: 'Ir à página {0}',
            currentPage: 'Página atual, página {0}'
          }
        }
      },
    },
  }
  
Vue.use(VueI18n)


const i18n = new VueI18n({
    locale: 'pt', // set locale
    messages, // set locale messages
})


const theme = {
    primary: '#558312', // change header color from here || "#1e88e6", "#21c1d6", "#fc4b6c", "#563dea", "#9C27b0", "#ff9800"
    info: '#1e88e5',
    success: '#21c1d6',
    accent: '#fc4b6c',
    default: '#563dea'
}

export default new Vuetify({
    lang: {
        t: (key, ...params) => i18n.t(key, params)
    },
    theme: {
        themes: {
            dark: theme,
            light: theme,
        },
        dark: false,  // If you want to set dark theme then dark:true else set to false
    },
    rtl: false, // If you want to set rtl theme then rtl:true else set to false
});
