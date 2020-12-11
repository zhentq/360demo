$(function(){
    // 加入购物车点击事件
    $('#go-gouwu').on('click', function(){
        // console.log('点击');
        window.location.href = './cart.html'
    })  


     // 0. 准备一个变量，接受所有的商品信息
    let list = null

    // 0. 准备一个对象，记录所有可以影响页面主体的内容的数据
    const list_info = {
        cat_one: 'all',
        // cat_two: 'all',
        // cat_three: 'all',
        sort_method: '综合',
        sort_type: 'ASC',  
        // ASC 正序（从小到大） DESC 倒序（从大到小）
        current: 1,
        pagesize: 12
    }


    // 1. 请求一级分类列表
    getCateOne()
    async function getCateOne(){
        // console.log("渲染");
        // 1.2 发送请求获取
        const cat_one_list = await $.get('./server/getCateOne.php', null, null , 'json')
        // console.log(cat_one_list);

        // 1.3 进行列表渲染
        let str = `<span data-type="all" class="active">全部</span>`

        cat_one_list.list.forEach(item => {
            str += `
            <span data-type="${item.cat_one_id}">${item.cat_one_id}</span>
            `
        })
        $('.cateOneBox > .right').html(str)
        // console.log($('.cateOneBox > .right')  );
    }

    // 2. 请求总页数，回来渲染分页器
    getTotalPage()
    async function getTotalPage(){
    // 2.1 请求分页数据
    const totalInfo = await $.get('./server/getTotalPage.php', list_info, null, 'json')
    //  console.log(totalInfo)
        
    //  2.2 渲染分页内容
    //  jquery-pagination 插件
    $('.pagination').pagination({
        pageCount: totalInfo.total,
        callback (index){
        list_info.current = index.getCurrent()
        // 从新请求商品列表
        getGoodsList()
        }
    })
    }

    // 3. 渲染商品列表
    getGoodsList()
    async function getGoodsList(){
    // 3.1 请求商品列表
    const goodsList = await $.get('./server/getGoodsList.php', list_info, null, 'json')
    // console.log('渲染');

    // 给全局变量 list 进行赋值
    // 放在这是在请求回来数据，让加入购物车事件才生效
    list = goodsList.list

    // 3.2 渲染页面
    let str = ''
    goodsList.list.forEach(item => {
        str += `
        <div class="list-box" >
			<img src="${  item.goods_big_logo }">
			<br>
			<a href="./detail.html" class="aa">
				<span class="title" data-id="${ item.goods_id}">${ item.goods_name }</span>
				<span class="price">${ item.goods_price}</span>
			</a>
			<a  class="join" data-id="${ item.goods_id}">
				加入购物车
			</a>
		</div>
        `
    })

    $('.liebiao-cen ').html(str)
    }




    // 4  点击一级分类进行切换操作
  //  4.1 事件委托形式进行事件绑定
  $('.cateOneBox').on('click', 'span', function(){
    // console.log(this);
    // 4.2 操作类名
    $(this).addClass('active').siblings().removeClass('active')

    // 4.3 拿到你点击的哪一个
    const type = $(this).data('type')
    // console.log(type)


    // 8.让当前页回到第一页
    list_info.current = 1

    // 4.4 修改 list_info  
    list_info.cat_one =type
    // 从新渲染分类信息和列表信息
    getTotalPage()
    getGoodsList()
    
  })

  // 5 排序方式点击事件
  $('.sortBox').on('click' ,'span', function(){
  // 5.2 拿到信息
  const method = $(this).attr('data-method')
  const type = $(this).attr('data-type')

  // 5.3 切换类名
  $(this).addClass('active').siblings().removeClass('active')

  // 5.4 修改对象信息
  list_info.sort_method = method
  list_info.sort_type = type
  // console.log(method);
  // console.log(type);

  // 5.5 从新请求
  getTotalPage()
  getGoodsList()
    
  // 5.6 修改 data-type 属性
  // 为下次点击准备
  $(this)
       .attr('data-type',type === 'ASC' ? 'DESC' : 'ASC')
       .siblings()
       .attr('data-type','ASC')
})


    
// 6 点击跳转到详情页
$('.liebiao-cen ').on('click', '.aa>.title', function(){
    //  6.2 拿到标签身上记录的商品id
    const id = $(this).data('id')
    // 6.3 把这个id 储存到 cookie 中
    setCookie('goods_id', id)
    // 6.4 进行页面跳转
    window.location.href = './detail.html'
  })


  // 7. 加入购物车操作
$('.liebiao-cen ').on('click', '.list-box>.join ', function(){
    // console.log('加入');
      const cart = JSON.parse(window.localStorage.getItem('cart')) || []
      // 多拿一个 id 的操作
      const id = $(this).data('id')
      // console.log(id);
      const flag = cart.some(item =>{
        return item.goods_id == id
      })
      // console.log(flag)
        if(flag){
          //  如果有这个数据拿到这个信息
          const cart_goods = cart.filter(item => item.goods_id == id)[0]
          cart_goods.cart_number = cart_goods.cart_number - 0 + 1
        }else{
          // 表示没有
          // 拿到当前商品的 id 所属的信息
          // list 在 100 行进行定义  在 193 行进行赋值
          const info = list.filter(item => {
            return item.goods_id == id
          })[0]
          // console.log(info)
          info.cart_number = 1
          cart.push(info)
        }
  
        // 4-5 添加完毕还是要存储到 localStorage 里面
        window.localStorage.setItem('cart', JSON.stringify(cart))
  })
  


})