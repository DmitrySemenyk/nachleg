<template>
  <div id="table_user">
    <table class="table table-striped">
      <thead class="thead-color">
        <tr>
          <th scope="col" width="5"><i class="el-icon-view"></i></th>
          <th scope="col" width="160">Сервис</th>
          <th scope="col" width="400">Имя</th>
          <th scope="col" width="400" style="text-align: justify">Логин</th>
          <th scope="col" width="300">Email</th>
          <th scope="col" width="260">Телефон</th>
          <th scope="col" width="200">
            <router-link to="/user/add">
              <el-button type="success" plain icon="el-icon-plus">
                Добавить
              </el-button>
            </router-link>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(items, index) in userInfo">

          <td v-if="items.status == '1'">
            <i class="el-icon-circle-check-outline" color="green"></i>
          </td>
          <td v-else>
            <el-tooltip class="item" effect="dark" :content="items.status" placement="top-start">
              <i class="el-icon-circle-close-outline" color="green"></i>
            </el-tooltip>
          </td>
          <td>{{items.siteName}}</td>
          <td>{{items.man}}</td>
          <td>{{items.login}}</td>
          <td>{{items.email}}</td>
          <td>{{items.phone}}</td>
          <td>
            <!--<el-button-group>-->
              <el-button type="danger" plain icon="el-icon-delete" @click="confirmDelete(items.akk_id, index)"></el-button>
              <router-link :to="{path: '/user/edit',name: 'editUser', params: {item: userInfo[index]}}"  v-b-modal.modalPrevent><el-button type="primary" plain icon="el-icon-edit"></el-button></router-link>
              <!--<router-link :to="{path: '/displaytable/edit',name: 'editItem', params: {item: userInfo[index]}}" v-b-modal.modalPrevent><el-button type="primary" plain icon="el-icon-edit"></el-button></router-link>-->
            <!--</el-button-group>-->
          </td>
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
            host: 'http://localhost:4000/',
            interval: new Function()
          }
        },
        created: function () {
          this.interval = setInterval(this.fetchUsers, 1000);
        },
        destroyed(){
          clearInterval(this.interval);
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
          confirmDelete: function (e,i) {
            this.$confirm('Вы точно хотите удплить акаунт?', 'Внимание', {
              confirmButtonText: 'OK',
              cancelButtonText: 'Cancel',
              type: 'warning'
            }).then(() => {
              this.rowDelete(e,i);
              this.$message({
                type: 'success',
                message: 'Аккаунт удален'
              });
            }).catch(() => {
              this.$message({
                type: 'info',
                message: 'Отмена удаления'
              });
            });
          },
          rowDelete: function(e, i) {
            var url = this.host+ 'database/delete_user/' + e;
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
  td{
    font-size: 16px;
  }
  .el-icon-circle-check-outline{
    color: green;
  }
  .el-icon-circle-close-outline{
    color: red;
  }
</style>
