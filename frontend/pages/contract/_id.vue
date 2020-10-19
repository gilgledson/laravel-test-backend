<template>
<v-container fluid class="down-top-padding">
    <BaseBreadcrumb :title="page.title" :icon="page.icon" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
    <v-stepper v-model="step">
        <v-stepper-header>
            <v-stepper-step :complete="step > 1" step="1" :rules="[() => valid]">
                Informações de Contrato
            </v-stepper-step>
            <v-stepper-step :complete="step > 2" step="2">
                Imóvel
            </v-stepper-step>
        </v-stepper-header>
        <v-stepper-items>
            <v-stepper-content step="1">
                <v-form ref="form" v-model="valid" lazy-validation>
                    <v-row>
                        <v-col cols="12" sm="6" md="6">
                            <v-row>
                                <v-col cols="4">
                                    <v-select label="Tipo docuemnto" v-model="itemDefault.document_type" :items="['CPF', 'CNPJ']" :rules="requireds"></v-select>
                                </v-col>
                                <v-col cols="8">
                                    <v-text-field v-if="itemDefault.document_type == 'CPF'" :rules="cpfRule" masked="false" required :hint="'Digite o CPF'" v-mask="'###.###.###-##'" v-model="itemDefault.document" label="CPF"></v-text-field>
                                    <v-text-field v-if="itemDefault.document_type == 'CNPJ'" :rules="cnpjRule" required masked="false" :hint="'Digite o CNPJ'" v-mask="'##.###.###/####-##'" v-model="itemDefault.document" label="CNPJ"></v-text-field>
                                </v-col>
                            </v-row>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                            <v-row>
                                <v-col>
                                    <v-text-field v-model="itemDefault.name" :rules="requireds" label="Nome Contratante"></v-text-field>
                                </v-col>
                            </v-row>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col cols="12" sm="6" md="6">
                            <v-text-field v-model="itemDefault.email" :rules="emailvalid" label="E-mail Contratante"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                            <v-text-field v-model="itemDefault.property_address" disabled label="Endereço Imóvel"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col>
                            <v-btn color="primary" @click="save()">
                                Salvar
                            </v-btn>

                            <v-btn :disabled="!valid" color="default" @click="nextFirst()">
                                Editar imóvel
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-form>
            </v-stepper-content>
            <v-stepper-content step="2">
                <v-row>
                    <v-col cols="12" sm="4" md="4">
                        <v-select v-model="filter.state_id" @change="getCities()" :hint="`Selecione o estado`" :items="states" item-value="id" item-text="abbr" label="Estado" persistent-hint single-line></v-select>
                    </v-col>
                    <v-col cols="12" sm="4" md="4">
                        <v-select v-model="filter.city_id" :hint="`Selecione a cidade`" :items="cities" item-value="id" item-text="name" label="Cidade" persistent-hint single-line></v-select>
                    </v-col>
                    <v-col cols="12" sm="4" md="4">
                        <v-row>
                            <v-col>
                                <v-btn block @click="getApiData()" color="primary">Filtrar</v-btn>
                            </v-col>
                            <v-col>
                                <v-btn block @click="clearFilter()" color="secundary">Limpar Filtrar</v-btn>
                            </v-col>
                        </v-row>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col>
                        <v-data-table selectable-key="id" v-model="propertyId" :single-select="true" item-key="id" show-select :headers="headers" :items="data" :options.sync="options" :server-items-length="total" :loading="loading" class="elevation-2">
                            <template v-slot:top>
                                <v-toolbar flat>
                                    <v-toolbar-title>Selecione o Imóvel</v-toolbar-title>
                                    <v-divider class="mx-4" inset vertical></v-divider>
                                    <v-spacer></v-spacer>
                                </v-toolbar>
                            </template>
                            <template v-slot:[`item.icone`]="{ item }">
                                <v-list-item-icon>
                                    <v-icon v-text="item.icone" />
                                </v-list-item-icon>
                            </template>
                        </v-data-table>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col>
                        <v-btn color="default" @click="back()">
                            Cancelar
                        </v-btn>
                        <v-btn :disabled="!this.propertyId.length" color="primary" @click="save()">
                            Salvar
                        </v-btn>
                    </v-col>
                </v-row>
            </v-stepper-content>
        </v-stepper-items>
        <v-snackbar v-model="snackbar" :right="true" :top="true" :color="snackbarColor">
            {{ msg }}

            <template v-slot:action="{ attrs }">
                <v-btn color="ligth" text v-bind="attrs" @click="snackbar = false">
                    Fechar
                </v-btn>
            </template>
        </v-snackbar>
    </v-stepper>
    <v-overlay :value="overlay">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
</v-container>
</template>

<script>
const {
    cpf,
    cnpj
} = require('cpf-cnpj-validator');
export default {
    middleware: ["authenticated"],
    layout: "full-layout/Layout",
    name: "contract-new",
    mounted() {
        this.getStates()
        this.getApiData()
        this.getContract()
    },
    methods: {
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

        },
        nextFirst() {
            if (this.$refs.form.validate(true)) {
                this.step++
                this.editProperty = true
            }
        },
        back() {
            this.step--;
            this.editProperty = false;
            this.propertyId = [];
        },
        async getStates() {
            let response = await this.$axios.get('/v1/states/all');
            this.states = response.data.success;
        },
        clearFilter() {
            this.filter = {
                state_id: null,
                city_id: null
            }
            this.getApiData();
        },
        async getContract() {
            let response = await this.$axios.get(`/v1/contract/${this.$route.params.id}`);
            this.itemDefault = response.data.success;
        },
        async getCities() {
            let response = await this.$axios.get(`/v1/cities/${this.filter.state_id}`);
            this.cities = response.data.success;
        },
        async getStates() {
            let response = await this.$axios.get('/v1/states/all');
            this.states = response.data.success;
        },
        async save() {
            try {
                let property_id;
                if (this.propertyId.length) {
                    property_id = this.propertyId[0]['id']
                } else {
                    property_id = this.itemDefault.property_id;
                }
                let response = await this.$axios.patch('/v1/contract/' + this.itemDefault.id, {
                    'id': this.itemDefault.id,
                    'name': this.itemDefault.name,
                    'document_type': this.itemDefault.document_type,
                    'document': this.itemDefault.document,
                    'email': this.itemDefault.email,
                    'property_id': property_id
                });
                this.makeToast('Regra atualizada com sucesso !', 'success')
                this.getApiData()
                this.close();
            } catch (error) {
                console.log(error)
                this.makeToast(error, 'danger')
            }

        },
        close() {
            setTimeout(() => this.$router.push('/contract'), 1000);
        },
        async getApiData() {
            this.loading = true;
            const {
                sortBy,
                descending,
                page,
                itemsPerPage
            } = this.options

            let start = (page - 1) * itemsPerPage;
            if (this.search) {
                this.$axios.get(`${this.getData}?start=${start}&state_id=${this.filter.state_id}&city_id=${this.filter.city_id}&query=${this.search}&page=${page}&length=${itemsPerPage}`)
                    .then(res => {
                        this.data = res.data.original.data;
                        this.total = res.data.original.recordsTotal;
                    })
                    .catch(err => console.log(err.response.data))
                    .finally(() => this.loading = false);
            }
            // get by sort option
            if (sortBy && !this.search) {
                const direction = descending ? 'desc' : 'asc';
                this.$axios.get(`${this.getData}?start=${start}&state_id=${this.filter.state_id}&city_id=${this.filter.city_id}&direction=${direction}&sortBy=${sortBy}&page=${page}&length=${itemsPerPage}`)
                    .then(res => {
                        this.loading = false;
                        this.data = res.data.original.data;
                        this.total = res.data.original.recordsTotal;
                    });
            }
            if (!this.search && !sortBy) {
                this.$axios.get(`${this.getData}?start=${start}&state_id=${this.filter.state_id}&city_id=${this.filter.city_id}&page=${page}&length=${itemsPerPage}`)
                    .then(res => {
                        this.data = res.data.original.data;
                        this.total = res.data.original.recordsTotal;
                    })
                    .catch(err => console.log(err.response.data))
                    .finally(() => this.loading = false);
            }
        },
    },
    data() {
        return {
            step: 1,
            getData: '/v1/property',
            data: [],
            snackbar: false,
            overlay: false,
            msg: '',
            editProperty: false,
            snackbarColor: '#000',
            options: {},
            propertyId: [],
            total: 0,
            loading: false,
            headers: [{
                    text: 'E-mail',
                    value: 'email'
                },
                {
                    text: 'Endereço',
                    value: 'address_formated'
                },
                {
                    text: 'Status',
                    value: 'statusFormatted'
                }
            ],
            itemDefault: {
                'name': '',
                'document_type': 'CPF',
                'document': '',
                'email': '',
                'property_id': []
            },
            valid: false,
            requireds: [
                v => !!v || "Esse campo é obrigatório",
            ],
            cities: [],
            states: [],
            cpfRule: [
                v => !!v || "Esse campo é obrigatório",
                v => cpf.isValid(v) || "CPF inválido",
            ],
            emailvalid: [
                v => !!v || "Esse campo é obrigatório",
                v => /.+@.+\..+/.test(v) || "E-mail não é válido"
            ],
            cnpjRule: [
                v => !!v || "Esse campo é obrigatório",
                v => cnpj.isValid(v) || "CNPJ inválido",
            ],
            page: {
                title: "Contrato"
            },
            filter: {
                state_id: null,
                city_id: null
            },
            breadcrumbs: [{
                    text: "Dashboard",
                    disabled: false,
                    to: "/dashboard"
                }, {
                    text: "Contratos",
                    disabled: false,
                    to: "/Contract"
                },
                {
                    text: "Novo",
                    disabled: true
                }
            ]
        }
    }
}
</script>
