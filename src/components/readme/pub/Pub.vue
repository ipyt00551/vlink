<template>
    <tbody v-loading="loading">

    <!-- 新增 -->
    <div v-if="addPub" v-loading="loadingDialog">
        <div class="handleAction-box">
            <el-button @click="backToList">返 回</el-button>
        </div>

        <div class="form-box">
            <el-form ref="form" :model="form" label-width="80px">
                <el-form-item label="公众号名">
                    <el-input v-model="form.wxname" required="true"></el-input>
                </el-form-item>
                <el-form-item label="原始ID">
                    <el-input v-model="form.wxid" required="true"></el-input>
                </el-form-item>
                <el-form-item label="微信号">
                    <el-input v-model="form.weixin"></el-input>
                </el-form-item>
                <el-form-item label="APPID">
                    <el-input v-model="form.appid"></el-input>
                </el-form-item>
                <el-form-item label="APPSECRET">
                    <el-input v-model="form.appsecret"></el-input>
                </el-form-item>

                <el-form-item label="类型">
                    <el-select v-model="select_status" placeholder="请选择" class="handle-select mr10">
                        <el-option key="1" label="认证订阅号" value="1"></el-option>
                        <el-option key="2" label="认证服务号" value="2"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="二维码">
                    <el-upload
                        class="avatar-uploader"
                        action="http://v.ftoul.com/api/imgUp"
                        name="img"
                        :drag= "true"
                        :show-file-list="false"
                        :on-success="handleAvatarQrcodeSuccess"
                        :before-upload="beforeAvatarUpload">
                        <img v-if="imageQrUrl" :src="imageQrUrl" class="avatar">
                        <img v-if="form.qrcode" :src="form.qrcode" class="avatar">

                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>




                <el-form-item label="头像地址">
                    <el-upload
                        class="avatar-uploader"
                        action="http://v.ftoul.com/api/imgUp"
                        name="img"
                        :drag= "true"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload">
                        <img v-if="imageUrl" :src="imageUrl" class="avatar">
                        <img v-if="form.headerpic" :src="form.headerpic" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>


                <el-form-item label="加密方式">
                    <el-select v-model="select_EncodeType" placeholder="请选择">
                        <el-option key="1" label="明文模式" value="1"></el-option>
                        <el-option key="2" label="兼容模式" value="2"></el-option>
                        <el-option key="3" label="安全模式" value="3"></el-option>
                    </el-select>
                </el-form-item>


                <el-form-item label="AesKey">
                    <el-input v-model="form.AesEncodingKey"></el-input>
                </el-form-item>


                <el-form-item label="TOKEN">
                    <el-input v-model="form.token"></el-input>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="savePubNum">提交</el-button>
                    <el-button>取消</el-button>
                </el-form-item>
            </el-form>
        </div>

    </div>


    <!--  列表  -->
    <div class="handleAction-box" v-if="viewList">
        <el-button type="primary" @click="addPubNum(false)">创建公众号</el-button>
        <el-button @click="initList">刷新</el-button>
    </div>

    <ul v-if="viewList" v-for="(item,index) in tableData" class="listMax_li">
        <li class="max_li">
            <el-card class="box-card">

                <div slot="header" class="clearfix">
                    <el-dropdown style="float: right">
                        <span class="el-dropdown-link">
                            <i class="el-icon-more el-icon--right"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <p @click="handleEdit(index, item)"><el-dropdown-item>编辑</el-dropdown-item></p>
                            <p @click="handleDelete(index, item)"><el-dropdown-item>删除</el-dropdown-item></p>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>

                <div class="pub_content">

                    <img class="image" :src="item.headerpic">
                    <p><b>{{item.wxname}}</b></p>
                    <hr/>
                    <div>
                        <ul style="list-style-type:none;">
                            <li>
                                <p class="cnt_p">
                                    客服悬窗
                                </p>

                            </li>
                            <li>
                                <p class="sw_p">
                                    <el-switch
                                        v-model="kefu[index]"
                                        on-text=""
                                        off-text="">
                                    </el-switch>
                                </p>
                            </li>
                        </ul>
                    </div>
                    <el-button type="primary" size="small" style="width:150px;" @click="startManager">进入公众号平台</el-button>
                </div>
            </el-card>
        </li>
    </ul>

    </tbody>


</template>



<script type="text/ecmascript-6">
    import qs from 'qs';
    var myMixin = require('mixins/ycMixin');
    export default {
        mixins: [myMixin],
        data() {
            let self = this;
            return {
                viewList:true,
                addPub:false,
                roleLoadedStatus: false,
                loadingDialog: false,
                parentItemTitle: '公众号管理',
                title: '列表',
                url: '../../../../static/vuetable.json',
                tableData: [], //table渲染data
                result: [],     //异步结果
                resultObj: {
                    authList: {
                        data: []
                    },
                    pubList: {
                        data: []
                    },
                    roleList: {
                        data: []
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
                    addRole: false,
                    editRole: false,
                    viewRole: false
                },
                dialogVisible: false,

                form: {
                    wxname: '',
                    wxid: '',
                    weixin: '',
                    headerpic: '',
                    token:'',
                    typeid:'',
                    appsecret:'',
                    EncodeType:'',
                    AesEncodingKey:'',
                    qrcode:'',
                    appid:''
                },
                //图片上传
                imageUrl: '',
                imageQrUrl:'',

                roleidSelected: "",
                select_status: "1",
                select_EncodeType:"1",
                formLabelWidth: '120px',

                //tree
                props: {
                    label: 'modulename',
                    children: '_child'
                },
                treeData: [],
                edit: false,
                treeExpanded: [],  //默认展开
                treeChecked: [],    //默认选择
                dialogVisiblePassword: false,
                userStatus: true,
                kefu:[]
            }
        },
        created(){
            this.initList();
        },
        methods: {
            //进入公众号平台
            startManager(){
                this.$router.push('/wcAccount');
            },

            //返回公众号列表
            backToList(){
                let self = this;
                self.viewList = true;
                self.addPub = false;
            },

            //保存公众号
            savePubNum(){
                let self = this;
                self.loadingDialog = true;
                console.log(self.form);
                self.form.uid = self.getSessionStorage(self.action.login).userinfo.id;
                self.form.token = self.getToken();
                self.form.EncodeType = self.select_EncodeType;
                self.form.typeid = self.select_status;
                if(self.edit){
                    self.form.id = self.getSessionStorage('id');
                }
                self.requestAxios('p', self.action.savePub, self.form, 'loadingDialog', '错误提示', '保存失败', 'savePubNumCallback');
            },

            //保存公众号回调
            savePubNumCallback(){
                let self = this;
                console.log(self.result);
                self.sendMsgBoxOk(self.result.msg,'操作成功','创建公众号成功啦');
                setTimeout(() => {
                    self.backToList();
                    self.initList();
                },2000);
            },



            //创建公众号
            addPubNum(init){
                let self = this;
                self.viewList = false;
                self.addPub = true;
                if(self.edit)
                    self.edit = false;
                if(!init)
                    self.$data.form = {};
            },

            handleAvatarSuccess(res, file) {
                this.form.headerpic = res.file.url;
                this.imageUrl = URL.createObjectURL(file.raw);
            },
            handleAvatarQrcodeSuccess(res,file){
                console.log(res);
                this.form.qrcode = res.file.url;
                this.imageQrUrl = URL.createObjectURL(file.raw);
            },
            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg';
                const isLt2M = file.size / 1024 / 1024 < 2;

                if (!isJPG) {
                    this.$message.error('上传头像图片只能是 JPG 格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 2MB!');
                }
                return isJPG && isLt2M;
            },


            handlePreview(file) {
                console.log(file);
            },
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
                self.loading = true;
                var sendData = {
                    "token": self.getToken(),
                    "uid": self.getSessionStorage(self.action.login).userinfo.id,
                };
                console.log(sendData);
                self.requestAxios('g', self.action.wechatGet, sendData, 'loading', '错误提示', '列表加载失败', 'axiosCallback');
            },

            //查询
            searchSubmit(){
                this.initList();
            },
            //回调
            axiosCallback(){
                let self = this;
                console.log('-------axiosCallback list -------');
                console.log(self.result);
                self.kefu[10000] = 0;
                self.tableData = self.result.data;
                console.log(self.tableData);
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
                console.log(index);
                console.log(row);
                this.$message('编辑第' + (index + 1) + '行');
                this.editUser(row);
            },
            handleUpPwd(index, row){
                console.log(row);
                this.dialogVisiblePassword = true;
                this.setSessionStorage('id', row.id);
            },
            handleDelete(index, row) {
                //this.$message.error('删除第' + (index + 1) + '行');
                let self = this;
                var msg = '确认删除该公众号吗？';

                this.$confirm(msg)
                    .then(_ => {
                        console.log("-----------  删除公众号开始  ------------")
                        console.log(this.getSessionStorage(this.action.login));
                        this.delPub(index, row);
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
                            if (state)
                                eval("self." + state + " = false");
                            if (Callback)
                                eval("self." + Callback + "()");
                        }
                    })
                } else {
                    self.$axios.get(self.url, {params: data}).then((res) => {
                        self.result = res.data;
                        sessionStorage.setItem(action, JSON.stringify(res.data));
                        if (state)
                            eval("self." + state + " = false");
                        if (Callback)
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
            dialogAction(type, value){
                let self = this;
                return eval("self.typeAction." + type + " = " + value);
            },


            //Tree监听器
            handleCheckChange(data, checked, indeterminate) {
                let self = this;
                console.log(data, checked, indeterminate);
                if (checked && data.pid != 0) {
                    if (self.treeData[data.pid]) {
                        self.treeData[data.pid].push(data.permission);
                    } else {
                        self.treeData[data.pid] = [data.permission];
                    }
                    //console.log(self.treeData);
                } else if (!checked && data.pid != 0) {
                    if (self.treeData[data.pid]) {
                        var index = self.treeData[data.pid].indexOf(data.permission);
                        //console.log(index);
                        self.treeData[data.pid].splice(index, 1);
                        //console.log(self.treeData);
                    }
                }
                console.log("-------- treeData -------");
                console.log(self.treeData);
            },

            //删除公众号
            delPub(index, row){
                console.log(row);
                let self = this;
                self.loading = true;
                self.setSessionStorage('index', index);
                var sendData = {
                    "token": self.getToken(),
                    "uid": self.getSessionStorage(self.action.login).userinfo.id,
                    "id": row.id
                };
                console.log(sendData);
                //停用
                self.requestAxios('p', self.action.wechatDelete, sendData, 'loading', '错误提示', '操作失败', 'delPubCallback');
            },

            //删除公众号回调
            delPubCallback(){
                let self = this;
                console.log("---- delPubCallback return ------");
                console.log(self.tableData);
                var msg = '删除公众号成功！';
                self.tableData.splice(self.getSessionStorage('index'),1);
                self.sendMsgBoxOk(self.result.msg, '成功', msg);
                setTimeout(() => {
                    self.initList();
                },500);
            },

            //编辑角色
            editUser(row){
                let self = this;
                console.log("----- 编辑角色开始  -----");
                console.log(row);
                self.setSessionStorage("id", row.id);
                self.form = row;
                console.log(self.form);
                self.edit = true;
                self.addPubNum(true);
            },

            //初始化编辑数据
            editDataInit(){
                let self = this;
                console.log("---- 初始化编辑开始 -------")
                console.log(self.resultObj.authList.data);

                var tmp = [];
                self.resultObj.authList.data.forEach(function (item, index, array) {
                    array[index]._child.forEach(function (z, d, k) {
                        console.log(z);
                        if (z.checked == 'true') {
                            console.log(z.permission);
                            self.treeChecked.push(z.permission);
                            if (self.treeExpanded.indexOf(z.pid) == -1) {
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
                if (self.loading == false) {
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
                if (self.edit) {
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
                console.log("--------  getUserAuthCallback return -----");
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
                console.log("--------  wechatGetCallBack return -----");
                console.log(self.result.data);
                self.resultObj.pubList.data = self.result.data;


                self.dialogVisible = true;
                if (self.edit) {
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
                    "username": self.getSessionStorage(self.action.login).userinfo.username + '@' + self.form.username,
                    "token": self.getToken(),
                    "realname": self.form.realname,
                    "password": self.form.password,
                    "role": self.form.role,
                    "uid": self.getSessionStorage(self.action.login).userinfo.id
                };
                if (self.edit) {
                    sendData.id = self.getSessionStorage('id');
                    console.log(sendData);
                    //账户保存
                    self.requestAxios('p', self.action.saveRbacUserInfo, sendData, 'loadingDialog', '错误提示', '修改用户失败', 'addUserCallBack');
                } else {
                    console.log(sendData);
                    //新增角色保存
                    self.requestAxios('p', self.action.addSysUser, sendData, 'loadingDialog', '错误提示', '新增账户失败', 'addUserCallBack');
                }
            },

            //新增账户回调
            addUserCallBack(){
                let self = this;
                self.sendMsgBoxOk(self.result.msg, '新增成功', '新增用户成功啦');
                setTimeout(() => {
                    self.initList();
                }, 3000);
            },

            //权限设置回调
            setRbacRoleAuthCallBack(){
                let self = this;
                self.loadingDialog = false;
                if (self.edit) {
                    self.sendMsgBoxOk(self.result.msg, '保存成功', '保存角色成功啦');
                } else {
                    self.sendMsgBoxOk(self.result.msg, '新增成功', '新增角色成功啦');
                }
                self.dialogVisible = false;


                location.reload();


            },
            //状态过滤
            statusActive(row, column){
                //console.log("-------  statusActive Return -----");
                //console.log(row);
                //console.log(column);
                if (row.active == 0) {
                    return "已启用";
                } else {
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
                    "password": self.form.password
                };
                console.log(sendData);
                //重置密码
                self.requestAxios('p', self.action.upSysUserPwd, sendData, 'loadingDialog', '错误提示', '重置密码失败', 'upPasswdCallBack');
            },

            //重置密码回调
            upPasswdCallBack(){
                let self = this;
                self.sendMsgBoxOk(self.result.msg, '重置密码', '重置密码成功啦');
            }

        },

        filters: {},

        watch: {},
    }
</script>

<style>

    .clearfix:before,
    .clearfix:after {
        display: table;
        content: "";
    }

    .clearfix:after {
        clear: both
    }

    .box-card {
        width: 180px;
        background-color: #f3f5f6;
        height: auto;
        color:#58666e;
        font-size:14px;
    }
    .el-card__header{
        height: 36px;
        border-bottom:none;
    }
    .image{
        width:73px;
        height:73px;
        border-radius:50px;
        padding-bottom: 10px;
    }
    .pub_content{
        text-align: center;
    }
    .pub_content .cnt_p{
        float: left;
        padding-bottom: 20px;
        width: 70px;
    }
    .pub_content .sw_p{
        float: right;
    }

    .pub_content ul{
        padding-top: 10px;
    }

    .max_li{
        float: left;
        padding: 20px 0 20px 20px;
    }
    .handleAction-box{
        padding-bottom: 20px;
        padding-left:20px;
    }


    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #20a0ff;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px!important;
        text-align: center;
    }
    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }
    .listMax_li{
        width: 1500px;
        list-style:none;
    }

</style>
