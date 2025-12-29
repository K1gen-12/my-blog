export const runtime = 'edge';

import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { PlusCircle, FileText, Settings, LayoutDashboard, Globe, FileEdit } from 'lucide-react'
import ArticleTable from '@/components/admin/ArticleTable'
import LogoutButton from '@/components/admin/LogoutButton'

export const revalidate = 0

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  const { data: articles } = await supabase
    .from('articles')
    .select('*')
    .order('updated_at', { ascending: false })

  // 統計データの計算
  const totalCount = articles?.length || 0
  const publishedCount = articles?.filter(a => a.status === 'published').length || 0
  const draftCount = articles?.filter(a => a.status === 'draft').length || 0

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* ヘッダー */}
      <header className="border-b border-gray-800 bg-gray-900/95 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-xl font-bold text-purple-400 hover:text-purple-300 transition-colors">
                げんのすけの秘密基地
              </Link>
              <span className="text-gray-700">|</span>
              <span className="text-sm font-medium text-gray-400 tracking-wider">ADMIN PANEL</span>
            </div>
            <LogoutButton />
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="container mx-auto px-6 py-10 space-y-12">
        
        {/* アクションボタンエリア */}
        <section>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-6 flex items-center gap-2">
            <LayoutDashboard size={16} />クイックメニュー
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-500/10 rounded-xl group-hover:bg-blue-500/20 transition-colors">
                  <FileText className="text-blue-400" size={28} />
                </div>
                <div>
                  <div className="font-bold text-lg">記事一覧・編集</div>
                  <p className="text-sm text-gray-500 mt-1">投稿済みの記事を管理</p>
                </div>
            </div>

            <Link href="/admin/new" className="group p-6 bg-gray-900 hover:bg-gray-800 rounded-2xl border border-gray-800 transition-all hover:border-purple-500/50 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-500/10 rounded-xl group-hover:bg-purple-500/20 transition-colors">
                  <PlusCircle className="text-purple-400" size={28} />
                </div>
                <div>
                  <div className="font-bold text-lg">新規記事作成</div>
                  <p className="text-sm text-gray-500 mt-1">新しい記事を書き始める</p>
                </div>
              </div>
            </Link>

            <Link href="/admin/about" className="group p-6 bg-gray-900 hover:bg-gray-800 rounded-2xl border border-gray-800 transition-all hover:border-green-500/50 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-500/10 rounded-xl group-hover:bg-green-500/20 transition-colors">
                  <Settings className="text-green-400" size={28} />
                </div>
                <div>
                  <div className="font-bold text-lg">Aboutページ編集</div>
                  <p className="text-sm text-gray-500 mt-1">プロフィール・配信日程</p>
                </div>
              </div>
            </Link>
          </div>
        </section>

        {/* 統計エリア */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">総記事数</p>
              <p className="text-3xl font-bold mt-1">{totalCount}</p>
            </div>
            <FileText className="text-gray-700" size={40} />
          </div>
          <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-sm text-green-500/80 font-medium">公開中</p>
              <p className="text-3xl font-bold mt-1 text-green-400">{publishedCount}</p>
            </div>
            <Globe className="text-green-900/30" size={40} />
          </div>
          <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-500/80 font-medium">下書き</p>
              <p className="text-3xl font-bold mt-1 text-yellow-400">{draftCount}</p>
            </div>
            <FileEdit className="text-yellow-900/30" size={40} />
          </div>
        </section>

        {/* 記事一覧テーブル */}
        <section className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-6 border-b border-gray-800 bg-gray-800/30">
            <h2 className="font-bold text-lg flex items-center gap-2">
              <FileText size={20} className="text-blue-400" /> 最近の更新
            </h2>
          </div>
          <div className="p-2">
            <ArticleTable articles={articles || []} />
          </div>
        </section>

      </main>
    </div>
  )
}