'use client'

import { useEffect, useState, useRef } from 'react'
import { Loader2 } from 'lucide-react'

export default function TwitchEmbed({ channel }: { channel: string }) {
  const [data, setData] = useState<{ isLive: boolean; lastVideoId: string | null } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    async function checkStatus() {
      try {
        const res = await fetch(`/api/twitch?channel=${channel}`)
        const json = await res.json()
        setData(json)
      } catch (e) {
        console.error('Twitch status check failed:', e)
      } finally {
        setIsLoading(false)
      }
    }
    checkStatus()
  }, [channel])

  if (!isMounted || isLoading) {
    return (
      <div className="w-full aspect-video bg-gray-900 rounded-2xl flex items-center justify-center border border-gray-800">
        <Loader2 className="animate-spin text-purple-500" size={32} />
      </div>
    )
  }

  const parent = typeof window !== 'undefined' ? window.location.hostname : 'localhost'
  const query = new URLSearchParams({
    parent: parent,
    autoplay: 'true',
    muted: 'true',
  })

  if (data?.isLive) {
    query.set('channel', channel)
  } else if (data?.lastVideoId) {
    query.set('video', data.lastVideoId)
  } else {
    query.set('channel', channel)
  }

  const embedUrl = `https://player.twitch.tv/?${query.toString()}`

  return (
    <div className="space-y-4">
      {/* --- タイトルの下のバッジエリア --- */}
      <div className="flex items-center gap-2 px-1">
        {data?.isLive ? (
          <div className="flex items-center gap-1.5 bg-red-600/10 border border-red-600/20 text-red-500 text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-tighter">
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
            Live Now
          </div>
        ) : (
          <div className="flex items-center gap-1.5 bg-gray-800 text-gray-400 text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-tighter border border-gray-700">
            <span>🎬</span>
            Recent Archive
          </div>
        )}
      </div>

      {/* --- 映像エリア --- */}
      <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-gray-800">
        <iframe
          src={embedUrl}
          height="100%"
          width="100%"
          allowFullScreen
          className="w-full h-full"
          title="Twitch Player"
        />
      </div>
    </div>
  )
}