<template>
    <header>
        <v-app-bar
        app
        color="customGreen"
        dark
        hide-on-scroll
        dense
        >
            <div class="d-flex text-h5 text-md-h4">
                <router-link to="/" tag="span" style="cursor: pointer">sharefor</router-link>
            </div>

            <v-spacer></v-spacer>
            <v-tabs align-with-title>
                <v-tabs-slider color="customLightGreen"></v-tabs-slider>

                <v-spacer></v-spacer>
                <v-tab to="/" class="caption text-sm-subtitle-1">
                        <p class="menu-font">ホーム</p>
                </v-tab>

                <v-spacer></v-spacer>
                <v-tab to="/about" class="caption text-sm-subtitle-1">
                    <p class="menu-font">募集中</p>
                </v-tab>

                <v-spacer></v-spacer>
                <v-tab to="/post_form" class="caption text-sm-subtitle-1">
                    <p class="menu-font">探す</p>
                </v-tab>
                
                <v-spacer></v-spacer>
                <v-tab to="" class="caption text-sm-subtitle-1">
                    <p class="menu-font">マイページ</p>
                </v-tab>
                <v-spacer></v-spacer>
            </v-tabs>
        </v-app-bar>
    </header>
</template>

<script>
import { mdiHome } from '@mdi/js'

export default {
    name: "AppHeader",
    data() {
        return {
            path: mdiHome
        }
    }
}
</script>

<style scoped>
    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@700&display=swap');
    .menu-font {
        font-family: 'Noto Sans JP', sans-serif;
        margin-bottom: 0;
    }
</style>