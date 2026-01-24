import { useState, useCallback } from 'react';
import { useRequest } from 'ahooks';
import * as analyticsService from '@/services/analytics';
import { message } from 'antd';
import moment from 'moment';

export default function useAnalyticsModel() {
  const [dateRange, setDateRange] = useState({
    startDate: moment().subtract(30, 'days').format('YYYY-MM-DD'),
    endDate: moment().format('YYYY-MM-DD'),
  });

  // Get key metrics
  const { data: metrics, loading: loadingMetrics, run: fetchMetrics } = useRequest(
    () => analyticsService.getAnalyticsMetrics(dateRange),
    {
      refreshDeps: [dateRange],
      onError: () => message.error('Failed to load metrics'),
    }
  );

  // Get time series data
  const { data: timeSeries, loading: loadingTimeSeries } = useRequest(
    () => analyticsService.getTimeSeriesData(dateRange),
    {
      refreshDeps: [dateRange],
      onError: () => message.error('Failed to load time series data'),
    }
  );

  // Get hourly data
  const { data: hourlyData, loading: loadingHourly } = useRequest(
    () => analyticsService.getHourlyData({ date: moment().format('YYYY-MM-DD') }),
    {
      refreshOnWindowFocus: true,
      pollingInterval: 60000, // Refresh every minute
    }
  );

  // Get top customers
  const { data: topCustomers, loading: loadingCustomers } = useRequest(
    () => analyticsService.getTopCustomers({ ...dateRange, limit: 10 }),
    {
      refreshDeps: [dateRange],
    }
  );

  // Get top products
  const { data: topProducts, loading: loadingProducts } = useRequest(
    () => analyticsService.getTopProducts(dateRange),
    {
      refreshDeps: [dateRange],
    }
  );

  // Get message metrics
  const { data: messageMetrics, loading: loadingMessageMetrics } = useRequest(
    () => analyticsService.getMessageMetrics(dateRange),
    {
      refreshDeps: [dateRange],
    }
  );

  // Get real-time stats
  const { data: realTimeStats, loading: loadingRealTime } = useRequest(
    analyticsService.getRealTimeStats,
    {
      pollingInterval: 30000, // Poll every 30 seconds for real-time data
      pollingWhenHidden: false,
    }
  );

  // Update date range
  const updateDateRange = useCallback((start: string, end: string) => {
    setDateRange({ startDate: start, endDate: end });
  }, []);

  // Export data
  const exportData = useCallback(async (format: 'csv' | 'excel' | 'pdf') => {
    try {
      const blob = await analyticsService.exportAnalyticsData({
        ...dateRange,
        format,
      });
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics-${moment().format('YYYY-MM-DD')}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      message.success('Export started successfully');
    } catch (error) {
      message.error('Failed to export data');
    }
  }, [dateRange]);

  return {
    // State
    dateRange,
    loading: loadingMetrics || loadingTimeSeries || loadingCustomers || loadingProducts,
    
    // Data
    metrics: metrics?.data,
    timeSeries: timeSeries?.data?.list || [],
    hourlyData: hourlyData?.data || [],
    topCustomers: topCustomers?.data?.list || [],
    topProducts: topProducts?.data?.list || [],
    messageMetrics: messageMetrics?.data,
    realTimeStats: realTimeStats?.data,
    
    // Actions
    updateDateRange,
    exportData,
    refreshMetrics: fetchMetrics,
  };
}