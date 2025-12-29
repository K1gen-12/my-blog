'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Save, Loader2, Plus, Trash2, Calendar, Gamepad2, User, Upload, Image as ImageIcon } from 'lucide-react'

export default function AboutEditForm({ initialData }: { initialData: any }) {
  const router = useRouter()
  const supabase = createClient()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  
  const [formData, setFormData] = useState({
    profile: initialData?.settings?.profile || { name: '', bio: '', avatar_url: '' },
    schedule: initialData?.settings?.schedule || [],
    favorite_games: initialData?.settings?.favorite_games || []
  })

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true)
      const file = e.target.files?.[0]
      if (!file) return

      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `images/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath)

      setFormData({
        ...formData,
        profile: { ...formData.profile, avatar_url: publicUrl }
      })
    } catch (error: any) {
      alert('アップロード失敗: ' + error.message)
    } finally {
      setUploading(false)
    }
  }

  const addSchedule = () => {
    setFormData({
      ...formData,
      schedule: [...formData.schedule, { day: '', title: '', start: '', end: '' }]
    })
  }

  const removeSchedule = (index: number) => {
    const newSchedule = formData.schedule.filter((_: any, i: number) => i !== index)
    setFormData({ ...formData, schedule: newSchedule })
  }

  const addGame = () => {
    setFormData({
      ...formData,
      favorite_games: [...formData.favorite_games, { title: '', description: '' }]
    })
  }

  const removeGame = (index: number) => {
    const newGames = formData.favorite_games.filter((_: any, i: number) => i !== index)
    setFormData({ ...formData, favorite_games: newGames })
  }

  const handleSave = async () => {
    setLoading(true)
    const { error } = await supabase
      .from('site_settings')
      .upsert({ 
        id: initialData?.id, 
        settings: formData,
        updated_at: new Date().toISOString()
      })

    if (error) {
      alert('保存エラー: ' + error.message)
    } else {
      alert('設定を保存しました！')
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <div className="space-y-12 pb-32 text-white">
      {/* 1. プロフィール設定 */}
      <section className="bg-gray-800 p-6 rounded-xl border border-gray-700">
        <div className="flex items-center gap-2 mb-6 text-purple-400">
          <User size={24} />
          <h2 className="text-xl font-bold">プロフィール設定</h2>
        </div>
        <div className="flex flex-col md:flex-row gap-8 items-start mb-6">
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-900 border-2 border-gray-700 flex items-center justify-center">
              {formData.profile.avatar_url ? (
                <img src={formData.profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <ImageIcon size={40} className="text-gray-600" />
              )}
              {uploading && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white"><Loader2 className="animate-spin" /></div>
              )}
            </div>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleUpload} />
            <button type="button" onClick={() => fileInputRef.current?.click()} className="text-sm bg-gray-700 px-4 py-2 rounded-full hover:bg-gray-600 flex items-center gap-2">
              <Upload size={16} />画像変更
            </button>
          </div>
          <div className="flex-1 w-full space-y-4">
            <input type="text" placeholder="名前" className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-2" value={formData.profile.name} onChange={(e) => setFormData({...formData, profile: {...formData.profile, name: e.target.value}})} />
            <textarea placeholder="自己紹介" rows={4} className="w-full bg-gray-900 border border-gray-700 rounded px-4 py-2" value={formData.profile.bio} onChange={(e) => setFormData({...formData, profile: {...formData.profile, bio: e.target.value}})} />
          </div>
        </div>
      </section>

      {/* 2. 配信スケジュール */}
      <section className="bg-gray-800 p-6 rounded-xl border border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-purple-400">
            <Calendar size={24} /><h2 className="text-xl font-bold">配信スケジュール</h2>
          </div>
          <button onClick={addSchedule} className="p-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30"><Plus size={20} /></button>
        </div>
        <div className="space-y-3">
          {formData.schedule.map((item: any, index: number) => (
            <div key={index} className="flex flex-wrap md:flex-nowrap gap-2 items-center bg-gray-900/50 p-3 rounded-lg border border-gray-700/50">
              <input placeholder="曜日" className="w-20 bg-gray-900 border border-gray-700 rounded px-2 py-2 text-sm" value={item.day} onChange={(e) => {
                const newSchedule = [...formData.schedule]; newSchedule[index].day = e.target.value; setFormData({...formData, schedule: newSchedule})
              }} />
              <input placeholder="内容" className="flex-1 min-w-[150px] bg-gray-900 border border-gray-700 rounded px-2 py-2 text-sm" value={item.title} onChange={(e) => {
                const newSchedule = [...formData.schedule]; newSchedule[index].title = e.target.value; setFormData({...formData, schedule: newSchedule})
              }} />
              <input placeholder="開始" className="w-24 bg-gray-900 border border-gray-700 rounded px-2 py-2 text-sm" value={item.start} onChange={(e) => {
                const newSchedule = [...formData.schedule]; newSchedule[index].start = e.target.value; setFormData({...formData, schedule: newSchedule})
              }} />
              <span className="text-gray-500">〜</span>
              <input placeholder="終了" className="w-24 bg-gray-900 border border-gray-700 rounded px-2 py-2 text-sm" value={item.end} onChange={(e) => {
                const newSchedule = [...formData.schedule]; newSchedule[index].end = e.target.value; setFormData({...formData, schedule: newSchedule})
              }} />
              <button onClick={() => removeSchedule(index)} className="text-red-400 p-2"><Trash2 size={18} /></button>
            </div>
          ))}
        </div>
      </section>

      {/* 3. よく遊ぶゲーム */}
      <section className="bg-gray-800 p-6 rounded-xl border border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-purple-400">
            <Gamepad2 size={24} /><h2 className="text-xl font-bold">よく遊ぶゲーム</h2>
          </div>
          <button onClick={addGame} className="p-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30"><Plus size={20} /></button>
        </div>
        <div className="grid gap-4">
          {formData.favorite_games.map((game: any, index: number) => (
            <div key={index} className="p-4 bg-gray-900 rounded-lg border border-gray-700 relative">
              <button onClick={() => removeGame(index)} className="absolute top-2 right-2 text-red-400"><Trash2 size={18} /></button>
              <input placeholder="タイトル" className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 mb-2" value={game.title} onChange={(e) => {
                const newGames = [...formData.favorite_games]; newGames[index].title = e.target.value; setFormData({...formData, favorite_games: newGames})
              }} />
              <textarea placeholder="説明" className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2" value={game.description} onChange={(e) => {
                const newGames = [...formData.favorite_games]; newGames[index].description = e.target.value; setFormData({...formData, favorite_games: newGames})
              }} />
            </div>
          ))}
        </div>
      </section>

      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
        <button onClick={handleSave} disabled={loading || uploading} className="flex items-center gap-2 px-12 py-4 bg-purple-500 hover:bg-purple-600 rounded-full font-bold shadow-2xl transition-all active:scale-95 disabled:opacity-50">
          {loading ? <Loader2 className="animate-spin" size={24} /> : <Save size={24} />}設定を保存する
        </button>
      </div>
    </div>
  )
}