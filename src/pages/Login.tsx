import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthFrame } from '../components/layout/AuthFrame';
import { useAuth } from '../hooks/useAuth';

interface LocationState {
  from?: string;
}

export function Login() {
  const { login} = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;
  const destination = state?.from?.startsWith('/app') ? state.from : '/app';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Preencha o e-mail e a senha para continuar.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Informe um endereço de e-mail válido.');
      return;
    }

    setIsSubmitting(true);
    try {
      await login(email.trim(), password);
      navigate(destination, { replace: true });
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : 'Não foi possível entrar. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  }



  return (
    <AuthFrame
      title="Xp Desk — Entrar"
      subtitle="Bem-vindo de volta!"
      footer={<>Ainda não tem uma conta? <Link to="/cadastro">Criar conta</Link></>}
    >
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <div className="field-row-stacked form-field">
          <label htmlFor="login-email">E-mail</label>
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            placeholder="voce@exemplo.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            aria-invalid={Boolean(error)}
            required
          />
        </div>

        <div className="field-row-stacked form-field">
          <label htmlFor="login-password">Senha</label>
          <div className="password-field">
            <input
              id="login-password"
              type="password"
              autoComplete="current-password"
              placeholder="Digite sua senha"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
            
          </div>
        </div>

        {error && <div className="form-alert" role="alert">{error}</div>}

        <button className="primary-action" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Verificando...' : 'Entrar'}
        </button>
      </form>
      
    </AuthFrame>
  );
}
