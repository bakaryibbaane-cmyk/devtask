import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../services/api";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await registerUser(name, email, password);
      setSuccess(true);
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Inscription
        </h1>
        {error && (
          <p className="bg-red-100 text-red-600 text-sm rounded-lg p-2 mb-4">
            {error}
          </p>
        )}
        {success && (
          <p className="bg-green-100 text-green-600 text-sm rounded-lg p-2 mb-4">
            Compte créé ! Redirection vers la connexion...
          </p>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Nom"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
          <input
            type="password"
            placeholder="Mot de passe (6 caractères min.)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
          <button
            type="submit"
            className="bg-purple-600 text-white rounded-lg py-2 text-sm hover:bg-purple-700"
          >
            S'inscrire
          </button>
        </form>
        <p className="text-sm text-gray-500 text-center mt-4">
          Déjà un compte ?{" "}
          <Link to="/login" className="text-purple-600 hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
