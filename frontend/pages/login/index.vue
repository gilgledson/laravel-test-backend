<template>
<v-row>
    <v-overlay :value="overlay">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
    <v-snackbar v-model="snackbar" :right="true" :top="true" :color="snackbarColor">
        {{ msg }}

        <template v-slot:action="{ attrs }">
            <v-btn color="ligth" text v-bind="attrs" @click="snackbar = false">
                Fechar
            </v-btn>
        </template>
    </v-snackbar>
    <v-col cols="12" lg="7" xl="6" class="primary d-none d-md-flex align-center login-background justify-center">
        <v-container transition="slide-y-transition">
            <div class="pa-10">
                <v-row justify="center">
                    <v-col cols="8" xl="5">
                        <div>
                            <h2 class="display-1 white--text font-weight-medium">Accordous</h2>
                            <h6 class="subtitle-1 mt-4 white--text op-5 font-weight-regular">Sistema de teste em laravel e VueJS.</h6>

                        </div>
                    </v-col>
                </v-row>
            </div>
        </v-container>
    </v-col>
    <v-col cols="12" lg="5" xl="6" class="d-flex align-center">
        <v-container v-if="newUser" style="margin-top:-75px">
            <v-fade-transition>
                <div class="pa-2 pa-sm-12" transition="slide-y-transition">
                    <v-row>
                        <v-col cols="12" lg="9" xl="6">
                            <v-form ref="form" v-model="valid" lazy-validation>
                                <h2 class="font-weight-bold mt-4 blue-grey--text text--darken-2">Faça seu cadastro</h2>

                                <v-text-field v-model="sigupData.name" :rules="required" label="Nome" class="mt-2" required outlined></v-text-field>
                                <v-text-field v-model="sigupData.email" :rules="emailRules" label="E-mail" class="mt-2" required outlined></v-text-field>
                                <v-text-field v-model="sigupData.celular" :rules="required" label="Celular" v-mask="'(##) # ####-####'" class="mt-2" required outlined></v-text-field>
                                <v-text-field v-model="sigupData.password" :counter="10" :rules="passwordRules" label="Senha" required outlined :type="'password'"></v-text-field>
                                <v-text-field v-model="sigupData.password_confirmation" :counter="10" :rules="passwordRules" label="Confirme Senha" required outlined :type="'password'"></v-text-field>
                                <v-btn :disabled="!valid || loading" color="primary" block class="mr-4" :loading="loading" @click="register">Cadastrar</v-btn>
                            </v-form>

                        </v-col>
                    </v-row>
                    <div class="d-block d-sm-flex align-center mb-4 mb-sm-0">
                        <div class="ml-4 m-3">
                            <a href="javascript:void(0)" @click="newUser = false " class="link">Já tem conta? faça login</a>
                        </div>
                    </div>
                </div>
            </v-fade-transition>
        </v-container>
        <v-container v-else>
            <v-fade-transition>
                <div class="pa-7 pa-sm-12" transition="slide-y-transition">
                    <v-row>
                        <v-col cols="12" lg="9" xl="6">
                            <h2 class="font-weight-bold mt-4 blue-grey--text text--darken-2">Faça login</h2>

                            <v-form ref="form" v-model="valid" lazy-validation>
                                <v-text-field v-model="email" :rules="emailRules" label="E-mail" class="mt-4" required outlined></v-text-field>
                                <v-text-field v-model="password" :counter="10" :rules="passwordRules" label="Senha" required outlined :type="'password'"></v-text-field>
                                <v-btn :disabled="!valid || loading" color="primary" block class="mr-4" :loading="loading" @click="submit">Entrar</v-btn>
                            </v-form>
                        </v-col>
                    </v-row>

                </div>
            </v-fade-transition>

        </v-container>
    </v-col>
</v-row>
</template>

<script>
export default {
    middleware: ["annonymous"],
    layout: "blank-layout/Blanklayout",
    name: "FullLogin",
    data: () => ({
        valid: true,
        password: "",
        snackbar: false,
        snackbarColor: "",
        overlay: false,
        sigupData: {
            "name": "",
            "email": "",
            "password": "",
            "password_confirmation": "",
            "celular": ""
        },
        msg: '',
        newUser: false,
        loading: false,
        showloading: false,
        show1: false,
        passwordRules: [
            v => !!v || "Esse campo é obrigatório",
            v => (v && v.length <= 10) || "Password must be less than 10 characters"
        ],
        required: [
            v => !!v || "Esse campo é obrigatório",
        ],
        email: "",
        emailRules: [
            v => !!v || "Esse campo é obrigatório",
            v => /.+@.+\..+/.test(v) || "E-mail não é válido"
        ],
        checkbox: false
    }),
    methods: {
        goForgotPassword() {
            this.$router.push('/forgot-password');
        },
        async register() {
            this.$refs.form.validate();
            if (this.$refs.form.validate(true)) {
                try {
                    this.loading = true;
                    this.overlay = true;
                    let {
                        data
                    } = await this.$axios.post('/v1/usuario/register', this.sigupData);
                    this.msg = "usuário cadastrado com sucesso !"
                    this.loading = false;
                    this.overlay = false;
                    console.log(this.loading);
                    this.makeToast('usuário cadastrado com sucesso, agora você pode fazer login !', 'success')
                    this.newUser = false;
                    this.$refs.form.reset();
                } catch (error) {
                    this.overlay = false;
                    console.log(error.response)

                    this.loading = false;
                    this.showloading = false
                    this.makeToast(error.response.data.error, 'danger')

                }

            }
        },
        async submit() {
            this.$refs.form.validate();
            try {
                if (this.$refs.form.validate(true)) {

                    //this.$router.push({ path: "/dashboards/analytical" });
                    this.loading = true;
                    this.overlay = true;

                    let response = await this.$auth.loginWith('local', {
                        data: {
                            'email': this.email,
                            'password': this.password
                        }
                    })

                    console.log(this.loading);

                    console.log(response)
                    if (response.status == 201) {
                        console.log("Token")
                        this.showloading = false
                        console.log(response.data.success.token)
                        this.$auth.setUser(response.data.success.user);
                        await this.$auth.setUserToken(response.data.success.token)
                            .then(() => {
                                this.loading = false;
                                this.overlay = false;
                                this.$router.push('dashboard')
                            })

                    } else {
                        this.loading = false;

                        console.log(this.loading);
                        this.overlay = false;
                        this.$toast.error(response.menssage)
                    }
                }
            } catch (error) {
                this.overlay = false;

                this.loading = false;
                console.log(this.loading);
                this.makeToast(error.response.data.error, 'danger')
            }

        },
        makeToast(message, type) {

            if (type == 'success') {
                this.snackbarColor = "#00b33c"
            } else if (type == 'danger') {
                this.snackbarColor = "#ff3333"
            }
            this.msg = message;
            if (this.snackbar) {
                this.snackbar = false;
                setTimeout(() => this.snackbar = true, 500)
            } else {
                this.snackbar = true;
            }

        }
    }
};
</script>

<style scoped>
.login-background {
    background: url('../../assets/images/property.jpg');
    background-size: cover;
}

.image-center {
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
