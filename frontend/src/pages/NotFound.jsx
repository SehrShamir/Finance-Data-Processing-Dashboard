import { Link } from 'react-router-dom';

export default function NotFound({ code = 404, message = 'Page not found' }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center">
      <p className="text-8xl font-bold text-gray-200">{code}</p>
      <p className="text-xl font-semibold text-gray-700">{message}</p>
      <Link to="/dashboard" className="btn-primary">Go to Dashboard</Link>
    </div>
  );
}
