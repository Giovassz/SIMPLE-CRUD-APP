import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  const links = [
    { to: "/", emoji: "🏠", label: "Inicio" },
    { to: "/list", emoji: "📦", label: "Productos" },
    { to: "/add", emoji: "✍️", label: "Registrar" },
    { to: "/query", emoji: "🔍", label: "Consultas" },
  ];

  return (
    <nav className="navbar-dock">
      {links.map(({ to, emoji, label }) => (
        <Link
          key={to}
          to={to}
          className={`flex flex-col items-center px-3 py-1 rounded-md transition-all ${
            location.pathname === to
              ? "text-purple-600 dark:text-purple-400 font-semibold scale-110"
              : "text-gray-600 dark:text-gray-300 hover:text-purple-500"
          }`}
        >
          <span className="text-xl">{emoji}</span>
          <span className="text-[0.7rem] mt-1">{label}</span>
        </Link>
      ))}
    </nav>
  );
}
