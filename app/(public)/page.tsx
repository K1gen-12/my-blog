export const runtime = 'edge';

import { createClient } from '@/lib/supabase/server' 
import TwitchEmbed from '@/components/TwitchEmbed'
import ArticleCard from '@/components/ArticleCard'
import { User } from 'lucide-react'
export const revalidate = 60

export default async function HomePage() {
  const supabase = await createClient()

  const { data: articles } = await supabase
    .from('articles')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(3)

  const { data: settingsData } = await supabase
    .from('site_settings')
    .select('settings')
    .single()

  const profile = settingsData?.settings?.profile

  return (
    <div className="space-y-12">
      <section>
        <h2 className="text-3xl font-bold mb-6 text-white">🎮 Live Stream</h2>
        <TwitchEmbed channel={process.env.NEXT_PUBLIC_TWITCH_CHANNEL || 'gennosuke'} />
      </section>

      {profile && (
        <section className="bg-gray-800 rounded-lg p-8 border border-gray-700">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-gray-700 flex-shrink-0 bg-gray-900">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-600"><User size={48} /></div>
              )}
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold mb-3 text-white">{profile.name}</h2>
              <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{profile.bio}</p>
            </div>
          </div>
        </section>
      )}

      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-white">📝 Latest Articles</h2>
          <a href="/articles" className="text-purple-400 hover:text-purple-300 transition-colors text-sm">すべて見る →</a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles?.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </section>
    </div>
  )
}