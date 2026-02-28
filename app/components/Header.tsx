"use client"

import Image from 'next/image'
import Link from 'next/link'
import Button from './ui/Button'
import React, { useState } from 'react'

export default function Header(){
  const [open, setOpen] = useState(false)

  return (
    <header className="w-full sticky top-0 z-40 px-10 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="container-center py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-3">
              <Image src="/logo.svg" alt="logo" width={44} height={44} />
              <span className="font-semibold text-lg text-gray-900">Teja Software Solution</span>
            </Link>
            <nav className="hidden lg:flex items-center gap-6 text-sm text-gray-700">
              <Link href="#features" className="px-3 py-2 rounded hover:bg-gray-100">Features</Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <nav className="hidden md:flex items-center gap-4">
              <Link href="/login"><Button width="md">Login</Button></Link>
            </nav>

            <button aria-label="Toggle menu" onClick={() => setOpen(!open)} className="md:hidden p-2 rounded-lg hover:bg-gray-100">
              {open ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-700"><path d="M6 18L18 6M6 6l12 12" /></svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-700"><path d="M3 12h18M3 6h18M3 18h18"></path></svg>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className={`md:hidden ${open ? 'block' : 'hidden'}`}>
        <div className="px-4 pt-3 pb-5 border-t border-gray-100 bg-white">
          <div className="flex flex-col gap-2">
            <Link href="#features" className="py-2 px-3 rounded hover:bg-gray-50">Features</Link>
            <Link href="#how" className="py-2 px-3 rounded hover:bg-gray-50">How it works</Link>
            <Link href="/login" className="mt-2">
              <Button width="full">Login</Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
