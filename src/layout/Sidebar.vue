<template>
    <div class="sidebar">
        <el-row class='tac' v-for="(route,index) in $router.options.routes" :key='route.path'>
            <el-menu :default-active="$route.path" class="el-menu-vertical-demo" unique-opened router>
                <template v-for="(item,index) in route.children" v-if="urlString == route.path">
                    <template v-if="item.children">
                        <el-submenu :index="item.path" :key='item.path'>
                            <template slot="title"><i :class="item.icon"></i>{{ item.name }}</template>
                            <el-menu-item v-for="(subItem,i) in item.children" :key="i" :index="subItem.path">{{ subItem.name }}
                            </el-menu-item>
                        </el-submenu>
                    </template>
                    <template v-else>
                        <el-menu-item :index="item.path" :key='item.path'>
                            <i :class="item.icon"></i>{{ item.name }}
                        </el-menu-item>
                    </template>
                </template>
            </el-menu>
        </el-row>
    </div>
</template>

<script>
    export default {
        props: ['urlString'],
        computed:{
            // onRoutes(){
            //     return this.$route.path.replace('/','');
            // }
        }
    }
</script>

<style scoped>
    .sidebar{
        display: block;
        position: absolute;
        width: 250px;
        left: 0;
        top: 70px;
        bottom:0;
        background: #eef6f6;
    }
    .sidebar > ul {
        height:100%;
    }
</style>
