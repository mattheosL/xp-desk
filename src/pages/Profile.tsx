import { useState,useRef, type FormEvent, type ChangeEvent } from "react";
import { useAuth } from "../hooks/useAuth";


export function Profile() {
  const { user } = useAuth();

  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState({ text: '', type: '' });

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState({ text: '', type: '' });

  const [avatarUrl,setAvatarUrl] = useState <string | null>(null);
  const fileInputRef = useRef<HTMLInputElement> (null);

  function handlePhotoClick() {
    fileInputRef.current?.click();
  }

  function handlePhotoChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setAvatarUrl(imageUrl);
    }
    
  }

  async function handleSaveProfile(e: FormEvent){
    e.preventDefault();
    setIsSavingPassword(true);
    setPasswordMessage({text: '', type: ''});

    if(newPassword != confirmPassword){
      setPasswordMessage({text: 'As senhas informadas não são iguais.',  type: 'error'});
      setIsSavingPassword(false);
      return;
    }

    if (newPassword.length < 4 || newPassword.length > 8) {
      setPasswordMessage({ text: 'A senha deve ter entre 4 e 8 caracteres.', type: 'error' });
      setIsSavingPassword(false);
      return;
    }

    setTimeout(() =>{
      setPasswordMessage({text: 'Senha alterada com sucesso!', type: 'success'});
      setNewPassword('');
      setConfirmPassword('');
      setIsSavingPassword(false);
    },1000);

  }

  return (
    <div className="page-stack">
      <div className="page-heading-row">
        <div>
          <div className="eyebrow">CONTA</div>
          <h1>Perfil</h1>
          <p className="page-description">Informações da conta ativa nesta sessão.</p>
        </div>
      </div>

      <div className="profile-container">

        <div className="window">

          <div className="title-bar">

            <div className="title-bar-text">Meus Perfil</div>

          </div>

          <div className="window-body profile-window-body">

            <div className="profile-header-layout">
              <div className="profile-photo-section">
                <div className="profile-avatar">
                  {avatarUrl? (
                    <img src= {avatarUrl} alt="Avatar do usuário" />
                  ) : (
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  )}
                </div>
                <button type="button" onClick={handlePhotoClick}>Alterar foto</button>
                <input 
                  type="file" 
                  accept="image/*" 
                  ref={fileInputRef} 
                  onChange={handlePhotoChange} 
                  className="hidden-file-input"
                />
              </div>
            </div>

            <form onSubmit={handleSaveProfile} className="profile-form">

              <div className="field-row-stacked">
                <label htmlFor="profile-username">Nome de usuário</label>
                <input
                  id="profile-username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  maxLength={25}
                  required
                />
              </div>

              <div className="field-row-stacked"> 
                <label htmlFor="profile-email">E-mail</label>
                <input 
                  id="profile-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {profileMessage.text && (
                  <div style={{ color: profileMessage.type === 'error' ? 'red' : 'green', fontSize: '0.9rem', fontWeight: 'bold' }}>
                    {profileMessage.text}
                  </div>
                )}

              <button type="submit" disabled={isSavingProfile} className="primary-action ${className}`.trim()} {...props}">
                {isSavingProfile ? 'Gravando...' : 'Salvar Alterações'}
              </button>

            </form>

          </div>

        </div>
      </div>

      <div className="window">
        <div className="title-bar">
          <div className="title-bar-text">Alterar senha</div>
        </div>
        <div className="window-body profile-window-body">
          <form className="profile-form">
            <div className="field-row-stacked">
              <label htmlFor="profile-password">Nova senha</label>
              <input
                id="profile-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                maxLength={8}
                required
              />

            </div>

            <div className="field-row-stacked">
              <label htmlFor="profile-confirm-password">Confirmar nova senha</label>
              <input
                id="profile-confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                maxLength={8}
                required
                />
            </div>

             {passwordMessage.text && (
                <div style={{ color: passwordMessage.type === 'error' ? 'red' : 'green', fontSize: '0.9rem', fontWeight: 'bold' }}>
                  {passwordMessage.text}
                </div>
              )}

              <button type="submit" disabled={isSavingPassword} className="primary-action ${className}`.trim()} {...props}">
                {isSavingPassword ? 'Atualizando...' : 'Atualizar senha'}
              </button>
          </form>

        </div>
        
      </div>

    </div>
  );
}
