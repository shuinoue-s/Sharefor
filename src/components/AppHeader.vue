<template>
    <div>
        <header>
            <v-app-bar
            app
            color="customGreen"
            dark
            dense
            >
                <div class="d-flex app-title">
                    <router-link to="/" tag="span" style="cursor: pointer" class="font">sharefor</router-link>
                </div>

                <v-spacer></v-spacer>
                <v-tabs align-with-title>
                    <v-tabs-slider color="customLightGreen"></v-tabs-slider>

                    <v-spacer></v-spacer>
                    <v-tab to="/" class="caption">
                        <p class="mb-0 font">ホーム</p>
                    </v-tab>

                    <v-spacer></v-spacer>
                    <v-tab to="/asking" class="caption">
                        <p class="mb-0 font">募集中</p>
                    </v-tab>

                    <v-spacer></v-spacer>
                    <v-tab to="/search" class="caption">
                        <p class="mb-0 font">探す</p>
                    </v-tab>
                    
                    <v-spacer></v-spacer>
                    <v-tab to="/mypage" class="caption">
                        <p class="mb-0 font">マイページ</p>
                    </v-tab>
                    <v-spacer></v-spacer>
                </v-tabs>
            </v-app-bar>
        </header>
    </div>
</template>

<script>

export default {
    name: "AppHeader"
}
</script>

<style scoped>
    @import '../css/style.css';

    .app-title {
        font-size: 24px;
    }
</style>