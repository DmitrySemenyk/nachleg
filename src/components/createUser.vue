<template>
  <b-modal v-model="modalCreateUser"
           ref="modal"
           size="lg"
           title="Добавьте пользователя"
           @ok="handleOk"
           @cancel="cancelRooot"
           @hidden="cancelRooot"
           @shown="clearName">
    <el-form :model="uesrForm" :rules="rulesUser" ref="uesrForm" class="demo-ruleForm" @submit.prevent="add_users('uesrForm')">
      <!--Service Choose-->
      <el-form-item prop="service">
        <div class="row">
          <div class="col-3">
            Сервис
          </div>
          <div class="col-1">

          </div>
          <div class="col-8">
            <el-select v-model="uesrForm.service" placeholder="Выберите сервис" style="width: 100%">
              <el-option
                v-for="item in sites"
                :key="item.site_id"
                :label="item.site_name"
                :value="item.site_id">
              </el-option>
            </el-select>
          </div>
        </div>
      </el-form-item>

      <!--Name-->
      <el-form-item prop="metka">
        <div class="row">
          <div class="col-3">
            Имя
          </div>
          <div class="col-1">

          </div>
          <div class="col-8">
            <el-input placeholder="Введите метку аккайнта" v-model="uesrForm.metka"></el-input>
          </div>
        </div>
      </el-form-item>

      <!--Login-->
      <el-form-item prop="login">
        <div class="row">
          <div class="col-3">
            Логин
          </div>
          <div class="col-1">

          </div>
          <div class="col-8">
            <el-input placeholder="Введите логин" v-model="uesrForm.login"></el-input>
          </div>
        </div>
      </el-form-item>

      <!--Password-->
      <el-form-item prop="password">
        <div class="row">
          <div class="col-3">
            Пароль
          </div>
          <div class="col-1">

          </div>
          <div class="col-8">
            <el-input placeholder="Введите пароль" v-model="uesrForm.password"></el-input>
          </div>
        </div>
      </el-form-item>

      <!--Email-->
      <el-form-item prop="email">
        <div class="row">
          <div class="col-3">
            Email
          </div>
          <div class="col-1">

          </div>
          <div class="col-8">
            <el-input placeholder="Введите електронную почту" v-model="uesrForm.email"></el-input>
          </div>
        </div>
      </el-form-item>

      <!--Phone-->
      <el-form-item prop="phone">
        <div class="row">
          <div class="col-3">
            Телефон
          </div>
          <div class="col-1">

          </div>
          <div class="col-8">
            <el-input type="age" placeholder="Введите телефон" v-model.number="uesrForm.phone"></el-input>
          </div>
        </div>
      </el-form-item>

      <!--Name-->
      <el-form-item>
        <div class="row">
          <div class="col-3">
            Имя
          </div>
          <div class="col-1">

          </div>
          <div class="col-8">
            <el-input placeholder="Введите имя" v-model="uesrForm.firstname"></el-input>
          </div>
        </div>
      </el-form-item>

      <!--Second Name-->
      <el-form-item>
        <div class="row">
          <div class="col-3">
            Фамилия
          </div>
          <div class="col-1">

          </div>
          <div class="col-8">
            <el-input placeholder="Введите фамилию" v-model="uesrForm.secondname"></el-input>
          </div>
        </div>
      </el-form-item>

    </el-form>
  </b-modal>
</template>

<script>
  import Vue from 'vue'

  import BootstrapVue from 'bootstrap-vue'
  import 'bootstrap/dist/css/bootstrap.css'
  import 'bootstrap-vue/dist/bootstrap-vue.css'

  import Element from 'element-ui'
  import 'element-ui/lib/theme-chalk/index.css'

  import axios from 'axios'

  import lang from 'element-ui/lib/umd/locale/ru-RU'
  import locale from 'element-ui/lib/locale'

  Vue.use(Element);
  Vue.use(BootstrapVue);



  export default {


    name: 'createUser',
    data() {
      return {
        modalCreateUser: true,
        uesrForm: {
          status: '0'
        },
        sites: [],
        host: 'http://localhost:4000/',
        rulesUser: {
          service: [
            { required: true, message: 'Выберете рекламный сервис', trigger: 'change' }
          ],
          metka: [
            { required: true, message: 'Введите имя аккаунта', trigger: 'blur' }
          ],
          login: [
            { required: true, message: 'Введите логин аккаунта', trigger: 'blur' }
          ],
          password: [
            { required: true, message: 'Введите пароль аккаунта', trigger: 'blur' }
          ],
          email: [
            { required: true, message: 'Введите адрес почты', trigger: 'blur' },
            { type: 'email', message: 'Некоректно введен адрес почты', trigger: 'blur,change' }
          ],
          phone: [
            { required: true, message: 'Поле телефон не должно быть пустым', trigger: 'blur'},
            { type: 'number', message: 'Телфон может содержать только цыфры', trigger: 'blur,change'}
          ]
        }
      };
    },
    created: function() {
      this.fetchUsers();
    },
    methods: {
      cancelRooot(){
        this.$router.push('/user');
      },
      fetchUsers: function () {
        var urlSites = this.host + 'database/akksites';
        axios.get(urlSites).then((res) => {
          this.sites = res.data;

        });
      },
      add_users: function () {
        var add_akkaunts = this.host + 'database/add_akkaunts';
        this.axios.post(add_akkaunts, this.uesrForm)
        this.$refs.modal.hide();
        this.$refs.upload.submit();
      },
      handleOk: function () {
        this.$refs['uesrForm'].validate((valid))
          this.add_users();
        }
      },

  }
</script>

<style scoped>
  .select-filter {
    padding: 20px;
    margin: 20px;
  }
  .form-style{
    margin-bottom: 20px;
  }
  .row{
    margin-bottom: 5px;
  }
</style>

