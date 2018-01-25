<template>
  <div id="displayItem">
    <div id="table">
      <table class="table table-hover">
        <thead>
        <tr>
          <th scope="col" width="200">Публикации</th>
          <th scope="col" width="400">Описание</th>
          <th scope="col" width="400">Фото</th>
          <th scope="col" width="150">Адресс</th>
          <th scope="col" width="200">Удобства</th>
          <th scope="col" width="300">Телефон</th>
          <th scope="col" width="300">Операции</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="items in tableData">
          <td>{{ items.date_post}} <br> {{ items.post_places}}</td>
          <td>{{ items.post_text}}</td>
          <td v-if="items.photo_dist == 'img/'"> ----- </td>
          <td v-else>
            <div class="lineBlock" v-for="elem in items.photo_dist">
              <img class="imageLook" :src="elem">
            </div>
          </td>
          <td><p>г.{{items.city}},<br> ул.{{items.street}},<br> д.{{items.building}}</p></td>
          <td><p>Ремонт: <br>{{items.state}}<br>Бытовая техника: <br>{{items.mebel}}<br>Интернет: <br>{{items.internet}}</p></td>
          <td><p>{{items.phone}}</p></td>
          <td><a class="btn btn-danger" href="#" @click="rowDelete(items.flat_id)" >
            <i class="fa fa-trash fa-lg"></i> Delete</a>
            <a class="btn btn-primary" href="#">
              <i class="fa fa-edit fa-lg"></i> Edit</a></td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>

  import axios from 'axios'

    export default {
        name: "displayItem",
      data() {
        return{
          hello: "Hello World!!!!",
          tableData: [],
          tableData_old: [],
          message: 'Hello'
        }
      },
      created: function()
      {
        this.fetchItems();
      },
      methods: {
        fetchItems: function () {
          var url = 'http://hostage.eu-4.evennode.com/database/flats';
          axios.get(url).then((res) => {
            var uploads = 'src/assets/';
            console.log(res.data);
            this.tableData_old = res.data;
            console.log(this.tableData_old);
            this.tableData = this.tableData_old;
            for(var key in this.tableData_old){
              if(this.tableData_old[key].photo_dist == null){
              }else{
                this.tableData[key].photo_dist = this.tableData_old[key].photo_dist.split(',');
                for(var pic in this.tableData[key].photo_dist){
                  this.tableData[key].photo_dist[pic] = uploads + this.tableData[key].photo_dist[pic];
                }
              }
            }

          });
        },
        rowDelete: function(e) {
          var url = 'http://hostage.eu-4.evennode.com/database/delete/' + e;
          console.log(e);
          console.log(this.tableData);
          console.log(this.tableData.splice(e, 1));
          console.log(this.tableData);

          //axios.get(url);

        }
      }
    }
</script>

<style scoped>
  .imageLook{
    width: 100px;
    height: 100px;
    margin: 5px;
    border: aqua 1px solid;
    -moz-border-radius: 10px; /* закругление для старых Mozilla Firefox */
    -webkit-border-radius: 10px; /* закругление для старых Chrome и Safari */
    -khtml-border-radius:10px; /* закругл. для браузера Konquerer системы Linux */
    border-radius: 10px; /* закругление углов для всех, кто понимает */
  }
  .lineBlock{
    display:inline-block
  }


</style>
