import { 
  ShoppingBagIcon, 
  CubeIcon, 
  UsersIcon, 
  ChartBarIcon 
} from "@heroicons/react/24/outline";

interface AdminStatsProps {
  stats: {
    totalProducts: number;
    activeProducts: number;
    totalOrders: number;
    totalUsers: number;
  };
}

const stats = [
  {
    name: "Total Products",
    value: "totalProducts",
    icon: CubeIcon,
    color: "bg-blue-500",
  },
  {
    name: "Active Products",
    value: "activeProducts",
    icon: ChartBarIcon,
    color: "bg-green-500",
  },
  {
    name: "Total Orders",
    value: "totalOrders",
    icon: ShoppingBagIcon,
    color: "bg-purple-500",
  },
  {
    name: "Total Users",
    value: "totalUsers",
    icon: UsersIcon,
    color: "bg-orange-500",
  },
];

export default function AdminStats({ stats: statsData }: AdminStatsProps) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        const value = statsData[stat.value as keyof typeof statsData];
        
        return (
          <div
            key={stat.name}
            className="relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow sm:px-6 sm:pt-6"
          >
            <dt>
              <div className={`absolute rounded-md p-3 ${stat.color}`}>
                <Icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">
                {stat.name}
              </p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
              <p className="text-2xl font-semibold text-gray-900">
                {value.toLocaleString()}
              </p>
            </dd>
          </div>
        );
      })}
    </div>
  );
}
