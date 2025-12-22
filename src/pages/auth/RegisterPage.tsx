import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft, Check, Phone, MapPin } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

type RegistrationStep = 'details' | 'verification';

export function RegisterPage() {
  const [step, setStep] = useState<RegistrationStep>('details');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    street: '',
    houseNumber: '',
    postalCode: '',
    city: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  });
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleCodeKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleSubmitDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Wachtwoorden komen niet overeen.');
      return;
    }

    if (formData.password.length < 8) {
      setError('Wachtwoord moet minimaal 8 tekens bevatten.');
      return;
    }

    if (!formData.acceptTerms) {
      setError('Je moet akkoord gaan met de voorwaarden.');
      return;
    }

    // Validate phone
    if (!/^(\+31|0)[1-9][0-9]{8}$/.test(formData.phone.replace(/\s/g, ''))) {
      setError('Voer een geldig Nederlands telefoonnummer in.');
      return;
    }

    // Validate postal code
    if (!/^[1-9][0-9]{3}\s?[A-Za-z]{2}$/.test(formData.postalCode)) {
      setError('Voer een geldige postcode in (bijv. 1234 AB).');
      return;
    }

    setIsLoading(true);

    try {
      // Generate verification code
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedCode(code);

      // Simulate sending email
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log(`Verification code sent to ${formData.email}: ${code}`);

      setStep('verification');
    } catch {
      setError('Er is een fout opgetreden. Probeer het opnieuw.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const enteredCode = verificationCode.join('');

    if (enteredCode.length !== 6) {
      setError('Voer de volledige 6-cijferige code in.');
      return;
    }

    if (enteredCode !== generatedCode) {
      setError('Ongeldige verificatiecode. Probeer het opnieuw.');
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await register(formData.email, formData.password);
      if (error) {
        setError('Registratie mislukt. Probeer een ander e-mailadres.');
      } else {
        // Store user data
        localStorage.setItem('userDetails', JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          address: {
            street: formData.street,
            houseNumber: formData.houseNumber,
            postalCode: formData.postalCode,
            city: formData.city,
          },
        }));
        navigate('/onboarding');
      }
    } catch {
      setError('Er is een fout opgetreden. Probeer het opnieuw.');
    } finally {
      setIsLoading(false);
    }
  };

  const resendCode = async () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(code);
    console.log(`New verification code sent to ${formData.email}: ${code}`);
    setVerificationCode(['', '', '', '', '', '']);
    setError('');
  };

  // Password strength indicator
  const getPasswordStrength = () => {
    const { password } = formData;
    if (!password) return { strength: 0, label: '' };

    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
    if (password.match(/\d/)) strength++;
    if (password.match(/[^a-zA-Z\d]/)) strength++;

    const labels = ['Zwak', 'Redelijk', 'Goed', 'Sterk'];
    const colors = ['bg-red-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];

    return {
      strength,
      label: labels[strength - 1] || '',
      color: colors[strength - 1] || '',
    };
  };

  const passwordStrength = getPasswordStrength();

  if (step === 'verification') {
    return (
      <div className="min-h-screen bg-dark-bg flex flex-col">
        <header className="p-4">
          <button
            onClick={() => setStep('details')}
            className="inline-flex items-center text-gray-400 hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Terug
          </button>
        </header>

        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-md text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-full mb-6">
              <Mail className="w-8 h-8 text-primary" />
            </div>

            <h1 className="text-2xl font-bold text-white mb-2">Verifieer je e-mail</h1>
            <p className="text-gray-400 mb-8">
              We hebben een 6-cijferige code gestuurd naar<br />
              <span className="text-white font-medium">{formData.email}</span>
            </p>

            <form onSubmit={handleVerifyCode} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                  {error}
                </div>
              )}

              <div className="flex justify-center gap-2">
                {verificationCode.map((digit, index) => (
                  <input
                    key={index}
                    id={`code-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleCodeChange(index, e.target.value)}
                    onKeyDown={(e) => handleCodeKeyDown(index, e)}
                    className="w-12 h-14 text-center text-2xl font-bold bg-dark-card border border-dark-border rounded-lg text-white focus:border-primary focus:outline-none"
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-primary text-dark-bg rounded-lg hover:bg-primary-dark transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Verifiëren...' : 'Verifieer & Maak Account'}
              </button>
            </form>

            <p className="mt-6 text-gray-400 text-sm">
              Geen code ontvangen?{' '}
              <button
                onClick={resendCode}
                className="text-primary hover:text-primary-dark font-medium"
              >
                Verstuur opnieuw
              </button>
            </p>

            {/* Dev hint - remove in production */}
            <p className="mt-4 text-xs text-gray-600">
              (Test code: {generatedCode})
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg flex flex-col">
      {/* Header */}
      <header className="p-4">
        <Link to="/" className="inline-flex items-center text-gray-400 hover:text-primary transition-colors">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Terug naar home
        </Link>
      </header>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-lg">
          {/* Logo */}
          <div className="text-center mb-6">
            <Link to="/" className="inline-flex items-center justify-center">
              <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none">
                <path
                  d="M 12 20 Q 12 14 18 14 L 30 14 Q 36 14 36 20 L 36 28 Q 36 34 30 34 L 18 34 Q 12 34 12 28 Z"
                  fill="#28EBCF"
                />
              </svg>
            </Link>
            <h1 className="mt-4 text-2xl font-bold text-white">Account aanmaken</h1>
            <p className="mt-2 text-gray-400">Start gratis met PIGG</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmitDetails} className="space-y-4">
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Name fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-2">
                  Voornaam *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full bg-dark-card border border-dark-border rounded-lg px-4 py-3 pl-10 text-white placeholder-gray-500 focus:border-primary focus:outline-none"
                    placeholder="Jan"
                    required
                  />
                </div>
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-2">
                  Achternaam *
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full bg-dark-card border border-dark-border rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-primary focus:outline-none"
                  placeholder="Jansen"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                E-mailadres *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-dark-card border border-dark-border rounded-lg px-4 py-3 pl-10 text-white placeholder-gray-500 focus:border-primary focus:outline-none"
                  placeholder="jouw@email.nl"
                  required
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                Telefoonnummer *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-dark-card border border-dark-border rounded-lg px-4 py-3 pl-10 text-white placeholder-gray-500 focus:border-primary focus:outline-none"
                  placeholder="+31 6 12345678"
                  required
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <MapPin className="inline w-4 h-4 mr-1" />
                Adres *
              </label>
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <input
                    name="street"
                    type="text"
                    value={formData.street}
                    onChange={handleChange}
                    className="w-full bg-dark-card border border-dark-border rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-primary focus:outline-none"
                    placeholder="Straatnaam"
                    required
                  />
                </div>
                <div>
                  <input
                    name="houseNumber"
                    type="text"
                    value={formData.houseNumber}
                    onChange={handleChange}
                    className="w-full bg-dark-card border border-dark-border rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-primary focus:outline-none"
                    placeholder="Nr."
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-3">
                <input
                  name="postalCode"
                  type="text"
                  value={formData.postalCode}
                  onChange={handleChange}
                  className="w-full bg-dark-card border border-dark-border rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-primary focus:outline-none"
                  placeholder="1234 AB"
                  required
                />
                <input
                  name="city"
                  type="text"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full bg-dark-card border border-dark-border rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-primary focus:outline-none"
                  placeholder="Plaats"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Wachtwoord *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-dark-card border border-dark-border rounded-lg px-4 py-3 pl-10 pr-10 text-white placeholder-gray-500 focus:border-primary focus:outline-none"
                  placeholder="Minimaal 8 tekens"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {/* Password strength indicator */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded ${
                          level <= passwordStrength.strength ? passwordStrength.color : 'bg-dark-border'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{passwordStrength.label}</p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                Bevestig wachtwoord *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full bg-dark-card border border-dark-border rounded-lg px-4 py-3 pl-10 text-white placeholder-gray-500 focus:border-primary focus:outline-none"
                  placeholder="••••••••"
                  required
                />
                {formData.confirmPassword && formData.password === formData.confirmPassword && (
                  <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
                )}
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-start">
              <input
                id="acceptTerms"
                name="acceptTerms"
                type="checkbox"
                checked={formData.acceptTerms}
                onChange={handleChange}
                className="mt-1 w-4 h-4 rounded border-dark-border bg-dark-card text-primary focus:ring-primary focus:ring-offset-dark-bg"
              />
              <label htmlFor="acceptTerms" className="ml-3 text-sm text-gray-400">
                Ik ga akkoord met de{' '}
                <a href="#" className="text-primary hover:text-primary-dark">
                  algemene voorwaarden
                </a>{' '}
                en het{' '}
                <a href="#" className="text-primary hover:text-primary-dark">
                  privacybeleid
                </a>
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-primary text-dark-bg rounded-lg hover:bg-primary-dark transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'E-mail versturen...' : 'Verificatie starten'}
            </button>
          </form>

          {/* Login link */}
          <p className="mt-6 text-center text-gray-400">
            Al een account?{' '}
            <Link to="/login" className="text-primary hover:text-primary-dark font-medium">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
