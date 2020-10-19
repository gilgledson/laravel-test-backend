<template>
<div>
    <p>redirecionando...</p>
</div>
</template>

<script>
import Logo from '~/components/Logo.vue'
import VuetifyLogo from '~/components/VuetifyLogo.vue'

export default {
    components: {
        Logo,
        VuetifyLogo
    },
    mounted() {
        this.$router.push('/login')
    }
}
</script>
