<template>
  <div id="table">
    <table class="table table-striped">
      <thead class="thead-color">
      <tr>
        <th scope="col" width="160">Публикации</th>
        <th scope="col" width="800" style="text-align: justify">Описание</th>
        <th scope="col" width="600">Фото</th>
        <th scope="col" width="150">Адресс</th>
        <th scope="col" width="260">Удобства</th>
        <th scope="col" width="160">Телефон</th>
        <th scope="col" width="150"><router-link class="btn btn-success" to="/displaytable/add">
          <i class="el-icon-delete"></i> Добавить</router-link></th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(items, index) in tableData">
        <td> <strong>{{ items.date_post}}</strong>
          <div  v-for="elem in items.post">
            <p class="p_post">{{elem}}</p>
          </div>
        </td>
        <td><strong>{{ items.title}}</strong> <br> {{ items.post_text}}</td>
        <td v-if="items.photo_dist == 'src/assets/'"> ----- </td>
        <td v-else>
          <div class="lineBlock" v-for="elem in items.photo_dist">
            <img class="imageLook" :src="elem">
          </div>
        </td>
        <td><p>г.{{items.city}},<br> ул.{{items.street}},<br> д.{{items.building}}</p></td>
        <td><p><strong>Ремонт:</strong> <br>{{items.state}}<br><strong>Бытовая техника:</strong> <br>{{items.mebel ? "да":"нет"}}<br><strong>Интернет:</strong> <br>{{items.internet ? "да":"нет"}}</p></td>
        <td><p>{{items.phone}}</p></td>
        <td><a class="btn btn-danger" href="#" @click="rowDelete(items.flat_id, index)" >
          <i class="el-icon-delete"></i></a>
          <router-link :to="{path: '/displaytable/edit',name: 'editItem', params: {item: tableData[index]}}" tag="button" class="btn btn-primary" v-b-modal.modalPrevent><i class="el-icon-edit"></i></router-link></td>
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
        form: [],
        host: 'http://localhost:4000/'
      }
    },
    mounted: function(){
      setInterval(this.fetchItems, 1000);
    },
    created: function() {
      this.fetchItems();
    },
    watch: {
      '$route': function(newRoute, oldRoute){
        console.log(newRoute, oldRoute)
        setTimeout(this.fetchItems ,1000);
      }
    },
    methods: {
      fetchItems: function () {
        var url = this.host + 'database/flats';
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
      },
      rowDelete: function(e, i) {
        var url = this.host+ 'database/delete/' + e;
        this.tableData.splice(i, 1);
        axios.get(url);
      },
      rowEdit: function (id, items) {
        this.$router.push({name: 'editItem'});
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
    width: 80px;
    height: 80px;
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

</style>
