<template>
  <div id="app">
    <el-row :gutter="20">
      <h1>BBmLinkChecker</h1>
    </el-row>
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'linker'
  }
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 40px;
}

.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}

.el-button {
  margin-top: 10px !important;
  &:last-child {
    margin-bottom: 0;
  }
}
</style>
