module.exports = {
    plugins:{
        //自动加浏览器兼容前缀
        autoprefixer:{},
        //px自动转vw，设计稿按1920(PC后台标准尺寸)
        "postcss-px-to-viewport" :{
            viewportWidth:1920,     //设计稿宽度(PC后台标准)
            unitToConvert:"px",     
            viewportUnit:"vw",      //转换成的单位
            propList:["*"],         //所有样式都转换
            selectorBlackList:[".novan"],//class加novan不转vw,固定尺寸
            minPixelValue:1         //小于1px不转换
        }
    }
}