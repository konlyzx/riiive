'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

interface NavigationDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function NavigationDrawer({ isOpen, onClose }: NavigationDrawerProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    if (isOpen) {
      document.body.style.overflow = 'hidden'
      document.addEventListener('keydown', handleEscape)
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  return (
    <>
      {/* Backdrop overlay */}
      <div 
        className={`fixed inset-0 bg-black/80 backdrop-blur-md z-[100] transition-all duration-500 ease-in-out ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
        style={{ cursor: 'pointer' }}
      />
      
      {/* Drawer panel - fullscreen */}
      <div 
        className={`fixed inset-0 bg-black z-[101] transition-all duration-500 ${
          isOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
        }`}
        style={{ 
          transitionTimingFunction: isOpen ? 'cubic-bezier(0.16, 1, 0.3, 1)' : 'cubic-bezier(0.7, 0, 0.84, 0)'
        }}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-8 md:p-12">
            <h2 className="text-2xl md:text-4xl font-medium tracking-tight text-white uppercase" style={{ fontFamily: 'Anton, sans-serif' }}>Menu</h2>
            <button
              onClick={onClose}
              className="p-3 rounded-full bg-white/5 -mt-8 justify-center rounded-full px-4 py-2 text-white hover:bg-white/15 transition-all duration-300 border border-white/10 cursor-pointer"
              aria-label="Close navigation"
            >
              <X className="w-5 h-5 font-bold" />
            </button>
          </div>

          {/* Navigation links */}
          <nav className="flex-1 flex items-center justify-center pb-20 -mt-10 -ml-192 px-8 md:px-12" aria-label="Main navigation">
            <ul className="space-y-8 md:space-y-12 w-full max-w-2xl">
              <li>
                <a
                  href="/"
                  className="block text-4xl md:text-6xl font-normal tracking-tight text-white hover:text-white/80 transition-all duration-300 uppercase cursor-pointer"
                  style={{ fontFamily: 'Anton, sans-serif' }}
                  onClick={onClose}
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/showcase"
                  className="block text-4xl md:text-6xl font-normal tracking-tight text-white hover:text-white/80 transition-all duration-300 uppercase cursor-pointer"
                  style={{ fontFamily: 'Anton, sans-serif' }}
                  onClick={onClose}
                >
                  Showcase
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  className="block text-4xl md:text-6xl font-normal tracking-tight text-white hover:text-white/80 transition-all duration-300 uppercase cursor-pointer"
                  style={{ fontFamily: 'Anton, sans-serif' }}
                  onClick={onClose}
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="/docs"
                  className="block text-4xl md:text-6xl font-normal tracking-tight text-white hover:text-white/80 transition-all duration-300 uppercase cursor-pointer"
                  style={{ fontFamily: 'Anton, sans-serif' }}
                  onClick={onClose}
                >
                  Documentation
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="block text-4xl md:text-6xl font-normal tracking-tight text-white hover:text-white/80 transition-all duration-300 uppercase cursor-pointer"
                  style={{ fontFamily: 'Anton, sans-serif' }}
                  onClick={onClose}
                >
                  Contact
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  )
}
