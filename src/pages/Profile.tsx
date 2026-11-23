import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { useAuth } from "../hooks/useAuth";
import { writeSession } from "../utils/storage";
import "./Profile.css";

type MessageType = "success" | "error" | "";

interface FeedbackMessage {
  text: string;
  type: MessageType;
}

export function Profile() {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<"personal" | "settings">(
    "personal",
  );
  const [username, setUsername] = useState(user?.username ?? "visitante");
  const [email, setEmail] = useState(user?.email ?? "visitante@exemplo.com");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const [editing, setEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [compactCards, setCompactCards] = useState(false);
  const [confirmBeforeAction, setConfirmBeforeAction] = useState(true);

  const [profileMessage, setProfileMessage] = useState<FeedbackMessage>({
    text: "",
    type: "",
  });

  const [passwordMessage, setPasswordMessage] = useState<FeedbackMessage>({
    text: "",
    type: "",
  });

  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  function handlePhotoChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;

    const previewUrl = URL.createObjectURL(file);
    setAvatarUrl(previewUrl);
  }

  function handleSaveProfile(e: FormEvent<HTMLFormElement>) {
  e.preventDefault();
  setProfileMessage({ text: "", type: "" });

  const cleanUsername = username.trim();
  const cleanEmail = email.trim();

  if (!user) {
    setProfileMessage({
      text: "Usuário não autenticado.",
      type: "error",
    });
    return;
  }

  if (cleanUsername.length < 3 || cleanUsername.length > 10) {
    setProfileMessage({
      text: "O nome deve ter entre 3 e 10 caracteres.",
      type: "error",
    });
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    setProfileMessage({
      text: "Informe um e-mail válido.",
      type: "error",
    });
    return;
  }

  setIsSavingProfile(true);

  const updatedUser = {
    ...user,
    username: cleanUsername,
    email: cleanEmail,
  };

  writeSession(updatedUser);

  setUsername(cleanUsername);
  setEmail(cleanEmail);
  setEditing(false);
  setIsSavingProfile(false);

  setProfileMessage({
    text: "Dados atualizados na sessão local. A alteração ainda não foi enviada ao servidor.",
    type: "success",
  });
  }

  async function handleSavePassword(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setPasswordMessage({ text: "", type: "" });

    if (!oldPassword) {
      setPasswordMessage({
        text: "Informe sua senha atual.",
        type: "error",
      });
      return;
    }

    if (newPassword.length < 4 || newPassword.length > 8) {
      setPasswordMessage({
        text: "A nova senha deve ter entre 4 e 8 caracteres.",
        type: "error",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage({
        text: "As senhas não são iguais.",
        type: "error",
      });
      return;
    }

    setIsSavingPassword(true);

    try {
      // A integração com o endpoint de alteração de senha
      // será adicionada aqui.

      setPasswordMessage({
        text: "A alteração de senha ainda não está integrada ao backend.",
        type: "error",
      });
    } catch (err) {
      setPasswordMessage({
        text: err instanceof Error
          ? err.message
          : "Erro ao atualizar senha.",
        type: "error",
      });
    } finally {
      setIsSavingPassword(false);
    }
  }

  return (
    <div className="profile-page">
      <div className="profile-window">
        <header className="profile-header">
          <div className="profile-header-icon">
            <span className="header-emoji" aria-hidden="true">
              👥
            </span>
          </div>

          <div>
            <h1>Perfil do Usuário</h1>
            <p>Veja e edite seus dados de acesso.</p>
          </div>

          <button
            className="help-button"
            type="button"
            onClick={() => setShowHelp(!showHelp)}
          >
            ❔ Ajuda
          </button>
        </header>

        {showHelp && (
          <div className="profile-help">
            Aqui você pode visualizar e atualizar suas informações pessoais,
            alterar sua senha e configurar suas preferências.
          </div>
        )}

        <div className="profile-content">
          <div className="profile-tabs">
            <button
              className={activeTab === "personal" ? "active" : ""}
              onClick={() => setActiveTab("personal")}
            >
              Dados Pessoais
            </button>

            <button
              className={activeTab === "settings" ? "active" : ""}
              onClick={() => setActiveTab("settings")}
            >
              Configurações
            </button>
          </div>

          {activeTab === "personal" ? (
            <>
              <div className="profile-columns">
                <section className="profile-panel">
                  <div className="panel-title">
                    <span>👤</span>
                    Informações do Usuário
                  </div>

                  <div className="user-information">
                    <div className="avatar-section">
                      <div className="profile-avatar">
                        {avatarUrl ? (
                          <img src={avatarUrl} alt="Foto do usuário" />
                        ) : (
                          <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                          </svg>
                        )}
                      </div>

                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={handlePhotoChange}
                      />

                      <button
                        className="secondary-button"
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        Alterar Foto...
                      </button>
                    </div>

                    <div className="user-details">
                      <form onSubmit={handleSaveProfile}>
                        <label>Nome de Usuário:</label>
                        <input
                          type="text"
                          value={username}
                          disabled={!editing}
                          onChange={(e) => setUsername(e.target.value)}
                          maxLength={10}
                        />

                        <label>E-mail:</label>
                        <input
                          type="email"
                          value={email}
                          disabled={!editing}
                          onChange={(e) => setEmail(e.target.value)}
                        />

                        <label>Tipo de Conta:</label>
                        <div className="account-type">👤 Usuário</div>

                        <strong>Membro desde:</strong>
                        <div className="member-date">📅 01/01/2024</div>

                        {profileMessage.text && (
                          <p
                            className={`profile-message ${profileMessage.type}`}
                          >
                            {profileMessage.text}
                          </p>
                        )}

                        {editing && (
                          <button
                            className="primary-button"
                            type="submit"
                            disabled={isSavingProfile}
                          >
                            {isSavingProfile
                              ? "Salvando..."
                              : "Salvar Alterações"}
                          </button>
                        )}
                      </form>
                    </div>
                  </div>
                </section>

                <section className="profile-panel">
                  <div className="panel-title">
                    <span>⭐</span>
                    Ações
                  </div>

                  <div className="action-list">
                    <div className="action-item">
                      <button
                        type="button"
                        className="action-button"
                        onClick={() => {
                          setEditing(!editing);
                          setProfileMessage({ text: "", type: "" });
                        }}
                      >
                        ✏️ {editing ? "Cancelar edição" : "Editar Perfil"}
                      </button>
                      <p>Atualize suas informações pessoais.</p>
                    </div>

                    <div className="action-item">
                      <button
                        type="button"
                        className="action-button"
                        onClick={() => {
                          setShowPasswordForm(!showPasswordForm);
                          setPasswordMessage({ text: "", type: "" });
                        }}
                      >
                        🔑 Alterar Senha
                      </button>
                      <p>Defina uma nova senha para sua conta.</p>
                    </div>

                    <div className="action-item">
                      <button
                        className="action-button"
                        onClick={() => setActiveTab("settings")}
                      >
                        ⚙️ Configurações
                      </button>
                      <p>Personalize suas preferências.</p>
                    </div>
                  </div>
                </section>
              </div>

              {showPasswordForm && (
                <section className="profile-panel password-panel">
                  <div className="panel-title">
                    <span>🔑</span>
                    Alterar Senha
                  </div>

                  <form className="password-form" onSubmit={handleSavePassword}>
                    <label>Senha Atual</label>
                    <input
                      type="password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                    />

                    <label>Nova Senha</label>
                    <input
                      type="password"
                      value={newPassword}
                      maxLength={8}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />

                    <label>Confirmar Nova Senha</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      maxLength={8}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />

                    {passwordMessage.text && (
                      <p className={`profile-message ${passwordMessage.type}`}>
                        {passwordMessage.text}
                      </p>
                    )}

                    <button
                      className="primary-button"
                      type="submit"
                      disabled={isSavingPassword}
                    >
                      {isSavingPassword ? "Atualizando..." : "Atualizar Senha"}
                    </button>
                  </form>
                </section>
              )}

              <section className="profile-panel account-panel">
                <div className="panel-title">
                  <span>ℹ️</span>
                  Sobre sua conta
                </div>

                <div className="account-description">
                  <span>🔵</span>
                  <p>
                    Sua conta possui acesso ao Kanban Desk com permissões de
                    usuário padrão.
                    <br />
                    Você pode criar, editar e gerenciar seus projetos e tarefas.
                  </p>
                </div>
              </section>

              <section className="profile-panel statistics-panel">
                <div className="panel-title">
                  <span>📊</span>
                  Estatísticas
                </div>

                <div className="statistics-grid">
                  <div className="statistic">
                    <span>📁</span>
                    <div>
                      <p>Projetos</p>
                    </div>
                  </div>

                  <div className="statistic">
                    <span>📋</span>
                    <div>
                      <p>Tarefas</p>
                    </div>
                  </div>

                  <div className="statistic">
                    <span>✅</span>
                    <div>
                      <p>Concluídas</p>
                    </div>
                  </div>
                </div>
              </section>
            </>
          ) : (
            <section className="profile-panel settings-panel">
              <div className="panel-title">
                <span>⚙️</span>
                Preferências da Conta
              </div>

              <div className="setting-option">
                <div>
                  <strong>Cartões compactos</strong>
                  <p>Utilizar cartões menores na visualização dos projetos.</p>
                </div>

                <input
                  type="checkbox"
                  checked={compactCards}
                  onChange={(e) => setCompactCards(e.target.checked)}
                />
              </div>

              <div className="setting-option">
                <div>
                  <strong>Confirmar antes de ações</strong>
                  <p>
                    Solicitar confirmação antes de executar ações importantes.
                  </p>
                </div>

                <input
                  type="checkbox"
                  checked={confirmBeforeAction}
                  onChange={(e) => setConfirmBeforeAction(e.target.checked)}
                />
              </div>

              <button
                type="button"
                className="primary-button"
                onClick={() => alert("Preferências atualizadas nesta sessão!")}
              >
                Salvar Configurações
              </button>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
