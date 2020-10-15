<template>
<v-container fluid class="down-top-padding">
    <BaseBreadcrumb :title="page.title" :icon="page.icon" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>
    <v-card>
        <v-card-text>
        </v-card-text>
    </v-card>
</v-container>
</template>

<script>
export default {
    middleware: ["authenticated"],
    layout: "full-layout/Layout",
    name: "property",
}
</script>
