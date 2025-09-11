import { Link } from "react-router-dom";

export default function Home() {
  const cards = [
    {
      to: "/list",
      title: "Ver Productos",
      desc: "Consulta la lista completa de productos registrados.",
      color: "from-blue-500 to-indigo-600",
    },
    {
      to: "/add",
      title: "Registrar Producto",
      desc: "Agrega un nuevo producto con nombre, precio y notas.",
      color: "from-green-500 to-emerald-600",
    },
    {
      to: "/query",
      title: "Consultas IA",
      desc: "Haz preguntas a la base de datos y recibe interpretaciones.",
      color: "from-purple-500 to-pink-600",
    },
  ];

  return (
    <div className="grid md:grid-cols-3 gap-6 mt-8">
      {cards.map(({ to, title, desc, color }) => (
        <Link
          key={to}
          to={to}
          className={`card-style group hover:scale-105 transform transition-all bg-gradient-to-br ${color} text-white`}
        >
          <div className="flex flex-col items-center text-center space-y-3">
            <h2 className="text-lg font-bold">{title}</h2>
            <p className="text-sm opacity-90">{desc}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
