'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useDrumSounds } from '@react-midi/sounds'

const drumMapping = {
  'q': 42, // Closed Hi-hat
  'w': 49, // Crash Cymbal 1
  'e': 51, // Ride Cymbal 1
  'a': 38, // Snare Drum 1
  's': 45, // Low Tom
  'd': 43, // High Floor Tom
  'z': 35, // Acoustic Bass Drum
  'x': 36, // Bass Drum 1
}

const DrumPad = ({ letter, note, position, size, color, borderColor, onClick }) => (
  <motion.div
    className={`absolute ${position} ${size} ${color} rounded-full flex items-center justify-center border-4 ${borderColor} cursor-pointer`}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={() => onClick(note)}
    role="button"
    aria-label={`${letter.toUpperCase()} - ${Object.keys(drumMapping).find(key => drumMapping[key] === note)}`}
  >
    <span className="text-2xl font-bold">{letter.toUpperCase()}</span>
  </motion.div>
)

export default function RealisticDrumKit() {
  const [activeKey, setActiveKey] = useState(null)
  const { play } = useDrumSounds()

  const playSound = useCallback((note) => {
    play(note)
  }, [play])

  useEffect(() => {
    const handleKeyDown = (event) => {
      const key = event.key.toLowerCase()
      if (key in drumMapping) {
        setActiveKey(key)
        playSound(drumMapping[key])
        setTimeout(() => setActiveKey(null), 100)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [playSound])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-4">
      <h1 className="text-4xl font-bold mb-8 text-center">Batería Virtual Ultra Realista</h1>
      <div className="relative w-[700px] h-[500px] bg-gradient-to-br from-gray-700 to-gray-600 rounded-3xl shadow-2xl p-8" role="region" aria-label="Batería virtual">
        {/* Platillos */}
        <DrumPad letter="q" note={drumMapping['q']} position="top-4 left-4" size="w-28 h-28" color="bg-yellow-600" borderColor="border-yellow-700" onClick={playSound} />
        <DrumPad letter="w" note={drumMapping['w']} position="top-4 right-4" size="w-32 h-32" color="bg-yellow-600" borderColor="border-yellow-700" onClick={playSound} />
        <DrumPad letter="e" note={drumMapping['e']} position="top-1/4 right-4" size="w-36 h-36" color="bg-yellow-600" borderColor="border-yellow-700" onClick={playSound} />

        {/* Tambores */}
        <DrumPad letter="a" note={drumMapping['a']} position="top-1/2 left-1/4" size="w-32 h-32" color="bg-white" borderColor="border-gray-300" onClick={playSound} />
        <DrumPad letter="s" note={drumMapping['s']} position="bottom-16 left-16" size="w-28 h-28" color="bg-red-600" borderColor="border-red-700" onClick={playSound} />
        <DrumPad letter="d" note={drumMapping['d']} position="bottom-16 right-16" size="w-28 h-28" color="bg-blue-600" borderColor="border-blue-700" onClick={playSound} />

        {/* Bombo */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-56 h-56 bg-gradient-to-br from-black to-gray-800 rounded-full flex items-center justify-center border-8 border-gray-700 shadow-lg" role="button" aria-label="Bombo (Teclas Z/X)">
          <span className="text-3xl font-bold">Z/X</span>
        </div>

        {/* Baquetas */}
        <motion.div
          className="absolute bottom-full left-1/4 w-3 h-64 bg-gradient-to-b from-yellow-700 to-yellow-600 rounded-full origin-bottom"
          animate={{ 
            rotate: activeKey === 'q' ? -30 : 
                    activeKey === 'w' ? -15 : 
                    activeKey === 'e' ? 0 : -5,
            height: activeKey === 'q' || activeKey === 'w' || activeKey === 'e' ? 240 : 256
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
          style={{ boxShadow: '0 0 10px rgba(0,0,0,0.5)' }}
          aria-hidden="true"
        />
        <motion.div
          className="absolute bottom-full right-1/4 w-3 h-64 bg-gradient-to-b from-yellow-700 to-yellow-600 rounded-full origin-bottom"
          animate={{ 
            rotate: activeKey === 'q' ? 30 : 
                    activeKey === 'w' ? 15 : 
                    activeKey === 'e' ? 0 : 5,
            height: activeKey === 'q' || activeKey === 'w' || activeKey === 'e' ? 240 : 256
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
          style={{ boxShadow: '0 0 10px rgba(0,0,0,0.5)' }}
          aria-hidden="true"
        />

        {/* Pedales */}
        <motion.div
          className="absolute -bottom-4 left-1/3 w-20 h-6 bg-gradient-to-b from-gray-400 to-gray-500 rounded-t-lg origin-bottom"
          animate={{ rotateX: activeKey === 'z' ? 45 : 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
          style={{ boxShadow: '0 -5px 10px rgba(0,0,0,0.3)' }}
          aria-hidden="true"
        />
        <motion.div
          className="absolute -bottom-4 right-1/3 w-20 h-6 bg-gradient-to-b from-gray-400 to-gray-500 rounded-t-lg origin-bottom"
          animate={{ rotateX: activeKey === 'x' ? 45 : 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
          style={{ boxShadow: '0 -5px 10px rgba(0,0,0,0.3)' }}
          aria-hidden="true"
        />

        {/* Soporte de platillos */}
        <div className="absolute top-0 left-16 w-2 h-40 bg-gradient-to-b from-gray-300 to-gray-400 transform -rotate-15" aria-hidden="true" />
        <div className="absolute top-0 right-20 w-2 h-48 bg-gradient-to-b from-gray-300 to-gray-400 transform rotate-15" aria-hidden="true" />
        <div className="absolute top-20 right-8 w-2 h-56 bg-gradient-to-b from-gray-300 to-gray-400" aria-hidden="true" />
      </div>
      <p className="mt-8 text-lg text-center">Presiona las teclas Q, W, E, A, S, D para los tambores y platillos, Z y X para el doble pedal</p>
    </div>
  )
}