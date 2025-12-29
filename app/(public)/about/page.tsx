export const runtime = 'edge';

import { createClient } from '@/lib/supabase/server' 
import { User, Calendar, Gamepad2, AlertCircle } from 'lucide-react'

export default async function AboutPage() {
  const supabase = await createClient()
  
  const { data: settingsData } = await supabase
    .from('site_settings')
    .select('*')
    .single()

  const settings = settingsData?.settings || {
    profile: { name: '未設定', bio: '', avatar_url: '' },
    schedule: [],
    favorite_games: []
  }

  const profile = settings.profile
  const schedule = settings.schedule
  const favoriteGames = settings.favorite_games

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-20">
      <section className="bg-gray-800 rounded-lg p-8 border border-gray-700">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-purple-500/30 flex-shrink-0 bg-gray-900">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-600"><User size={48} /></div>
            )}
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold mb-3 text-white">{profile.name}</h1>
            <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{profile.bio}</p>
          </div>
        </div>
      </section>

      {/* スケジュール表示 */}
      <section>
        <div className="flex items-center gap-3 mb-6"><Calendar className="text-purple-400" size={28} /><h2 className="text-2xl font-bold text-white">配信スケジュール</h2></div>
        <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
          <table className="w-full text-left">
            <thead className="bg-gray-900/50 text-gray-300 text-sm">
              <tr><th className="px-6 py-4">曜日</th><th className="px-6 py-4">内容</th><th className="px-6 py-4">時間</th></tr>
            </thead>
            <tbody className="divide-y divide-gray-700 text-gray-300">
              {schedule.map((item: any, i: number) => (
                <tr key={i} className="hover:bg-gray-700/30">
                  <td className="px-6 py-4 font-medium text-white">{item.day}曜日</td>
                  <td className="px-6 py-4">{item.title}</td>
                  <td className="px-6 py-4">{item.start} 〜 {item.end}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ゲーム表示 */}
      <section>
        <div className="flex items-center gap-3 mb-6"><Gamepad2 className="text-purple-400" size={28} /><h2 className="text-2xl font-bold text-white">よく遊ぶゲーム</h2></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {favoriteGames.map((game: any, i: number) => (
            <div key={i} className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <h3 className="text-xl font-bold mb-2 text-white">{game.title}</h3>
              <p className="text-gray-400">{game.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}