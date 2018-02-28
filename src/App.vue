<template>
  <div id="app">
    <div id="displayItem_all">
      <b-navbar toggleable="md" type="dark" variant="info">

        <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>

        <b-navbar-brand to="/"><img src="/src/img/Nochleg_.png" width="80px" alt="NOCHLEG"></b-navbar-brand>

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
        <div class="elem-div">

        </div>
      </transition>
    </div>

  </div>
</template>

<script>
  import axios from 'axios'

export default {
  name: "app",
  data() {
    return {
      tableData: [],
      tableData_old: [],
      form: [],
      host: 'http://localhost:4000/'
    }
  },
  watch: {
    '$route' (to,from){
      console.log(to);
      console.log(from);
    }
  }
}
</script>

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
  #app{
    background-image: url('/src/img/Nochleg_O.png');
  }
  .elem-div{
    background-image: url('/src/img/Nochleg_O.png');
    background-repeat: no-repeat;
    -moz-background-size: 100%; /* Firefox 3.6+ */
    -webkit-background-size: 100%; /* Safari 3.1+ и Chrome 4.0+ */
    -o-background-size: 100%; /* Opera 9.6+ */
    background-size: 100%; /* Современные браузеры */
    position: fixed;
    width: 100%;
    height: 100%;
  }
  .h1_possition{
    margin-bottom: auto;
    margin-top: auto;
    margin-left: auto;
    margin-right: auto;
    width: 6em;
  }

</style>

