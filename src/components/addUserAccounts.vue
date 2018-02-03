<template>
  <div id="table_user">
    <table class="table table-striped">
      <thead class="thead-color">
      <tr>
        <th scope="col" width="160">Сервис</th>
        <th scope="col" width="200" style="text-align: justify">Логин</th>
        <th scope="col" width="200">Пароль</th>
        <th scope="col" width="150">Email</th>
        <th scope="col" width="260">Телефон</th>
        <th scope="col" width="160">Имя</th>
        <th scope="col" width="160">Фамилия</th>
        <th scope="col" width="600">Информация</th>
        <th scope="col" width="150"><router-link class="btn btn-success" to="/user/add">
          <i class="el-icon-delete"></i> Добавить</router-link></th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(items, index) in userInfo">
        <td>{{items.siteName}}</td>
        <td>{{items.login}}</td>
        <td>{{items.pass}}</td>
        <td>{{items.email}}</td>
        <td>{{items.phone}}</td>
        <td>{{items.name}}</td>
        <td>{{items.surname}}</td>
        <td>{{items.information}}</td>

        <td><a class="btn btn-danger" href="#" @click="rowDelete(items.akk_id, index)" >
          <i class="el-icon-delete"></i></a>
          <router-link :to="{path: '/displaytable/edit',name: 'editItem', params: {item: userInfo[index]}}" tag="button" class="btn btn-primary" v-b-modal.modalPrevent><i class="el-icon-edit"></i></router-link></td>
      </tr>
      </tbody>
    </table>
    <transition name="fade">
      <router-view></router-view>
    </transition>
  </div>

</template>

<script>
  import axios from 'axios'

    export default {
        name: "addUserAccounts",
        data(){
          return{
            userInfo: [],
            sites: [],
            host: 'http://localhost:4000/'
          }
        },
        mounted: function(){
          setInterval(this.fetchUsers, 1000);
        },
        created: function() {
          this.fetchUsers();
        },
        methods: {
          fetchUsers: function () {
            var url = this.host + 'database/akkounts';
            var urlSites = this.host + 'database/akksites';



            axios.get(urlSites).then((res) => {
              this.sites = res.data;
            });

            axios.get(url).then((res) => {
              this.userInfo = res.data;
              for(let key in this.userInfo){
                for(let el in this.sites){
                  if(this.sites[el].site_id == this.userInfo[key].site ){
                    this.userInfo[key].siteName = this.sites[el].site_name;
                  }
                }
              }
            });
          },
          rowDelete: function(e, i) {
            var url = this.host+ 'database/delete_user/' + e;
            console.log(url);
            this.userInfo.splice(i, 1);
            axios.get(url);
          },
        }
    }
</script>

<style scoped>
  #table_user{
    position: absolute;
  }
</style>
