export const runtime = 'edge';

import { createClient } from '@/lib/supabase/server' 
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Calendar, Tag, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'

export const revalidate = 60

// 1. params を Promise 型に変更
interface ArticlePageProps {
  params: Promise<{ id: string }>
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  // 2. params を await して id を取得
  const { id } = await params
  const supabase = await createClient()

  const { data: article } = await supabase
    .from('articles')
    .select('*')
    .eq('id', id) // ここに await した id を使う
    // 公開済みの記事のみを表示（管理画面からのプレビューも兼ねるならここを調整）
    .eq('status', 'published') 
    .single()

  if (!article) {
    notFound()
  }

  const formattedDate = new Date(article.updated_at).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      {/* 戻るボタン */}
      <Link 
        href="/articles" 
        className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors mb-8 group"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        記事一覧に戻る
      </Link>

      {/* サムネイル */}
      {article.thumbnail && (
        <div className="relative w-full aspect-video bg-gray-800 rounded-2xl overflow-hidden mb-10 shadow-2xl">
          <Image
            src={article.thumbnail}
            alt={article.title}
            fill
            className="object-cover"
            priority // 記事のメイン画像なので優先読み込み
          />
        </div>
      )}

      {/* メタ情報 */}
      <div className="flex flex-wrap items-center gap-4 mb-6 text-sm">
        <div className="flex items-center gap-2 px-3 py-1 bg-purple-500/10 text-purple-400 rounded-full border border-purple-500/20">
          <Tag size={14} />
          <span className="font-medium">{article.category || 'カテゴリなし'}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-400">
          <Calendar size={14} />
          <time dateTime={article.updated_at}>{formattedDate}</time>
        </div>
      </div>

      {/* タイトル */}
      <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-white leading-tight">
        {article.title}
      </h1>

      {/* 概要 */}
      {article.excerpt && (
        <p className="text-xl text-gray-400 mb-10 leading-relaxed italic border-l-4 border-gray-700 pl-6">
          {article.excerpt}
        </p>
      )}

      {/* 本文 */}
      <div className="prose prose-invert prose-lg max-w-none prose-headings:text-white prose-a:text-purple-400 prose-code:text-purple-300">
        <ReactMarkdown
          components={{
            h1: ({ ...props }) => <h1 className="text-3xl font-bold mt-12 mb-6 pb-2 border-b border-gray-800" {...props} />,
            h2: ({ ...props }) => <h2 className="text-2xl font-bold mt-10 mb-4 text-purple-100" {...props} />,
            h3: ({ ...props }) => <h3 className="text-xl font-bold mt-8 mb-3 text-white" {...props} />,
            p: ({ ...props }) => <p className="mb-6 leading-8 text-gray-300" {...props} />,
            ul: ({ ...props }) => <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-300" {...props} />,
            ol: ({ ...props }) => <ol className="list-decimal pl-6 mb-6 space-y-2 text-gray-300" {...props} />,
            code: ({ inline, ...props }: any) => 
              inline ? (
                <code className="bg-gray-800/50 px-1.5 py-0.5 rounded text-purple-300 font-mono text-sm" {...props} />
              ) : (
                <div className="relative my-8">
                  <div className="absolute top-0 right-0 px-4 py-1 text-xs font-mono text-gray-500 bg-gray-800/80 rounded-bl-lg rounded-tr-lg">code</div>
                  <pre className="bg-gray-900 border border-gray-800 p-6 rounded-xl overflow-x-auto shadow-inner font-mono text-sm leading-6" {...props} />
                </div>
              ),
            blockquote: ({ ...props }) => (
              <blockquote className="border-l-4 border-purple-500 bg-purple-500/5 px-6 py-4 italic text-gray-300 rounded-r-lg my-8" {...props} />
            ),
            a: ({ ...props }) => (
              <a className="text-purple-400 hover:text-purple-300 underline underline-offset-4 decoration-2 transition-colors font-medium" {...props} />
            ),
          }}
        >
          {article.content}
        </ReactMarkdown>
      </div>
    </article>
  )
}