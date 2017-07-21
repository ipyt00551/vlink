<template>
    <div class="login-wrap">
        <div class="ms-title">后台管理系统</div>
        <div class="ms-login">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="demo-ruleForm">
                <el-form-item prop="username">
                    <el-input v-model="ruleForm.username" placeholder="username"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="password" v-model="ruleForm.password" @keyup.enter.native="submitForm('ruleForm')"></el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm('ruleForm')" v-loading.fullscreen.lock="fullscreenLoading">登录</el-button>
                </div>
                <p style="font-size:12px;line-height:30px;color:#999;">Tips : 用户名和密码随便填。</p>
            </el-form>
        </div>
    </div>
</template>

<script>
    import qs from 'qs';

    export default {
        created:function () {
            let self = this;
            self.delSessionStorage(self.action.login);
        },
        data: function(){
            let self = this;
            return {
                ruleForm: {
                    username: 'yanchao',
                    password: 'program'
                },
                rules: {
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' }
                    ]
                },
                fullscreenLoading: false,
                result:[],
                url:'',
                action: self.$CONFIG().apiName
            }
        },
        methods: {
            submitForm(formName) {
                const self = this;
                self.$refs[formName].validate((valid) => {
                    if (valid) {
                        self.fullscreenLoading = true;
                        self.postFormData();
                        //self.$router.push('/readme');
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            //登录成功
            axiosCallback(){
                let self = this;
                sessionStorage.setItem('ms_username',self.result.userinfo.username);
                self.$router.push('/readme');
            },


            postFormData(){
                let self = this;
                var sendData = {
                    "username": self.ruleForm.username,
                    "password": self.ruleForm.password
                };
                self.requestAxios('p',self.action.login,sendData,'fullscreenLoading','错误提示','请重新输入','axiosCallback');

            },

            /**
             * 消息提示ALERT
             * @param msg
             * @param title
             * @param act
             * @param bntTitle
             */
            sendMsgBoxOk(msg,title,act,bntTitle){
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
            requestAxios(type,action,data,state,title,act,Callback){
                let self = this;
                if(process.env.NODE_ENV === 'development'){
                    self.url = self.$CONFIG().apiHost + action;
                };
                if(type == 'p'){
                    self.$axios.post(self.url, qs.stringify(data)).then((res) => {
                        //console.log(res.data);
                        if(res.data.status != 1){
                            eval("self." + state + " = false" );
                            self.sendMsgBoxOk(res.data.msg,title,act);
                            return false;
                        }else{
                            self.result = res.data;
                            sessionStorage.setItem(action, JSON.stringify(res.data));
                            eval("self." + state + " = false" );
                            eval("self." + Callback + "()");
                        }
                    })
                }else{
                    self.$axios.get(self.url).then( (res) => {
                        self.result = res.data;
                    })
                }
            },
        }
    }
</script>

<style scoped>
    .login-wrap{
        position: relative;
        width:100%;
        height:100%;
    }
    .ms-title{
        position: absolute;
        top:50%;
        width:100%;
        margin-top: -230px;
        text-align: center;
        font-size:30px;
        color: #fff;

    }
    .ms-login{
        position: absolute;
        left:50%;
        top:50%;
        width:300px;
        height:160px;
        margin:-150px 0 0 -190px;
        padding:40px;
        border-radius: 5px;
        background: #fff;
    }
    .login-btn{
        text-align: center;
    }
    .login-btn button{
        width:100%;
        height:36px;
    }
</style>
