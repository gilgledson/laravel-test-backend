//import colors from 'vuetify/es5/util/colors'
// const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin')
const { parsed: localEnv } = require('dotenv').config()
const webpack = require('webpack')

module.exports = {
  webpack(config) {
    config.plugins.push(new webpack.EnvironmentPlugin(localEnv))

    return config
  }
}

export default {
  /*
  ** Nuxt rendering mode
  ** See https://nuxtjs.org/api/configuration-mode
  */
  mode: 'spa',
  /*
  ** Nuxt target
  ** See https://nuxtjs.org/api/configuration-target
  */
  target: 'static',
  /*
  ** Headers of the page
  ** See https://nuxtjs.org/api/configuration-head
  */
  head: {
    titleTemplate: '%s - ' + process.env.npm_package_name,
    title: 'Laravel Vue - accordous',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Global CSS
  */
  css: [
    'vue-file-agent/dist/vue-file-agent.css'
  ],
  /*
  ** Plugins to load before mounting the App
  ** https://nuxtjs.org/guide/plugins
  */
  plugins: [
    { src: '~/plugins/base.js', ssr:false },
    { src: '~/plugins/vuetify.js', ssr:false },
    { src: '~/plugins/laravel-permissions' },
    { src: '~/plugins/moment-ptBR' }
  ],
  /*
  ** Auto import components
  ** See https://nuxtjs.org/api/configuration-components
  */
  components: true,
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    '@nuxt/typescript-build',
    '@nuxtjs/vuetify',
    '@nuxtjs/pwa',
    '@nuxtjs/google-fonts'
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/auth',
    '@nuxtjs/pwa',
    '@nuxtjs/toast'
  ],
  axios: {
   'baseURL': process.env.BASE_URL_API || "http://127.0.0.1:8000/api"
  },
  pwa: {
    icon: {
      "fileName": 'icon.png'
    },
    manifest: {
      name: 'CruzeiroExpress',
      short_name: 'CruzeiroExpress',
      lang: 'pt-br',
      display: 'standalone'
    },
    workbox: {
      runtimeCaching: [
        {
          urlPattern: 'https://fonts.googleapis.com/.*',
          handler: 'cacheFirst',
          method: 'GET',
          strategyOptions: { cacheableResponse: { statuses: [0, 200] } }
        },
        {
          urlPattern: 'https://fonts.gstatic.com/.*',
          handler: 'cacheFirst',
          method: 'GET',
          strategyOptions: { cacheableResponse: { statuses: [0, 200] } }
        },
        {
          urlPattern: 'https://cdn.snipcart.com/.*',
          method: 'GET',
          strategyOptions: { cacheableResponse: { statuses: [0, 200] } }
        },
        {
          urlPattern: 'https://ajax.googleapis.com/ajax/libs/jquery/2.2.2/jquery.min.js',
          handler: 'cacheFirst',
          method: 'GET',
          strategyOptions: { cacheableResponse: { statuses: [0, 200] } }
        }
      ]
    }
  },
  oneSignal: {
    init: {
      appId: process.env.ONE_SIGNAL,
      allowLocalhostAsSecureOrigin: true,
      welcomeNotification: {
        disable: true
      },
      autoRegister: true
    }
  },
  auth: {
    redirect: {
      login: '/login',
      logout: '/',
      callback: '/login',
      home: '/dashboard'
    },
    strategies: {
      local: {
        endpoints: {
          login: { url: '/v1/login', method: 'POST', propertyName: 'success.token' },
          logout: {url: '/v1/logout', method: 'DELETE'},
          user: {url: '/v1/user/me', method: 'GET', propertyName: 'success'}
        },
        tokenType: 'Bearer',
        autoFetchUser: true,
      }
    }
  },
  toast: {
    position: 'top-right',
    register: [ // Register custom toasts
      {
        name: 'my-error',
        message: 'Oops...Something went wrong',
        options: {
          type: 'error'
        }
      }
    ]
  },
  /*
  ** vuetify module configuration
  ** https://github.com/nuxt-community/vuetify-module
  */
  vuetify: {
    lang: {
      locales: {
        pt: {
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
        }
      },
      current: 'pt',
      defaultLocale: 'pt'
    },
    customVariables: [
      '~/scss/variables.scss'
    ],
    theme: {
      dark: false,
      themes: {
        light:{
          primary: '#0f4c75', // change header color from here || "#1e88e6", "#21c1d6", "#fc4b6c", "#563dea", "#9C27b0", "#ff9800"
          info: '#0f4c75',
          success: '#21c1d6',
          accent: '#fc4b6c',
          default: '#f5f5f5',
          background:'#4CAF5'
        },
        dark: {
          primary: '#0f4c75',
          default: '#000'
          // accent: colors.grey.darken3,
          // secondary: colors.amber.darken3,
          // info: colors.teal.lighten1,
          // warning: colors.amber.base,
          // error: colors.deepOrange.accent4,
          // success: colors.green.accent3
        }
      }
    }
  },
  /*
  ** Build configuration
  ** See https://nuxtjs.org/api/configuration-build/
  */
  build: {
    // transpile: ['vuetify/lib'],
    // plugins: [new VuetifyLoaderPlugin()],
    loaders: {
      stylus: {
        import: ["~scss/variables.scss"]
      }
    },
    extend (config, { isDev, isClient }) {
      // ..
        config.module.rules.push(
          {
            test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
            loader: 'file-loader'
          }
        )
        // Sets webpack's mode to development if `isDev` is true.
        if (isDev) { config.mode = 'development' }
    },
    postcss:{
      plugins: {
        // Disable a plugin by passing false as value
        'postcss-url': false,
        'postcss-nested': {},
        'postcss-responsive-type': {},
        'postcss-hexrgba': {}
      },
      preset: {
        // Change the postcss-preset-env settings
        autoprefixer: {
          grid: true
        }
      }
    }
  }
}
