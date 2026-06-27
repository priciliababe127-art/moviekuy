'use client';
import { useState, useEffect } from 'react';

interface BookmarkProps {
  id: string;
  title: string;
  poster: string;
  type: 'movie' | 'tv';
}

export default function BookmarkButton({ id, title, poster, type }: BookmarkProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Cek apakah sudah di-bookmark saat komponen dimuat
  useEffect(() => {
    const bookmarks = JSON.parse(localStorage.getItem('moviekuy_bookmarks') || '[]');
    setIsBookmarked(bookmarks.some((m: any) => m.id === id));
  }, [id]);

  const toggleBookmark = () => {
    const bookmarks = JSON.parse(localStorage.getItem('moviekuy_bookmarks') || '[]');
    
    if (isBookmarked) {
      const newBookmarks = bookmarks.filter((m: any) => m.id !== id);
      localStorage.setItem('moviekuy_bookmarks', JSON.stringify(newBookmarks));
      setIsBookmarked(false);
    } else {
      bookmarks.push({ id, title, poster, type });
      localStorage.setItem('moviekuy_bookmarks', JSON.stringify(bookmarks));
      setIsBookmarked(true);
    }
  };

  return (
    <button 
      onClick={toggleBookmark}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-xs transition ${
        isBookmarked ? 'bg-amber-500/20 text-amber-500 border border-amber-500/50' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
      }`}
    >
      {isBookmarked ? '★ Disimpan' : '☆ Simpan ke Favorit'}
    </button>
  );
}