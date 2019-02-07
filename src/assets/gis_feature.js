module.exports = {
  features: [
    {
      type: "气温",
      timeList: [
        { ItemName: "实时", configId: "2" },
        { ItemName: "日平均", configId: "9" },
        { ItemName: "日最高", configId: "13" },
        { ItemName: "日最低", configId: "14" },
        { ItemName: "1h变温", configId: "15" },
        { ItemName: "8时最低", configId: "26" },
        { ItemName: "8时最高", configId: "25" },
        { ItemName: "20时最低", configId: "28" }
      ]
    },
    {
      type: "降水",
      timeList: [
        { ItemName: "1小时", configId: "37" },
        { ItemName: "3小时", configId: "38" },
        { ItemName: "6小时", configId: "39" },
        { ItemName: "12小时", configId: "40" },
        { ItemName: "24小时", configId: "41" },
        { ItemName: "48小时", configId: "43" },
        { ItemName: "20时来", configId: "31" },
        { ItemName: "8时以来", configId: "32" }
      ]
    },
    {
      type: "湿度",
      timeList: [
        { ItemName: "实时", configId: "69" },
        { ItemName: "1h最小", configId: "173" },
        { ItemName: "日最小", configId: "70" },
        { ItemName: "24h最小", configId: "71" },
        { ItemName: "水汽压", configId: "73" },
        { ItemName: "整点", configId: "74" },
      ]
    },
    {
      type: "风",
      timeList: [
        { ItemName: "2分钟", configId: "46" },
        { ItemName: "10分钟", configId: "47" },
        { ItemName: "瞬间", configId: "48" },
        { ItemName: "极大≥8", configId: "55" },
        { ItemName: "日≥10级", configId: "56" },
        { ItemName: "日≥12级", configId: "57" },
        { ItemName: "日极大", configId: "58" },
        { ItemName: "24h最大", configId: "59" }
      ]
    }
  ]
}