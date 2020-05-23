import { ADD_COUNTER, ADD_TO_CART } from './mutation-types'

export default {
    addCart(context, payload) {
        return new Promise((resolve, reject) => {
            // 1.查找之前数组是否有该商品
            let odlProduct = context.state.cartList.find(item => item.iid === payload.iid)

            // 2.判断odlProduct
            if (odlProduct) {
                context.commit(ADD_COUNTER, odlProduct)
                resolve('商品数量+1')
            } else {
                payload.count = 1
                context.commit(ADD_TO_CART, payload)
                resolve('添加了新的商品+1')
            }
        })
    }
}