
    // 放大镜
    $('.cen-left').on('mousemove',  '.img',  function(ev)  { 
              // console.log(this) 
              $('.big-img').css({ 'display': 'block' });
              $('.mask').css({ 'display': 'block' });
              let  mLeft  =  ev.offsetX - 100
              let  mTop  = ev.offsetY - 100  
              if (mLeft  <=  0) {     mLeft  =  0   }
              if (mLeft  >= 280) {  
                  mLeft  =  280
              }
              if (mTop  <= 0) {  
                  mTop  =  0
              }
              if (mTop  >=  280) {  
                  mTop  =  280
              }  
              $('.mask').css({     left: mLeft,     top: mTop   });
              $('.big-img').css({ 
                    backgroundPosition: ` ${-2 * mLeft}px ${-2 * mTop}px`
              })

          })
          $('.cen-left').on('mouseout',  '.img',  function()  { 
              // console.log(this) 
              $('.big-img').css({ 'display': 'none' });
              $('.mask').css({ 'display': 'none' });
          })



// jQuery 入口函数
$(function(){
      // 加入购物车点击事件
      $('#go-gouwu').on('click', function(){
        // console.log('点击');
        window.location.href = './cart.html'
    })  

    // 0.提前准备一个变量拿出来商品信息
    let info = null

    // 1. 拿到cookie  中的 good_id 属性
    const id = getCookie('goods_id')
    // 2. 根据id 信息去请求商品数据
    getGoodsInfo()
    async function getGoodsInfo(){
        const goodsInfo = await $.get('./server/getGoodsInfo.php', { goods_id:id }, null ,'json')
        // 3. 进行页面渲染
        bindHtml(goodsInfo.info)
        
        // 给提前准备好的变量进行赋值
        info = goodsInfo.info
    }


    // 3.渲染页面
    function bindHtml(info){
        console.log(info);
        // 1 渲染左边放大镜位置渲染
        $('.cen-left').html(`
        <div class="img">
							<img src="${ info.goods_big_logo }"  width="480px" height="480px">
							<div class="mask"></div>	
				</div>
        <div class="img-list">
            <p>
              <img src="${ info.goods_small_logo}" width="89px" height="89px">
            </p>
        </div>
        <div class="big-img" style="background: url(${ info.goods_big_logo }) no-repeat; background-size: 960px 960px" >
        </div>
        <div class="img-item">
									<div>
										<img src="https://p1.ssl.qhimg.com/t014f3c7cc8304a06c2.png">
										<p>360商城发货&售后</p>
									</div>
									<div>
										<img src="https://p1.ssl.qhimg.com/t014f3c7cc8304a06c2.png">
										<p>满99元包邮</p>
									</div>
									<div>
										<img src="https://p1.ssl.qhimg.com/t014f3c7cc8304a06c2.png">
										<p>7天无理由退货</p>
									</div>
									<div>
										<img src="https://p1.ssl.qhimg.com/t014f3c7cc8304a06c2.png">
										<p>15天免费换货</p>
									</div>
				</div>
        `)


        // 2. 商品详情信息渲染
        $('.cen-right').html(`
        <p class="desc">${ info.goods_name }</p>
        <p class="price-box">
          价格： 
          <span class="price">${ info.goods_price }</span>
        </p>
        <div class="num">
          <button class="subNum">-</button>
          <input type="text" value="1" class="cartNum">
          <button class="addNum">+</button>
        </div>
        <div class="join-box">
          <button class="addCart">
              加入购物车
          </button>
          <button class="">
            立即购买
          </button>
        </div>
        `)
        
    }

      // 4. ++ -- 的事件
      $('.cen-right')
      .on('click','.subNum', function(){
      // 拿到 input 的 value 值`
      let num = $('.cartNum').val() - 0
      // 进行判断，如果当前是 1 ，那么什么都不做
      if(num ===1 ) return
      // 否则就进行 -- 操作，然后在设置进去
      $('.cartNum').val(num - 1)
      })  
      .on('click', '.addNum', function(){
      // 拿到 input 的 value 值
      let num = $('.cartNum').val() - 0
      // 进行 ++ 操作， 然后在设置进去
      $('.cartNum').val(num + 1)
      })


    // 5. 加入购物车操作
    $('.cen-right').on('click', '.addCart', function(){
      console.log('我要加入购物车');
      // 5-2. 拿到 localStorage 里面有没有数组
        // 如果你没有这个数组, 那么我就定义一个空数组
        // 如果你有, 我就用你的
        const cart = JSON.parse(window.localStorage.getItem('cart')) || []
        // console.log(cart);
        // 5-3. 判断一下 cart 数组里面有没有这个数据
        // 问题: 当前是哪一条数据 ? id
        // 如果 cart 里面有某一条数据和我的 id 一样
        // 表示我不需要添加内容了, 而是 ++
        // 如果 cart 里面没有某一条数据, 那么我要把当前这条数据 push 进去
        // 当前这一条数据是哪一条 ? info 存储进去
        // 如何判断 cart 中有没有 id 一样的数据
        // some 方法
        const flag = cart.some(item =>{
          return item.goods_id === id
        })
          // console.log(flag);
          if(flag){
            // cart 里面 id 一样的这一条里面的 cart_number ++
            // 5-4. 如果有这个数据拿到这个信息
            // filter 方法返回的是一个数组
            // 从数组里面筛选出来满足条件的项
            const cart_goods = cart.filter(item => {
              return item.goods_id === id
                    })[0]
            // console.log(cart_goods);

            cart_goods.cart_number = cart_goods.cart_number - 0 + ($('.cartNum').val() - 0)
          }else{
            info.cart_number = 1
            // 表示没有
            cart.push(info)
          }

          // 5-5 添加完毕还是要存储到 localStorage 里面
          window.localStorage.setItem('cart', JSON.stringify(cart))
    })




})