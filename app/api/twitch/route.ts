export const runtime = 'edge'; // この一行を追加

import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const channel = searchParams.get('channel')

  if (!channel) {
    return NextResponse.json({ error: 'Channel is required' }, { status: 400 })
  }

  // 環境変数のチェック
  if (!process.env.TWITCH_CLIENT_ID || !process.env.TWITCH_CLIENT_SECRET) {
    console.error('Missing Twitch Environment Variables')
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
  }

  try {
    // 1. アクセストークンを取得
    const authRes = await fetch(
      `https://id.twitch.tv/oauth2/token?client_id=${process.env.TWITCH_CLIENT_ID}&client_secret=${process.env.TWITCH_CLIENT_SECRET}&grant_type=client_credentials`,
      { method: 'POST', cache: 'no-store' }
    )
    
    if (!authRes.ok) {
      const errorText = await authRes.text()
      console.error('Twitch Auth Error:', errorText)
      throw new Error('Failed to get Twitch access token')
    }
    
    const authData = await authRes.json()
    const token = authData.access_token

    // 2. ユーザーIDを取得
    const userRes = await fetch(`https://api.twitch.tv/helix/users?login=${channel}`, {
      headers: {
        'Client-ID': process.env.TWITCH_CLIENT_ID,
        'Authorization': `Bearer ${token}`,
      },
    })
    const userData = await userRes.json()
    
    if (!userData.data || userData.data.length === 0) {
      return NextResponse.json({ isLive: false, lastVideoId: null })
    }
    const userId = userData.data[0].id

    // 3. 配信中か確認
    const streamRes = await fetch(`https://api.twitch.tv/helix/streams?user_id=${userId}`, {
      headers: {
        'Client-ID': process.env.TWITCH_CLIENT_ID,
        'Authorization': `Bearer ${token}`,
      },
      cache: 'no-store'
    })
    const streamData = await streamRes.json()
    const isLive = streamData.data && streamData.data.length > 0

    let lastVideoId = null
    // 4. オフラインなら最新のアーカイブを取得
    if (!isLive) {
      const videoRes = await fetch(`https://api.twitch.tv/helix/videos?user_id=${userId}&first=1&type=archive`, {
        headers: {
          'Client-ID': process.env.TWITCH_CLIENT_ID,
          'Authorization': `Bearer ${token}`,
        },
      })
      const videoData = await videoRes.json()
      // IDが数字であることを確実にし、vなどのプレフィックスがあれば除去
      if (videoData.data && videoData.data.length > 0) {
        lastVideoId = videoData.data[0].id
      }
    }

    return NextResponse.json({
      isLive,
      streamInfo: isLive ? streamData.data[0] : null,
      lastVideoId
    })
  } catch (error: any) {
    console.error('Twitch API Route Error:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}