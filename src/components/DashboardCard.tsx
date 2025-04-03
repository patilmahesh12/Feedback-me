import Link from 'next/link';

export default function DashboardCard({
  title,
  description,
  href
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link href={href}>
      <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </Link>
  );
}