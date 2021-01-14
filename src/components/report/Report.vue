<template>
    <div>
    <!-- breadcrumb導航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首頁</el-breadcrumb-item>
      <el-breadcrumb-item>數據統計</el-breadcrumb-item>
      <el-breadcrumb-item>資料報表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡面視別區域 -->
    <el-card>
      <div id="main" style="width: 750px;height:400px;"></div>
    </el-card>
    </div>
</template>

<script>
// 導入echarts
// import echarts from 'echarts'
import * as echarts from 'echarts'
import _ from 'lodash'

export default {
  data() {
    return {
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  created() {

  },
  methods: {

  },
  async mounted() {
    // 基于准备好的dom，初始化echarts实例
    //   到此階段dom已準備好了
    const myChart = echarts.init(document.getElementById('main'))
    const { data: res } = await this.$http.get('reports/type/1')
    if (res.meta.status !== 200) {
      return this.$message.error('取得圖表資料錯誤!')
    }

    // 準備資料
    const result = _.merge(res.data, this.options)
    // 展示數據
    myChart.setOption(result)
  }
}
</script>
<style lang="less" scpoed>

</style>
