<template>
<v-container fluid class="down-top-padding">
    <!-- <BaseBreadcrumb :title="page.title" :icon="page.icon" :breadcrumbs="breadcrumbs"></BaseBreadcrumb> -->
    <v-row>

    </v-row>
</v-container>
</template>

<script>
export default {
    middleware: "auth",
    layout: 'full-layout/Layout',
    name: "Ecommerce",

    async created() {
        this.$store.dispatch('layout/GET_MENUS');
    },
    async mounted() {

    },
    computed: {
        app_token: {
            get() {
                return this.$store.state.layout.app_token;
            },
            set(val) {
                this.$store.commit("layout/SET_APP_TOKEN", val);
            }
        }
    },
    data: () => ({
        page: {
            title: "Ecommerce"
        },
        breadcrumbs: [{
                text: "Dashboard",
                disabled: false,
                to: "#"
            },
            {
                text: "Ecommerce",
                disabled: true
            }
        ]
    }),

};
</script>
