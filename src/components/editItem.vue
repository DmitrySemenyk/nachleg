<template>
  <b-modal v-model="modalPrevent"
           ref="modal"
           size="lg"
           title="Изменить обьявление о квартире"
           @cancel="cancelRooot"
           @hidden="cancelRooot"
           @ok="handleOk">
    <form @submit.prevent="editClose">
      <b-form-input class="form-style"
                    type="text"
                    placeholder="Введите названия обьявления"
                    v-model="form.title"></b-form-input>
      <b-form-textarea class="form-style"
                       id="textarea1"
                       type="text"
                       placeholder="Введите дополнительную информацию о квартире"
                       v-model="form.post_text"
                       :rows="6"
                       :max-rows="12"></b-form-textarea>
      <h5>Адрес квартиры</h5>
      <el-row class="form-style">
        <el-col :span="8"><div class="grid-content bg-purple">
          <el-autocomplete
            class="elemHouse"
            v-model="form.city"
            :fetch-suggestions="querySearchAsync"
            placeholder="Выберите город"
            @select="handleSelect"><template slot="prepend">Город:</template></el-autocomplete>
        </div></el-col>
        <el-col :span="8"><div class="grid-content bg-purple-light">
          <el-input
            class="elemHouse"
            placeholder="Введите улицу"
            v-model="form.street"
            clearable><template slot="prepend">Улица:</template>
          </el-input>
        </div></el-col>
        <el-col :span="8"><div class="grid-content bg-purple">
          <el-input-number v-model="form.building" controls-position="right" @change="handleChange" :min="1" :max="1000" class="elemHouse"></el-input-number>
        </div></el-col>
      </el-row>

      <h5>Выберите количество комнат</h5>
      <b-form-group>
        <b-form-radio-group class=""
                            id="btnradios2"
                            buttons
                            button-variant="outline-primary"
                            size="lg"
                            v-model="form.rooms"
                            :options="roomsOptions"
                            name="radioBtnOutline" />
      </b-form-group>

      <h5>Атрибуты квартиры</h5>
      <el-row :gutter="20">
        <el-col :span="14"><div class="grid-content bg-purple">
          <el-select v-model="form.state" placeholder="Select">
            <el-option
              v-for="item in stateFix"
              :key="item.value"
              :label="item.text"
              :value="item.value">
            </el-option>
          </el-select>
        </div></el-col>
        <el-col :span="5"><div class="grid-content bg-purple">
          <el-switch
            style="display: block"
            v-model="form.mebel"
            active-color="#13ce66"
            inactive-color="#ff4949"
            inactive-text="Мебель">
          </el-switch>
        </div></el-col>
        <el-col :span="5"><div class="grid-content bg-purple">
          <el-switch
            style="display: block"
            v-model="form.internet"
            active-color="#13ce66"
            inactive-color="#ff4949"
            inactive-text="Интернет">
          </el-switch>
        </div></el-col>
      </el-row>
      <h5>Укажите номер телефона и цену квартиры</h5>
      <el-row :gutter="20">
        <el-col :span="16"><div class="grid-content bg-purple">
          <el-input placeholder="Введите номер телефона" v-model="form.phone"></el-input>
        </div></el-col>
        <el-col :span="8"><div class="grid-content bg-purple">
          <el-input placeholder="" v-model="form.price">
            <template slot="append">&#8364;</template>
          </el-input>
        </div></el-col>
      </el-row>
      <h5>Укажите дату обьявления и выберите рекламные</h5>
      <el-row :gutter="20">
        <el-col :span="8"><div class="grid-content bg-purple">
          <el-date-picker
            v-model="form.date_post"
            format="dd-MM-yyyy HH:mm"
            value-format="dd-MM-yyyy HH:mm"
            type="datetime"
            placeholder="Select date and time">
          </el-date-picker>
        </div></el-col>
        <el-col :span="16"><div class="grid-content bg-purple">
          <el-select v-model="form.post_places_new" placeholder="Выберете аккаунты" multiple style="width: 100%" >
            <el-option-group
              v-for="item in sites"
              :key="item.site_id"
              :label="item.site_name">
              <el-option
                v-for="items in item.array_user"
                :key="item.site_name + ': ' + items.akk_id"
                :label="item.site_name + ': ' + items.login"
                :value="item.site_name + ': ' + items.login">
              </el-option>
            </el-option-group>
          </el-select>
        </div></el-col>
      </el-row>
      <h5>Загрузите сюдв ващи изображения</h5>
      <el-upload
        class="upload-demo"
        name="imageRent"
        ref="upload"
        :headers="headerInfo"
        action="http://localhost:4000/database/photos/upload"
        :on-remove="handleRemove"
        :before-remove="beforeRemove"
        :auto-upload="false"
        multiple
        :limit="12"
        :on-exceed="handleExceed"
        list-type="picture-card"
        :file-list="this.photo_card"
        :on-change="beforeUpdate">
        <i class="el-icon-plus"></i>
        <el-dialog :visible.sync="dialogVisible" size="tiny">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
        <div slot="tip" class="el-upload__tip">jpg/png files with a size less than 500kb</div>
      </el-upload>
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
  import lang from 'element-ui/lib/umd/locale/ru-RU'
  import locale from 'element-ui/lib/locale'

  Vue.use(Element);
  Vue.use(BootstrapVue);
  locale.use(lang);

  const cityOptions = ['onliner.by', 'kufar.by', 'akua.by', 'tut.by'];

  export default {
    name: "editItem",
    params: {
      items: []
    },
    data() {
      return {
        modalPrevent: true,
        imageRent: [],
        tableData: [],
        tableData_first: [],
        editItem: [],
        dialogTableVisible: false,
        dialogFormVisible: false,
        form: [],
        formLabelWidth: '120px',
        name: '',
        names: [],

        links: [],
        state4: '',
        timeout: null,

        roomsOptions: [
          { text: '1', value: 1 },
          { text: '2', value: 2 },
          { text: '3', value: 3 },
          { text: '4', value: 4 }
        ],
        stateFix: [
          { value: 'отличное состояние', text: 'отличное состояние' },
          { value: 'хорошее состояние', text: 'хорошее состояние' }
        ],

        checkAll: false,
        checkedCities: ['onliner.by', 'kufar.by'],
        cities: cityOptions,
        isIndeterminate: true,
        photo_card_elem: {},
        photo_card: [],

        filterCity: '',
        host: 'http://localhost:4000/'
      };
    },

    created: function(){
      this.form = this.$route.params.item;
      this.imageCard();
      this.addCitis();
    },
    methods: {
      handleOk (evt) {
        // Prevent modal from closing
        evt.preventDefault()
        if (!this.form.title && !this.form.title) {
          alert('Please enter your name')
        } else {
          this.editClose();
        }
      },

      querySearchAsync(queryString, cb) {
        var links = this.links;
        var results = queryString ? links.filter(this.createFilter(queryString)) : links;
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          cb(results);
        }, 3000 * Math.random());
      },
      createFilter(queryString) {
        return (link) => {
          return (link.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
      fetchItems(){
        let url = this.host + 'database/flats';
        this.axios.get(url).then((res)=> {
          this.tableData_first = res.data;

          this.tableData = this.tableData_first;
          for(let key in this.tableData_first){
            if(this.tableData_first[key].photo_dist == null){
            }else{
              this.tableData[key].photo_dist = this.tableData_first[key].photo_dist.split(',');
            }
          }
        })
      },
      editClose: function () {
        let url = this.host + 'database/edit/' + this.form.flat_id;
        this.form.post_places = this.checkedCities.toString();
        this.form.mebel = this.form.mebel ? 1 : 0;
        this.form.internet = this.form.internet ? 1: 0;
        this.axios.post(url, this.form);
        this.modalPrevent = false;
        this.$router.push('/displaytable');
      },
      addCitis: function(){
        let url = this.host + 'database/citys';
        this.axios.get(url).then((res) => {
          this.links = res.data;
        });
      },
      handleCheckAllChange(val) {
        this.checkedCities = this.form.post_places_new;
        this.checkedCities = val ? cityOptions : [];
        this.isIndeterminate = false;
      },
      handleCheckedCitiesChange(value) {
        let checkedCount = value.length;
        this.checkAll = checkedCount === this.cities.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
      },
      handleRemove(file, fileList) {
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      beforeRemove(file, fileList) {
        // return this.$confirm(`Вы действительно хотите удалить ${ file.name }？`);
        this.form.photo_dist.splice(find(this.form.photo_dist, file.name), 1);
      },
      beforeUpdate(file, fileList){
        this.form.photo_dist.push(file.name);

      },
      imageCard: function(){
        for (let val in this.form.photo_dist ){
          this.photo_card_elem = {name: this.form.photo_dist[val], url: 'http://localhost:4000/' + this.form.photo_dist[val] };
          this.photo_card.push(this.photo_card_elem);
        };
      },
      cancelRooot(){
        this.$router.push('/displaytable');
      }
    }

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
</style>
