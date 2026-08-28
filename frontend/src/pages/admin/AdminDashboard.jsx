import { useEffect, useState } from "react";
import DashboardHeader from "../../components/admin/dashboard/DashboardHeader";
import StatCards from "../../components/admin/dashboard/StatCards";
import AnalyticsCharts from "../../components/admin/dashboard/AnalyticsCharts";
import DashboardTables from "../../components/admin/dashboard/DashboardTables";
import SystemHealth from "../../components/admin/dashboard/SystemHealth";
import ActivityTimeline from "../../components/admin/dashboard/ActivityTimeline";
import apiClient from "../../api/client";

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.get("/admin/dashboard");
        if (isMounted) {
          setData(response.data);
        }
      } catch (err) {
        console.error("Failed to fetch real admin dashboard data:", err);
        if (isMounted) {
          setError(err.response?.data?.message || "Failed to load real database analytics.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full mb-4" />
        <p className="text-body font-medium">Loading Real Platform Analytics...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] p-6 text-center">
        <div className="bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 p-6 rounded-2xl border border-red-200 dark:border-red-800/50 max-w-md">
          <h3 className="font-heading font-bold text-lg mb-2">Error Loading Dashboard</h3>
          <p className="text-sm font-medium">{error || "Unable to retrieve database analytics. Please ensure you are logged in as an Administrator."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto pb-12">
      {/* SECTION 1: HEADER */}
      <DashboardHeader />

      {/* SECTION 2: KPI CARDS WITH REAL DATA */}
      <StatCards overview={data.overview} />

      {/* SECTION 3, 4, 5, 6: RECHARTS ANALYTICS */}
      <AnalyticsCharts
        userAnalytics={data.userAnalytics}
        revenueAnalytics={data.revenueAnalytics}
        courseAnalytics={data.courseAnalytics}
        enrollmentAnalytics={data.enrollmentAnalytics}
      />

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        <div className="xl:col-span-3 space-y-8">
          {/* SECTION 7, 8, 9, 10: DATA TABLES */}
          <DashboardTables
            topCourses={data.topCourses || []}
            topInstructors={data.topInstructors || []}
            recentPayments={data.recentPayments || []}
            latestStudents={data.latestStudents || []}
          />

          {/* SECTION 11: SYSTEM STATUS & INSIGHTS */}
          <SystemHealth
            systemStatus={data.systemStatus}
            platformInsights={data.platformInsights || []}
            pendingApprovals={data.pendingApprovals}
          />
        </div>

        <div className="xl:col-span-1">
          {/* SECTION 12: REAL RECENT ACTIVITY TIMELINE */}
          <ActivityTimeline activities={data.recentActivities || []} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
