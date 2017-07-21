exports.install = function (Vue, options) {
    Vue.prototype.$CONFIG = function () {
        var config={};
        // 基础url前缀
        config.apiHost = "http://v.ftoul.com/api/";
        config.apiName = {
            //RBAC
            login:'login', //登录
            getRbacRoleList:'getRbacRoleList', //角色列表
            setRbacRoleAuth:'setRbacRoleAuth', //设置角色权限
            delRole:'delRole', //删除角色
            addRole:'addRole',//新增角色
            saveRole:'saveRole',//编辑角色
            wechatGet:'wechatGet',//获取当前公众号信息,
            getUserAuth:'getUserAuth',//获取用户权限列表
            //账户管理
            getRbacUserList:'getRbacUserList',   //账号列表
            addSysUser:'addSysUser', //新增账号
            upSysUserPwd:'upSysUserPwd',   //重置密码
            upUserStatus:'upUserStatus',   //停用启用
            saveRbacUserInfo:'saveRbacUserInfo', // 修改用户信息
            //公众号管理
            savePub:'savePub',   //新增
            wechatDelete:'delPub'
        };
        config.glbListLimitNum = 3;  //默认列表每也条数
        return config;
    };
}
