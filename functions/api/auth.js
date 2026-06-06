import { MongoClient } from 'mongodb'

export async function onRequestPost(context) {
  const { username, password } = await context.request.json()
  const client = new MongoClient(context.env.MONGODB_URL)
  
  try {
    await client.connect()
    const db = client.db('sales')
    const col = db.collection('users')

    if (context.request.url.includes('/login')) {
      const user = await col.findOne({ username, password })
      if (!user) return new Response('fail', { status: 401 })
      return Response.json({ token: 'ok' })
    }

    if (context.request.url.includes('/register')) {
      await col.insertOne({ username, password })
      return Response.json({ ok: 1 })
    }
  } finally {
    client.close()
  }
  return new Response('not found')
}