// 登录
const denglu = document.querySelector('#denglu')
const login = document.querySelector('.login')
const guanbi = document.querySelector('#guanbi')

denglu.addEventListener('click', function(){
    // login.style.display = "block"
    window.location.href = './login.html'
})


$(function(){
    // 1.根据cookie 中的信息
    // 判断用户信息面板中显示哪一个内容
    const nickname = getCookie('nickname')

    // 2. 根据 nickname 信息进行判断
    if(nickname){
        // 表示存在，不是 underfind
        $('.off').addClass('hide')
        console.log();
        $('.on').removeClass('hide').text(` 您好：${nickname}`)

        // 如果登录才进行购物车联动
        // setCartNum()
    } else{
        // 表示不存在，是 underfined
        $('.off').removeClass('hide')
        $('.on').addClass('hide')
    }


})



// 轮播图
var mySwiper = new Swiper ('.swiper-container', {
      loop: true, // 循环模式选项
      
      // 如果需要分页器
      pagination: {
        el: '.swiper-pagination',
      },
      
      // 如果需要前进后退按钮
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      
      speed:1000,
      autoplay : {
        delay:3000
      },

     
}) 



// 搜素引擎

  // 1.获取元素
  const ul = document.querySelector(".nav>.box1>.div2>ul");
  const inp = document.querySelector(".nav>.box1>.div2>input");
    // console.log(ul);
    // console.log(inp);

  // 2. 给文本框绑定一个 input 事件
  inp.addEventListener("input", function () {
    // console.log('接收')
    // 3. 拿到文本框输入的内容
    // trim() 去除首位空格
    const value = this.value.trim();
    //  如果文本框首位没有值就不用执行
    if (!value){
      ul.classList.remove('active')
      return
    } 
    // console.log('接收')
    // 4. 准备发送请求
    //  动态创建 script 标签
    const script = document.createElement("script");
    //   准备一个请求地址
    // wd 这个参数换成我文本框里面输入的内容
    // cb
    const url = `https://www.baidu.com/sugrec?pre=1&p=3&ie=utf-8&json=1&prod=pc&from=pc_web&sugsid=1446,32857,33124,33061,32973,33099,33101,32962,22159&wd=${value}&req=2&csor=1&cb=bindHtml&_=1605768936993`;
    // 给script scr 添加地址
    script.src = url;
    // 把 script 标签插入到页面里面
    document.body.appendChild(script);
    // 当 script 标签插入到页面里面的挥手, 请求已经发送出去了
    // 此时, script 标签已经没有用了
    script.remove();
  });

    // 全局准备一个 jsonp 的处理函数
  function bindHtml(res) {
    // console.log(res)

    if (!res.g) {
      ul.classList.remove("active");
      return;
    }
    // 代码到达这里表示有 g 这个数据
    // 渲染页面
    let str = "";
    for (let i = 0; i < res.g.length; i++) {
      str += `
           <li>${res.g[i].q}</li>
        `;
    }
    ul.innerHTML = str;
    // 让 ul 显示出来
    ul.classList.add("active");
  }

