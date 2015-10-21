require('../css/main.less')


var content = document.querySelector('.content');
// 缓存所有移动块
var cubes = [];
// 缓存指令
var order = ['Up','Down','Left','Right'];
// 计时开始、结束时间
var startTime = 0;
var endTime;
// 最佳成绩
var bestRecord;
// 级别选择
var level = {
    // 区域总长度
    width: 450,
    // 移动增量
    moveTemp: 150,
    // 方块个数
    cubesNum: 3
};

init();
/**
 * 初始化函数
 */
function init() {
    // 每次初始化
    var width = level.width;
    var moveTemp = level.moveTemp;
    cubes = document.querySelectorAll(".pic");
    var cubesNum = level.cubesNum;
    var divs = document.querySelectorAll('.content div');

    for (var i = 0; i < divs.length; i++) {
        divs[i].style.left = '';
        divs[i].style.top = '';
        divs[i].style.width = level.moveTemp+'px';
        divs[i].style.height = level.moveTemp+'px';
    };
    divs[0].attributes.style="top:0px;left:0px";
    // 设置方块背景
    for (var i = 0,ii = cubes.length;i<ii;i++) {
        // 设置背景，第一块不设置背景
        if(i>0)cubes[i].style.backgroundImage = "url('img/bg.jpg')";
        cubes[i].style.backgroundSize = width+"px "+ width+"px";
        var positionX = (i%cubesNum)*(-moveTemp) + 'px ';
        var positionY = parseInt(i/cubesNum)*(-moveTemp) + 'px';
        cubes[i].style.backgroundPosition = positionX+positionY;
    }
    document.querySelector('.main').style.width = level.width+'px';
    // 打乱方块
    setTimeout(function(){
        for (var i = 150; i >= 0; i--) {
            var randomI = parseInt(Math.random()*order.length);
            cubeMove(order[randomI],'init');
            startTime = new Date().getTime();
        }
     },0);
};

/**
 * 按键事件绑定
 * left: 37
 * up : 38
 * right: 39
 * down : 40 
 */
document.body.addEventListener('keydown',function(event){
    event.preventDefault();
    cubeMove(event.keyIdentifier);
},false);
document.querySelector('#refresh').addEventListener('click',function(event){
    init();
},false);
document.querySelector('#level').addEventListener('change', function(event){
    var content = document.querySelector(".content");
    if (event.target.value === 'normal') {
        level.width = 450;
        level.moveTemp = 150;
        level.cubesNum = 3;
        content.style.height = 450+'px';
        init();
    }
    if (event.target.value === 'hard') {
        level.width = 452;
        level.moveTemp = 113;
        level.cubesNum = 4;
        content.style.height = 'auto';
        init();
    }
    // 初始化最佳记录
    bestRecord = 0;
    document.getElementById('best-record').value = '';
},false)

/**
 * 拼块移动主要逻辑方法
 * 移动方块其实是标志位方块的移动，再判断周围
 * 是否存在合法方块填充到标志位方块移动前的位置
 * @param  {type}
 */
function cubeMove (type) {
    // 标志位方块
    var flagCube = cubes[0];
    // 标志位当前位置
    var flagPosition = {};
    // 标志位变化位置
    var changePosition;
    // 移动目标方块
    var targetCube;
    var targetCubeTop;
    var targetCubeLeft;
    // 每次移动的偏移量
    var moveTemp = level.moveTemp;
    var width = level.width;
    switch(type) {
        case 'Up':
            changePosition = flagCube.offsetTop + moveTemp;
            // 判断是否出界
            if(changePosition >= width) return false;
            // 首先移动flagCube标志位
            flagCube.style.top = changePosition + 'px';
            // 获得位置需要变换的合法方块
            targetCube = getValidCube();
            targetCubeTop = (targetCube.style.top || '0px');
            targetCubeTop = parseInt(targetCubeTop.substr(0,targetCubeTop.length-2))-moveTemp;
            targetCube.style.top = targetCubeTop + 'px';
            break;
        case 'Down':
            changePosition = flagCube.offsetTop - moveTemp;
            if(changePosition < 0) return false;
            flagCube.style.top = changePosition + 'px';
            targetCube = getValidCube();
            targetCubeTop = (targetCube.style.top || '0px');
            targetCubeTop = parseInt(targetCubeTop.substr(0,targetCubeTop.length-2))+moveTemp;
            targetCube.style.top = targetCubeTop + 'px';
            break;
        case 'Right':
            changePosition = flagCube.offsetLeft - moveTemp;
            if(changePosition < 0) return false;
            flagCube.style.left = changePosition + 'px';
            targetCube = getValidCube();
            targetCubeLeft = (targetCube.style.left || '0px');
            targetCubeLeft = parseInt(targetCubeLeft.substr(0,targetCubeLeft.length-2))+moveTemp;
            targetCube.style.left = targetCubeLeft + 'px';
            break;
        case 'Left':
            changePosition = flagCube.offsetLeft + moveTemp;
            if(changePosition >= width) return false;
            flagCube.style.left = changePosition + 'px';
            targetCube = getValidCube();
            targetCubeLeft = (targetCube.style.left || '0px');
            targetCubeLeft = parseInt(targetCubeLeft.substr(0,targetCubeLeft.length-2))-moveTemp;
            targetCube.style.left = targetCubeLeft + 'px';
            break;
        default: 
            break;
    }
    // 初始化时会调用该移动函数，但初始化时arguments.length == 2
    if(isFinish()&&arguments.length<2) {
        endTime = new Date().getTime();
        var timeDuring = new Number((endTime - startTime)/1000).toFixed(2);
        if (!bestRecord || (bestRecord&&timeDuring < bestRecord)) {
            document.getElementById('best-record').value = timeDuring;
            bestRecord = timeDuring;
        }
        startTime = new Date().getTime();
        alert('完成,共用时'+timeDuring+'秒');
    } 
}

/**
 * 获得合法的移动方块
 * @return {object} 合法的dom节点
 */
function getValidCube () {
    var left = cubes[0].offsetLeft;
    var top = cubes[0].offsetTop;
    for (var i = 1,ii = cubes.length;i<ii; i++) {
        if (cubes[i].offsetTop === top && cubes[i].offsetLeft === left) {
            return cubes[i];
        }
    }
}

/**
 * 判断是否完成
 * @return {Boolean} [description]
 */
function isFinish () {
    var isfinish = true;
    var cubesNum = level.cubesNum;
    var moveTemp = level.moveTemp;
    for (var i = cubes.length - 1; i >= 0; i--) {
        var left = cubes[i].offsetLeft;
        var top = cubes[i].offsetTop;
        isfinish = isfinish && (left == (i%cubesNum)*moveTemp && top == parseInt(i/cubesNum)*moveTemp);
    };
    return isfinish;
}


