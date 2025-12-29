import Link from 'next/link'
import { Home, FileText, Info, Twitch, Twitter, Youtube } from 'lucide-react'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* ヘッダー */}
      <header className="border-b border-gray-800 bg-gray-900/95 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link 
              href="/" 
              className="text-xl font-bold text-purple-400 hover:text-purple-300 transition-colors"
            >
              げんのすけの秘密基地
            </Link>
            
            <nav className="flex items-center gap-6">
              <Link 
                href="/" 
                className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
              >
                <Home size={18} />
                <span className="hidden sm:inline">Home</span>
              </Link>
              <Link 
                href="/articles" 
                className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
              >
                <FileText size={18} />
                <span className="hidden sm:inline">Articles</span>
              </Link>
              <Link 
                href="/about" 
                className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
              >
                <Info size={18} />
                <span className="hidden sm:inline">About</span>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      {/* フッター */}
      <footer className="border-t border-gray-800 bg-gray-900/95 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © 2025 げんのすけの秘密基地. All rights reserved.
            </p>
            
            <div className="flex items-center gap-4">
              <a 
                href="https://twitch.tv/gensukettv" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-purple-400 transition-colors"
                aria-label="Twitch"
              >
                <Twitch size={20} />
              </a>
              <a 
                href="https://twitter.com/tw_gen1203" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a 
                href="https://youtube.com/@gen11120" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-red-400 transition-colors"
                aria-label="YouTube"
              >
                <Youtube size={20} />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}