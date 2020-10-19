<template>
    <v-footer app class="footerpart" inset>
      <v-col sm="3" md="9">
        <span>© {{ new Date().getFullYear() }} — TechMake</span>
      </v-col>
      
    </v-footer>
</template>
<script>
export default {
    name: "Footer",
    watch:{
      estabelecimento(){
        this.$router.push('/dashboard')
      }
    },
    computed:{
      estabelecimento: {
        get() {
          return this.$store.state.layout.estabelecimento;
        },
        set(val) {
          this.$store.commit("layout/SET_ACTIVE_ESTABELECIMENTO", val);
        }
      }
    }
}
</script>
<style lang="scss">
  .v-application .footerpart{
    border-top:1px solid rgba(0,0,0,0.1)!important;
  }
  .theme--light.v-footer{
    background:white;
  }
</style>