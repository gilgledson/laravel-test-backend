<template>
<v-container fluid class="down-top-padding">
    <BaseBreadcrumb :title="page.title" :icon="page.icon" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
    <div>
        <div class="mt-4">
            <v-data-table :headers="headers" :items="data" :options.sync="options" :server-items-length="total" :loading="loading" class="elevation-1">
                <template v-slot:top>
                    <v-toolbar flat>
                        <v-toolbar-title>Todas Cidades</v-toolbar-title>
                        <v-divider class="mx-4" inset vertical></v-divider>
                        <v-spacer></v-spacer>
                        <v-btn color="primary" @click="goToNew()" dark class="mb-2">Novo Contrato</v-btn>
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
    },
    watch: {
        options: {
            handler: function (value) {
                this.getApiData();
            },
            deep: true
        },
        dialog(value) {
            if (!value) {
                if (this.$refs.form)
                    this.$refs.form.reset()
            }
            if (!this.editedItem.id) {
                if (this.$refs.form)
                    this.$refs.form.reset()
            }

        },
        pagination() {
            this.getCategoriesByPagination();
        },
        search() {
            this.getCategoriesByPagination();
        }
    },
    methods: {
        goToNew() {
            this.$router.push('/contract/new');
        },

        async getCities() {
            let response = await this.$axios.get(`/v1/cities/${this.editedItem.state_id.id}`);
            this.cities = response.data.success;
        },
        async deleteItem(item) {
            try {
                let response = await this.$axios.delete('/v1/contract/' + item.id)
                this.makeToast('Item deletado com sucesso !', 'success')
                this.getApiData()
            } catch (error) {
                this.makeToast('Erro ao tentar deletar registro', 'danger')
                this.getApiData()
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
        close() {
            this.dialog = false;
            setTimeout(() => {
                this.editedItem = Object.assign({}, this.defaultItem);
                this.editedIndex = -1;
            }, 300);
        },
        editItem(item) {
            this.$router.push(`/contract/${item.id}`)
        },
        async getApiData() {
            this.loading = true;
            const {
                sortBy,
                descending,
                page,
                itemsPerPage
            } = this.options
            if (this.search) {
                this.$axios.get(`${this.getData}?query=${this.search}&page=${page}&length=${itemsPerPage}`)
                    .then(res => {
                        this.data = res.data.original.data;
                        this.total = res.data.recordsTotal;
                    })
                    .catch(err => console.log(err.response.data))
                    .finally(() => this.loading = false);
            }
            // get by sort option
            if (sortBy && !this.search) {
                const direction = descending ? 'desc' : 'asc';
                this.$axios.get(`${this.getData}?direction=${direction}&sortBy=${sortBy}&draw=0&page=${page}&length=${itemsPerPage}`)
                    .then(res => {
                        this.loading = false;
                        this.data = res.data.original.data;
                        this.total = res.data.recordsTotal;
                    });
            }
            if (!this.search && !sortBy) {
                this.$axios.get(`${this.getData}?page=${page}&draw=0&length=${itemsPerPage}&draw=0`)
                    .then(res => {
                        this.data = res.data.original.data;
                        this.total = res.data.original.recordsTotal;
                    })
                    .catch(err => console.log(err.response.data))
                    .finally(() => this.loading = false);
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
        permissionsForUser: [],
        dialogPermission: false,
        getData: '/v1/contract',
        editedItem: {
            email: "",
            state_id: '',
            city_id: '',
            status: '',
            complment: '',
            neighborhood: ''
        },
        defaultItem: {
            email: "",
            state_id: '',
            city_id: '',
            status: '',
            complment: '',
            neighborhood: ''
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
                text: 'Contratante',
                value: 'name'
            },

            {
                text: 'E-mail',
                value: 'email'
            },
            {
                text: 'Imóvel',
                value: 'address_formated'
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
            title: "Contratos"
        },
        breadcrumbs: [{
                text: "Dashboard",
                disabled: false,
                to: "/dashboard"
            },
            {
                text: "Contratos",
                disabled: true
            }
        ]
    })
};
</script>
