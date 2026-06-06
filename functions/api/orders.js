export async function onRequestGet(context) {
  return Response.json({
    orders: [
      { _id:1, amount:1299, category:"电子产品", region:"华东", status:"已支付" }
    ],
    total: 1
  })
}

export async function onRequestDelete(context) {
  return Response.json({ message: "删除成功" })
}