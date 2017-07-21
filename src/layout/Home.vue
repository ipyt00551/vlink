<template>
    <div class="wrapper">
        <v-head :urlString='urlString'></v-head>
        <v-sidebar :urlString='urlString'></v-sidebar>
        <div class="content">
            <transition name="move" mode="out-in"><router-view></router-view></transition>
        </div>
    </div>
</template>

<script>
    import vHead from './Header.vue';
    import vSidebar from './Sidebar.vue';
    var myMixin = require('mixins/ycMixin');
    export default {
        mixins:[myMixin],
        data() {
            return {
                urlString: ''
            }
        },
        created:function () {
            let self = this;
            if(self.$route.path.indexOf('login') == '-1'){
                self.checkLogin('login');
            }
        },
        components:{
            vHead, vSidebar
        },
        watch: {
            '$route':'fetchdata'
        },
        methods:{
            fetchdata() {
                this.urlString = window.location.hash
                this.urlString = '/' + this.urlString.split("/")[1];
            }
        },
        mounted: function () {
            this.urlString = window.location.hash
            this.urlString = '/' + this.urlString.split("/")[1];
        }
    }
</script>
