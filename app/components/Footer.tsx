import React from 'react'
import Link from 'next/link'

export default function Footer(){
  return (
    <footer className="mt-12 border-t border-gray-100 bg-white">
      <div className="container-center py-12 text-sm text-gray-600">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img src="/logo.svg" alt="logo" className="w-10 h-10 rounded" />
            <div>
              <div className="font-semibold text-gray-900">Teja Software</div>
              <div className="text-xs text-gray-500">© {new Date().getFullYear()}</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <a href="https://twitter.com/" aria-label="twitter" className="text-gray-500 hover:text-gray-700">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className=""><path d="M22 5.92c-.66.29-1.36.5-2.1.59.76-.46 1.35-1.18 1.63-2.04-.71.42-1.5.73-2.34.9A3.48 3.48 0 0 0 12.8 8.5c0 .28.03.56.1.82-2.89-.14-5.45-1.53-7.16-3.64-.3.5-.47 1.08-.47 1.7 0 1.17.6 2.2 1.52 2.8-.56-.02-1.09-.17-1.55-.43v.04c0 1.64 1.17 3.01 2.72 3.33-.28.07-.57.11-.87.11-.21 0-.41-.02-.61-.06.42 1.3 1.65 2.25 3.1 2.28A6.99 6.99 0 0 1 3 19.54a9.9 9.9 0 0 0 5.36 1.57c6.43 0 9.95-5.33 9.95-9.95v-.45c.67-.47 1.24-1.06 1.7-1.73-.62.28-1.27.48-1.95.56z"/></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
