'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Save, Loader2, X, Upload, Image as ImageIcon } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

interface Category {
  id: string
  name: string
}

interface ArticleFormProps {
  initialData?: any
  categories: Category[]
}

export default function ArticleForm({ initialData, categories }: ArticleFormProps) {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    content: initialData?.content || '',
    status: initialData?.status || 'draft',
    category: initialData?.category || '',
    thumbnail: initialData?.thumbnail || '',
  })

  // 画像アップロード処理 (バケット名: images)
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setLoading(true)
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`
      const filePath = `thumbnails/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath)

      setFormData({ ...formData, thumbnail: publicUrl })
    } catch (error) {
      console.error('Upload error:', error)
      alert('画像のアップロードに失敗しました')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // 本文から概要を自動生成（最初の100文字）
      const excerpt = formData.content.replace(/[#*`]/g, '').slice(0, 100) + '...'

      const { error } = await supabase
        .from('articles')
        .upsert({
          id: initialData?.id, // IDがあれば上書き(編集)、なければ新規作成
          title: formData.title,
          content: formData.content,
          thumbnail: formData.thumbnail || null,
          excerpt: excerpt,
          status: formData.status,
          category: formData.category || null, // 空文字ならnullにして制約エラーを防ぐ
          updated_at: new Date().toISOString(),
        })

      if (error) throw error

      router.push('/admin/dashboard')
      router.refresh()
    } catch (error) {
      console.error('Error saving article:', error)
      alert('保存中にエラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* タイトル入力 */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-400">タイトル</label>
        <input
          type="text"
          required
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-purple-500 outline-none transition-all"
          placeholder="記事のタイトルを入力"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
      </div>

      {/* サムネイル設定 */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-400">サムネイル画像</label>
        <div className="border-2 border-dashed border-gray-700 rounded-xl p-6 bg-gray-800/30 transition-colors hover:bg-gray-800/50">
          {formData.thumbnail ? (
            <div className="relative aspect-video w-full max-w-md mx-auto rounded-lg overflow-hidden border border-gray-700 mb-4">
              <img src={formData.thumbnail} alt="Thumbnail preview" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => setFormData({ ...formData, thumbnail: '' })}
                className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 text-gray-500">
              <ImageIcon size={40} className="mb-2 opacity-20" />
              <p className="text-sm">画像を選択するか、URLを入力してください</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={loading}
              className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-700 file:text-white hover:file:bg-gray-600 cursor-pointer"
            />
            <input
              type="url"
              placeholder="画像URLを直接入力"
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-sm text-white focus:ring-2 focus:ring-purple-500 outline-none"
              value={formData.thumbnail}
              onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* カテゴリとステータス */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-400">カテゴリ</label>
          <select
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white outline-none focus:ring-2 focus:ring-purple-500"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          >
            <option value="">カテゴリを選択なし</option>
            {categories?.map((cat) => (
              <option key={cat.id} value={cat.name}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-400">公開設定</label>
          <select
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white outline-none focus:ring-2 focus:ring-purple-500"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          >
            <option value="draft">下書き</option>
            <option value="published">公開</option>
          </select>
        </div>
      </div>

      {/* コンテンツ入力 */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-400">本文 (Markdown)</label>
          <button
            type="button"
            onClick={() => setPreviewMode(!previewMode)}
            className="text-xs font-semibold px-3 py-1 rounded bg-gray-700 text-gray-300 hover:bg-gray-600"
          >
            {previewMode ? '編集に戻る' : 'プレビューを表示'}
          </button>
        </div>

        {previewMode ? (
          <div className="w-full bg-gray-900 border border-gray-700 rounded-lg p-6 prose prose-invert max-w-none min-h-[400px]">
            <ReactMarkdown>{formData.content}</ReactMarkdown>
          </div>
        ) : (
          <textarea
            required
            rows={15}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white font-mono focus:ring-2 focus:ring-purple-500 outline-none transition-all"
            placeholder="Markdown形式で本文を入力..."
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          />
        )}
      </div>

      {/* 送信ボタン */}
      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-900/20"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <Save size={20} />
          )}
          {initialData ? '記事を更新する' : '記事を公開する'}
        </button>
      </div>
    </form>
  )
}