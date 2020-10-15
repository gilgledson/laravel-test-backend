<template>
<v-navigation-drawer v-model="Sidebar_drawer" :dark="SidebarColor !== 'white'" :color="SidebarColor" mobile-break-point="960" clipped :right="$vuetify.rtl" mini-variant-width="70" :expand-on-hover="expandOnHover" app id="main-sidebar" v-bar>
    <!---USer Area -->
    <v-list-item two-line class="profile-bg">
        <v-list-item-avatar>
            <img v-if="$auth.user.avatar" :src="$auth.user.avatar" />
            <img v-else src="../../../assets/avatar-default.png" />
        </v-list-item-avatar>

        <v-list-item-content class="white--text">
            <v-list-item-title>{{$auth.user.name}}</v-list-item-title>
            <v-list-item-subtitle class="caption white--text">{{$auth.user.email}}</v-list-item-subtitle>
        </v-list-item-content>
    </v-list-item>
    <!---USer Area -->

    <v-list expand nav class="mt-1">
        <template v-for="(item, i) in menus">
            <!---If Sidebar Caption -->
            <v-row v-if="item.header" :key="item.header" align="center">
                <v-col cols="12">
                    <v-subheader v-if="item.titulo" class="d-block text-truncate">{{ item.titulo }}</v-subheader>
                </v-col>
            </v-row>
            <!---If Sidebar Caption -->
            <BaseItemGroup v-else-if="item.children" :key="`group-${i}`" :item="item"></BaseItemGroup>

            <BaseItem v-else :key="`item-${i}`" :item="item" />
        </template>
        <!---Sidebar Items -->
    </v-list>
    <v-divider></v-divider>
    <!--- Progress -->
    <v-overlay :value="overlay">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <!--- Progress -->
</v-navigation-drawer>
</template>

<script>
import {
    mapState,
    mapGetters
} from "vuex";
import SidebarItems from "./SidebarItems";
export default {
    name: "Sidebar",
    props: {
        expandOnHover: {
            type: Boolean,
            default: false
        }
    },
    data: () => ({
        items: SidebarItems,
        overlay: false
    }),
    created() {
        this.$store.dispatch('layout/CLEAR_MENUS');
    },
    destroyed() {
        this.$store.dispatch('layout/CLEAR_MENUS');
    },
    async mounted() {
        this.overlay = true;
        await this.$store.dispatch('layout/GET_MENUS')
        this.overlay = false;
    },
    computed: {
        ...mapState({
            "SidebarColor": "layout/SidebarColor",
            "SidebarBg": "layout/SidebarBg"
        }),
        ...mapGetters({
            menus: "layout/GET_MENUS"
        }),
        Sidebar_drawer: {
            get() {
                return this.$store.state.layout.Sidebar_drawer;
            },
            set(val) {
                this.$store.commit("layout/SET_SIDEBAR_DRAWER", val);
            }
        }
    },
    watch: {
        "$vuetify.breakpoint.smAndDown"(val) {
            this.$emit("update:expandOnHover", !val);
        }
    },

    methods: {}
};
</script>

<style lang="scss">
#main-sidebar {
    box-shadow: 1px 0 20px rgba(0, 0, 0, .08);
    -webkit-box-shadow: 1px 0 20px rgba(0, 0, 0, .08);

    .v-navigation-drawer__border {
        display: none;
    }

    .v-list {
        padding: 8px 15px;
    }

    .v-list-item {

        &__icon--text,
        &__icon:first-child {
            justify-content: center;
            text-align: center;
            width: 20px;

        }
    }

    .profile-bg {
        background: url('../../../assets/images/delivery-boy-4k-6z.png') no-repeat;
        background-size: cover;

        .v-avatar {
            padding: 45px 0;
        }
    }

}
</style>
