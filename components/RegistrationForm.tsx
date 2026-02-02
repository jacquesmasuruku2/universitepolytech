
import React, { useState, useMemo } from 'react';
import { FormStep, RegistrationData } from '../types';
import { FACULTIES } from '../constants';
import { CheckCircle2, ChevronRight, ChevronLeft, Upload, User, Camera, BookOpen, AlertCircle, FileText, Loader2 } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../supabaseClient';

const RegistrationForm: React.FC = () => {
  const [step, setStep] = useState<FormStep>(FormStep.IDENTITY);
  const [formData, setFormData] = useState<Partial<RegistrationData>>({
    gender: undefined,
    maritalStatus: undefined,
    firstName: '',
    lastName: '',
    middleName: '',
    email: '',
    phone: '',
    birthDate: '',
    birthPlace: '',
    previousSchool: '',
    targetFaculty: '',
    targetDepartment: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorFeedback, setErrorFeedback] = useState<string | null>(null);

  const availableDepartments = useMemo(() => {
    const faculty = FACULTIES.find(f => f.name === formData.targetFaculty);
    return faculty ? faculty.departments : [];
  }, [formData.targetFaculty]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errorFeedback) setErrorFeedback(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (!files || files.length === 0) return;

    if (name === 'passportPhoto') {
      const file = files[0];
      if (file.size > 5 * 1024 * 1024) {
        alert("La photo ne doit pas dépasser 5Mo.");
        return;
      }
      setFormData(prev => ({ ...prev, passportPhoto: file }));
    } else if (name === 'documents') {
      setFormData(prev => ({ ...prev, documents: files }));
    }
    if (errorFeedback) setErrorFeedback(null);
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === FormStep.IDENTITY) setStep(FormStep.ACADEMIC);
    else if (step === FormStep.ACADEMIC) setStep(FormStep.DOCUMENTS);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSupabaseConfigured()) {
      setErrorFeedback("Supabase n'est pas configuré. Vérifiez vos clés dans supabaseClient.ts");
      return;
    }

    setIsSubmitting(true);
    setErrorFeedback(null);
    
    try {
      let passportPhotoUrl = "";
      let academicDocsUrl = "";
      const timestamp = Date.now();

      if (formData.passportPhoto) {
        const ext = formData.passportPhoto.name.split('.').pop()?.toLowerCase();
        const filePath = `public/photo-${timestamp}-${Math.random().toString(36).substring(7)}.${ext}`;
        
        const { data, error: photoError } = await supabase.storage
          .from('form_site_files')
          .upload(filePath, formData.passportPhoto);
        
        if (photoError) throw new Error(`Erreur Photo: ${photoError.message}`);
        passportPhotoUrl = data.path;
      }

      if (formData.documents && formData.documents.length > 0) {
        const docFile = formData.documents[0];
        const ext = docFile.name.split('.').pop()?.toLowerCase();
        const filePath = `public/docs-${timestamp}-${Math.random().toString(36).substring(7)}.${ext}`;
        
        const { data, error: docError } = await supabase.storage
          .from('form_site_files')
          .upload(filePath, formData.documents[0]);
        
        if (docError) throw new Error(`Erreur Document: ${docError.message}`);
        academicDocsUrl = data.path;
      }

      const { error: dbError } = await supabase.from('registrations').insert([
        {
          first_name: formData.firstName,
          last_name: formData.lastName,
          middle_name: formData.middleName,
          email: formData.email,
          phone: formData.phone,
          gender: formData.gender,
          marital_status: formData.maritalStatus,
          birth_date: formData.birthDate,
          birth_place: formData.birthPlace,
          previous_school: formData.previousSchool,
          target_faculty: formData.targetFaculty,
          target_department: formData.targetDepartment,
          passport_photo_url: passportPhotoUrl,
          academic_docs_url: academicDocsUrl
        }
      ]);

      if (dbError) throw dbError;

      supabase.functions.invoke('send-confirmation-email', {
        body: {
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          faculty: formData.targetFaculty,
          department: formData.targetDepartment
        }
      }).catch(err => console.warn("L'email de confirmation n'a pas pu être envoyé mais l'inscription est validée.", err));

      setStep(FormStep.CONFIRMATION);
    } catch (error: any) {
      console.error("Erreur d'inscription:", error);
      setErrorFeedback(error.message || "Une erreur inconnue est survenue.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (step === FormStep.CONFIRMATION) {
    return (
      <div className="bg-white dark:bg-slate-900 p-12 rounded-3xl shadow-xl text-center max-w-2xl mx-auto border-t-8 border-upgGold transition-colors">
        <div className="bg-green-100 dark:bg-green-900/30 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={40} className="text-green-600 dark:text-green-400" />
        </div>
        <h2 className="text-3xl font-bold text-upgBlue dark:text-white mb-4">Candidature Envoyée !</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
          Félicitations <strong>{formData.firstName} {formData.lastName}</strong>. Votre dossier a été enregistré avec succès pour la faculté de <strong>{formData.targetFaculty}</strong>. <br/><span className="text-upgGold font-semibold">Un email de confirmation vient de vous être envoyé.</span>
        </p>
        <button onClick={() => window.location.reload()} className="bg-upgBlue text-white px-8 py-3 rounded-xl font-bold hover:bg-upgGold hover:text-upgBlue transition-all shadow-lg">Retour à l'accueil</button>
      </div>
    );
  }

  const hasDocs = formData.documents && formData.documents.length > 0;
  const docName = hasDocs ? formData.documents![0].name : "";

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden max-w-5xl mx-auto flex flex-col md:flex-row min-h-[700px] transition-colors border border-slate-100 dark:border-slate-800">
      <div className="bg-upgBlue dark:bg-slate-950 md:w-1/4 p-8 text-white flex flex-col justify-between border-r border-white/5">
        <div>
          <h2 className="text-2xl font-bold mb-12 tracking-tighter">Portail<br/><span className="text-upgGold">Admission</span></h2>
          <div className="space-y-10">
            <div className={`flex items-center gap-4 transition-all ${step === FormStep.IDENTITY ? 'scale-110' : 'opacity-40'}`}>
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold ${step === FormStep.IDENTITY ? 'bg-upgGold border-upgGold text-upgBlue' : 'border-white'}`}>1</div>
              <span className="text-sm font-bold uppercase tracking-widest">Identité</span>
            </div>
            <div className={`flex items-center gap-4 transition-all ${step === FormStep.ACADEMIC ? 'scale-110' : 'opacity-40'}`}>
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold ${step === FormStep.ACADEMIC ? 'bg-upgGold border-upgGold text-upgBlue' : 'border-white'}`}>2</div>
              <span className="text-sm font-bold uppercase tracking-widest">Cursus</span>
            </div>
            <div className={`flex items-center gap-4 transition-all ${step === FormStep.DOCUMENTS ? 'scale-110' : 'opacity-40'}`}>
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold ${step === FormStep.DOCUMENTS ? 'bg-upgGold border-upgGold text-upgBlue' : 'border-white'}`}>3</div>
              <span className="text-sm font-bold uppercase tracking-widest">Pièces</span>
            </div>
          </div>
        </div>
        <div className="text-[10px] opacity-40 uppercase tracking-widest font-bold">UPG Admission v2.0</div>
      </div>

      <form onSubmit={step === FormStep.DOCUMENTS ? handleSubmit : handleNext} className="p-8 md:p-12 flex-1 space-y-6">
        {errorFeedback && (
          <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 mb-4 flex items-center gap-3 animate-in fade-in">
            <AlertCircle className="text-red-500" size={20} />
            <p className="text-xs text-red-700 dark:text-red-400 font-bold">{errorFeedback}</p>
          </div>
        )}

        {step === FormStep.IDENTITY && (
          <div className="space-y-6 animate-in slide-in-from-right-4">
            <h3 className="text-xl font-bold text-upgBlue dark:text-white uppercase tracking-tight flex items-center gap-2 border-b dark:border-slate-800 pb-3">
              <User className="text-upgGold" /> État Civil & Identité
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Prénom</label>
                <input required name="firstName" value={formData.firstName} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-800 p-3 rounded-xl outline-none focus:ring-2 focus:ring-upgGold dark:text-white border border-transparent" placeholder="Ex: Jean" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Nom</label>
                <input required name="lastName" value={formData.lastName} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-800 p-3 rounded-xl outline-none focus:ring-2 focus:ring-upgGold dark:text-white border border-transparent" placeholder="Ex: MUTABAZI" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Post-nom</label>
                <input name="middleName" value={formData.middleName} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-800 p-3 rounded-xl outline-none focus:ring-2 focus:ring-upgGold dark:text-white border border-transparent" placeholder="Ex: MUNGUIKO" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Sexe</label>
                <select required name="gender" value={formData.gender || ''} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-800 p-3 rounded-xl outline-none dark:text-white border border-transparent">
                  <option value="" disabled>Sélectionner le sexe</option>
                  <option value="M">Masculin</option>
                  <option value="F">Féminin</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">État Matrimonial</label>
                <select required name="maritalStatus" value={formData.maritalStatus || ''} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-800 p-3 rounded-xl outline-none dark:text-white border border-transparent">
                  <option value="" disabled>Sélectionner l'état civil</option>
                  <option value="Célibataire">Célibataire</option>
                  <option value="Marié(e)">Marié(e)</option>
                  <option value="Divorcé(e)">Divorcé(e)</option>
                  <option value="Séparé(e)">Séparé(e)</option>
                  <option value="Veuf(ve)">Veuf(ve)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Date Naissance</label>
                <input required type="date" name="birthDate" value={formData.birthDate || ''} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-800 p-3 rounded-xl outline-none dark:text-white" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Lieu Naissance</label>
                <input required name="birthPlace" value={formData.birthPlace || ''} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-800 p-3 rounded-xl outline-none dark:text-white" placeholder="Ville/Territoire" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Téléphone</label>
                <input required type="tel" name="phone" value={formData.phone || ''} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-800 p-3 rounded-xl outline-none dark:text-white" placeholder="+243..." />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Email</label>
                <input required type="email" name="email" value={formData.email || ''} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-800 p-3 rounded-xl outline-none dark:text-white" placeholder="etudiant@mail.com" />
              </div>
            </div>

            <div className="flex justify-end pt-6">
              <button type="submit" className="flex items-center gap-2 bg-upgBlue text-white px-10 py-4 rounded-2xl font-bold hover:scale-105 transition-all shadow-lg">
                Continuer <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}

        {step === FormStep.ACADEMIC && (
          <div className="space-y-6 animate-in slide-in-from-right-4">
            <h3 className="text-xl font-bold text-upgBlue dark:text-white uppercase tracking-tight flex items-center gap-2 border-b dark:border-slate-800 pb-3">
              <BookOpen className="text-upgGold" /> Choix Académique
            </h3>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">École de provenance</label>
              <input required name="previousSchool" value={formData.previousSchool || ''} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-800 p-3 rounded-xl outline-none dark:text-white" placeholder="Nom de votre école secondaire" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Faculté</label>
                <select required name="targetFaculty" value={formData.targetFaculty || ''} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-xl outline-none dark:text-white">
                  <option value="">Sélectionner une Faculté</option>
                  {FACULTIES.map(f => <option key={f.id} value={f.name}>{f.name}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Filière / Département</label>
                <select required name="targetDepartment" value={formData.targetDepartment || ''} onChange={handleChange} disabled={!formData.targetFaculty} className="w-full bg-slate-50 dark:bg-slate-800 p-4 rounded-xl outline-none dark:text-white opacity-100 disabled:opacity-50">
                  <option value="">Choisir la Filière</option>
                  {availableDepartments.map((dept, i) => <option key={i} value={dept}>{dept}</option>)}
                </select>
              </div>
            </div>
            <div className="flex justify-between pt-10">
              <button type="button" onClick={() => setStep(FormStep.IDENTITY)} className="flex items-center gap-2 text-slate-500 font-bold hover:text-upgBlue transition-colors">
                <ChevronLeft size={20} /> Retour
              </button>
              <button type="submit" className="flex items-center gap-2 bg-upgBlue text-white px-10 py-4 rounded-2xl font-bold shadow-lg">
                Suivant <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}

        {step === FormStep.DOCUMENTS && (
          <div className="space-y-6 animate-in slide-in-from-right-4">
            <h3 className="text-xl font-bold text-upgBlue dark:text-white uppercase tracking-tight flex items-center gap-2 border-b dark:border-slate-800 pb-3">
              <Camera className="text-upgGold" /> Justificatifs
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center gap-6 p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-upgGold transition-colors">
                <div className="w-20 h-24 bg-white dark:bg-slate-900 rounded-lg flex items-center justify-center overflow-hidden border border-slate-100 dark:border-slate-700 shadow-sm">
                  {formData.passportPhoto ? <img src={URL.createObjectURL(formData.passportPhoto)} className="w-full h-full object-contain" /> : <Camera size={32} className="text-slate-300" />}
                </div>
                <div>
                  <input type="file" name="passportPhoto" accept="image/*" onChange={handleFileChange} className="hidden" id="photo-upload" />
                  <label htmlFor="photo-upload" className="bg-upgBlue text-white px-4 py-2 rounded-lg text-xs font-bold cursor-pointer hover:bg-opacity-90 transition-all">Charger la photo passeport</label>
                  <p className="text-[10px] text-slate-400 mt-2 font-medium uppercase tracking-tight">Format JPG/PNG • Max 5Mo</p>
                </div>
              </div>

              <div className={`p-10 text-center rounded-2xl border-2 border-dashed transition-all ${hasDocs ? 'border-green-500 bg-green-50 dark:bg-green-900/10' : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:border-upgGold'}`}>
                <input type="file" name="documents" accept=".pdf" onChange={handleFileChange} className="hidden" id="pdf-upload" />
                <label htmlFor="pdf-upload" className="cursor-pointer flex flex-col items-center group">
                  {hasDocs ? (
                    <>
                      <FileText size={48} className="text-green-500 mb-3" />
                      <span className="text-sm font-bold text-green-700 dark:text-green-400">Dossier PDF joint</span>
                      <span className="text-[10px] text-slate-500 mt-1 italic line-clamp-1 max-w-[200px]">{docName}</span>
                    </>
                  ) : (
                    <>
                      <Upload size={48} className="text-slate-300 mb-3 group-hover:text-upgGold transition-colors" />
                      <span className="text-sm text-slate-500 font-bold uppercase tracking-widest">Dossier Académique (PDF)</span>
                    </>
                  )}
                </label>
              </div>
            </div>

            <div className="flex justify-between pt-10">
              <button type="button" onClick={() => setStep(FormStep.ACADEMIC)} className="flex items-center gap-2 text-slate-500 font-bold hover:text-upgBlue transition-colors">
                <ChevronLeft size={20} /> Retour
              </button>
              <button 
                type="submit" 
                disabled={isSubmitting || !formData.passportPhoto || !hasDocs}
                className="bg-upgGold text-upgBlue px-12 py-4 rounded-2xl font-bold shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 hover:scale-105 transition-all min-w-[240px]"
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : "Envoyer ma Candidature"}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default RegistrationForm;
