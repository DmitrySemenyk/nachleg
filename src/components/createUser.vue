<template>
  <b-modal v-model="modalCreateUser"
           ref="modal"
           size="lg"
           title="Добавьте пользователя"
           @ok="handleOk"
           @cancel="cancelRooot"
           @hidden="cancelRooot"
           @shown="clearName">
    <form @submit.prevent="add_users">
      <div class="row">
        <div class="col-3">
          Сервис
        </div>
        <div class="col-1">

        </div>
        <div class="col-8">
          <el-select v-model="uesrForm.service" placeholder="Выберите сервис">
            <el-option
              v-for="item in sites"
              :key="item.site_id"
              :label="item.site_name"
              :value="item.site_id">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="row">
        <div class="col-3">
          Метка
        </div>
        <div class="col-1">

        </div>
        <div class="col-8">
          <el-input placeholder="Введите метку аккайнта" v-model="uesrForm.metka"></el-input>
        </div>
      </div>
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
      <div class="row">
        <div class="col-3">
          Телефон
        </div>
        <div class="col-1">

        </div>
        <div class="col-8">
          <el-input placeholder="Введите телефон" v-model="uesrForm.phone"></el-input>
        </div>
      </div>
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
    </form>
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
        uesrForm: {},
        sites: [],
        host: 'http://localhost:4000/'
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
          console.log(this.sites);
        });
      },
      add_users: function () {
        var add_akkaunts = this.host + 'database/add_akkaunts';
        this.axios.post(add_akkaunts, this.uesrForm).then((response) => {
          console.log(res.data);
        });
        this.$refs.modal.hide();
        this.$refs.upload.submit();
      },
      handleOk: function () {
        // Prevent modal from closing
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

