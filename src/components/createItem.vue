<template>
  <b-modal v-model="modalPrevent"
           ref="modal"
           size="lg"
           title="Добавьте обьявление о квартире"
           @ok="handleOk"
           @cancel="cancelRooot"
           @hidden="cancelRooot"
           @shown="clearName">
    <el-form :model="form" :rules="rules" ref="form" class="demo-ruleForm">

       <!--Title-->
      <el-form-item prop="title">
        <el-input type="text"
                  placeholder="Введите названия обьявления"
                  v-model="form.title">
        </el-input>
      </el-form-item>

      <!--Post_Text-->
      <el-form-item prop="post_text">
        <el-input type="textarea"
                  placeholder="Введите дополнительную информацию о квартире"
                  v-model="form.post_text"
                  :rows="6"
                  :max-rows="12"></el-input>
      </el-form-item>

      <!--Cities Address Flat-->
      <h5>Адрес квартиры</h5>
        <el-row>
          <!--City-->
          <el-col :span="8"><div class="grid-content bg-purple">
            <el-form-item prop="cities">
              <el-autocomplete
                class="elemHouse"
                v-model="form.cities"
                :fetch-suggestions="querySearchAsync"
                placeholder="Выберите город"
                @select="handleSelect"><template slot="prepend">Город:</template></el-autocomplete>
            </el-form-item>
          </div></el-col>
          <!--Street-->
          <el-col :span="8"><div class="grid-content bg-purple-light">
            <el-form-item prop="address">
              <el-input
                class="elemHouse"
                placeholder="Введите улицу"
                v-model="form.address"
                clearable><template slot="prepend">Улица:</template>
              </el-input>
            </el-form-item>
          </div></el-col>
          <!--Home number-->
          <el-col :span="8"><div class="grid-content bg-purple">
            <el-form-item prop="building">
              <el-input v-model="form.building" controls-position="right" placeholder="Введите номер дома" @change="handleChange" :min="1" :max="1000" class="elemHouse" clearable>
                <template slot="prepend">Дом:</template>
              </el-input>
            </el-form-item>
          </div></el-col>
        </el-row>

      <!--Number of rooms-->
      <h5>Выберите количество комнат</h5>
      <el-row>
        <el-col :span="16">
          <div class="grid-content bg-purple">
            <el-form-item prop="rooms">
              <b-form-group>
                <b-form-radio-group
                                    id="btnradios2"
                                    buttons
                                    button-variant="outline-primary"
                                    size="lg"
                                    v-model="form.rooms"
                                    :options="roomsOptions"
                                    name="radioBtnOutline" />
              </b-form-group>
            </el-form-item>
          </div>
        </el-col>
      </el-row>

      <!--Flat elements-->
      <h5>Атрибуты квартиры</h5>
      <el-row :gutter="20">
        <el-col :span="10"><div class="grid-content bg-purple">
          <el-form-item prop="state">
            <el-select v-model="form.state" placeholder="Select" class="aributes_state">
              <el-option
                v-for="item in stateFix"
                :key="item.value"
                :label="item.text"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </div></el-col>
        <el-col :span="2"><div class="grid-content bg-purple"></div></el-col>
        <el-col :span="4"><div class="grid-content bg-purple">
          <el-switch
            style="display: block"
            v-model="form.mebel"
            active-color="#13ce66"
            inactive-color="#ff4949"
            inactive-text="Мебель">
          </el-switch>
        </div></el-col>
        <el-col :span="4"><div class="grid-content bg-purple">
          <el-switch
            style="display: block"
            v-model="form.internet"
            active-color="#13ce66"
            inactive-color="#ff4949"
            inactive-text="Интернет">
          </el-switch>
        </div></el-col>
      </el-row>

      <!--Mobile namber and price-->
      <h5>Укажите номер телефона и цену квартиры</h5>
        <el-row :gutter="20">
        <!--Phone number-->
        <el-col :span="16"><div class="grid-content bg-purple">
          <el-form-item prop="phone">
            <el-input placeholder="Введите номер телефона" v-model="form.phone" value="number">
              <template slot="prepend">+375</template>
            </el-input>
          </el-form-item>
        </div></el-col>
        <!--Price-->
        <el-col :span="8"><div class="grid-content bg-purple">
          <el-form-item prop="price">
            <el-input placeholder="Введите цену" v-model="form.price">
              <el-select v-model="select_label" slot="append" :placeholder="select_label">
                <el-option label="$" value="_2"></el-option>
                <el-option label="руб" value="_1"></el-option>
              </el-select>
            </el-input>
          </el-form-item>
        </div></el-col>
      </el-row>

      <!--Date and Accounts-->
      <h5>Укажите дату обьявления и выберите акаунты</h5>
      <el-row :gutter="20">
        <!--Date-->
        <el-col :span="8"><div class="grid-content bg-purple">
          <el-form-item prop="date_post">
            <el-date-picker
              v-model="form.date_post"
              format="dd-MM-yyyy HH:mm"
              value-format="dd-MM-yyyy HH:mm"
              type="datetime"
              placeholder="Выберете дату и время">
            </el-date-picker>
          </el-form-item>
        </div></el-col>
        <!--Acaounts-->
        <el-col :span="16"><div class="grid-content bg-purple">
          <el-select v-model="form.post_places_new" placeholder="Выберете аккаунты" multiple style="width: 100%" >
            <el-option-group
              v-for="item in sites"
              :key="item.site_id"
              :label="item.site_name">
              <el-option
                v-for="items in item.array_user"
                :key="item.site_name + ': ' + items.akk_id"
                :label="items.man"
                :value="items.akk_id">
              </el-option>
            </el-option-group>
          </el-select>
        </div></el-col>
      </el-row>

      <!--Image Upload-->
      <h5>Загрузите изображения</h5>
      <el-upload
        class="upload-demo"
        name="imageRent"
        ref="upload"
        :headers="headerInfo"
        action="http://localhost:4000/database/photos/upload"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :before-remove="beforeRemove"
        :auto-upload="false"
        multiple
        :limit="12"
        :on-exceed="handleExceed"
        list-type="picture-card"
        :file-list="form.fileList_array"
        :on-change="beforeUpdate">
        <i class="el-icon-plus"></i>
        <el-dialog :visible.sync="dialogVisible" size="tiny">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
        <div slot="tip" class="el-upload__tip">jpg/png files with a size less than 500kb</div>
      </el-upload>

    </el-form>
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
    name: 'createItem',
    data() {
      return {
        modalPrevent: true,
        imageRent: [],
        tableData: [],
        tableData_first: [],
        editItem: [],
        dialogTableVisible: false,
        dialogFormVisible: false,
        test: {
          elem1: {
            text: 'Kat',
            max: 'Lom'
          },
          elem2: {
            text: 'Cat',
            max: 'Lat'
          }
        },
        form: {
          title: '',
          post_text: '',
          cities: '',
          address: '',
          building: '',
          rooms:'',
          state:'',
          internet: true,
          mebel: true,
          phone: '',
          price: '',
          date_post: '',
          post_places_new: [],
          post_places: '',
          fileList: '',
          fileList_array: [],
          filename: []
        },
        rules: {
          title: [
            { required: true, message: 'Please input Activity name', trigger: 'blur' },
            { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' }
          ],
          post_text: [
            { required: true, message: 'Please input activity form', trigger: 'blur' }
          ],
          cities: [
            { required: true, message: 'Please input Activity name', trigger: 'change' }
          ],
          address: [
            { required: true, message: 'Please input Activity name', trigger: 'blur' },
          ],
          building: [
            { required: true, message: 'Please input Activity name', trigger: 'blur' },
          ],
          rooms: [
            { required: true, message: 'Please input Activity name', trigger: 'change' },
          ],
          state: [
            { required: true, message: 'Please input Activity name', trigger: 'change' },
          ],
          phone: [
            { required: true, message: 'Please input Activity name', trigger: 'blur' },
          ],
          price: [
            { required: true, message: 'Please input Activity name', trigger: 'blur' },
          ],
          date_post: [
            { required: true, message: 'Please pick a time', trigger: 'change' }
          ]
        },
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
        cities: cityOptions,
        isIndeterminate: true,
        checkedCities: ['onliner.by', 'kufar.by'],

        filterCity: '',
        host: 'http://localhost:4000/',

        sites: [],
        userInfo: [],

        select_label: '_1'
      };
    },

    created: function(){
      this.fetchItems();
      this.addCitis();
    },

    methods: {
      clearName () {
        this.form.title = '';
        this.form.post_text = '';
        this.form.cities = '';
        this.form.address = '';
        this.form.building = '';
        this.form.rooms = '';
        this.form.state = '';
        this.form.mebel = true;
        this.form.internet = true;
        this.form.phone = '';
        this.form.price = '';
        this.form.date_post = '';
        this.form.post_places = '';
      },
      handleOk (evt) {
        // Prevent modal from closing
        evt.preventDefault();
        this.$refs['form'].validate((valid) => {
          if(valid){
            alert('Submit!!!');
            this.addItem();
          }else{
            console.log("Error");
            this.$message({
              message: 'Ошибка записи',
              type: 'warning'
            });
            return false;
          }
        });
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
        });
        var urlAkk = this.host + 'database/akkounts';
        var urlSites = this.host + 'database/akksites';
        this.axios.get(urlSites).then((res) => {
          this.sites = res.data;
          for( let items in this.sites){
            this.sites[items].array_user = [];
          }
        });

        this.axios.get(urlAkk).then((res) => {
          this.userInfo = res.data;
          for(let items in this.sites){
            for(let akk in this.userInfo){
              if(this.sites[items].site_id == this.userInfo[akk].site){
                this.sites[items].array_user.push(this.userInfo[akk]);
              }
            }
          }
        });



      },
      addItem: function(){
        let uri = this.host + 'database/add';
        this.axios.post(uri, this.form).then((response) => {
          this.form.title.push(this.form.title);
          this.form.post_text.push(this.form.post_text);
          this.form.cities.push(this.form.cities);
          this.form.address.push(this.form.address);
          this.form.building.push(this.form.building);
          this.form.rooms.push(this.form.rooms);
          this.form.state.push(this.form.state);
          this.form.internet.push(this.form.internet);
          this.form.mebel.push(this.form.mebel);
          this.form.phone.push(this.form.phone);
          this.form.price.push(this.form.price);
          this.form.date_post.push(this.form.date_post);
          this.form.post_places.push(this.form.post_places);
          this.clearName();
        });
        this.$refs.modal.hide();
        this.$refs.upload.submit();
        this.$router.push({path: '/displaytable', params: {elem: this.form}});

      },
      addCitis: function(){
        let url = this.host + 'database/citys';
        this.axios.get(url).then((res) => {
          this.links = res.data;
        });
      },
      handleCheckAllChange: function(val) {
        this.form.post_places_new = val ? cityOptions : [];
        this.isIndeterminate = false;
      },
      handleCheckedCitiesChange: function(value) {
        let checkedCount = value.length;
        this.checkAll = checkedCount === this.cities.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
      },
      handleRemove(file, fileList) {
        console.log(file.name);
        this.form.fileList_array.splice(this.form.fileList_array.indexOf(file.name), 1);
        this.form.fileList = this.form.fileList_array.toString();
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      beforeRemove(file, fileList) {
        if(this.$confirm(`Вы действительно хотите удалить ${ file.name }？`)){
          console.log('here!');
        }else{
          console.log('Not found');
        }
      },
      beforeUpdate(file, fileList){
        // file.name = Date.now() + '-' + file.name;
        this.form.filename.push(file);
        console.log(file);
        this.form.fileList_array.push(fileList[fileList.length-1].name);
        this.form.fileList = this.form.fileList_array.toString();
        this.form.post_places = this.form.post_places_new.toString();
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
  .elemHouse{
    padding-right: 5px;
  }
  .el-select {
    width: 100px;
  }
  .aributes_state{
    width: 100%;
  }
</style>
