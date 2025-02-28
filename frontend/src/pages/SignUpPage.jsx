import { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore';
import { MessageSquare, User, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';   
import { Link } from 'react-router-dom';
import AuthImagePattern from '../components/AuthImagePattern';
import toast from 'react-hot-toast';

const SignUpPage = () => {

  const [showPassword, setShowPassword]= useState(false);
  const [formData, setFormData]= useState({
    fullName:"",
    email:"",
    password:""
  });
  const {signup,isSigningUp}=useAuthStore()

  const validateForm = () => {
    if (!formData.fullName.trim()) return toast.error("Renseignez votre nom");
    if (!formData.email.trim()) return toast.error("Renseignez votre email");
    if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Format email invalide");
    if (!formData.password) return toast.error("Entrez un mot de passe");
    if (formData.password.length < 6) return toast.error("Le mot de passe doit contenir au moins 6 caractères");

    return true;
  };

  const handleSubmit = (e)=>{
    e.preventDefault()

    const success = validateForm()
    if(success)signup(formData);
  }
  return (
    <div className='min-h-screen grid lg:grid-cols-2'>
      {/* Left side */}
      <div className='flex flex-col justify-center items-center p-6 sm:p-12'>
        <div className='w-full max-w-md space-y-8'>
          {/* LOGO */}
          <div className='text-center mb-8'>
            <div className='flex flex-col items-center gap-2 group'>
              <div className='size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors'>
                <MessageSquare className='size-6 text-primary'/>
              </div>
              <h1 className='text-2xl font-bold mt-2'>Créer compte</h1>
              <p className='text-base-content/60'>Commencez avec un compte gratuit</p>
            </div>

          </div>
          <form onSubmit={handleSubmit} className='space-y-6'>
          <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Nom complet</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="size-5 text-base-content/40" />
                </div>
                <input
                  type="text"
                  style={{ paddingLeft: "2.5rem" }}
                  className={`input input-bordered w-full pl-12`}
                  placeholder="Modou dou"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Adresse mail</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3  flex items-center pointer-events-none">
                  <Mail className="size-5 text-base-content/40" />
                </div>
                <input
                  type="email"
                  style={{ paddingLeft: "2.5rem" }}
                  className={`input input-bordered w-full pl-10`}
                  placeholder="modou@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Mot de passe</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="size-5 text-base-content/40" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  style={{ paddingLeft: "2.5rem" }}
                  className={`input input-bordered w-full pl-20`}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="size-5 text-base-content/40" />
                  ) : (
                    <Eye className="size-5 text-base-content/40" />
                  )}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-full" disabled={isSigningUp}>
              {isSigningUp ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Chargement...
                </>
              ) : (
                "Créer compte"
              )}
            </button>
          </form>

          <div className='text-center'>
            <p className='text-base-content/60'>
            Vous avez déjà un compte ?{""}
            <Link to="/login" className='link link-primary'> Se connecter</Link>
            </p>
          </div>
        </div>

      </div>

      {/* Right Side */}

      <AuthImagePattern
      title="Rejoignez notre communauté"
      subtitle="Connectez vous avec vos amis, partagez vos moments et restez en contact."
      />
    </div>
  )
}

export default SignUpPage