export async function onRequestGet(context) {
  return Response.json({
    totalSales: 125800,
    orderCount: 368,
    avgOrderValue: 342
  })
}