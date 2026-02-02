
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ChatBot from './components/ChatBot';
import RegistrationForm from './components/RegistrationForm';
import AdminPublishModal from './components/AdminPublishModal';
import NewsDetailModal from './components/NewsDetailModal';
import { supabase, isSupabaseConfigured } from './supabaseClient';
import { 
  UNIVERSITY_NAME, 
  UNIVERSITY_ABBR, 
  CONTACT_PHONE, 
  CONTACT_EMAIL, 
  CONTACT_ADDRESS,
  FACULTIES, 
  ADVANTAGES, 
  ADMISSION_DOCS,
  HERO_BG_URL,
  TEAM,
  SOCIAL_FB,
  SOCIAL_LI,
  SOCIAL_X,
  SIGNATURE,
  INITIAL_NEWS
} from './constants';
import { NewsItem } from './types';
import { 
  Users, 
  Lightbulb, 
  Target, 
  ArrowRight, 
  Book, 
  BookOpen,
  MapPin, 
  Mail, 
  Phone,
  Facebook,
  Twitter,
  Linkedin,
  Calendar,
  RefreshCw,
  ChevronRight,
  FileCheck,
  Search,
  Inbox,
  Eye
} from 'lucide-react';

const App: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loadingNews, setLoadingNews] = useState(true);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    setLoadingNews(true);
    try {
      if (!isSupabaseConfigured()) {
        setNews(INITIAL_NEWS);
        setLoadingNews(false);
        return;
      }

      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('publish_date', { ascending: false });
      
      if (error) throw error;

      if (data && data.length > 0) {
        setNews(data.map(item => ({
          id: item.id,
          title: item.title,
          content: item.content,
          author: item.author || 'Direction UPG',
          category: item.category,
          date: new Date(item.publish_date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }),
          image: item.image_url || 'https://picsum.photos/id/24/800/600',
          views: item.views || 0
        })));
      } else {
        setNews(INITIAL_NEWS);
      }
    } catch (e: any) {
      console.warn("Erreur chargement news:", e.message);
      setNews(INITIAL_NEWS);
    } finally {
      setLoadingNews(false);
    }
  };

  const handleSelectNews = async (item: NewsItem) => {
    setSelectedNews(item);
    
    // Incrémentation des vues
    if (isSupabaseConfigured()) {
      try {
        await supabase.rpc('increment_news_views', { news_id: item.id });
        // Mise à jour locale immédiate pour l'UI
        setNews(prev => prev.map(n => n.id === item.id ? { ...n, views: (n.views || 0) + 1 } : n));
      } catch (err) {
        console.error("Erreur increment vues:", err);
      }
    }
  };

  const handlePublish = async (newItem: NewsItem) => {
    try {
      if (!isSupabaseConfigured()) return;
      const { error } = await supabase.from('news').insert([
        {
          title: newItem.title,
          content: newItem.content,
          author: newItem.author,
          category: newItem.category,
          image_url: newItem.image,
          publish_date: new Date().toISOString(),
          views: 0
        }
      ]);
      if (error) throw error;
      await fetchNews();
    } catch (e: any) {
      console.error("Erreur publication:", e.message);
      throw e;
    }
  };

  const filteredNews = news.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen font-sans transition-colors duration-300">
      <Navbar onOpenAdmin={() => setIsAdminModalOpen(true)} />
      
      {/* Hero Section */}
      <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={HERO_BG_URL} 
            alt="Campus UPG Background" 
            className="w-full h-full object-cover brightness-100 scale-100"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-upgBlue/60 via-black/10 to-upgBlue/90 dark:to-slate-950/95"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center text-white">
          <div className="mb-6 inline-block bg-upgGold text-upgBlue px-5 py-2 rounded-full font-bold text-xs tracking-[0.2em] animate-bounce shadow-lg">
            INSCRIPTIONS OUVERTES - SYSTÈME LMD {new Date().getFullYear()}
          </div>
          <h1 className="font-serif text-5xl md:text-8xl font-bold mb-6 leading-tight animate-in fade-in slide-in-from-bottom-8 duration-700 [text-shadow:_0_4px_8px_rgba(0,0,0,0.8)]">
            Forger l'Avenir par <br /> 
            <span className="text-upgGold italic font-light">l'Excellence Polytechnique</span>
          </h1>
          <p className="text-xl md:text-2xl mb-10 text-slate-100 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-10 delay-300 duration-700 font-light italic [text-shadow:_0_2px_4px_rgba(0,0,0,0.6)]">
            Une institution d'élite au cœur de Goma, dédiée à l'innovation technologique et au développement durable de la RD Congo.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-12 delay-500 duration-700">
            <a href="#registration" className="bg-upgGold text-upgBlue px-10 py-4 rounded-xl font-bold text-lg hover:bg-upgLightGold hover:scale-105 transition-all shadow-xl flex items-center gap-2 group">
              S'inscrire maintenant <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <a href="#news" className="bg-white/10 backdrop-blur-md border border-white/30 px-10 py-4 rounded-xl font-bold text-lg hover:bg-white/20 transition-all">
              Découvrir nos actualités
            </a>
          </div>
        </div>
      </section>

      {/* Highlights / Advantages Section */}
      <section className="py-20 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            {ADVANTAGES.map((adv, i) => (
              <div key={i} className="p-8 bg-slate-50 dark:bg-slate-950 rounded-3xl border border-transparent hover:border-upgGold/30 transition-all group">
                <div className="mb-6 bg-upgBlue/5 dark:bg-upgGold/10 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:bg-upgGold transition-colors">
                  <div className="group-hover:text-upgBlue transition-colors">{adv.icon}</div>
                </div>
                <h3 className="text-lg font-bold text-upgBlue dark:text-white mb-3 tracking-tight">{adv.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{adv.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-white dark:bg-slate-950 hero-pattern">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-block bg-upgBlue/5 dark:bg-upgGold/5 text-upgBlue dark:text-upgGold px-4 py-2 rounded-lg font-bold text-sm tracking-widest uppercase">Identité Institutionnelle</div>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-upgBlue dark:text-white leading-tight">Une Histoire d'Excellence et de Vision Technologique</h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                Située à Goma, dans la province du Nord‑Kivu en République démocratique du Congo, l’Université Polytechnique de Goma (UPG) est une institution d’enseignement supérieur tournée vers l’excellence technique, scientifique et sociale. Née d’une vision ambitieuse de formation des futurs bâtisseurs de la RD Congo, l’UPG allie rigueur académique, innovation pratique et impact sur le développement local. L’UPG se distingue par une pédagogie dynamique : elle met l’accent sur des compétences pratiques, l’innovation technologique et la capacité à apporter des solutions concrètes aux défis socio‑économiques de la région. L’université forme des professionnels compétents dans les domaines des sciences appliquées, de l’ingénierie, des technologies de l’information et de la gestion des infrastructures, ainsi que dans d’autres filières techniques essentielles pour le progrès technologique et industriel du pays.

Forte d’un environnement d’apprentissage innovant et inclusif, l’UPG encourage les étudiants à se réinventer, à penser de manière critique et à exploiter pleinement les nouvelles technologies pour relever les défis actuels et futurs. L’université se veut un véritable carrefour d’innovation et de créativité, contribuant non seulement à la formation de cadres compétents, mais aussi à l’optimisation du capital humain au service du développement durable de la RD Congo..
              </p>
              
              <div className="grid sm:grid-cols-2 gap-8">
                <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl border-l-4 border-upgGold shadow-sm">
                  <div className="flex items-center gap-3 mb-3 text-upgBlue dark:text-white">
                    <Target size={24} className="text-upgGold" /> <h3 className="font-bold">Notre Mission</h3>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Former des cadres compétents et innovateurs capables de transformer les défis en opportunités de développement.</p>
                </div>
                <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl border-l-4 border-upgGold shadow-sm">
                  <div className="flex items-center gap-3 mb-3 text-upgBlue dark:text-white">
                    <Lightbulb size={24} className="text-upgGold" /> <h3 className="font-bold">Notre Vision</h3>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Devenir le pôle d'excellence de référence en ingénierie et sciences appliquées en Afrique Centrale.</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <img src="https://picsum.photos/id/442/800/600" alt="Student studying" className="rounded-3xl shadow-2xl relative z-10 brightness-90 dark:brightness-75" />
              <div className="absolute -bottom-6 -right-6 w-64 h-64 bg-upgGold rounded-3xl -z-0 opacity-20 dark:opacity-10"></div>
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-upgBlue dark:bg-upgGold rounded-3xl -z-0 opacity-10 dark:opacity-5"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Programme Section */}
      <section id="lmd" className="py-24 bg-upgBlue dark:bg-slate-950 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10"><BookOpen size={400} /></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold mb-4">Système LMD</h2>
            <div className="w-24 h-1 bg-upgGold mx-auto"></div>
            <p className="mt-6 text-slate-300 max-w-2xl mx-auto italic">Aligné sur les standards internationaux pour une mobilité et une reconnaissance mondiale de nos diplômes.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="p-10 bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10">
              <div className="text-5xl font-serif font-bold text-upgGold mb-4">L</div>
              <h3 className="text-xl font-bold mb-4 uppercase tracking-widest">Licence</h3>
              <p className="text-sm text-slate-400">3 Ans (Bac +3) - Acquisition des fondamentaux et spécialisation initiale.</p>
            </div>
            <div className="p-10 bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10">
              <div className="text-5xl font-serif font-bold text-upgGold mb-4">M</div>
              <h3 className="text-xl font-bold mb-4 uppercase tracking-widest">Master</h3>
              <p className="text-sm text-slate-400">2 Ans (Bac +5) - Expertise approfondie et initiation à la recherche.</p>
            </div>
            <div className="p-10 bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10">
              <div className="text-5xl font-serif font-bold text-upgGold mb-4">D</div>
              <h3 className="text-xl font-bold mb-4 uppercase tracking-widest">Doctorat</h3>
              <p className="text-sm text-slate-400">3 Ans (Bac +8) - Recherche originale et contribution scientifique majeure.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Faculties Section */}
      <section id="faculties" className="py-24 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-upgBlue dark:text-white mb-4">Nos Domaines de Formation</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">Des programmes conçus pour répondre aux besoins réels du marché de l'emploi et aux enjeux de développement.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FACULTIES.map((faculty) => (
              <div key={faculty.id} className="bg-white dark:bg-slate-950 p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all border border-slate-100 dark:border-slate-800 group">
                <div className="flex justify-between items-start mb-6">
                  <div className="bg-upgBlue/5 dark:bg-upgGold/10 p-4 rounded-2xl text-upgBlue dark:text-upgGold group-hover:bg-upgBlue group-hover:text-white transition-all">
                    <Book size={28} />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-upgBlue dark:text-white mb-4 uppercase tracking-tight">{faculty.name}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">{faculty.description}</p>
                <div className="space-y-2">
                  <div className="text-[10px] font-bold text-upgGold uppercase tracking-widest mb-2">Départements</div>
                  {faculty.departments.map((dept, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 font-medium">
                      <ChevronRight size={12} className="text-upgGold" /> {dept}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-24 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-serif font-bold text-upgBlue dark:text-white mb-4">Autorités Académiques</h2>
          <div className="w-24 h-1 bg-upgGold mx-auto mb-16"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
            {TEAM.map((member, i) => (
              <div key={i} className="group">
                <div className="relative mb-6 mx-auto w-40 h-40">
                  <div className="absolute inset-0 bg-upgGold rounded-full -rotate-6 scale-95 opacity-20 group-hover:rotate-6 transition-transform"></div>
                  <div className="relative w-full h-full rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden border-2 border-upgGold/20 group-hover:border-upgGold transition-colors">
                    <Users size={64} className="text-slate-300 dark:text-slate-600" />
                  </div>
                </div>
                <h4 className="font-bold text-upgBlue dark:text-white text-sm uppercase tracking-tight leading-tight mb-1">{member.name}</h4>
                <p className="text-xs text-upgGold font-bold uppercase tracking-widest mb-3">{member.role}</p>
                <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex p-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-upgBlue dark:text-upgGold hover:bg-upgGold hover:text-upgBlue transition-all">
                  <Linkedin size={16} />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* News Section */}
      <section id="news" className="py-24 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
            <div>
              <h2 className="text-4xl font-serif font-bold text-upgBlue dark:text-white mb-4">Dernières Nouvelles</h2>
              <div className="w-24 h-1 bg-upgGold mb-6"></div>
            </div>
            
            <div className="flex flex-1 max-w-xl items-center gap-3 w-full">
              <div className="relative flex-1 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-upgGold transition-colors" size={18} />
                <input 
                  type="text" 
                  placeholder="Rechercher un communiqué..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-upgGold/30 dark:text-white text-sm transition-all shadow-sm"
                />
              </div>
              <button 
                onClick={fetchNews}
                className="p-3.5 bg-white dark:bg-slate-800 rounded-2xl text-slate-600 dark:text-slate-300 hover:text-upgGold transition-all border border-slate-200 dark:border-slate-700 shadow-sm active:scale-95"
                title="Actualiser les news"
              >
                <RefreshCw size={20} className={loadingNews ? "animate-spin" : ""} />
              </button>
            </div>
          </div>

          {filteredNews.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredNews.map((item) => (
                <div key={item.id} className="bg-white dark:bg-slate-950 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-slate-100 dark:border-slate-800 flex flex-col group animate-in fade-in duration-500">
                  <div className="relative h-56 overflow-hidden">
                    <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={item.title} />
                    <div className="absolute top-4 left-4 bg-upgGold text-upgBlue px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">{item.category}</div>
                    
                    {/* Badge de vues en temps réel */}
                    <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 shadow-lg border border-white/10">
                      <Eye size={12} className="text-upgGold" /> {item.views || 0} vues
                    </div>
                  </div>
                  <div className="p-8 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 text-slate-400 text-xs mb-4">
                      <Calendar size={14} /> {item.date}
                    </div>
                    <h3 className="text-xl font-bold text-upgBlue dark:text-white mb-4 leading-tight">{item.title}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 flex-1 line-clamp-3 leading-relaxed">{item.content}</p>
                    <button 
                      onClick={() => handleSelectNews(item)}
                      className="text-upgGold font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:gap-4 transition-all"
                    >
                      En savoir plus <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center space-y-4 animate-in fade-in zoom-in-95 duration-300">
              <div className="bg-slate-100 dark:bg-slate-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Inbox size={40} className="text-slate-400" />
              </div>
              <h3 className="text-xl font-bold text-upgBlue dark:text-white">Aucun résultat pour "{searchQuery}"</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Essayez d'autres mots-clés ou vérifiez l'orthographe.</p>
              <button 
                onClick={() => setSearchQuery('')}
                className="text-upgGold font-bold text-xs uppercase tracking-widest hover:underline"
              >
                Réinitialiser la recherche
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Inscription Section */}
      <section id="registration" className="py-24 bg-white dark:bg-slate-950 hero-pattern border-t border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-16">
            <div className="lg:col-span-1 space-y-8">
              <div className="inline-block bg-upgGold text-upgBlue px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-widest shadow-sm">Processus d'Admission</div>
              <h2 className="text-4xl font-serif font-bold text-upgBlue dark:text-white uppercase">Rejoignez l'élite</h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed italic border-l-4 border-upgGold pl-6">
                "L'éducation est l'arme la plus puissante pour changer le monde." - Nelson Mandela
              </p>
              
              <div className="space-y-4 pt-6">
                <h4 className="font-bold text-upgBlue dark:text-white uppercase text-sm tracking-widest mb-4">Pièces à fournir (Format PDF) :</h4>
                {ADMISSION_DOCS.map((doc, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-tighter bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                    <FileCheck className="text-upgGold flex-shrink-0" size={16} /> {doc}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="lg:col-span-2">
              <RegistrationForm />
            </div>
          </div>
        </div>
      </section>

      {/* Footer & Contact */}
      <footer id="contact" className="bg-upgBlue dark:bg-slate-950 text-white pt-24 pb-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="space-y-6">
              <div className="text-4xl font-bold tracking-tighter text-upgGold">UPG</div>
              <p className="text-sm text-slate-400 leading-relaxed italic">
                "Forger l'avenir par l'excellence polytechnique au service de la nation congolaise."
              </p>
              <div className="flex gap-4">
                <a href={SOCIAL_FB} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 rounded-xl hover:bg-upgGold hover:text-upgBlue transition-all border border-white/5"><Facebook size={20} /></a>
                <a href={SOCIAL_X} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 rounded-xl hover:bg-upgGold hover:text-upgBlue transition-all border border-white/5"><Twitter size={20} /></a>
                <a href={SOCIAL_LI} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 rounded-xl hover:bg-upgGold hover:text-upgBlue transition-all border border-white/5"><Linkedin size={20} /></a>
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-6 border-b border-upgGold/30 pb-2 uppercase tracking-widest text-sm text-upgGold">Navigation</h4>
              <ul className="space-y-4 text-[11px] text-slate-400 font-bold uppercase tracking-widest">
                <li><a href="#about" className="hover:text-upgGold transition-colors">Institution</a></li>
                <li><a href="#news" className="hover:text-upgGold transition-colors">Actualités</a></li>
                <li><a href="#faculties" className="hover:text-upgGold transition-colors">Nos Facultés</a></li>
                <li><a href="#team" className="hover:text-upgGold transition-colors">Rectorat</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-6 border-b border-upgGold/30 pb-2 uppercase tracking-widest text-sm text-upgGold">Facultés</h4>
              <ul className="space-y-4 text-[11px] text-slate-400 font-bold uppercase tracking-tighter">
                {FACULTIES.slice(0, 4).map(f => (
                  <li key={f.id}>{f.name}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-6 border-b border-upgGold/30 pb-2 uppercase tracking-widest text-sm text-upgGold">Siège Social</h4>
              <ul className="space-y-4 text-xs font-medium">
                <li className="flex items-start gap-3">
                  <MapPin className="text-upgGold flex-shrink-0" size={16} />
                  <span className="text-slate-400 leading-relaxed">{CONTACT_ADDRESS}</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="text-upgGold flex-shrink-0" size={16} />
                  <span className="text-slate-400 font-bold tracking-widest">{CONTACT_PHONE}</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="text-upgGold flex-shrink-0" size={16} />
                  <span className="text-slate-400 font-bold">{CONTACT_EMAIL}</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/5 pt-12 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-slate-500 uppercase tracking-[0.4em] font-bold">
            <div>&copy; {new Date().getFullYear()} {UNIVERSITY_NAME}. Tout Droit Réservé.</div>
            <div className="text-upgGold/40 hover:text-upgGold transition-colors tracking-[0.5em] cursor-default">{SIGNATURE}</div>
          </div>
        </div>
      </footer>

      <AdminPublishModal 
        isOpen={isAdminModalOpen} 
        onClose={() => setIsAdminModalOpen(false)} 
        onPublish={handlePublish}
      />

      <NewsDetailModal 
        news={selectedNews} 
        onClose={() => setSelectedNews(null)} 
      />

      <ChatBot />
    </div>
  );
};

export default App;