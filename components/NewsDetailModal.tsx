
import React from 'react';
import { X, Calendar, Tag, ChevronRight, User, Award, Share2, Facebook, Linkedin, MessageCircle, Eye } from 'lucide-react';
import { NewsItem } from '../types';

interface NewsDetailModalProps {
  news: NewsItem | null;
  onClose: () => void;
}

const NewsDetailModal: React.FC<NewsDetailModalProps> = ({ news, onClose }) => {
  if (!news) return null;

  const shareUrl = window.location.href;
  const shareText = `Découvrez cette actualité de l'UPG : ${news.title}`;

  const shareLinks = {
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    x: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
  };

  const renderEnrichedContent = (content: string) => {
    let html = content
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-900 dark:text-white">$1</strong>')
      .replace(/### (.*?)\n/g, '<h3 class="text-xl md:text-2xl font-serif font-bold text-upgBlue dark:text-upgGold mt-8 mb-4 border-l-4 border-upgGold pl-4">$1</h3>')
      .replace(/<u>(.*?)<\/u>/g, '<u class="decoration-upgGold decoration-2 underline-offset-4">$1</u>');

    return (
      <div 
        className="text-slate-600 dark:text-slate-300 text-base md:text-lg leading-relaxed whitespace-pre-wrap font-sans space-y-4"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-upgBlue/90 backdrop-blur-md animate-in fade-in duration-300">
      <div 
        className="bg-white dark:bg-slate-900 w-full max-w-4xl max-h-[95vh] rounded-3xl shadow-2xl overflow-y-auto border border-slate-100 dark:border-slate-800 animate-in zoom-in-95 duration-300 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Image Container - Intégré dans le défilement parent */}
        <div className="relative w-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden min-h-[300px] md:min-h-[400px]">
          {/* Blurred Background */}
          <img 
            src={news.image || 'https://picsum.photos/id/24/800/600'} 
            alt="" 
            className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-30"
          />
          {/* Main Image */}
          <img 
            src={news.image || 'https://picsum.photos/id/24/800/600'} 
            alt={news.title} 
            className="relative z-10 max-w-full max-h-[400px] object-contain shadow-2xl"
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-20"></div>
          
          {/* Bouton de fermeture STICKY pour rester accessible même si l'image remonte */}
          <button 
            onClick={onClose}
            className="fixed top-8 right-8 md:top-12 md:right-12 p-2 bg-upgBlue/40 hover:bg-upgGold backdrop-blur-md text-white rounded-full transition-all z-[110] shadow-lg border border-white/20"
          >
            <X size={24} />
          </button>
          
          <div className="absolute bottom-6 left-6 right-6 z-30">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="bg-upgGold text-upgBlue px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] shadow-lg">
                {news.category}
              </span>
              <span className="flex items-center gap-1.5 text-white/90 text-xs font-bold uppercase tracking-widest">
                <Calendar size={14} className="text-upgGold" /> {news.date}
              </span>
              {/* Compteur de vues dans le modal */}
              <span className="flex items-center gap-1.5 text-white/90 text-xs font-bold uppercase tracking-widest bg-black/30 px-3 py-1 rounded-full backdrop-blur-sm">
                <Eye size={14} className="text-upgGold" /> {news.views || 0} vues
              </span>
            </div>
            <h2 className="text-2xl md:text-4xl font-serif font-bold text-white leading-tight drop-shadow-xl">
              {news.title}
            </h2>
          </div>
        </div>

        {/* Content Container - Défile naturellement avec le parent */}
        <div className="p-6 md:p-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-upgBlue/5 dark:bg-upgGold/10 flex items-center justify-center text-upgBlue dark:text-upgGold border border-upgGold/20">
                <Award size={24} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Communiqué signé par</p>
                <h4 className="font-bold text-upgBlue dark:text-white uppercase tracking-tight">{news.author}</h4>
              </div>
            </div>

            {/* Quick Share Buttons */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mr-2 flex items-center gap-1">
                <Share2 size={12} /> Partager :
              </span>
              <a href={shareLinks.whatsapp} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-green-500 text-white rounded-xl hover:scale-110 transition-transform shadow-md" title="Partager sur WhatsApp">
                <MessageCircle size={18} />
              </a>
              <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-blue-600 text-white rounded-xl hover:scale-110 transition-transform shadow-md" title="Partager sur Facebook">
                <Facebook size={18} />
              </a>
              <a href={shareLinks.x} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-slate-900 text-white rounded-xl hover:scale-110 transition-transform shadow-md" title="Partager sur X">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a href={shareLinks.linkedin} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-blue-700 text-white rounded-xl hover:scale-110 transition-transform shadow-md" title="Partager sur LinkedIn">
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {renderEnrichedContent(news.content)}
          
          <div className="mt-16 pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">
              <Tag size={14} className="text-upgGold" /> Document Officiel UPG
            </div>
            <button 
              onClick={onClose}
              className="bg-upgBlue dark:bg-upgGold text-white dark:text-upgBlue px-10 py-4 rounded-2xl font-bold text-sm transition-all hover:scale-105 active:scale-95 flex items-center gap-3 shadow-xl tracking-widest uppercase"
            >
              Terminer la lecture <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsDetailModal;