<template>
  <div id="table">
    <table class="table table-striped">
      <thead class="thead-color">
        <tr>
          <th scope="col" width="50">№</th>
          <th scope="col" width="100" style="text-align: justify">Город</th>
          <th scope="col" width="1000">Текст</th>
          <th scope="col" width="400">Фото</th>
          <th scope="col" width="200">Дата публикации</th>
          <th scope="col" width="160">Сервисы</th>
          <th scope="col" width="150">
            <router-link to="/displaytable/add">
              <el-button type="success" plain icon="el-icon-plus">
                Добавить
              </el-button>
            </router-link>
          </th>
        </tr>
      </thead>
      <tbody>
      <tr v-for="(items, index) in tableData">
        <td>
          <strong>
            {{items.flat_id}}
          </strong>
          <!--<div  v-for="elem in items.post">-->
            <!--<el-tag class="p_post" type="success"><i class="el-icon-success"> {{elem}} </i></el-tag>-->
          <!--</div>-->
        </td>
        <td><p>{{items.city}}</p></td>
        <td class="elem_post_text"><strong>{{items.title}}</strong><br><p>{{items.post_text}}</p></td>
        <td v-if="items.photo_dist == 'src/assets/'"> ----- </td>
        <td v-else>
          <div class="lineBlock" v-for="elem in items.photo_dist">
            <img class="imageLook" :src="elem">
          </div>
        </td>
        <td><p>{{items.date_post}}</p></td>
        <td v-if="">
          <div  v-for="keyM in akkaunts">
            <div v-for="elem in post_plase">
              <el-tag v-if="elem.state == 'wait' && elem.akkaunt == keyM.akk_id && items.flat_id == elem.post" class="p_post" type="info"><i class="el-icon-loading"></i>
                {{keyM.man}}
              </el-tag>
              <el-tag v-else-if="elem.state == 'no' && elem.akkaunt == keyM.akk_id && items.flat_id == elem.post" class="p_post" type="warning"><i class="el-icon-circle-close"></i> {{keyM.man}}</el-tag>
              <el-tag v-else-if="elem.state == 'ok' && elem.akkaunt == keyM.akk_id && items.flat_id == elem.post" class="p_post" type="success"><i class="el-icon-circle-check"></i> {{keyM.man}}</el-tag>
            </div>
          </div>
        </td>
        <td>
          <!--<el-button-group>-->
            <el-button type="danger" plain icon="el-icon-delete" @click="confirmDelete(items.flat_id, index)"></el-button>
            <router-link :to="{path: '/displaytable/edit',name: 'editItem', params: {item: tableData[index]}}"  v-b-modal.modalPrevent><el-button type="primary" plain icon="el-icon-edit"></el-button></router-link>
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
    name: "displayItem",
    data() {
      return{
        tableData: [],
        tableData_old: [],
        post_plase: [],
        sites: [],
        akkaunts: [],
        form: [],
        host: 'http://localhost:4000/',
        interval: new Function()
      }
    },
    created: function () {
      this.interval = setInterval(this.fetchItems, 1000);
    },
    destroyed(){
      clearInterval(this.interval);
    },
    methods: {
      fetchItems: function () {
        let url = this.host + 'database/flats';
        let post_get = this.host + 'database/post_places';
        let sites = this.host + 'database/akksites';
        let akkaunts = this.host + 'database/akkounts'

        axios.get(url).then((res) => {
          var uploads = 'src/assets/';
          this.tableData_old = res.data;
          this.tableData = this.tableData_old;
          for(var key in this.tableData_old){
            if(this.tableData_old[key].photo_dist == null){
            }else{
              this.tableData[key].photo_dist = this.tableData_old[key].photo_dist.split(',');
              this.tableData[key].post_places_new = this.tableData_old[key].post_places.split(',');
              this.tableData[key].internet = this.tableData_old[key].internet ? true : false;
              this.tableData[key].mebel = this.tableData_old[key].mebel ? true : false;
              this.tableData[key].post = this.tableData_old[key].post_places.split(',')
              for(var pic in this.tableData[key].photo_dist){
                if(this.tableData[key].photo_dist[pic].indexOf(uploads)+1){
                  this.tableData[key].photo_dist[pic] = this.tableData[key].photo_dist[pic];
                }else{
                  this.tableData[key].photo_dist[pic] = uploads + this.tableData[key].photo_dist[pic];
                }

              }
            }
          }

        });
        axios.get(post_get).then((res) => {
          this.post_plase = res.data;
        });

        axios.get(sites).then((res) => {
          this.sites = res.data;
        });

        axios.get(akkaunts).then((res) => {
          this.akkaunts = res.data;
        });
      },
      confirmDelete: function (e,i) {
        this.$confirm('Вы точно хотите удплить данный пост?', 'Внимание', {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          this.rowDelete(e,i);
          this.$message({
            type: 'success',
            message: 'Пост номер ' + i + ' удален'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: 'Отмена удаления'
          });
        });
      },
      rowDelete: function(e, i) {
        var url = this.host+ 'database/delete/' + e;
        console.log(url);
        this.tableData.splice(i, 1);
        axios.get(url);
        this.success_elem(e);
      },
      rowEdit: function (id, items) {
        this.$router.push({name: 'editItem'});
      },
      success_elem: function (e) {
        this.$message({
          message: 'Удалена строка ' + e,
          type: 'success'
        });
      }
    }
  }
</script>

<style>
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-active{
    opacity: 0
  }
  .imageLook{
    width: 50px;
    height: 50px;
    margin: 5px;
    -moz-border-radius: 10px; /* закругление для старых Mozilla Firefox */
    -webkit-border-radius: 10px; /* закругление для старых Chrome и Safari */
    -khtml-border-radius:10px; /* закругл. для браузера Konquerer системы Linux */
    border-radius: 10px; /* закругление углов для всех, кто понимает */
  }
  .lineBlock{
    display:inline-block
  }
  .button-add-item{
    float: right;
    padding: 20px;
    margin: 20px;
  }
  td{
    font-size: 16px;
  }
  .p_post{
    margin: 0;
  }
  .thead-color{
    background-color: #17A2B8;
    color: #FFEDDE;
    border-color: #17A2B8;
  }
  #table{
    position:absolute;
  }
  .elem_post_text p {
    font-size: 12px;
    text-align:justify;
  }

</style>
