<template>
    <div class="table" v-loading="loadingDialog">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-menu"></i> {{parentItemTitle}}</el-breadcrumb-item>
                <el-breadcrumb-item>{{title}}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="handle-box">
            <el-button class="handle-del mr10">批量删除</el-button>
            <el-select v-model="roleidSelected" placeholder="筛选角色">
                <el-option
                    v-for="item in resultObj.roleList.data[0]"
                    :key="item.roleid"
                    :label="item.roletitle"
                    :value="item.roleid">
                </el-option>
            </el-select>
            <el-select v-model="select_status" placeholder="筛选状态" class="handle-select mr10">
                <el-option key="" label="全部" value=""></el-option>
                <el-option key="0" label="已启用" value="0"></el-option>
                <el-option key="1" label="未启用" value="1"></el-option>
            </el-select>

            <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
            <el-button type="primary" icon="search" @click="searchSubmit">搜索</el-button>
            <el-button type="primary" icon="edit" @click="addUserBnt">新增账户</el-button>
            <el-button type="primary" @click="initList">刷新</el-button>
        </div>
        <el-table  v-loading="loading" :data="tableData[0]" border style="width: 100%" ref="multipleTable"
                  @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"></el-table-column>

            <el-table-column prop="username" label="用户名" width="180" >
            </el-table-column>
            <el-table-column prop="realname" label="姓名" width="180">
            </el-table-column>
            <el-table-column prop="roletitle" label="角色名称" width="180">
            </el-table-column>
            <el-table-column prop="createdate" label="日期" sortable width="180">
            </el-table-column>
            <el-table-column prop="active" label="状态" width="180" :formatter="statusActive"  >

            </el-table-column>

            <el-table-column label="操作" style="width:100%">
                <template scope="scope">
                    <el-button size="small"
                               @click="handleUpPwd(scope.$index,scope.row)">重置密码
                    </el-button>
                    <el-button size="small"
                               @click="handleEdit(scope.$index, scope.row)">编辑
                    </el-button>
                    <el-button size="small" type="danger"
                               @click="handleDelete(scope.$index, scope.row, true)">停用
                    </el-button>

                    <el-button size="small" type="danger"
                               @click="handleDelete(scope.$index, scope.row, false)">启用
                    </el-button>

                </template>
            </el-table-column>

        </el-table>


        <div class="pagination" style="text-align: center;">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="cur_page"
                :page-sizes="[3, 6, 9, 12]"
                :page-size="limit"
                layout="total, sizes, prev, pager, next, jumper"
                :total="totalCount">
            </el-pagination>
        </div>


        <!-- 新增 编辑 查看 角色弹出层  -->

        <el-dialog
            title="新增账户"
            :visible.sync="dialogVisible"
            :before-close="handleClose"
            >

            <div class="form-box">
                <el-form ref="form" :model="form" label-width="80px">
                    <el-form-item label="账户名称">
                        <el-tooltip class="item" effect="dark" content="请填入账户名称" placement="top-start">
                            <el-input v-model="form.username" ></el-input>
                        </el-tooltip>
                    </el-form-item>

                    <el-form-item label="真实姓名">
                        <el-tooltip class="item" effect="dark" content="请填入账户名称" placement="top-start">
                            <el-input v-model="form.realname"></el-input>
                        </el-tooltip>
                    </el-form-item>

                    <el-form-item label="密码" v-if="!edit">
                        <el-tooltip class="item" effect="dark" content="请填入账户密码" placement="top-start">
                            <el-input v-model="form.password" type="password"></el-input>
                        </el-tooltip>
                    </el-form-item>


                    <el-form-item label="角色">
                        <el-tooltip class="item" effect="dark" content="选择该账户组绑定的角色" placement="top-start">

                            <el-select v-model="form.role" placeholder="选择角色">
                                <el-option
                                    v-for="item in resultObj.roleList.data[0]"
                                    :key="item.roleid"
                                    :label="item.roletitle"
                                    :value="item.roleid">
                                </el-option>
                            </el-select>

                        </el-tooltip>
                    </el-form-item>
                </el-form>
            </div>

            <!--<el-tooltip class="item" effect="dark" content="请选择赋予该角色的权限" placement="top-start">-->
            <!--<el-tree-->
                <!--:data="resultObj.authList.data"-->
                <!--node-key="permission"-->
                <!--:props="props"-->
                <!--show-checkbox-->
                <!--:default-expanded-keys="treeExpanded"-->
                <!--:default-checked-keys="treeChecked"-->
                <!--@check-change="handleCheckChange">-->
            <!--</el-tree>-->
            <!--</el-tooltip>-->

            <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addUser">提 交</el-button>
            </span>
        </el-dialog>


        <!-- 重置密码  -->
        <el-dialog
            title="重置系统登录密码"
            :visible.sync="dialogVisiblePassword"
            :before-close="handleClose"
        >
            <div class="form-box">
                <el-form ref="form" :model="form" label-width="80px">
                    <el-form-item label="密码">
                        <el-tooltip class="item" effect="dark" content="请填入账户密码" placement="top-start">
                            <el-input v-model="form.password" type="password"></el-input>
                        </el-tooltip>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisiblePassword = false">取 消</el-button>
                <el-button type="primary" @click="upPasswd">提 交</el-button>
            </span>
        </el-dialog>



    </div>



</template>





<script type="text/ecmascript-6">
    import qs from 'qs';
    var myMixin = require('mixins/ycMixin');
    export default {
        mixins: [myMixin],
        data() {
            let self = this;
            return {
                roleLoadedStatus:false,
                loadingDialog:false,
                parentItemTitle: '账户管理',
                title: '列表',
                url: '../../../../static/vuetable.json',
                tableData: [], //table渲染data
                result: [],     //异步结果
                resultObj:{
                    authList:{
                        data:[]
                    },
                    pubList:{
                        data:[]
                    },
                    roleList:{
                        data:[]
                    }
                },
                cur_page: 1,   //当前页面
                limit: self.$CONFIG().glbListLimitNum, //全局每页条数
                multipleSelection: [],
                select_word: '',    //查询字段
                loading: true,      //状态
                totalCount: 1000,    //总数
                url: '',             //请求地址
                action: self.$CONFIG().apiName,   //接口地址全局
                typeAction: {   //弹出层
                    addRole:false,
                    editRole:false,
                    viewRole:false
                },
                dialogVisible: false,

                form: {
                    username: '',
                    realname: '',
                    password:'',
                    role:''
                },
                roleidSelected:"",
                select_status:"",
                formLabelWidth: '120px',

                //tree
                props: {
                    label: 'modulename',
                    children: '_child'
                },
                treeData:[],
                edit:false,
                treeExpanded:[],  //默认展开
                treeChecked:[],    //默认选择
                dialogVisiblePassword: false,
                userStatus: true
            }
        },
        created(){
            this.initList();
        },
        methods: {
            handleCurrentChange(val){
                this.cur_page = val;
            },
            handleSizeChange(val) {
                this.limit = val;
                console.log(`每页 ${val} 条`);
                this.initList();
            },
            handleCurrentChange(val) {
                this.cur_page = val;
                console.log(`当前页: ${val}`);
                this.initList();
            },

            getData(){
                let self = this;
                var sendData = {
                    "token": self.getToken(),
                    "uid": self.getSessionStorage(self.action.login).userinfo.id,
                    "limit": self.limit,
                    "page": self.cur_page,
                    "role": self.getSessionStorage(self.action.login).userinfo.role,
                    "keyword": self.select_word,
                    "groupid":self.roleidSelected,
                    "active":self.select_status
                };
                console.log(sendData);
                self.requestAxios('g', self.action.getRbacUserList, sendData, false, '错误提示', '列表加载失败', 'axiosCallback');
            },

            //查询
            searchSubmit(){
                this.initList();
            },
            //回调
            axiosCallback(){
                let self = this;
                console.log('-------callback list -------');
                console.log(self.result);
                if (self.result.data.list.id > 0) {
                    console.log(self.result);
                    self.tableData.push([self.result.data.list]);
                    console.log(self.tableData);
                    self.totalCount = parseInt(self.result.data.total);
                }
                console.log(self.result);
                self.tableData.push(self.result.data.list);
                console.log(self.tableData);
                self.totalCount = parseInt(self.result.data.total);
                self.getRbacRoleList();
            },

            //获取角色列表
            getRbacRoleList(){
                let self = this;
                //获取角色列表
                var sendData = {
                    "token": self.getToken(),
                    "uid": self.getSessionStorage(self.action.login).userinfo.id,
                    "limit": self.limit,
                    "page": self.cur_page,
                    "role": self.getSessionStorage(self.action.login).userinfo.role,
                    "keywords": self.select_word
                };
                console.log(sendData);
                self.requestAxios('g', self.action.getRbacRoleList, sendData, 'loading', '错误提示', '列表加载失败', 'getRbacRoleListCallback');
            },

            //获取角色列表回调
            getRbacRoleListCallback(){
                let self = this;
                console.log("------ getRbacRoleListCallback  return  -------");
                self.resultObj.roleList.data.push(self.result.data.list);
                console.log(self.resultObj.roleList.data);
            },

            formatter(row, column) {
                return row.address;
            },
            filterTag(value, row) {
                return row.tag === value;
            },
            handleEdit(index, row) {
                this.$message('编辑第' + (index + 1) + '行');
                console.log(row);
                this.editUser(row);
            },
            handleUpPwd(index,row){
                console.log(row);
                this.dialogVisiblePassword = true;
                this.setSessionStorage('id',row.id);
            },
            handleDelete(index, row, state) {
                //this.$message.error('删除第' + (index + 1) + '行');
                let self = this;
                self.userStatus = state ? true : false;
                var msg = '';
                if(self.userStatus){
                    msg = '确认停用账户？';
                }else{
                    msg = '确认启用账户？';
                }
                this.$confirm(msg)
                    .then(_ => {
                        console.log("----------- Stop User ------------")
                        console.log(this.getSessionStorage(this.action.login));
                        this.delUser(index,row);
                    })
                    .catch(_ => {
                    });
            },
            handleSelectionChange: function (val) {
                this.multipleSelection = val;
            },

            /**
             * 初始化列表
             */
            initList () {
                this.tableData = [];
                this.loading = true;
                this.getData();
            },


            /**
             * 消息提示ALERT
             * @param msg
             * @param title
             * @param act
             * @param bntTitle
             */
            sendMsgBoxOk(msg, title, act, bntTitle){
                let self = this;
                self.$alert(msg, title, {
                    confirmButtonText: bntTitle ? bntTitle : "确定",
                    callback: action => {
                        this.$message({
                            type: 'info',
                            message: act
                        });
                    }
                });
            },

            //获取本地数据
            getSessionStorage(action){
                console.log(action);
                return JSON.parse(sessionStorage.getItem(action));
            },
            //删除本地数据
            delSessionStorage(action){
                sessionStorage.removeItem(action);
            },

            /**
             * 异步封装
             * @param type p是post g是get
             * @param action 接口action
             * @param data 发送object json
             * @param state 加载状态
             * @param title error标题
             * @param act error回调提示
             * @param axiosCallback  回调函数名
             */
            requestAxios(type, action, data, state, title, act, Callback){
                let self = this;
                if (process.env.NODE_ENV === 'development') {
                    self.url = self.$CONFIG().apiHost + action;
                }
                ;
                if (type === 'p') {
                    self.$axios.post(self.url, qs.stringify(data)).then((res) => {
                        //console.log(res.data);
                        if (res.data.status != 1) {
                            eval("self." + state + " = false");
                            self.sendMsgBoxOk(res.data.msg, title, act);
                            return false;
                        } else {
                            self.result = res.data;
                            sessionStorage.setItem(action, JSON.stringify(res.data));
                            if(state)
                                eval("self." + state + " = false");
                            if (Callback)
                                eval("self." + Callback + "()");
                        }
                    })
                } else {
                    self.$axios.get(self.url, {params: data}).then((res) => {
                        self.result = res.data;
                        sessionStorage.setItem(action, JSON.stringify(res.data));
                        if(state)
                            eval("self." + state + " = false");
                        if(Callback)
                            eval("self." + Callback + "()");
                    })
                }
            },

            //关闭当前弹出层
            handleClose(done) {
                this.$confirm('确认关闭？')
                    .then(_ => {
                        location.reload();
                        done();
                    })
                    .catch(_ => {
                    });
            },

            /**
             * 弹出层状态
             * @param type
             * @param value
             * @returns {Object|any}
             */
            dialogAction(type,value){
                let self = this;
                return eval("self.typeAction." + type + " = " + value);
            },


            //Tree监听器
            handleCheckChange(data, checked, indeterminate) {
                let self = this;
                console.log(data, checked, indeterminate);
                if(checked && data.pid != 0){
                    if(self.treeData[data.pid]){
                        self.treeData[data.pid].push(data.permission);
                    }else{
                        self.treeData[data.pid]=[data.permission];
                    }
                    //console.log(self.treeData);
                }else if(!checked && data.pid != 0){
                    if(self.treeData[data.pid]){
                        var index = self.treeData[data.pid].indexOf(data.permission);
                        //console.log(index);
                        self.treeData[data.pid].splice(index,1);
                        //console.log(self.treeData);
                    }
                }
                console.log("-------- treeData -------");
                console.log(self.treeData);
            },

            //停用账户
            delUser(index,row){
                console.log(row);
                let self = this;
                self.loading = true;
                self.setSessionStorage('index',index);
                var sendData = {
                    "token": self.getToken(),
                    "uid": self.getSessionStorage(self.action.login).userinfo.id,
                    "id": row.id,
                    "active":self.userStatus ? 1 : 0
                };
                console.log(sendData);
                //停用
                self.requestAxios('p', self.action.upUserStatus, sendData, 'loading', '错误提示', '操作失败', 'delUserCallback');
            },

            //删除角色回调
            delUserCallback(){
                let self = this;
                console.log("---- delUserCallback return ------");
                console.log(self.tableData);
                console.log(self.getSessionStorage('index_row'));
                var msg = '';
                var state = null;
                if(self.userStatus){
                    msg = '停用账户成功!';
                    state = 1;
                }else{
                    msg = '启用账户成功！';
                    state = 0;
                }
                self.tableData[0][self.getSessionStorage('index')].active = state;
                self.sendMsgBoxOk(self.result.msg,'成功',msg);
            },

            //编辑角色
            editUser(row){
                let self = this;
                console.log(row);
                self.form.username = row.username.split('@')[1];
                self.form.role = row.role;
                self.form.realname = row.realname;
                self.setSessionStorage("id",row.id);
                self.edit = true;
                self.dialogVisible = true;
            },

            //初始化编辑数据
            editDataInit(){
                let self = this;
                console.log("---- 初始化编辑开始 -------")
                console.log(self.resultObj.authList.data);

                var tmp = [];
                self.resultObj.authList.data.forEach(function (item,index,array) {
                    array[index]._child.forEach(function (z,d,k) {
                        console.log(z);
                        if(z.checked == 'true'){
                            console.log(z.permission);
                            self.treeChecked.push(z.permission);
                            if(self.treeExpanded.indexOf(z.pid) == -1){
                                self.treeExpanded.push(z.pid);
                            }
                            tmp.push(z.permission);
                        }
                    });
                    self.treeData[item.id] = tmp;
                    tmp = [];
                });
                console.log("---- 初始化编辑结束 -------")
                console.log(self.treeExpanded);
                console.log(self.treeChecked);
                console.log(self.treeData);
            },

            /**
             * 新增按钮触发
             */
            addUserBnt(){
                let self = this;
                if(self.loading == false){
                    self.edit = false;
                    self.form.username = '';
                    self.form.realname = '';
                    self.form.password = '';
                    self.form.role = false;
                    self.dialogVisible = true;
                }
            },

            //获取权限列表
            getAuthList(){
                let self = this;
                var gid = 1;
                if(self.edit){
                    gid = self.getSessionStorage('roleId');
                }
                //权限列表
                var sendData = {
                    "token": self.getToken(),
                    "uid": self.getSessionStorage(self.action.login).userinfo.id,
                    "groupid": gid
                };
                console.log(sendData);
                //获取权限列表
                self.requestAxios('g', self.action.getUserAuth, sendData, false, '错误提示', '用户权限列表加载失败', 'getUserAuthCallback');

            },


            //获取用户权限列表回掉
            getUserAuthCallback(){
                let self = this;
                console.log("--------  getUserAuthCallback return -----" );
                console.log(self.result.data);
                self.resultObj.authList.data = self.result.data;

                var sendData = {
                    "token": self.getToken(),
                    "uid": self.getSessionStorage(self.action.login).userinfo.id
                };
                console.log(sendData);

                //获取公众号列表
                self.requestAxios('g', self.action.wechatGet, sendData, 'loadingDialog', '错误提示', '列表加载失败', 'wechatGetCallBack');

            },


            //公众号列表回调
            wechatGetCallBack(setTimeOut){
                let self = this;
                console.log("--------  wechatGetCallBack return -----" );
                console.log(self.result.data);
                self.resultObj.pubList.data = self.result.data;



                self.dialogVisible = true;
                if(self.edit){
                    self.editDataInit();  //初始化编辑数据
                }
                console.log("------ wechatGetCallBack return ----");
                console.log(self.resultObj.authList);
                console.log(self.resultObj.pubList);
                return;
            },


            /**
             * 新增账户提交
             */
            addUser(){
                let self = this;
                self.dialogVisible = false;
                self.loadingDialog = true;
                var sendData = {
                    "username":self.getSessionStorage(self.action.login).userinfo.username+'@'+self.form.username,
                    "token": self.getToken(),
                    "realname":self.form.realname,
                    "password":self.form.password,
                    "role":self.form.role,
                    "uid":self.getSessionStorage(self.action.login).userinfo.id
                };
                if(self.edit){
                    sendData.id = self.getSessionStorage('id');
                    console.log(sendData);
                    //账户保存
                    self.requestAxios('p', self.action.saveRbacUserInfo, sendData, 'loadingDialog', '错误提示', '修改用户失败', 'addUserCallBack');
                }else{
                    console.log(sendData);
                    //新增角色保存
                    self.requestAxios('p', self.action.addSysUser, sendData, 'loadingDialog', '错误提示', '新增账户失败', 'addUserCallBack');
                }
            },

            //新增账户回调
            addUserCallBack(){
                let self = this;
                self.sendMsgBoxOk(self.result.msg,'新增成功','新增用户成功啦');
                setTimeout(() => {
                    self.initList();
                },3000);
            },

            //权限设置回调
            setRbacRoleAuthCallBack(){
                let self = this;
                self.loadingDialog = false;
                if(self.edit){
                    self.sendMsgBoxOk(self.result.msg,'保存成功','保存角色成功啦');
                }else{
                    self.sendMsgBoxOk(self.result.msg,'新增成功','新增角色成功啦');
                }
                self.dialogVisible = false;

                setTimeout(() => {
                    self.initList();
                },2000);
            },

            //状态过滤
            statusActive(row,column){
                //console.log("-------  statusActive Return -----");
                //console.log(row);
                //console.log(column);
                if(row.active == 0){
                    return "已启用";
                }else{
                    return "停用";
                }
            },

            //重置密码
            upPasswd(){
                let self = this;
                self.dialogVisiblePassword = false;
                self.loadingDialog = true;
                var sendData = {
                    "token": self.getToken(),
                    "uid": self.getSessionStorage(self.action.login).userinfo.id,
                    "id": self.getSessionStorage('id'),
                    "password":self.form.password
                };
                console.log(sendData);
                //重置密码
                self.requestAxios('p', self.action.upSysUserPwd, sendData, 'loadingDialog', '错误提示', '重置密码失败', 'upPasswdCallBack');
            },

            //重置密码回调
            upPasswdCallBack(){
                let self = this;
                self.sendMsgBoxOk(self.result.msg,'重置密码','重置密码成功啦');
            }

        },

        filters:{
        },

        watch:{

        },
    }
</script>

<style>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-del {
        border-color: #bfcbd9;
        color: #999;
    }

    .handle-select {
        width: 120px;
    }

    .handle-input {
        width: 300px!important;
        display: inline-block;
    }
</style>
