<template>
<div>
    <el-row >
      <el-col :span="22" :offset="1">
        <el-input type="text" placeholder="https://test.example.dummy.bbmedia.jp/testdummy/example.html" />
        <el-button @click="checkStart" :disabled=!valid type="primary">リンクチェックスタート</el-button>
      </el-col>
    </el-row>
    <el-row id="options" >
      <el-col :span="22" :offset="1">
         <el-card >
            <el-tabs v-model="activeName" @tab-click="tabClick">
              <el-tab-pane label="ベーシック認証" name="first">
                <el-col :span="22" :offset="1">
                <el-form :inline="false" :model="authForm" id="authForm">
                  <el-form-item label="ID">
                    <el-input v-model="authForm.id"></el-input>
                  </el-form-item>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                  <el-form-item label="PASSWORD">
                    <el-input type="password" v-model="authForm.password"></el-input>
                  </el-form-item>
                </el-form>
                </el-col>
              </el-tab-pane>
              <el-tab-pane label="エラードメイン設定" name="second">
                <el-col :span="22" :offset="1">
                <el-form  :model="errorDomainForm" id="errorDomainForm">
                  <el-form-item label="このドメインがリンクや画像に含まれていたらエラーにする">
                    <el-input
                        type="textarea"
                        :rows="10"
                        placeholder="test.errordomain.exampple.jp
https://test.errordomain.exampple.jp
複数のドメインを記述する場合は改行してください"
                        v-model="authForm.domains"></el-input>
                  </el-form-item>
                </el-form>
                </el-col>
              </el-tab-pane>
              <el-tab-pane label="チェック結果" name="third">
                <el-col :span="22" :offset="1">
                  <el-form :inline="true" :model="checkFilter" id="checkFilter">
                    <el-checkbox-group v-model="checkFilter.type">
                      <el-checkbox label="success" name="type" ><el-tag type="success">OK</el-tag></el-checkbox>
                      <el-checkbox label="warning" name="type" ><el-tag type="warning">警告</el-tag></el-checkbox>
                      <el-checkbox label="danger" name="type" ><el-tag type="danger">エラー</el-tag></el-checkbox>
                    </el-checkbox-group>
                  </el-form>

                  <el-card class="check-card">
                    <div slot="header" class="clearfix">
                      <span>https://test.page.jp/example/</span>
                    </div>
                    <div class="text item">
                        <el-alert
                          title="エラーは見つかりませんでした"
                          type="success"
                          description="OK"
                          show-icon
                          :closable="false">
                        </el-alert>
                    </div>
                  </el-card>
                  <el-card class="check-card">
                    <div slot="header" class="clearfix">
                      <span>https://test.page.jp/example2/</span>
                    </div>
                    <div class="text item">
                        <el-alert
                          title="リンクが繋がっていません"
                          type="error"
                          show-icon
                          description="/notofouhd/error.html"
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
  export default {
    data () {
      return {
        authForm: {
          id: '',
          password: ''
        },
        errorDomainForm: {
          domains: ''
        },
        checkFilter: {
          type: ['success', 'warning', 'danger']
        },

        /* activeName: 'first', */
        activeName: 'third',
        valid: false
      }
    },
    methods: {
      tabClick () {
      },
      checkStart () {
        console.log('submit!')
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
