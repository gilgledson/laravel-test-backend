<template>
<v-app id="inspire">
    <Header v-model="expandOnHover"></Header>
    <vue-confirm-dialog></vue-confirm-dialog>

    <v-content :class="{'ligth-background': $vuetify.theme.dark == false }">
        <v-container fluid class="page-wrapper ">
            <router-view />
        </v-container>
    </v-content>
    <Sidebar :expand-on-hover.sync="expandOnHover"></Sidebar>

    <!-- <Customizer v-model="expandOnHover"></Customizer> -->

    <Footer></Footer>
</v-app>
</template>

<script>
import Header from "./header/Header";
import Sidebar from "./sidebar/Sidebar";
import Footer from "./footer/Footer";
import Customizer from "./customizer/Customizer";
import {
    mapState,
    mapMutations
} from "vuex";
export default {
    name: "Layout",

    components: {
        Header,
        Sidebar,
        Footer,
        Customizer
    },

    props: {
        source: String
    },
    data: () => ({
        expandOnHover: false
    }),
    mounted() {
        //this.$vuetify.lang.current = 'pt'
    },
    computed: {
        ...mapState({
            'Customizer_drawer': 'layout/Customizer_drawer'
        })
    },

    methods: {
        ...mapMutations({
            setCustomizerDrawer: "layout/SET_CUSTOMIZER_DRAWER"
        })
    }
};
</script>

<style>
.ligth-background {
    background-color: #F5F5F5;
}
</style>
