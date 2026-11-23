import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthFrame } from '../components/layout/AuthFrame';
import { useAuth } from '../hooks/useAuth';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function validate(): string | null {
    const cleanUsername = username.trim();
    if (cleanUsername.length < 3 || cleanUsername.length > 10) {
      return 'O nome de usuário deve ter entre 3 e 10 caracteres.';
    }
    if (!EMAIL_PATTERN.test(email.trim())) {
      return 'Informe um endereço de e-mail válido.';
    }
    if (password.length < 4 || password.length > 8) {
      return 'A senha deve ter entre 4 e 8 caracteres nesta versão demonstrativa.';
    }
    if (password !== confirmPassword) {
      return 'As senhas informadas não são iguais.';
    }
    return null;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    try {
      await register({ username: username.trim(), email: email.trim(), password });
      navigate('/app', { replace: true });
    } catch (registerError) {
      setError(registerError instanceof Error ? registerError.message : 'Não foi possível criar a conta.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthFrame
      title="Xp Desk — Criar conta"
      subtitle="Crie sua conta"
      footer={<>Já possui uma conta? <Link to="/login">Fazer login</Link></>}
    >
      <form className="auth-form register-form" onSubmit={handleSubmit} noValidate>
        <div className="field-row-stacked form-field">
          <label htmlFor="register-username">Nome de usuário</label>
          <input
            id="register-username"
            type="text"
            autoComplete="username"
            placeholder="Ex.: maria"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            maxLength={10}
            required
          />
          <small className="field-hint">De 3 a 10 caracteres.</small>
        </div>

        <div className="field-row-stacked form-field">
          <label htmlFor="register-email">E-mail</label>
          <input
            id="register-email"
            type="email"
            autoComplete="email"
            placeholder="voce@exemplo.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>

        <div className="field-row-stacked form-field">
          <label htmlFor="register-password">Senha</label>
          <div className="password-field">
            <input
              id="register-password"
              type="password"
              autoComplete="new-password"
              placeholder="Crie uma senha"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              maxLength={8}
              required
            />
            
          </div>
          <small className="field-hint">De 4 a 8 caracteres. A conta é criada no backend local em POST /api/v1/users.</small>
        </div>

        <div className="field-row-stacked form-field">
          <label htmlFor="register-confirm-password">Confirmar senha</label>
          <input
            id="register-confirm-password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder="Digite a senha novamente"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            required
          />
        </div>

        {error && <div className="form-alert" role="alert">{error}</div>}

        <button className="primary-action" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Criando conta...' : 'Criar conta'}
        </button>
      </form>
    </AuthFrame>
  );
}
