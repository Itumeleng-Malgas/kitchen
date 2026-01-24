import { useState, useCallback } from 'react';
import { useRequest } from 'ahooks';
import * as securityService from '@/services/security';
import { message, notification } from 'antd';
import moment from 'moment';

export default function useSecurityModel() {
  const [loading, setLoading] = useState(false);

  // Get security metrics
  const { data: metrics, loading: loadingMetrics, run: fetchMetrics } = useRequest(
    securityService.getSecurityMetrics,
    {
      onError: () => message.error('Failed to load security metrics'),
    }
  );

  // Get security events
  const { data: events, loading: loadingEvents, run: fetchEvents } = useRequest(
    () => securityService.getSecurityEvents({ pageSize: 20, current: 1 }),
    {
      onError: () => message.error('Failed to load security events'),
    }
  );

  // Get active sessions
  const { data: sessions, loading: loadingSessions, run: fetchSessions } = useRequest(
    securityService.getActiveSessions,
    {
      onError: () => message.error('Failed to load active sessions'),
    }
  );

  // Get 2FA methods
  const { data: twoFactorMethods, loading: loading2FA, run: fetch2FA } = useRequest(
    securityService.getTwoFactorMethods,
    {
      onError: () => message.error('Failed to load 2FA methods'),
    }
  );

  // Change password
  const changePassword = useCallback(async (data: any) => {
    setLoading(true);
    try {
      const result = await securityService.changePassword(data);
      if (result.success) {
        message.success('Password changed successfully');
        
        // Log security event
        notification.success({
          message: 'Security Update',
          description: 'Your password has been changed successfully.',
          duration: 5,
        });
        
        return result;
      } else {
        message.error(result.errorMessage || 'Failed to change password');
        return result;
      }
    } catch (error: any) {
      message.error(error.message || 'Failed to change password');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Enable 2FA
  const enableTwoFactor = useCallback(async (data: any) => {
    setLoading(true);
    try {
      const result = await securityService.enableTwoFactor(data);
      if (result.success) {
        message.success('Two-factor authentication enabled');
        
        notification.success({
          message: '2FA Enabled',
          description: 'Two-factor authentication has been successfully enabled.',
          duration: 5,
        });
        
        // Refresh 2FA methods
        await fetch2FA();
        return result;
      } else {
        message.error(result.errorMessage || 'Failed to enable 2FA');
        return result;
      }
    } catch (error: any) {
      message.error(error.message || 'Failed to enable 2FA');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [fetch2FA]);

  // Disable 2FA
  const disableTwoFactor = useCallback(async (verificationCode: string) => {
    setLoading(true);
    try {
      const result = await securityService.disableTwoFactor(verificationCode);
      if (result.success) {
        message.success('Two-factor authentication disabled');
        
        notification.warning({
          message: '2FA Disabled',
          description: 'Two-factor authentication has been disabled.',
          duration: 5,
        });
        
        await fetch2FA();
        return result;
      } else {
        message.error(result.errorMessage || 'Failed to disable 2FA');
        return result;
      }
    } catch (error: any) {
      message.error(error.message || 'Failed to disable 2FA');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [fetch2FA]);

  // Delete account
  const deleteAccount = useCallback(async (data: any) => {
    setLoading(true);
    try {
      const result = await securityService.deleteAccount(data);
      if (result.success) {
        message.success('Account deletion initiated');
        
        notification.warning({
          message: 'Account Deletion Requested',
          description: `Your account will be deleted on ${moment(result.deletionScheduled).format('MMMM D, YYYY')}`,
          duration: 0, // Don't auto-close
        });
        
        return result;
      } else {
        message.error(result.errorMessage || 'Failed to delete account');
        return result;
      }
    } catch (error: any) {
      message.error(error.message || 'Failed to delete account');
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Terminate session
  const terminateSession = useCallback(async (sessionId: string) => {
    try {
      const result = await securityService.terminateSession(sessionId);
      if (result.success) {
        message.success('Session terminated');
        await fetchSessions();
        return result;
      } else {
        message.error('Failed to terminate session');
        return result;
      }
    } catch (error: any) {
      message.error(error.message || 'Failed to terminate session');
      throw error;
    }
  }, [fetchSessions]);

  // Terminate all other sessions
  const terminateAllOtherSessions = useCallback(async () => {
    try {
      const result = await securityService.terminateAllOtherSessions();
      if (result.success) {
        message.success(`Terminated ${result.terminated} sessions`);
        await fetchSessions();
        return result;
      } else {
        message.error('Failed to terminate sessions');
        return result;
      }
    } catch (error: any) {
      message.error(error.message || 'Failed to terminate sessions');
      throw error;
    }
  }, [fetchSessions]);

  // Export security data
  const exportSecurityData = useCallback(async (format: 'json' | 'csv' | 'pdf') => {
    try {
      const blob = await securityService.exportSecurityData(format);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `security-data-${moment().format('YYYY-MM-DD')}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      message.success('Security data exported successfully');
    } catch (error) {
      message.error('Failed to export security data');
      throw error;
    }
  }, []);

  // Generate backup codes
  const generateBackupCodes = useCallback(async (verificationCode: string) => {
    try {
      const result = await securityService.generateBackupCodes(verificationCode);
      if (result.success) {
        message.success('New backup codes generated');
        return result.backupCodes;
      } else {
        message.error('Failed to generate backup codes');
        return null;
      }
    } catch (error: any) {
      message.error(error.message || 'Failed to generate backup codes');
      throw error;
    }
  }, []);

  // Rotate API key
  const rotateApiKey = useCallback(async (keyId: string) => {
    try {
      const result = await securityService.rotateApiKey(keyId);
      if (result.success) {
        message.success('API key rotated successfully');
        return result.newKey;
      } else {
        message.error('Failed to rotate API key');
        return null;
      }
    } catch (error: any) {
      message.error(error.message || 'Failed to rotate API key');
      throw error;
    }
  }, []);

  return {
    // State
    loading: loading || loadingMetrics || loadingEvents || loadingSessions || loading2FA,
    
    // Data
    metrics: metrics?.data,
    events: events?.data?.list || [],
    sessions: sessions?.data || [],
    twoFactorMethods: twoFactorMethods?.data || [],
    
    // Actions
    changePassword,
    enableTwoFactor,
    disableTwoFactor,
    deleteAccount,
    terminateSession,
    terminateAllOtherSessions,
    exportSecurityData,
    generateBackupCodes,
    rotateApiKey,
    
    // Refresh functions
    refreshMetrics: fetchMetrics,
    refreshEvents: fetchEvents,
    refreshSessions: fetchSessions,
    refresh2FA: fetch2FA,
  };
}