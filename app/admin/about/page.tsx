import { createClient } from '@/lib/supabase/server'
import AboutEditForm from '@/components/admin/AboutEditForm'
import { Settings } from 'lucide-react'

export default async function AdminAboutPage() {
  const supabase = await createClient()

  // site_settings テーブルから現在の設定を取得
  const { data: initialData } = await supabase
    .from('site_settings')
    .select('*')
    .single()

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* ヘッダー部分 */}
      <div className="flex items-center gap-3 border-b border-gray-800 pb-6">
        <Settings className="text-purple-500" size={32} />
        <h1 className="text-3xl font-bold text-white">Aboutページ編集</h1>
      </div>

      <p className="text-gray-400 text-sm">
        公開ページの「About」セクションに表示されるプロフィール情報や配信スケジュールを管理します。
      </p>

      {/* 編集フォーム本体に取得データを渡す */}
      <AboutEditForm initialData={initialData} />
    </div>
  )
}