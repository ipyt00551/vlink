/**
 * Created by suguangwen on 2017/7/20.
 */
import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);

import components from 'components/';
import { Home } from 'layout/';


export default new Router({
    routes: [
        {
            path  : '/',
            name  : 'index',
            hidden: true,
            redirect(to){
                return 'login';
            }
        }, 
        {
            path     : '/login',
            name     : '登录',
            hidden   : true,
            component: components.Login
        },
        {
            path: '/readme',
            name: '后台管理系统',
            component: Home,
            redirect: '/readme/role',
            children:[
                {
                    path: '/readme/role',
                    name: '角色管理',
                    icon: 'el-icon-setting',
                    component: components.Readme.Role
                },
                {
                    path: '/readme/user',
                    name: '账号管理',
                    icon: 'el-icon-menu',
                    component: components.Readme.User
                },
                {
                    path: '/readme/pub',
                    name: '公众号管理',
                    icon: 'el-icon-date',
                    component: components.Readme.Pub
                }
            ]
        },
        {
            path: '/wcAccount',
            name: '微信公共号管理',
            component: Home,
            redirect: '/wcAccount/basic',
            children:[
                {
                    path: '/wcAccount/basic',
                    name: '基本功能管理',
                    icon: 'el-icon-setting',
                    children: [{
                        path: '/wcAccount/basic/menu',
                        name: '自定义菜单',
                        icon: 'reorder'
                    }, {
                        path: '/wcAccount/basic/fans',
                        name: '粉丝管理',
                        icon: 'edit'
                    }]
                },
                {
                    path: '/readme',
                    name: '返回系统管理',
                    icon: 'el-icon-setting',
                }
            ]
        }
    ]
})