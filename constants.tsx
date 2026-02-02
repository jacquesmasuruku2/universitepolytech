
import React from 'react';
import { BookOpen, ShieldCheck, Cpu, Briefcase, HeartPulse, Sprout, Globe, GraduationCap } from 'lucide-react';
import { Faculty, NavItem, NewsItem } from './types';

export const UNIVERSITY_NAME = "Université Polytechnique de Goma";
export const UNIVERSITY_ABBR = "UPG";
export const CONTACT_PHONE = "+243973380118";
export const CONTACT_EMAIL = "info@upgoma.org";
export const CONTACT_ADDRESS = "Goma, Quartier Lac Vert Avenue Nyarutsiru Avant entrée Buhimba";

export const LOGO_URL = "https://tlidmidccmqotuqmcydq.supabase.co/storage/v1/object/public/Logo%20UPG/logo%20upg.png";
export const HERO_BG_URL = "https://tlidmidccmqotuqmcydq.supabase.co/storage/v1/object/public/Public%20bucket/IMG_20251107_133323.jpg";

export const SOCIAL_FB = "https://web.facebook.com/upgoma/?locale=fr_FR&_rdc=1&_rdr#";
export const SOCIAL_X = "https://x.com/UP_Goma";
export const SOCIAL_LI = "https://www.linkedin.com/company/universit%C3%A9-polytechnique-de-goma/posts/?feedView=all";

export const SIGNATURE = "designed by UPG 2026";

export const NAV_ITEMS: NavItem[] = [
  { label: "Accueil", href: "#home" },
  { label: "À propos", href: "#about" },
  { label: "Actualités", href: "#news" },
  { label: "Programme", href: "#lmd" },
  { label: "Facultés", href: "#faculties" },
  { label: "Équipe", href: "#team" },
  { label: "Contact", href: "#contact" }
];

export const INITIAL_NEWS: NewsItem[] = [
  {
    id: '1',
    title: "Ouverture des inscriptions 2025-2026",
    date: "15 Oct 2025",
    category: "Annonce",
    // Fix: Added required 'author' property
    author: "Admin UPG",
    content: "L'UPG annonce l'ouverture officielle du portail d'inscription pour l'année académique 2025-2026. Tous les bacheliers sont invités à postuler dès maintenant.",
    image: "https://picsum.photos/id/119/800/600"
  },
  {
    id: '2',
    title: "Conférence sur l'Intelligence Artificielle",
    date: "10 Nov 2025",
    category: "Événement",
    // Fix: Added required 'author' property
    author: "Admin UPG",
    content: "Une journée d'échange sur l'impact de l'IA dans le génie civil et l'agronomie se tiendra dans l'amphithéâtre de l'UPG.",
    image: "https://picsum.photos/id/201/800/600"
  },
  {
    id: '3',
    title: "Nouveau Laboratoire de Polytechnique",
    date: "05 Dec 2025",
    category: "Actualité",
    // Fix: Added required 'author' property
    author: "Admin UPG",
    content: "L'UPG s'équipe de nouveaux matériels de pointe pour son département de Génie Électrique, renforçant sa position de leader technologique.",
    image: "https://picsum.photos/id/2/800/600"
  }
];

export const TEAM = [
  { 
    name: "Jean de Dieu MUTABAZI MUNGUIKO", 
    role: "Recteur", 
    linkedin: "https://www.linkedin.com/search/results/all/?keywords=Jean%20de%20Dieu%20MUTABAZI%20MUNGUIKO" 
  },
  { 
    name: "André MUSAVULI BALIKWISHA", 
    role: "Secrétaire Général Académique", 
    linkedin: "https://www.linkedin.com/search/results/all/?keywords=André%20MUSAVULI%20BALIKWISHA" 
  },
  { 
    name: "Claver NDABIJIMANA", 
    role: "Secrétaire Administratif et Financier", 
    linkedin: "https://www.linkedin.com/search/results/all/?keywords=Claver%20NDABIJIMANA" 
  },
  { 
    name: "Jacques Masuruku", 
    role: "Informaticien", 
    linkedin: "https://www.linkedin.com/in/jacques-mapenzi-masuruku-73266b245/" 
  },
  { 
    name: "Joel SEBAGENI", 
    role: "Appariteur", 
    linkedin: "https://www.linkedin.com/search/results/all/?keywords=Joel%20SEBAGENI" 
  }
];

export const FACULTIES: Faculty[] = [
  {
    id: 'poly',
    name: 'Polytechnique',
    description: 'Ingénierie civile, électricité, et technologies de pointe pour reconstruire la nation.',
    departments: ['Génie Civil', 'Génie Électrique', 'Génie Informatique']
  },
  {
    id: 'econ',
    name: 'Sciences Économiques',
    description: 'Analyse des marchés et gestion des ressources dans un contexte globalisé.',
    departments: ['Économie Rurale', 'Économie de Développement']
  },
  {
    id: 'health',
    name: 'Santé Publique',
    description: 'Gestion de la santé communautaire et expertise en épidémiologie.',
    departments: ['Gestion des Institutions de Santé', 'Épidémiologie']
  },
  {
    id: 'manage',
    name: 'Management',
    description: 'Leadership entrepreneurial et gestion organisationnelle moderne.',
    departments: ['Management des Affaires', 'Ressources Humaines']
  },
  {
    id: 'dev',
    name: 'Sciences de Développement',
    description: 'Planification stratégique pour le progrès social et durable.',
    departments: ['Développement Communautaire', 'Gestion de Projets']
  },
  {
    id: 'agri',
    name: 'Sciences Agronomiques',
    description: 'Expertise en agriculture moderne et gestion environnementale.',
    departments: ['Phytotechnie', 'Zootechnie', 'Gestion de l\'Environnement']
  }
];

export const ADVANTAGES = [
  {
    title: "Enseignement Moderne",
    desc: "Approche pédagogique innovante centrée sur l'étudiant et la pratique, nous adoptons l'utilisation des outils pédagogiques modernes comme les écran interactifs.",
    icon: <GraduationCap className="w-8 h-8 text-upgGold" />
  },
  {
    title: "Bourses d'Excellence",
    desc: "Octroi de bourses d'entrepreuneuriat aux étudiants pour soutenir les Activités Génératrices de Revenus (AGR).",
    icon: <ShieldCheck className="w-8 h-8 text-upgGold" />
  },
  {
    title: "Internet Haut Débit",
    desc: "Connexion WiFi gratuite sur tout le campus pour faciliter la recherche.",
    icon: <Globe className="w-8 h-8 text-upgGold" />
  },
  {
    title: "Frais Réduits",
    desc: "L'excellence académique rendue accessible à toutes les bourses, Les frais académiques sont largement réduits pour faciliter toutes les couches d'accéder à la formation de qualité.",
    icon: <Briefcase className="w-8 h-8 text-upgGold" />
  }
];

export const ADMISSION_DOCS = [
  "Diplôme d'État ou son équivalent",
  "Bulletin de la 5ème et 6ème année des Humanités",
  "Attestation de naissance et de bonne vie et mœurs",
  "4 Photos passeport récentes",
  "Certificat d'aptitude physique"
];