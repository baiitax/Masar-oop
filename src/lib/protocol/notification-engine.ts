// MASAR Protocol - Notification Engine
// Intelligent notification routing and delivery

import {
  Notification,
  NotificationRecipient,
  MASARTransaction,
  AuditEvent
} from './types';

// ============================================================
// NOTIFICATION ENGINE
// ============================================================

export class NotificationEngine {
  private templates: Map<string, NotificationTemplate> = new Map();
  private auditLog: AuditEvent[] = [];

  constructor() {
    this.initializeTemplates();
  }

  /**
   * Initialize notification templates
   */
  private initializeTemplates(): void {
    const templates: NotificationTemplate[] = [
      {
        id: 'KYB_APPROVED',
        title: 'KYB Verification Approved',
        message: 'KYB verification for {{organizationName}} has been approved. Transaction {{transactionId}} can proceed to compliance review.',
        category: 'INFO',
        channels: ['EMAIL', 'IN_APP'],
        recipients: ['COMPLIANCE_TEAM', 'OPERATIONS']
      },
      {
        id: 'COMPLIANCE_READY',
        title: 'Compliance Pack Ready',
        message: 'Compliance pack for transaction {{transactionId}} is ready. All mandatory documents verified.',
        category: 'INFO',
        channels: ['EMAIL', 'IN_APP'],
        recipients: ['INSPECTION_TEAM', 'EXPORTER']
      },
      {
        id: 'INSPECTION_PASSED',
        title: 'Inspection Passed',
        message: 'Inspection for transaction {{transactionId}} has passed. Quality score: {{qualityScore}}%.',
        category: 'INFO',
        channels: ['EMAIL', 'IN_APP'],
        recipients: ['FINANCE_TEAM', 'OPERATIONS', 'BUYER', 'EXPORTER']
      },
      {
        id: 'INSPECTION_FAILED',
        title: 'Inspection Failed',
        message: 'Inspection for transaction {{transactionId}} has failed. Immediate action required.',
        category: 'ALERT',
        channels: ['EMAIL', 'SMS', 'IN_APP'],
        recipients: ['OPERATIONS', 'COMPLIANCE', 'BUYER', 'EXPORTER']
      },
      {
        id: 'FUNDS_SECURED',
        title: 'Funds Secured',
        message: 'Funds for transaction {{transactionId}} have been secured in escrow.',
        category: 'INFO',
        channels: ['EMAIL', 'IN_APP'],
        recipients: ['OPERATIONS', 'FINANCE_TEAM']
      },
      {
        id: 'RELEASE_ELIGIBLE',
        title: 'Release Eligible',
        message: 'Transaction {{transactionId}} is now eligible for release. All conditions satisfied.',
        category: 'ACTION_REQUIRED',
        channels: ['EMAIL', 'SMS', 'IN_APP'],
        recipients: ['OPERATIONS', 'FINANCE_TEAM', 'COMPLIANCE']
      },
      {
        id: 'DOCUMENT_EXPIRING',
        title: 'Document Expiring Soon',
        message: 'Document {{documentType}} for transaction {{transactionId}} expires in {{daysRemaining}} days.',
        category: 'WARNING',
        channels: ['EMAIL', 'IN_APP'],
        recipients: ['COMPLIANCE', 'EXPORTER']
      },
      {
        id: 'SLA_WARNING',
        title: 'SLA Warning',
        message: 'SLA for {{policyName}} is at {{percentage}}% for transaction {{transactionId}}.',
        category: 'WARNING',
        channels: ['EMAIL', 'IN_APP'],
        recipients: ['OWNER']
      },
      {
        id: 'SLA_CRITICAL',
        title: 'SLA Critical',
        message: 'CRITICAL: SLA for {{policyName}} is at {{percentage}}% for transaction {{transactionId}}. Immediate action required.',
        category: 'ALERT',
        channels: ['EMAIL', 'SMS', 'IN_APP'],
        recipients: ['SUPERVISOR', 'OWNER']
      },
      {
        id: 'SANCTIONS_MATCH',
        title: 'Sanctions Match Detected',
        message: 'CRITICAL: Potential sanctions match detected for transaction {{transactionId}}. Transaction frozen.',
        category: 'ALERT',
        channels: ['EMAIL', 'SMS', 'IN_APP'],
        recipients: ['COMPLIANCE_HEAD', 'CEO']
      },
      {
        id: 'DOCUMENT_REQUEST',
        title: 'Document Required',
        message: 'Document {{documentType}} is required for transaction {{transactionId}}. Deadline: {{deadline}}.',
        category: 'ACTION_REQUIRED',
        channels: ['EMAIL', 'IN_APP'],
        recipients: ['EXPORTER']
      },
      {
        id: 'SETTLEMENT_COMPLETED',
        title: 'Settlement Completed',
        message: 'Settlement for transaction {{transactionId}} has been completed. Amount: {{amount}} {{currency}}.',
        category: 'INFO',
        channels: ['EMAIL', 'IN_APP'],
        recipients: ['OPERATIONS', 'FINANCE_TEAM', 'BUYER', 'EXPORTER']
      }
    ];

    templates.forEach(template => this.templates.set(template.id, template));
  }

  /**
   * Send notification
   */
  async sendNotification(
    transaction: MASARTransaction,
    templateId: string,
    variables: Record<string, string>,
    additionalRecipients: string[] = []
  ): Promise<{ success: boolean; notification: Notification | null }> {
    const template = this.templates.get(templateId);

    if (!template) {
      return { success: false, notification: null };
    }

    // Replace variables in template
    const title = this.replaceVariables(template.title, variables);
    const message = this.replaceVariables(template.message, variables);

    // Determine recipients
    const recipients = await this.determineRecipients(
      transaction,
      template.recipients,
      additionalRecipients
    );

    // Create notification
    const notification: Notification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      transactionId: transaction.id,
      type: templateId,
      category: template.category,
      title,
      message,
      recipients,
      channels: template.channels,
      status: 'PENDING',
      sentAt: null,
      readAt: null,
      actionUrl: null,
      actionLabel: null
    };

    // Send through channels
    await this.deliverNotification(notification);

    this.addAuditEvent(
      transaction.id,
      'NOTIFICATION_SENT',
      `Notification sent: ${templateId} to ${recipients.length} recipients`
    );

    return { success: true, notification };
  }

  /**
   * Send custom notification
   */
  async sendCustomNotification(
    transactionId: string,
    title: string,
    message: string,
    category: Notification['category'],
    recipients: NotificationRecipient[],
    channels: Notification['channels']
  ): Promise<{ success: boolean; notification: Notification }> {
    const notification: Notification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      transactionId,
      type: 'CUSTOM',
      category,
      title,
      message,
      recipients,
      channels,
      status: 'PENDING',
      sentAt: null,
      readAt: null,
      actionUrl: null,
      actionLabel: null
    };

    await this.deliverNotification(notification);

    this.addAuditEvent(
      transactionId,
      'NOTIFICATION_SENT',
      `Custom notification sent: ${title}`
    );

    return { success: true, notification };
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string, userId: string): Promise<{ success: boolean }> {
    // In production, this would update the notification in the database
    this.addAuditEvent('', 'NOTIFICATION_READ', `Notification ${notificationId} read by ${userId}`);
    return { success: true };
  }

  /**
   * Get notifications for user
   */
  async getNotificationsForUser(
    userId: string,
    filters?: {
      transactionId?: string;
      category?: string;
      status?: string;
      limit?: number;
    }
  ): Promise<Notification[]> {
    // In production, this would query the database
    return [];
  }

  /**
   * Get notification statistics
   */
  async getStatistics(userId: string): Promise<NotificationStatistics> {
    // In production, this would aggregate from database
    return {
      total: 0,
      unread: 0,
      byCategory: {
        INFO: 0,
        WARNING: 0,
        ALERT: 0,
        ACTION_REQUIRED: 0
      }
    };
  }

  // ============================================================
  // PRIVATE METHODS
  // ============================================================

  private replaceVariables(template: string, variables: Record<string, string>): string {
    let result = template;

    for (const [key, value] of Object.entries(variables)) {
      result = result.replace(new RegExp(`{{${key}}}`, 'g'), value);
    }

    return result;
  }

  private async determineRecipients(
    transaction: MASARTransaction,
    templateRecipients: string[],
    additionalRecipients: string[]
  ): Promise<NotificationRecipient[]> {
    const recipients: NotificationRecipient[] = [];
    const processedRoles = new Set<string>();

    // Process template recipients
    for (const recipient of templateRecipients) {
      if (processedRoles.has(recipient)) continue;
      processedRoles.add(recipient);

      const userId = await this.resolveRecipient(transaction, recipient);

      if (userId) {
        recipients.push({
          userId,
          role: recipient,
          channel: 'IN_APP',
          status: 'PENDING'
        });
      }
    }

    // Process additional recipients
    for (const recipient of additionalRecipients) {
      if (processedRoles.has(recipient)) continue;
      processedRoles.add(recipient);

      recipients.push({
        userId: recipient,
        role: 'ADDITIONAL',
        channel: 'IN_APP',
        status: 'PENDING'
      });
    }

    return recipients;
  }

  private async resolveRecipient(
    transaction: MASARTransaction,
    role: string
  ): Promise<string | null> {
    // In production, this would resolve role to actual user IDs
    const roleMap: Record<string, string> = {
      'COMPLIANCE_TEAM': 'compliance-team',
      'OPERATIONS': 'operations-team',
      'INSPECTION_TEAM': 'inspection-team',
      'FINANCE_TEAM': 'finance-team',
      'BUYER': transaction.buyer.contactId,
      'EXPORTER': transaction.exporter.contactId,
      'OWNER': transaction.assignedTo || 'operations-team',
      'SUPERVISOR': 'supervisor',
      'COMPLIANCE_HEAD': 'compliance-head',
      'FINANCE_HEAD': 'finance-head',
      'OPERATIONS_HEAD': 'operations-head',
      'CEO': 'ceo'
    };

    return roleMap[role] || null;
  }

  private async deliverNotification(notification: Notification): Promise<void> {
    // Deliver through each channel
    for (const channel of notification.channels) {
      switch (channel) {
        case 'EMAIL':
          await this.sendEmail(notification);
          break;
        case 'SMS':
          await this.sendSMS(notification);
          break;
        case 'WHATSAPP':
          await this.sendWhatsApp(notification);
          break;
        case 'IN_APP':
          await this.sendInApp(notification);
          break;
      }
    }

    notification.status = 'SENT';
    notification.sentAt = new Date().toISOString();
  }

  private async sendEmail(notification: Notification): Promise<void> {
    // In production, this would integrate with email service
    console.log(`[EMAIL] ${notification.title}: ${notification.message}`);
  }

  private async sendSMS(notification: Notification): Promise<void> {
    // In production, this would integrate with SMS service
    console.log(`[SMS] ${notification.title}: ${notification.message}`);
  }

  private async sendWhatsApp(notification: Notification): Promise<void> {
    // In production, this would integrate with WhatsApp Business API
    console.log(`[WHATSAPP] ${notification.title}: ${notification.message}`);
  }

  private async sendInApp(notification: Notification): Promise<void> {
    // In production, this would store in database for in-app display
    console.log(`[IN_APP] ${notification.title}: ${notification.message}`);
  }

  private addAuditEvent(transactionId: string, eventType: string, details: string): void {
    const event: AuditEvent = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      transactionId,
      eventType,
      category: 'SYSTEM',
      action: details,
      actor: 'SYSTEM',
      actorType: 'SYSTEM',
      target: transactionId,
      targetType: 'TRANSACTION',
      details: {},
      evidence: [],
      timestamp: new Date().toISOString(),
      hash: this.simpleHash(`${eventType}:${details}:${Date.now()}`),
      previousHash: null,
      ipAddress: null,
      userAgent: null
    };

    this.auditLog.push(event);
  }

  private simpleHash(input: string): string {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16).padStart(8, '0');
  }
}

// ============================================================
// NOTIFICATION TYPES
// ============================================================

export interface NotificationTemplate {
  id: string;
  title: string;
  message: string;
  category: Notification['category'];
  channels: Notification['channels'];
  recipients: string[];
}

export interface NotificationStatistics {
  total: number;
  unread: number;
  byCategory: Record<string, number>;
}

// ============================================================
// NOTIFICATION DISPLAY HELPERS
// ============================================================

export function getNotificationCategoryDisplay(category: string): {
  label: string;
  color: string;
  icon: string;
} {
  const displays: Record<string, { label: string; color: string; icon: string }> = {
    'INFO': { label: 'Information', color: '#3B82F6', icon: 'ℹ' },
    'WARNING': { label: 'Warning', color: '#F59E0B', icon: '⚠' },
    'ALERT': { label: 'Alert', color: '#EF4444', icon: '🔔' },
    'ACTION_REQUIRED': { label: 'Action Required', color: '#8B5CF6', icon: '→' }
  };

  return displays[category] || { label: category, color: '#6B7280', icon: '?' };
}

export function getNotificationStatusDisplay(status: string): {
  label: string;
  color: string;
} {
  const displays: Record<string, { label: string; color: string }> = {
    'PENDING': { label: 'Pending', color: '#6B7280' },
    'SENT': { label: 'Sent', color: '#3B82F6' },
    'DELIVERED': { label: 'Delivered', color: '#10B981' },
    'READ': { label: 'Read', color: '#10B981' }
  };

  return displays[status] || { label: status, color: '#6B7280' };
}

export function getChannelDisplay(channel: string): {
  label: string;
  icon: string;
} {
  const displays: Record<string, { label: string; icon: string }> = {
    'EMAIL': { label: 'Email', icon: '✉' },
    'SMS': { label: 'SMS', icon: '📱' },
    'WHATSAPP': { label: 'WhatsApp', icon: '💬' },
    'IN_APP': { label: 'In-App', icon: '🔔' }
  };

  return displays[channel] || { label: channel, icon: '?' };
}
