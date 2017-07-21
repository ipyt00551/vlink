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
            <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>
            <el-button type="primary" icon="search" @click="searchSubmit">搜索</el-button>
            <el-button type="primary" icon="edit" @click="addRoleBnt">新增角色</el-button>
            <el-button type="primary" @click="initList">刷新</el-button>
        </div>
        <el-table  v-loading="loading" :data="tableData[0]" border style="width: 100%" ref="multipleTable"
                  @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="roletitle" label="角色名称" style="width:80%;">
            </el-table-column>
            <el-table-column label="操作" style="width:20%">
                <template scope="scope">
                    <el-button size="small"
                               @click="handleEdit(scope.$index, scope.row)">编辑
                    </el-button>
                    <el-button size="small" type="danger"
                               @click="handleDelete(scope.$index, scope.row)">删除
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
            title="提示"
            :visible.sync="dialogVisible"
            :before-close="handleClose"
            >

            <div class="form-box">
                <el-form ref="form" :model="form" label-width="80px">
                    <el-form-item label="角色名称">
                        <el-tooltip class="item" effect="dark" content="请填入角色名称" placement="top-start">
                            <el-input v-model="form.roleName"></el-input>
                        </el-tooltip>
                    </el-form-item>
                    <el-form-item label="公众号">
                        <el-tooltip class="item" effect="dark" content="选择该角色组绑定的公众号" placement="top-start">

                            <el-select v-model="form.pub" placeholder="请选择">
                                <el-option
                                    v-for="item in resultObj.pubList.data"
                                    :key="item.id"
                                    :label="item.wxname"
                                    :value="item.id">
                                </el-option>
                            </el-select>

                        </el-tooltip>
                    </el-form-item>
                </el-form>
            </div>

            <el-tooltip class="item" effect="dark" content="请选择赋予该角色的权限" placement="top-start">
            <el-tree
                :data="resultObj.authList.data"
                node-key="permission"
                :props="props"
                show-checkbox
                :default-expanded-keys="treeExpanded"
                :default-checked-keys="treeChecked"
                @check-change="handleCheckChange">
            </el-tree>
            </el-tooltip>

            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="addRole">提 交</el-button>
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
                parentItemTitle: '角色管理',
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
                    roleName: '',
                    pub: '',
                },
                formLabelWidth: '120px',

                //tree
                props: {
                    label: 'modulename',
                    children: '_child'
                },
                treeData:[],
                edit:false,
                treeExpanded:[],  //默认展开
                treeChecked:[]    //默认选择
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
                    "keywords": self.select_word
                };
                console.log(sendData);
                self.requestAxios('g', self.action.getRbacRoleList, sendData, 'loading', '错误提示', '列表加载失败', 'axiosCallback');
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
                if (self.result.data.list.roleid > 0) {
                    console.log(self.result);
                    self.tableData.push([self.result.data.list]);
                    console.log(self.tableData);
                    self.totalCount = parseInt(self.result.data.total);
                }
                console.log(self.result);
                self.tableData.push(self.result.data.list);
                console.log(self.tableData);
                self.totalCount = parseInt(self.result.data.total);
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
                this.editRole(row);
            },
            handleDelete(index, row) {
                this.$message.error('删除第' + (index + 1) + '行');
                this.$confirm('确认删除？')
                    .then(_ => {
                        this.delRole(index,row);
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

            //删除角色
            delRole(index,row){
                let self = this;
                self.loading = true;
                self.setSessionStorage('index',index);
                //权限列表
                var sendData = {
                    "token": self.getToken(),
                    "uid": self.getSessionStorage(self.action.login).userinfo.id,
                    "id": row.roleid
                };
                console.log(sendData);
                //删除
                self.requestAxios('p', self.action.delRole, sendData, 'loading', '错误提示', '删除角色失败', 'delRoleCallback');
            },

            //删除角色回调
            delRoleCallback(){
                let self = this;
                console.log("---- delRoleCallback return ------");
                console.log(self.tableData);
                console.log(self.getSessionStorage('index'));
                self.tableData[0].splice(self.getSessionStorage('index'),1);
            },

            //编辑角色
            editRole(row){
                let self = this;
                self.loadingDialog = true;
                self.form.roleName = row.roletitle;
                self.form.pub = row.wechatid;
                self.setSessionStorage("roleId",row.roleid);
                self.edit = true;
                self.getAuthList();
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
             * 新增角色按钮触发
             */
            addRoleBnt(){
                let self = this;
                self.form.roleName = '';
                self.form.pub = false;
                self.treeData = [];
                self.loadingDialog = true;
                self.getAuthList();
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
             * 新增角色提交
             */
            addRole(){
                let self = this;
                self.dialogVisible = false;
                self.loadingDialog = true;
                var sendData = {
                    "roletitle":self.form.roleName,
                    "token": self.getToken(),
                    "wechatid":self.form.pub,
                    "rpid":self.getSessionStorage(self.action.login).userinfo.role,
                    "uid":self.getSessionStorage(self.action.login).userinfo.id
                };
                if(self.edit){
                    sendData.id = self.getSessionStorage('roleId');
                    console.log(sendData);
                    //角色保存
                    self.requestAxios('p', self.action.saveRole, sendData, false, '错误提示', '修改角色失败', 'addRoleCallBack');
                }else{
                    console.log(sendData);
                    //新增角色保存
                    self.requestAxios('p', self.action.addRole, sendData, false, '错误提示', '新增角色失败', 'addRoleCallBack');
                }
            },

            //新增角色回调
            addRoleCallBack(){
                let self = this;
                let params = {};
                if(self.edit){
                    params.groupid= self.getSessionStorage('roleId');
                }else{
                    params.groupid= self.result.data;
                }
                params.uid = self.getSessionStorage(self.action.login).userinfo.id;
                params.token = self.getToken();
                params.role = self.getSessionStorage(self.action.login).userinfo.role;
                console.log(params);
                //权限合成字符串
                var powerStr = "";
                for(var i=0;i<self.treeData.length;i++){
                    console.log(i);
                    if(self.treeData[i]){
                        for(var j=0;j<self.treeData[i].length;j++){
                            powerStr += self.treeData[i][j];
                            powerStr += ",";
                        }
                    }
                }
                //设置权限
                params.powerid = powerStr.substring(0,powerStr.length-1);
                console.log(params);
                //角色权限保存
                self.requestAxios('p', self.action.setRbacRoleAuth, params, 'loadingDialog', '错误提示', '权限设置失败', 'setRbacRoleAuthCallBack');
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
                    location.reload();
                },2000);
            }


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
        width: 300px;
        display: inline-block;
    }
</style>
