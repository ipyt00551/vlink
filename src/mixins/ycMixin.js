module.exports = {
    created: function () {
        this.checkLogin(this.$CONFIG().apiName.login);
    },
    data:function () {
        let self =this;
        return {
            TOKEN:""
        };
    },
    methods: {
        /**
         * 检测登录
         * @param action
         */
        checkLogin: function (action) {
            let self = this;
            console.log('check Login Status');
            console.log(JSON.parse(sessionStorage.getItem(action)));
            var loginRes = sessionStorage.getItem(action) ? sessionStorage.getItem(action) : false;
            console.log(loginRes);
            if (!loginRes) {
                this.$message('请登录系统');
                this.$router.push('/login');
            }else{
                self.TOKEN = JSON.parse(sessionStorage.getItem(action)).token;
            }
        },

        /**
         * 获取TOKEN
         * @returns {*}
         */
        getToken:function () {
            let self = this;
            return self.TOKEN;
        },

        /**
         * 封装Post方法数据
         * @param param
         * @returns {FormData}
         */
        urlFormDataEncode:function (param) {
            var formData = new FormData();
            for(var k in param){
                formData.append(k, param[k]);
            }
            return formData;
        },

        /**
         * 转化时间
         * @param days
         * @returns {Object}
         */
        changeDate: function (days) {
            var today = new Date(); // 获取今天时间
            var begin;
            var end;
            var time = new Object();
            if (days == 1) {
                today.setTime(today.getTime() - 1 * 24 * 3600 * 1000);
                begin = today.format('yyyy-MM-dd 23:59:59');
                end = new Date().format('yyyy-MM-dd 23:59:59');
            } else if (days == 3) {
                today.setTime(today.getTime() - 3 * 24 * 3600 * 1000);
                begin = today.format('yyyy-MM-dd 23:59:59');
                end = new Date().format('yyyy-MM-dd 23:59:59');
            } else if (days == 7) {
                today.setTime(today.getTime() - 7 * 24 * 3600 * 1000);
                begin = today.format('yyyy-MM-dd 23:59:59');
                end = new Date().format('yyyy-MM-dd 23:59:59');
            } else if (days == 30) {
                today.setTime(today.getTime() - 30 * 24 * 3600 * 1000);
                begin = today.format('yyyy-MM-dd 23:59:59');
                end = new Date().format('yyyy-MM-dd 23:59:59');
            }
            time.begin = begin;
            time.end = end;
            return time;
        },

        /**
         * 格式化时间
         * @param format
         * @returns {*}
         */
        formatDatetime: function (format) {
            var o = {
                "M+": this.getMonth() + 1, //month
                "d+": this.getDate(),    //day
                "h+": this.getHours(),   //hour
                "m+": this.getMinutes(), //minute
                "s+": this.getSeconds(), //second
                "q+": Math.floor((this.getMonth() + 3) / 3),  //quarter
                "S": this.getMilliseconds() //millisecond
            }
            if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
                (this.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o)if (new RegExp("(" + k + ")").test(format))
                format = format.replace(RegExp.$1,
                    RegExp.$1.length == 1 ? o[k] :
                        ("00" + o[k]).substr(("" + o[k]).length));
            return format;
        },


        /**
         * 删除sessionStorage
         * @param objName
         */
        removeSessionStorage:function (objName) {
            return sessionStorage.removeItem(objName);
        },

        /**
         * 存储sessionStorage
         * @param objName
         * @param obj
         */
        setSessionStorage:function (objName, obj) {
            return sessionStorage.setItem(objName, obj);
        }



    }
}
