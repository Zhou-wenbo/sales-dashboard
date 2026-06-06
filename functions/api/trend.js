export async function onRequestGet() {
  return Response.json({
    dates: ["6-1","6-5","6-10","6-15","6-20","6-25","6-30"],
    sales: [12000,19000,15000,22000,18000,25000,21000]
  })
}