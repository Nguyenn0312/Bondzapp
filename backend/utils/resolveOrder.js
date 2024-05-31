const Bond = require("../models/Bond");
const Order = require("../models/Order");
const User = require("../models/User");

async function resolveOrder(order, price, user) {
    const orderUser = await User.findById(order.user);
    const orderBond = await Bond.findById(order.bond);
   
    if (!price) price = orderBond.price; // Gán giá trị price cuối cùng trong mảng giá của bond nếu price không được cung cấp

    const totalPrice = price * order.quantity; // Tính total_price cho đơn hàng hiện tại
    order.total_price = totalPrice; // Cập nhật total_price cho đơn hàng gốc

    if (order.type == "buy") {
        orderUser.balance -= price; // Trừ total_price từ số dư của người dùng
    } else {
        orderUser.balance += price; // Cộng total_price vào số dư của người dùng
    }
    
    order.completed = true;
    order.price = price;

    const newOrders = Array(order.quantity)
        .fill(1)
        .map(() =>
            new Order({
                bond: orderBond,
                user: user,
                type: order.type == "buy" ? "sell" : "buy",
                quantity: 1,
                price: order.price,
                TotalPrice: totalPrice, // Gán total_price tính được cho mỗi đơn hàng
                completed: true,
            })
        );

    // Lấy tổng của totalPrice cho toàn bộ đơn hàng
    const totalOrderPrice = newOrders.reduce((acc, cur) => acc + cur.TotalPrice, 0);

    await Promise.all([
        order.save(),
        ...newOrders.map(order => order.save()),
        orderUser.save(),
        orderBond.save()
    ]);
}

module.exports = resolveOrder;
