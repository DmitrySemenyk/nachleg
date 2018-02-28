<template>
  <b-modal v-model="modalCreateUser"
           ref="modal"
           size="lg"
           title="Добавьте пользователя"
           @ok="handleOk"
           @cancel="cancelRooot"
           @hidden="cancelRooot"
           @shown="clearName">
    <form @submit.prevent="edit_users">
      <div class="row">
        <div class="col-3">
          Сервис
        </div>
        <div class="col-1">

        </div>
        <div class="col-8">
          <el-select v-model="uesrForm.site" placeholder="Выберите сервис" style="width: 100%">
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
          <el-input placeholder="Введите метку аккайнта" v-model="uesrForm.man"></el-input>
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
          <el-input placeholder="Введите пароль" v-model="uesrForm.pass"></el-input>
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


    name: 'editUser',
    data() {
      return {
        modalCreateUser: true,
        uesrForm: {},
        sites: [],
        host: 'http://localhost:4000/'
      };
    },
    created: function() {
      this.uesrForm = this.$route.params.item;
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
      edit_users: function () {
        let url = this.host + 'database/edituser/' + this.uesrForm.akk_id;
        console.log(url);
        this.axios.post(url, this.uesrForm);
        this.$router.push('/user');
      },
      handleOk: function () {
        this.edit_users();
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

