import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, FileEdit, FilePlus } from 'lucide-react'
import ArticleForm from '@/components/admin/ArticleForm'
import LogoutButton from '@/components/admin/LogoutButton'

export const revalidate = 0

// 1. Propsの型定義を Promise に変更
interface NewArticlePageProps {
  searchParams: Promise<{ id?: string }>
}

export default async function NewArticlePage({ searchParams }: NewArticlePageProps) {
  const supabase = await createClient()
  
  // 2. ここで await して中身を取り出す
  const resolvedSearchParams = await searchParams
  const id = resolvedSearchParams.id
  const isEdit = !!id

  // 編集モードの場合は記事データを取得
  let article = null
  if (isEdit) {
    const { data } = await supabase
      .from('articles')
      .select('*')
      .eq('id', id) // さきほど await した id を使う
      .single()

    if (!data) notFound()
    article = data
  }

  // カテゴリ一覧を取得
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('name')

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
      <main className="container mx-auto px-6 py-10 max-w-5xl space-y-8">
        <Link
          href="/admin/dashboard"
          className="group inline-flex items-center gap-2 text-gray-400 hover:text-purple-400 transition-colors"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          ダッシュボードに戻る
        </Link>

        <div className="bg-gray-900 border border-gray-800 p-8 rounded-2xl shadow-xl">
          <div className="mb-8 border-b border-gray-800 pb-6">
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
              {isEdit ? (
                <>
                  <FileEdit size={32} className="text-blue-400" />
                  記事を編集
                </>
              ) : (
                <>
                  <FilePlus size={32} className="text-purple-400" />
                  新規記事作成
                </>
              )}
            </h1>
            <p className="text-gray-500">
              {isEdit 
                ? '既存の記事内容を修正して更新します。' 
                : '新しい知見や日常を Markdown 形式で綴りましょう。'}
            </p>
          </div>

          {/* プロパティ名を article ではなく initialData にして渡す */}
          <ArticleForm initialData={article} categories={categories || []} />
        </div>
      </main>
    </div>
  )
}