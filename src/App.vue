<template>
  <div id="app">
    <div id="displayItem_all">
      <b-navbar toggleable="md" type="dark" variant="info">

        <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>

        <b-navbar-brand href="#">NOCHLEG</b-navbar-brand>

        <b-collapse is-nav id="nav_collapse">

          <b-navbar-nav>
            <b-nav-item to="/displaytable"><i class="el-icon-edit-outline"></i> Добавить</b-nav-item>
            <b-nav-item :to="{name: 'addUserAccounts'}"><i class="el-icon-view"></i> Учетные записи</b-nav-item>
          </b-navbar-nav>

          <!-- Right aligned nav items -->
          <b-navbar-nav class="ml-auto">

            <b-nav-form>
              <b-form-input size="sm" class="mr-sm-2" type="text" placeholder=""/>
              <b-button size="sm" class="my-2 my-sm-0" type="submit">Поиск</b-button>
            </b-nav-form>


          </b-navbar-nav>

        </b-collapse>
      </b-navbar>
      <transition name="slide">
        <router-view></router-view>
      </transition>
    </div>

  </div>
</template>

<script>
  import axios from 'axios'

export default {
  name: "app",
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
    this.$route.push('/displaytable')
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
}</script>

<style>
  .slide-leave-active,
  .slide-enter-active {
    transition: 1s;
  }
  .slide-enter {
    transform: translate(100%, 0);
  }
  .slide-leave-to {
    transform: translate(-100%, 0);
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

</style>

<transition name="fade">
  <router-view></router-view>
</transition>
