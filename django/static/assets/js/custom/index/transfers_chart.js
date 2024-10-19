

$(document).ready(function () {
  var $echartsLinePaymentChart = document.querySelector('.chart-line-transfer');
  var dataset = {
    successful: last15DaysTransfers,
  };
  console.log(last15DaysTransfers)
  var labels = last15DaysLabel;
  if ($echartsLinePaymentChart) {
    var userOptions = utils.getData($echartsLinePaymentChart, 'options');
    var chart = window.echarts.init($echartsLinePaymentChart);
    var getDefaultOptions = function getDefaultOptions() {
      return {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'none'
          },
          padding: [7, 10],
          backgroundColor: utils.getGrays()['100'],
          borderColor: utils.getGrays()['300'],
          borderWidth: 1,
          transitionDuration: 0,
          formatter: function formatter(params) {
            return "".concat(params[0].axisValue, " - ").concat(formatCurrency(params[0].value));
          },
          textStyle: {
            fontWeight: 500,
            fontSize: 11,
            color: utils.getGrays()['1100']
          }
        },
        xAxis: {
          type: 'category',
          data: labels,
          splitLine: {
            show: true,
            lineStyle: {
              color: utils.rgbaColor('#fff', 0.1)
            },
            interval: 0
          },
          axisLine: {
            lineStyle: {
              color: utils.rgbaColor('#fff', 0.1)
            }
          },
          axisTick: {
            show: true,
            length: 10,
            lineStyle: {
              color: utils.rgbaColor('#fff', 0.1)
            }
          },
          axisLabel: {
            color: utils.getGrays()['400'],
            fontWeight: 600,
            formatter: function formatter(value) {
              return value;
            },
            fontSize: 12,
            interval: window.innerWidth < 768 ? 'auto' : 0,
            margin: 15
          },
          boundaryGap: false
        },
        yAxis: {
          type: 'value',
          axisPointer: {
            show: false
          },
          splitLine: {
            show: false
          },
          axisLabel: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          }
        },
        series: [{
          type: 'line',
          smooth: true,
          data: dataset.successful.map(function (d) {
            return (d);
          }),
          symbol: 'emptyCircle',
          itemStyle: {
            color: utils.isDark() === 'light' ? utils.getColors().white : utils.getColors().primary
          },
          lineStyle: {
            color: utils.isDark() === 'light' ? utils.rgbaColor(utils.getColors().white, 0.8) : utils.getColors().primary
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [{
                offset: 0,
                color: utils.isDark() === 'light' ? 'rgba(255, 255, 255, 0.5)' : utils.rgbaColor(utils.getColors().primary, 0.5)
              }, {
                offset: 1,
                color: utils.isDark() === 'light' ? 'rgba(255, 255, 255, 0)' : utils.rgbaColor(utils.getColors().primary, 0)
              }]
            }
          },
          emphasis: {
            lineStyle: {
              width: 2
            }
          }
        }],
        grid: {
          right: 15,
          left: 15,
          bottom: '15%',
          top: 0
        }
      };
    };
    echartSetOption(chart, userOptions, getDefaultOptions);
    utils.resize(function () {
      if (window.innerWidth < 768) {
        chart.setOption({
          xAxis: {
            axisLabel: {
              interval: 'auto'
            }
          }
        });
      }
    });
  }
});
