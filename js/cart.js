// jQuery 的入口函数
$(function(){
    
  // 0. 进行登录判断
  // 如果没有登录, 直接跳转回登录页
  // 通过 cookie
  const nickname = getCookie('nickname')
  console.log(typeof(nickname));
  if(nickname === undefined) return window.location.href = './login.html'

    
  // 1. 拿到 localStorage 里面的 cart 数据
  const cart = JSON.parse(window.localStorage.getItem('cart'))
  console.log(cart);
  // 2. 判断 cart 的 length, 决定执行进行哪一个渲染
  if(!cart.length){
      // 表示购物车没有数据
      // 购物车列表添加 hide 类名, 进行隐藏
     $('.on').addClass('hide')
     $('.off').removeClass('hide')
     return
  }

   // 3. 能来到这里表示 cart 里面有数据
  // 就要进行渲染了
  $('.off').addClass('hide')
  $('.on').removeClass('hide')


    // 4. 根据 cart进行页面渲染
    // 写一个方法进行渲染
    bindHtml()
    function bindHtml(){
        // 5. 进行一些数据准备
        // 5-1 决定全选按钮是不是选中
        // every()
        // selectAll 拿到一个布尔值
        const selectAll = cart.every(item => item.is_select === '1')
        // 5-2 计算选中商品的数量和价格
        let total = 0
        let totalMoney = 0
        cart.forEach(item => {
            if(item.is_select === '1'){
                total += item.cart_number -0
                totalMoney += item.cart_number * item.goods_price
            }
        })

    let str = `
        <div class="gouwu-top">
        <div class="selectAll">
            <input type="checkbox" class="items-all"  ${ selectAll ? 'checked' : ''}>
            <span>全选</span>
            <div class="a1">
                <P>商品</P>
            </div>
            <div class="a2">
                <P>单价</P>
            </div>
            <div class="a3">
                <P>数量</P>
            </div>
            <div class="a4">
                <P>小计</P>
            </div>
            <div class="a5">
                <P>操作</P>
            </div>
        </div>
    </div>
            <div class="gouwu-mid">
            <ul class="goodlist">
        `
    cart.forEach(item => {
        str += `
                <li>
                    <div class="select">
                        <input type="checkbox" data-id="${ item.goods_id }"  ${ item.is_select === '0' ? '' : 'checked'}>
                    </div>
                    <div class="goodsImg">
                        <img src=" ${ item.goods_small_logo }" alt="">
                    </div>
                    <div class="goodsDesc">
                        <p>
                             ${ item.goods_name}
                        </p>
                    </div>
                    <div class="price">
                        ￥ <span class="text-danger">${ item.goods_price}</span>
                    </div>
                    <div class="count">
                        <button class="subNum" data-id="${ item.goods_id }">-</button>
                        <input type="text" value="${ item.cart_number }">
                        <button class="addNum" data-id="${ item.goods_id }">+</button>
                    </div>
                    <div class="xiaoji">
                        ￥ <span class="text-danger">${(item.goods_price * item.cart_number).toFixed(2)}</span>
                    </div>
                    <div class="operate">
                        <button class="btn btn-danger del" data-id="${ item.goods_id}">删除</button>
                    </div>
                </li>
             `
    })
    str += `
        </ul>
        </div>
          <div class="gouwu-but">
          <p class="buyNum">
              已选
              <span class="">${ total }</span>
              件商品
          </p>
          <p class="buyMoney">
              合计：
              <span class="">${ totalMoney .toFixed(2)}</span>
              元
          </p>
          <p class="buyGo">					
              <button ${ totalMoney === 0 ? 'disabled' : ''}>
                  <a href="">
                      去结算
                  </a>							
              </button>
          </p>
      </div>
     `

        $('.on').html(str)
    }



     // 5 给每一个按钮添加点击事件
    // 5-1 每一个选择按钮的点击事件
    $('.on').on('click','.select > input', function(){
        // 拿到当前标签的状态
        // checked的属性可以为 true 和 false
        const type = this.checked
        // 拿到当前标签的 id
        const id = $(this).data('id')
        // 去 cart 里面找到 id 对应的数据，把 is_select 修改一下
        const info = cart.filter(item => item.goods_id == id)[0]
        info.is_select = type ? '1' : '0'
        // 从新渲染页面
        bindHtml()
        // 把最新的 cart 存起来
        window.localStorage.setItem('cart', JSON.stringify(cart))
    })

    // 5-2 数量 ++
    $('.on').on('click', '.addNum', function(){
    // 拿到商品 id
        const id = $(this).data('id')
    // 找到 cart 中的对应商品
        const info = cart.filter(item => item.goods_id == id)[0]
    // 修改信息
        info.cart_number = info.cart_number - 0 + 1
    // 重新渲染页面
        bindHtml()
    // 从新保存起来
        window.localStorage.setItem('cart', JSON.stringify(cart))
    })

    // 5-3 数量--
    $('.on').on('click','.subNum', function(){
    // 拿到商品 id
        const id = $(this).data('id')
    // 找到 cart 中的对应商品
        const info = cart.filter(item => item.goods_id == id)[0]
    // 判断 info 内的 cart_number 如果已经是 1 了, 就什么都不做了
        if(info.cart_number === 1) return
    // 修改信息
        info.cart_number = info.cart_number - 0 -1
    // 重新渲染页面
        bindHtml()
    // 从新保存起来
        window.localStorage.setItem('cart', JSON.stringify(cart))
    })

    // 5-4 删除操作
    $('.on').on('click', '.del', function(){
        // 拿到商品id
      const id = $(this).data('id')
        // 删除指定商品id
      for (let i = 0; i < cart.length; i++) {
        if (cart[i].goods_id == id) {
          cart.splice(i, 1)
          break
        }
      }

    // 重新渲染页面
    bindHtml()
    // 从新保存起来
    window.localStorage.setItem('cart',JSON.stringify(cart))
    // 如果购物车没有商品以后，重新加载页面
    if (!cart.length) return window.location.reload()
    })
   

    // 5-5 全选按钮
    $('.on').on('click', '.selectAll > .items-all', function(){
        console.log("点击");
            const type = this.checked
        //      console.log(type)
            if(!type) {
                for(let i = 0; i < cart.length; i++){
                    cart[i].is_select = '0'
                }
            }else{
                for(let i = 0; i < cart.length; i++){
                    cart[i].is_select = '1'
                }
            }
    
            bindHtml()
            window.localStorage.setItem('cart', JSON.stringify(cart))
        })

})



