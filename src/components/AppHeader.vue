<template>
    <header>
        <v-app-bar
        app
        color="customGreen"
        dark
        hide-on-scroll
        dense
        >
            <!-- <v-app-bar-title> -->
            <div class="d-flex text-h5 text-md-h4">
                sharefor
            </div>
            <!-- </v-app-bar-title> -->

            <v-spacer></v-spacer>
            <v-tabs align-with-title>
                <v-tabs-slider color="customLightGreen"></v-tabs-slider>

                <v-spacer></v-spacer>
                <v-tab to="/" class="caption text-sm-subtitle-1">
                        <!-- <svg-icon type="mdi" :path="path" style="transform: translateY(7%)"></svg-icon> -->
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
// import SvgIcon from '@jamescoyle/vue-icon'
import { mdiHome } from '@mdi/js'

export default {
    name: "AppHeader",

    components: {
        // SvgIcon
    },

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