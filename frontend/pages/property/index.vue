<template>
<v-container fluid class="down-top-padding">

    <BaseBreadcrumb :title="page.title" :icon="page.icon" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
    <div>
        <div class="mt-4">
            <v-data-table :headers="headers" :items="data" :options.sync="options" :server-items-length="total" :loading="loading" class="elevation-1">
                <template v-slot:top>
                    <v-toolbar flat>
                        <v-toolbar-title>Todos Imóveis</v-toolbar-title>
                        <v-divider class="mx-4" inset vertical></v-divider>
                        <v-spacer></v-spacer>
                        <v-dialog v-model="dialog" max-width="500px">
                            <template v-slot:activator="{ on }">
                                <v-btn color="primary" dark class="mb-2" v-on="on">Novo Imóvel</v-btn>
                            </template>
                            <v-card>
                                <v-overlay :value="overlay">
                                    <v-progress-circular indeterminate size="64"></v-progress-circular>
                                </v-overlay>
                                <v-card-title>
                                    <span class="headline">{{ formTitle }}</span>
                                </v-card-title>
                                <v-form ref="form" v-model="valid" lazy-validation>
                                    <v-card-text>
                                        <v-container>
                                            <v-row>
                                                <v-col cols="12" sm="6" md="6">
                                                    <v-text-field :rules="emailvalid" v-model="editedItem.email" label="E-mail do Próprietario"></v-text-field>
                                                </v-col>
                                                <v-col cols="12" sm="6" md="6">
                                                    <v-select v-model="editedItem.status" :hint="`Selecione o status`" :items="status" :rules="requireds" required item-value="id" item-text="name" label="Status" persistent-hint single-line></v-select>
                                                </v-col>
                                            </v-row>
                                            <v-row>
                                                <v-col cols="12" sm="6" md="6">
                                                    <v-select v-model="editedItem.state_id" @change="getCities()" :hint="`Selecione o estado`" :items="estados" :rules="requireds" required item-value="id" item-text="abbr" label="Estado" persistent-hint single-line></v-select>
                                                </v-col>
                                                <v-col cols="12" sm="6" md="6">
                                                    <v-select v-model="editedItem.city_id" :hint="`Selecione a cidade`" :items="cities" :rules="requireds" required item-value="id" item-text="name" label="Cidade" persistent-hint single-line></v-select>
                                                </v-col>
                                            </v-row>
                                            <v-row>
                                                <v-col cols="12" sm="6" md="6">
                                                    <v-text-field :rules="requireds" v-model="editedItem.street" label="Rua"></v-text-field>
                                                </v-col>
                                                <v-col cols="12" sm="6" md="6">
                                                    <v-text-field :rules="requireds" v-model="editedItem.neighborhood" label="Bairro"></v-text-field>
                                                </v-col>
                                            </v-row>
                                            <v-row>
                                                <v-col cols="12" sm="6" md="6">
                                                    <v-text-field :rules="requireds" v-model="editedItem.number" label="Número"></v-text-field>
                                                </v-col>
                                                <v-col cols="12" sm="6" md="6">
                                                    <v-text-field v-model="editedItem.complment" label="Complemento"></v-text-field>
                                                </v-col>
                                            </v-row>
                                        </v-container>
                                    </v-card-text>
                                </v-form>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn color="blue darken-1" text @click="close">Cancelar</v-btn>
                                    <v-btn color="blue darken-1" text @click="save">Salvar</v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>
                    </v-toolbar>
                </template>
                <template v-slot:[`item.icone`]="{ item }">
                    <v-list-item-icon>
                        <v-icon v-text="item.icone" />
                    </v-list-item-icon>
                </template>
                <template v-slot:[`item.actions`]="{ item }">
                    <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>

                    <v-icon small class="mr-2" @click="ConfirmdeleteItem(item)">mdi-delete</v-icon>
                </template>

            </v-data-table>
        </div>
    </div>
    <v-snackbar v-model="snackbar" :right="true" :top="true" :color="snackbarColor">
        {{ msg }}

        <template v-slot:action="{ attrs }">
            <v-btn color="ligth" text v-bind="attrs" @click="snackbar = false">
                Fechar
            </v-btn>
        </template>
    </v-snackbar>
</v-container>
</template>

<script>
export default {
    middleware: ["authenticated"],
    layout: "full-layout/Layout",
    name: "menus",
    computed: {
        formTitle() {
            return this.editedIndex === -1 ? "Cadastrar" : "Editar cadastro";
        }
    },
    mounted() {
        this.getApiData();
        this.getStates();
    },
    watch: {
        dialog(value) {
            if (!value) {
                if (this.$refs.form) {
                    this.$refs.form.reset()
                    this.cities = [];
                }
            }
            if (!this.editedItem.id) {
                if (this.$refs.form) {
                    this.$refs.form.reset()
                    this.cities = [];
                }
            }
        },
        pagination() {
            this.getCategoriesByPagination();
        }
    },
    methods: {
        async getCities() {
            if (this.cities.length) {
                this.editedItem.city_id = null;
            }
            let response = await this.$axios.get(`/v1/cities/${this.editedItem.state_id}`);
            this.cities = response.data.success;
        },

        close() {
            this.dialog = false;
            setTimeout(() => {
                this.editedItem = Object.assign({}, this.defaultItem);
                this.editedIndex = -1;
            }, 300);
        },
        editItem(item) {
            this.editedIndex = this.data.indexOf(item);
            this.editedItem = Object.assign({}, item);
            this.getCities();
            this.dialog = true;
        },
        async deleteItem(item) {
            try {
                let response = await this.$axios.delete('/v1/property/' + item.id)
                this.makeToast('Item deletado com sucesso !', 'success')
                this.getApiData()
            } catch (error) {
                this.makeToast('Erro ao tentar deletar registro', 'danger')
                this.getApiData()
            }
        },
        ConfirmdeleteItem(item) {
            this.$confirm({
                message: `Você realmente quer deletar esse item?`,
                button: {
                    no: 'Não',
                    yes: 'Sim'
                },
                /**
                 * Callback Function
                 * @param {Boolean} confirm
                 */
                callback: confirm => {
                    if (confirm) {
                        this.deleteItem(item)
                    }
                }
            });

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
                this.$axios.get(`${this.getData}?start=${start}&query=${this.search}&page=${page}&length=${itemsPerPage}`)
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
                this.$axios.get(`${this.getData}?start=${start}&direction=${direction}&sortBy=${sortBy}&page=${page}&length=${itemsPerPage}`)
                    .then(res => {
                        this.loading = false;
                        this.data = res.data.original.data;
                        this.total = res.data.original.recordsTotal;
                    });
            }
            if (!this.search && !sortBy) {
                this.$axios.get(`${this.getData}?start=${start}&page=${page}&length=${itemsPerPage}`)
                    .then(res => {
                        this.data = res.data.original.data;
                        this.total = res.data.original.recordsTotal;
                    })
                    .catch(err => console.log(err.response.data))
                    .finally(() => this.loading = false);
            }
        },
        async getStates() {
            let response = await this.$axios.get('/v1/states/all');
            this.estados = response.data.success;
        },
        async save() {
            try {
                if (this.$refs.form.validate(true)) {
                    let data = this.editedItem;
                    this.overlay = true;
                    if (this.editedItem.id) {
                        let response = await this.$axios.patch('/v1/property/' + this.editedItem.id, this.editedItem);
                        this.overlay = false;
                        this.makeToast('Regra atualizada com sucesso !', 'success')
                        this.getApiData()
                        this.close();
                    } else {
                        let response = await this.$axios.post('/v1/property', this.editedItem);
                        this.overlay = false;
                        this.makeToast('Regra cadastrado com sucesso !', 'success')
                        this.getApiData()
                        this.close();
                    }
                }
            } catch (error) {
                this.overlay = false;
                if (error.response) {
                    this.makeToast(error.response.data.error, 'danger')
                } else {
                    this.makeToast(error.message, 'danger')
                }

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
    },
    data: () => ({
        dialog: false,
        snackbar: false,
        msg: '',
        snackbarColor: '#000',
        editedIndex: -1,
        options: {},
        cities: [],
        valid: false,
        status: [{
            'id': '00',
            'name': 'Não contratado'
        }, {
            'id': '01',
            'name': 'Contratado'
        }, ],
        estados: [],
        getData: '/v1/property',
        overlay: false,
        editedItem: {
            email: "",
            state_id: '',
            city_id: '',
            status: '',
            complment: '',
            neighborhood: '',
            street: '',
            number: ''
        },
        defaultItem: {
            email: "",
            state_id: '',
            city_id: '',
            status: '',
            complment: '',
            neighborhood: '',
            street: '',
            number: ''
        },
        data: [],
        search: '',
        requireds: [
            v => !!v || "Esse campo é obrigatório",
        ],
        emailvalid: [
            v => !!v || "Esse campo é obrigatório",
            v => /.+@.+\..+/.test(v) || "E-mail não é válido"
        ],
        total: 0,
        loading: false,
        pagination: {},
        headers: [{
                text: 'ID',
                value: 'id'
            },
            {
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
            },
            {
                text: 'Ação',
                value: 'actions',
                sortable: false,
                align: 'center'
            }
        ],
        rowsPerPageItems: [5, 10, 20, 50, 100],
        page: {
            title: "Imóveis"
        },
        breadcrumbs: [{
                text: "Dashboard",
                disabled: false,
                to: "/dashboard"
            },
            {
                text: "Imóveis",
                disabled: true
            }
        ]
    })
};
</script>
