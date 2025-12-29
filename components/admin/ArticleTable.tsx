'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Edit, Trash2, Eye, Calendar } from 'lucide-react'
import { Database } from '@/types/database.types'

type Article = Database['public']['Tables']['articles']['Row']

interface ArticleTableProps {
  articles: Article[]
}

export default function ArticleTable({ articles }: ArticleTableProps) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleDelete = async (id: string) => {
    if (!confirm('この記事を削除してもよろしいですか?')) return

    setIsDeleting(id)
    try {
      const { error } = await supabase.from('articles').delete().eq('id', id)
      if (error) throw error
      router.refresh()
    } catch (error) {
      alert('削除に失敗しました')
    } finally {
      setIsDeleting(null)
    }
  }

  if (articles.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-12 text-center border border-gray-700">
        <p className="text-gray-400">まだ記事がありません</p>
      </div>
    )
  }

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-900/50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">タイトル</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">カテゴリ</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">ステータス</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">更新日</th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {articles.map((article) => (
              <tr key={article.id} className="hover:bg-gray-700/30 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {article.status === 'published' && (
                      <Eye size={16} className="text-green-500" />
                    )}
                    <span className="text-white font-medium">{article.title}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-400">
                    {article.category}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {article.status === 'published' ? (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
                      公開
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-600/20 text-gray-400">
                      下書き
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-gray-400 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} />
                    {new Date(article.updated_at).toLocaleDateString('ja-JP')}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => router.push(`/admin/new?id=${article.id}`)}
                      className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                      title="編集"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(article.id)}
                      disabled={isDeleting === article.id}
                      className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
                      title="削除"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}