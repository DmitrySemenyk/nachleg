<template>
  <div id="centered">
    <el-row type="flex" class="row-bg">
      <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
      <el-col :span="6"><div class="grid-content bg-purple-light">
        <el-form status-icon :label-position="labelPosition" label-width="100px" :rules="rules" ref="form" :model="form">
          <el-form-item label="Имя" prop="name">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="Пароль" prop="password">
            <el-input type="password" v-model="form.password" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button class="button-width" type="primary" @click="onSubmit">Войти</el-button>
          </el-form-item>
        </el-form>
      </div></el-col>
      <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
    </el-row>
  </div>
</template>
<script>
  import axios from 'axios'

  export default {
    data() {
      return {
        labelPosition: 'right',
        form: {
          name: '',
          password: ''
        },
        rules: {
          name: [
            { required: true, message: 'Введите имя', trigger: 'blur' },
          ],
          password: [
            { required: true, message: 'Введите пароль', trigger: 'blur' },
          ]
        }
      };
    }
  }
</script>
<style scoped>
  #centered{
    padding: 30px;
    margin-left:auto;
    margin-right:auto;
  }
  .button-width{
    width: 100%;
  }
</style>
