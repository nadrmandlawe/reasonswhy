'use client';

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Flag, MessageSquare, Hash, MapPin } from "lucide-react";
import dynamic from 'next/dynamic';
import { LucideIcon } from "lucide-react";
import { Loading } from "@/components/ui/loading";
import type { ChartSectionProps } from '@/components/admin/ChartSection';

// Lazy load the chart component
const DynamicChartSection = dynamic<ChartSectionProps>(
  () => import('@/components/admin/ChartSection'),
  {
    loading: () => (
      <Card className="p-6">
        <div className="h-[300px] animate-pulse bg-muted rounded-lg" />
      </Card>
    ),
    ssr: false
  }
);

function MetricCard({ 
  title, 
  value, 
  icon: Icon,
  description 
}: { 
  title: string; 
  value: number | string;
  icon: LucideIcon;
  description?: string;
}) {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-2">
        <div className="p-2 rounded-lg bg-primary/10">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <h3 className="font-medium">{title}</h3>
      </div>
      <div className="mt-4">
        <p className="text-3xl font-bold">{value}</p>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
    </Card>
  );
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Fetch metrics with optimized pagination
  const totalReasons = useQuery(api.reasons.getCount);
  const flaggedReasons = useQuery(api.reasons.listFlaggedReasons);
  const allReasons = useQuery(api.reasons.listReasons, {
    paginationOpts: {
      numItems: 100, // Reduced from 1000 for better performance
      cursor: null
    },
  });

  useEffect(() => {
    if (status === "unauthenticated" || (status === "authenticated" && session?.user?.role !== "admin")) {
      router.push("/admin/login");
    }
  }, [session, status, router]);

  if (status === "loading" || !totalReasons || !flaggedReasons || !allReasons) {
    return <Loading />;
  }

  if (!session?.user || session.user.role !== "admin") {
    return null;
  }

  // Calculate metrics from the first 100 items
  const uniqueLocations = new Set(allReasons.page.map(r => r.location).filter(Boolean)).size;
  const allTags = allReasons.page.flatMap(r => r.tags || []);
  const uniqueTags = new Set(allTags).size;
  const averageTagsPerReason = allTags.length / allReasons.page.length;

  // Calculate location metrics
  const locationData = allReasons.page
    .filter(r => r.location)
    .reduce((acc: { [key: string]: number }, reason) => {
      acc[reason.location!] = (acc[reason.location!] || 0) + 1;
      return acc;
    }, {});

  const topLocations = Object.entries(locationData)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([name, value]) => ({ name, value }));

  return (
    <div className="flex flex-col flex-1">
      <div className="h-[60px] flex items-center px-6 border-b">
        <h1 className="font-semibold">Dashboard</h1>
      </div>
      
      <div className="p-6 space-y-6">
        {/* Main Metrics */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Total Reasons"
            value={totalReasons}
            icon={MessageSquare}
            description="Total reasons on the wall"
          />
          <MetricCard
            title="Flagged Reasons"
            value={flaggedReasons.length}
            icon={Flag}
            description="Reasons requiring review"
          />
          <MetricCard
            title="Unique Tags"
            value={uniqueTags}
            icon={Hash}
            description={`Avg ${averageTagsPerReason.toFixed(1)} tags per reason`}
          />
          <MetricCard
            title="Locations"
            value={uniqueLocations}
            icon={MapPin}
            description="Unique locations mentioned"
          />
        </div>

        {/* Location Distribution */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <DynamicChartSection topLocations={topLocations} />

          {/* Recent Flagged Reasons */}
          <Card className="p-6">
            <h2 className="flex items-center gap-2 mb-4 font-semibold">
              <Flag className="w-4 h-4" />
              Recent Flagged Reasons
            </h2>
            <div className="space-y-4">
              {flaggedReasons.slice(0, 5).map((flag) => (
                <div key={flag._id} className="flex items-start justify-between pb-4 border-b">
                  <div>
                    <p className="text-sm line-clamp-2">{flag.reason!.reasonText}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      by {flag.reason!.initialName}
                    </p>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {new Date(flag.flaggedAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Tag Distribution */}
        <Card className="p-6">
          <h2 className="flex items-center gap-2 mb-4 font-semibold">
            <Hash className="w-4 h-4" />
            Popular Tags
          </h2>
          <div className="flex flex-wrap gap-2">
            {Array.from(new Set(allTags))
              .map(tag => ({
                tag,
                count: allTags.filter(t => t === tag).length
              }))
              .sort((a, b) => b.count - a.count)
              .slice(0, 10)
              .map(({ tag, count }) => (
                <div 
                  key={tag} 
                  className="flex items-center gap-2 px-3 py-1 text-sm rounded-full bg-muted"
                >
                  <span>{tag}</span>
                  <span className="text-xs text-muted-foreground">{count}</span>
                </div>
              ))}
          </div>
        </Card>
      </div>
    </div>
  );
} 