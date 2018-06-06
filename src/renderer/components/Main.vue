<template>
<div>
    <el-row >
      <el-col :span="22" :offset="1">
        <el-input @change="changeUrl" type="text" placeholder="https://test.example.dummy.bbmedia.jp/testdummy/example.html" />
        <el-button @click="checkStart" :disabled=!form.valid type="primary">リンクチェックスタート</el-button>
      </el-col>
    </el-row>
    <el-row id="options" >
      <el-col :span="22" :offset="1">
         <el-card>
            <el-tabs v-model="form.activeName" @tab-click="tabClick">
              <el-tab-pane label="ベーシック認証" name="first">
                <el-col :span="22" :offset="1">
                <el-form :inline="false" :model="form.auth" id="authForm">
                  <el-form-item label="ID">
                    <el-input v-model="form.auth.id"></el-input>
                  </el-form-item>
                  <el-form-item label="PASSWORD">
                    <el-input type="password" v-model="form.auth.password"></el-input>
                  </el-form-item>
                </el-form>
                </el-col>
              </el-tab-pane>
              <el-tab-pane label="エラードメイン設定" name="second">
                <el-col :span="22" :offset="1">
                <el-form :model="form" id="errorDomainForm">
                  <el-form-item label="このドメインがリンクや画像に含まれていたらエラーにする">
                    <el-input
                        type="textarea"
                        :rows="10"
                        placeholder="test.errordomain.exampple.jp
https://test.errordomain.exampple.jp
複数のドメインを記述する場合は改行してください"
                        v-model="form.ignoreDomains"></el-input>
                  </el-form-item>
                </el-form>
                </el-col>
              </el-tab-pane>
              <el-tab-pane label="チェック結果" name="third">
                <el-col :span="22" :offset="1">
                  <el-form :inline="true" :model="form.checkFilter" id="checkFilter">
                    <el-checkbox-group v-model="form.checkFilter.type">
                      <el-checkbox label="success" name="type" ><el-tag type="success">OK</el-tag></el-checkbox>
                      <el-checkbox label="warning" name="type" ><el-tag type="warning">警告</el-tag></el-checkbox>
                      <el-checkbox label="danger" name="type" ><el-tag type="danger">エラー</el-tag></el-checkbox>
                    </el-checkbox-group>
                  </el-form>
                  <el-card v-for="item in messages" class="check-card">
                    <div slot="header" class="clearfix">
                      <span>{{item.url}}</span>
                    </div>
                    <div class="text item">
                        <el-alert
                          :title="item.message"
                          :type="item.type"
                          :description="item.params"
                          show-icon
                          :closable="false">
                        </el-alert>
                    </div>
                  </el-card>
                </el-col>
              </el-tab-pane>
            </el-tabs>
        </el-card>
      </el-col>
    </el-row>
</div>
</template>

<script>
  import validator from 'validator'
  import { ipcRenderer } from 'electron'

  export default {
    data () {
      return {
        form: {
          url: '',
          valid: false,
          auth: {
            id: '',
            password: ''
          },
          ignoreDomains: '',
          checkFilter: {
            type: ['success', 'warning', 'danger']
          },
          /* activeName: 'first', */
          activeName: 'third'
        },
        /* messages: [ {url: 'hoge.com', type: 'error', params: {hoge: 'fuga'}, message: 'test'}]  */
        messages: []
      }
    },
    mounted () {
      ipcRenderer.on('message', (event, arg) => {
        arg.params = JSON.stringify(arg.params)
        this.messages.push(arg)
      })
    },
    methods: {
      tabClick () {
      },
      checkStart () {
        console.log('submit!')
        if (this.form.valid) {
          this.messages = []
          ipcRenderer.send('runChecks', this.form)
        }
      },
      changeUrl (value) {
        this.form.valid = validator.isURL(value, {
          require_host: true, require_protocol: true
        })
        this.form.url = value
      }
    }
  }
</script>

<style>
  #options {
    text-align:left;
    margin-top:40px;
  }
  #authForm {
    text-align:center;
  }
  #checkFilter {
    margin: 20px auto;
    text-align:center;
  }
  .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
  .item {
    margin-bottom:5px;
  }
  .check-card {
    margin-bottom:18px;
  }
</style>
