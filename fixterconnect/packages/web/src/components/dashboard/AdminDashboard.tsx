import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../config/api';
import {
  Users,
  MessageSquare,
  AlertTriangle,
  Activity,
  Search,
  Trash2,
  Slash,
  Eye,
  X,
  CheckCircle,
  XCircle,
  Lock,
  Briefcase,
  Plus,
  Edit,
  ToggleLeft,
  ToggleRight,
  MapPin,
  Globe
} from 'react-feather';

type AdminSection = 'users' | 'messages' | 'reports' | 'activity' | 'services' | 'service-areas' | 'languages';

interface Language {
  id: number;
  name: string;
  code: string;
  flag: string;
  isActive: boolean;
  createdAt: string;
}
type UserType = 'client' | 'contractor';

interface User {
  id: string;
  originalId: number;
  name: string;
  email: string;
  phone: string;
  type: UserType;
  status: 'active' | 'suspended';
  joinDate: string;
  totalJobs: number;
  totalSpent?: number;
  totalEarned?: number;
}

interface FlaggedMessage {
  id: number;
  messageId: number | null;
  messageText: string;
  flaggedBy: 'CONTRACTOR' | 'CLIENT';
  flaggedById: number;
  contractorId: number;
  clientId: number;
  reason: string;
  details: string | null;
  status: 'PENDING' | 'REVIEWED' | 'ACTION_TAKEN' | 'DISMISSED';
  reviewedBy: number | null;
  reviewedAt: string | null;
  createdAt: string;
  contractor: {
    id: number;
    name: string;
  };
  client: {
    id: number;
    firstName: string;
    lastName: string;
  };
}

interface Report {
  id: number;
  reportedBy: string;
  reportedUser: string;
  reason: string;
  description: string;
  timestamp: string;
  status: 'pending' | 'reviewed' | 'resolved';
}

interface ActivityLog {
  id: number;
  user: string;
  action: string;
  details: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high';
}

interface ServiceItem {
  id: number;
  name: string;
  category: string;
  description: string;
  active: boolean;
  contractorCount?: number;
}

const AdminDashboard: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeSection, setActiveSection] = useState<AdminSection>('users');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [serviceForm, setServiceForm] = useState({ name: '', description: '' });
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null);
  const [showMessagesModal, setShowMessagesModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // State for real data from API
  const [users, setUsers] = useState<User[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [flaggedMessages, setFlaggedMessages] = useState<FlaggedMessage[]>([]);
  const [selectedFlag, setSelectedFlag] = useState<FlaggedMessage | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [actionNote, setActionNote] = useState('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState<string>('');
  const [reports] = useState<Report[]>([]); // Keep empty for now
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);

  // Service Areas state
  const [serviceAreas, setServiceAreas] = useState<any[]>([]);
  const [showAddAreaModal, setShowAddAreaModal] = useState(false);
  const [editingArea, setEditingArea] = useState<any>(null);
  const [areaForm, setAreaForm] = useState({ name: '', state: '' });

  // Languages state
  const [languages, setLanguages] = useState<Language[]>([]);
  const [showAddLanguageModal, setShowAddLanguageModal] = useState(false);
  const [editingLanguage, setEditingLanguage] = useState<Language | null>(null);
  const [languageForm, setLanguageForm] = useState({ name: '', code: '', flag: '' });

  // Fetch admin data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchAdminData();
    }
  }, [isAuthenticated]);

  const fetchAdminData = async () => {
    try {
      setLoading(true);

      // Fetch users
      const usersResponse = await fetch(`${API_BASE_URL}/admin/users`);
      const usersData = await usersResponse.json();
      if (usersData.success) {
        setUsers(usersData.users);
      }

      // Fetch services
      const servicesResponse = await fetch(`${API_BASE_URL}/admin/services`);
      const servicesData = await servicesResponse.json();
      if (servicesData.success) {
        setServices(servicesData.services);
      }

      // Fetch flagged messages
      const messagesResponse = await fetch(`${API_BASE_URL}/flagged-messages`);
      const messagesData = await messagesResponse.json();
      if (messagesData.success) {
        setFlaggedMessages(messagesData.flaggedMessages);
      }

      // Fetch activity logs
      const logsResponse = await fetch(`${API_BASE_URL}/admin/activity-logs`);
      const logsData = await logsResponse.json();
      if (logsData.success) {
        setActivityLogs(logsData.logs);
      }

      // Fetch service areas
      const areasResponse = await fetch(`${API_BASE_URL}/admin/service-areas`);
      const areasData = await areasResponse.json();
      if (areasData.success) {
        setServiceAreas(areasData.serviceAreas);
      }

      // Fetch languages
      const languagesResponse = await fetch(`${API_BASE_URL}/languages/all`);
      const languagesData = await languagesResponse.json();
      if (languagesData.success) {
        setLanguages(languagesData.languages);
      }

    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle admin actions on flagged messages
  const handleAdminAction = async (action: string) => {
    if (!selectedFlag) return;

    try {
      // Determine the target user based on who was flagged
      const targetUserId = selectedFlag.flaggedBy === 'CLIENT'
        ? selectedFlag.contractorId
        : selectedFlag.clientId;

      const targetUserType = selectedFlag.flaggedBy === 'CLIENT' ? 'CONTRACTOR' : 'CLIENT';

      // Handle different actions
      if (action === 'dismiss') {
        // Just update the flag status to DISMISSED
        const response = await fetch(`${API_BASE_URL}/flagged-messages/${selectedFlag.id}/status`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            status: 'DISMISSED',
            reviewedBy: 1, // TODO: Replace with actual admin user ID
            adminNote: actionNote || 'Flag dismissed - no action required'
          })
        });

        if (response.ok) {
          alert('Flag dismissed successfully');
          fetchAdminData(); // Refresh the data
          setShowReviewModal(false);
          setShowConfirmDialog(false);
          setSelectedFlag(null);
          setActionNote('');
          setConfirmAction('');
        } else {
          alert('Error dismissing flag');
        }
      } else if (action === 'warn' || action === 'suspend' || action === 'ban') {
        // Call admin action endpoint (to be created)
        const response = await fetch(`${API_BASE_URL}/admin/user-action`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userId: targetUserId,
            userType: targetUserType,
            action: action.toUpperCase(),
            reason: selectedFlag.reason,
            adminNote: actionNote || `Action taken due to flagged message: ${selectedFlag.reason}`,
            flagId: selectedFlag.id
          })
        });

        if (response.ok) {
          // Update the flag status
          await fetch(`${API_BASE_URL}/flagged-messages/${selectedFlag.id}/status`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              status: 'ACTION_TAKEN',
              reviewedBy: 1, // TODO: Replace with actual admin user ID
              adminNote: actionNote || `${action.toUpperCase()} action taken`
            })
          });

          alert(`User ${action}ed successfully`);
          fetchAdminData(); // Refresh the data
          setShowReviewModal(false);
          setShowConfirmDialog(false);
          setSelectedFlag(null);
          setActionNote('');
          setConfirmAction('');
        } else {
          const errorData = await response.json();
          alert(`Error: ${errorData.error || 'Failed to perform action'}`);
        }
      } else if (action === 'delete') {
        // Delete the message (to be implemented in backend)
        const response = await fetch(`${API_BASE_URL}/admin/delete-message`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            flagId: selectedFlag.id,
            messageId: selectedFlag.messageId,
            adminNote: actionNote || 'Message deleted due to TOS violation'
          })
        });

        if (response.ok) {
          // Update the flag status
          await fetch(`${API_BASE_URL}/flagged-messages/${selectedFlag.id}/status`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              status: 'ACTION_TAKEN',
              reviewedBy: 1, // TODO: Replace with actual admin user ID
              adminNote: actionNote || 'Message deleted'
            })
          });

          alert('Message deleted successfully');
          fetchAdminData(); // Refresh the data
          setShowReviewModal(false);
          setShowConfirmDialog(false);
          setSelectedFlag(null);
          setActionNote('');
          setConfirmAction('');
        } else {
          alert('Error deleting message');
        }
      }
    } catch (error) {
      console.error('Error performing admin action:', error);
      alert('An error occurred while performing the action');
    }
  };

  // TODO: Replace with actual authentication against backend
  const handleLogin = () => {
    // Temporary hardcoded password - MUST be replaced with secure backend auth
    if (password === 'admin123') {
      setIsAuthenticated(true);
    } else {
      alert('Invalid password');
    }
  };

  // Login screen
  if (!isAuthenticated) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#f8fafc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '48px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          maxWidth: '400px',
          width: '90%'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '24px',
            gap: '12px'
          }}>
            <Lock size={32} color="#ef4444" />
            <h1 style={{
              fontSize: '28px',
              fontWeight: 'bold',
              color: '#1e293b',
              margin: 0
            }}>
              Admin Access
            </h1>
          </div>
          <p style={{
            textAlign: 'center',
            color: '#64748b',
            marginBottom: '32px'
          }}>
            This area is restricted to authorized administrators only.
          </p>
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#1e293b',
              marginBottom: '8px'
            }}>
              Admin Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              placeholder="Enter admin password"
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
            />
          </div>
          <button
            onClick={handleLogin}
            style={{
              width: '100%',
              padding: '14px',
              backgroundColor: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            LOGIN
          </button>
          <p style={{
            fontSize: '12px',
            color: '#94a3b8',
            textAlign: 'center',
            marginTop: '24px'
          }}>
            TODO: Replace with secure backend authentication
          </p>
        </div>
      </div>
    );
  }

  const menuItems = [
    { id: 'users' as AdminSection, label: 'User Management', icon: Users },
    { id: 'services' as AdminSection, label: 'Services Management', icon: Briefcase },
    { id: 'service-areas' as AdminSection, label: 'Service Areas', icon: MapPin },
    { id: 'languages' as AdminSection, label: 'Languages', icon: Globe },
    { id: 'messages' as AdminSection, label: 'Message Monitoring', icon: MessageSquare },
    { id: 'reports' as AdminSection, label: 'Reports & Flags', icon: AlertTriangle },
    { id: 'activity' as AdminSection, label: 'Activity Logs', icon: Activity }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#94a3b8';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#f59e0b';
      case 'reviewed': return '#3b82f6';
      case 'resolved': return '#10b981';
      default: return '#94a3b8';
    }
  };

  // User Management Section
  const renderUserManagement = () => {
    const filteredUsers = users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div>
        <h2 style={{
          fontSize: '28px',
          fontWeight: 'bold',
          color: '#1e293b',
          marginBottom: '8px'
        }}>
          User Management
        </h2>
        <p style={{
          fontSize: '16px',
          color: '#64748b',
          marginBottom: '24px'
        }}>
          View, suspend, or delete user accounts
        </p>

        {/* Search Bar */}
        <div style={{
          position: 'relative',
          marginBottom: '24px'
        }}>
          <Search
            size={20}
            style={{
              position: 'absolute',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#94a3b8'
            }}
          />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '14px 14px 14px 48px',
              border: '2px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '16px',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Users Table */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          overflow: 'hidden'
        }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse'
          }}>
            <thead>
              <tr style={{
                backgroundColor: '#f8fafc',
                borderBottom: '2px solid #e2e8f0'
              }}>
                <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: 'bold', color: '#1e293b' }}>Name</th>
                <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: 'bold', color: '#1e293b' }}>Email</th>
                <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: 'bold', color: '#1e293b' }}>Type</th>
                <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: 'bold', color: '#1e293b' }}>Status</th>
                <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: 'bold', color: '#1e293b' }}>Jobs</th>
                <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: 'bold', color: '#1e293b' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id} style={{
                  borderBottom: '1px solid #e2e8f0'
                }}>
                  <td style={{ padding: '16px', fontSize: '15px', color: '#1e293b' }}>{user.name}</td>
                  <td style={{ padding: '16px', fontSize: '14px', color: '#64748b' }}>{user.email}</td>
                  <td style={{ padding: '16px' }}>
                    <span style={{
                      padding: '4px 12px',
                      backgroundColor: user.type === 'contractor' ? '#dbeafe' : '#fef3c7',
                      color: user.type === 'contractor' ? '#1e40af' : '#92400e',
                      borderRadius: '6px',
                      fontSize: '13px',
                      fontWeight: '600'
                    }}>
                      {user.type.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <span style={{
                      padding: '4px 12px',
                      backgroundColor: user.status === 'active' ? '#dcfce7' : '#fee2e2',
                      color: user.status === 'active' ? '#166534' : '#991b1b',
                      borderRadius: '6px',
                      fontSize: '13px',
                      fontWeight: '600'
                    }}>
                      {user.status.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '16px', fontSize: '15px', color: '#1e293b' }}>{user.totalJobs}</td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setShowUserModal(true);
                        }}
                        style={{
                          padding: '8px 12px',
                          backgroundColor: 'transparent',
                          color: '#64748b',
                          border: '1px solid #e2e8f0',
                          borderRadius: '6px',
                          fontSize: '13px',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <Eye size={14} />
                        VIEW
                      </button>
                      <button
                        onClick={() => {
                          // TODO: Implement suspend user API call
                          alert(`Suspend user: ${user.name}`);
                        }}
                        style={{
                          padding: '8px 12px',
                          backgroundColor: 'transparent',
                          color: '#64748b',
                          border: '1px solid #e2e8f0',
                          borderRadius: '6px',
                          fontSize: '13px',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <Slash size={14} />
                        {user.status === 'active' ? 'SUSPEND' : 'ACTIVATE'}
                      </button>
                      <button
                        onClick={async () => {
                          if (window.confirm(`Are you sure you want to permanently delete ${user.name}? This action cannot be undone.`)) {
                            try {
                              const response = await fetch(`${API_BASE_URL}/admin/users/${user.type}/${user.originalId}`, {
                                method: 'DELETE'
                              });
                              const data = await response.json();
                              if (data.success) {
                                setUsers(users.filter(u => u.id !== user.id));
                                alert('User deleted successfully');
                              } else {
                                alert(data.error || 'Failed to delete user');
                              }
                            } catch (error) {
                              console.error('Delete user error:', error);
                              alert('Failed to delete user');
                            }
                          }
                        }}
                        style={{
                          padding: '8px 12px',
                          backgroundColor: '#ef4444',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '13px',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <Trash2 size={14} />
                        DELETE
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // Message Monitoring Section
  const renderMessageMonitoring = () => {
    return (
      <div>
        <h2 style={{
          fontSize: '28px',
          fontWeight: 'bold',
          color: '#1e293b',
          marginBottom: '8px'
        }}>
          Message Monitoring
        </h2>
        <p style={{
          fontSize: '16px',
          color: '#64748b',
          marginBottom: '24px'
        }}>
          Monitor conversations for Terms of Service violations
        </p>

        {loading ? (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '48px',
            textAlign: 'center',
            border: '1px solid #e2e8f0'
          }}>
            <p style={{ fontSize: '16px', color: '#94a3b8' }}>
              Loading flagged messages...
            </p>
          </div>
        ) : flaggedMessages && flaggedMessages.length > 0 ? (
          <div style={{
            display: 'grid',
            gap: '16px'
          }}>
            {flaggedMessages.map((flag) => (
            <div
              key={flag.id}
              style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '24px',
                border: flag.status === 'PENDING' ? '2px solid #ef4444' : '1px solid #e2e8f0',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                cursor: 'pointer'
              }}
              onClick={() => {
                setSelectedFlag(flag);
                setShowReviewModal(true);
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '12px'
              }}>
                <div>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: '#1e293b',
                    margin: 0,
                    marginBottom: '4px'
                  }}>
                    {flag.client.firstName} {flag.client.lastName} ↔ {flag.contractor.name}
                  </h3>
                  <p style={{
                    fontSize: '14px',
                    color: '#64748b',
                    margin: 0
                  }}>
                    Flagged by: {flag.flaggedBy}
                  </p>
                </div>
                <div style={{
                  padding: '6px 12px',
                  backgroundColor: flag.status === 'PENDING' ? '#fee2e2' :
                                   flag.status === 'REVIEWED' ? '#dbeafe' :
                                   flag.status === 'ACTION_TAKEN' ? '#dcfce7' : '#f1f5f9',
                  color: flag.status === 'PENDING' ? '#991b1b' :
                         flag.status === 'REVIEWED' ? '#1e40af' :
                         flag.status === 'ACTION_TAKEN' ? '#166534' : '#475569',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <AlertTriangle size={14} />
                  {flag.status}
                </div>
              </div>
              <div style={{
                backgroundColor: '#fef2f2',
                padding: '12px',
                borderRadius: '8px',
                marginBottom: '12px'
              }}>
                <p style={{
                  fontSize: '13px',
                  fontWeight: 'bold',
                  color: '#991b1b',
                  margin: 0,
                  marginBottom: '4px'
                }}>
                  Reason: {flag.reason}
                </p>
                {flag.details && (
                  <p style={{
                    fontSize: '13px',
                    color: '#7f1d1d',
                    margin: 0
                  }}>
                    Details: {flag.details}
                  </p>
                )}
              </div>
              <p style={{
                fontSize: '15px',
                color: '#475569',
                margin: 0,
                marginBottom: '8px'
              }}>
                "{flag.messageText}"
              </p>
              <p style={{
                fontSize: '13px',
                color: '#94a3b8',
                margin: 0
              }}>
                Flagged: {new Date(flag.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
        ) : (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '48px',
            textAlign: 'center',
            border: '1px solid #e2e8f0'
          }}>
            <MessageSquare size={48} style={{ color: '#cbd5e1', margin: '0 auto 16px' }} />
            <p style={{ fontSize: '16px', color: '#94a3b8' }}>
              No flagged messages
            </p>
          </div>
        )}
      </div>
    );
  };

  // Reports & Flags Section
  const renderReports = () => (
    <div>
      <h2 style={{
        fontSize: '28px',
        fontWeight: 'bold',
        color: '#1e293b',
        marginBottom: '8px'
      }}>
        Reports & Flags
      </h2>
      <p style={{
        fontSize: '16px',
        color: '#64748b',
        marginBottom: '24px'
      }}>
        Review other types of user reports and violations
      </p>

      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '64px 48px',
        textAlign: 'center',
        border: '2px dashed #e2e8f0'
      }}>
        <AlertTriangle
          size={64}
          style={{
            color: '#cbd5e1',
            margin: '0 auto 24px',
            display: 'block'
          }}
        />

        <h3 style={{
          fontSize: '20px',
          fontWeight: 'bold',
          color: '#1e293b',
          margin: 0,
          marginBottom: '12px'
        }}>
          Coming Soon
        </h3>

        <p style={{
          fontSize: '15px',
          color: '#64748b',
          margin: 0,
          marginBottom: '24px',
          maxWidth: '600px',
          marginLeft: 'auto',
          marginRight: 'auto',
          lineHeight: '1.6'
        }}>
          This section will allow you to review and manage other types of reports including:
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '16px',
          maxWidth: '700px',
          margin: '0 auto',
          textAlign: 'left'
        }}>
          <div style={{
            padding: '16px',
            backgroundColor: '#f8fafc',
            borderRadius: '8px',
            border: '1px solid #e2e8f0'
          }}>
            <h4 style={{
              fontSize: '14px',
              fontWeight: 'bold',
              color: '#1e293b',
              margin: 0,
              marginBottom: '4px'
            }}>
              User Profile Reports
            </h4>
            <p style={{
              fontSize: '13px',
              color: '#64748b',
              margin: 0
            }}>
              Reports about contractor or client profiles
            </p>
          </div>

          <div style={{
            padding: '16px',
            backgroundColor: '#f8fafc',
            borderRadius: '8px',
            border: '1px solid #e2e8f0'
          }}>
            <h4 style={{
              fontSize: '14px',
              fontWeight: 'bold',
              color: '#1e293b',
              margin: 0,
              marginBottom: '4px'
            }}>
              Booking Disputes
            </h4>
            <p style={{
              fontSize: '13px',
              color: '#64748b',
              margin: 0
            }}>
              Issues with bookings, cancellations, or no-shows
            </p>
          </div>

          <div style={{
            padding: '16px',
            backgroundColor: '#f8fafc',
            borderRadius: '8px',
            border: '1px solid #e2e8f0'
          }}>
            <h4 style={{
              fontSize: '14px',
              fontWeight: 'bold',
              color: '#1e293b',
              margin: 0,
              marginBottom: '4px'
            }}>
              Payment Disputes
            </h4>
            <p style={{
              fontSize: '13px',
              color: '#64748b',
              margin: 0
            }}>
              Payment issues, refunds, or billing problems
            </p>
          </div>

          <div style={{
            padding: '16px',
            backgroundColor: '#f8fafc',
            borderRadius: '8px',
            border: '1px solid #e2e8f0'
          }}>
            <h4 style={{
              fontSize: '14px',
              fontWeight: 'bold',
              color: '#1e293b',
              margin: 0,
              marginBottom: '4px'
            }}>
              Platform Abuse
            </h4>
            <p style={{
              fontSize: '13px',
              color: '#64748b',
              margin: 0
            }}>
              Spam, fake accounts, or fraudulent activity
            </p>
          </div>
        </div>

        <p style={{
          fontSize: '13px',
          color: '#94a3b8',
          margin: '32px 0 0 0',
          fontStyle: 'italic'
        }}>
          Note: For flagged messages, please use the "Message Monitoring" section.
        </p>
      </div>
    </div>
  );

  // Activity Logs Section
  const renderActivityLogs = () => (
    <div>
      <h2 style={{
        fontSize: '28px',
        fontWeight: 'bold',
        color: '#1e293b',
        marginBottom: '8px'
      }}>
        Activity Logs
      </h2>
      <p style={{
        fontSize: '16px',
        color: '#64748b',
        marginBottom: '24px'
      }}>
        Track user actions and system events
      </p>

      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        border: '1px solid #e2e8f0',
        overflow: 'hidden'
      }}>
        {activityLogs.map((log, index) => (
          <div
            key={log.id}
            style={{
              padding: '20px 24px',
              borderBottom: index < activityLogs.length - 1 ? '1px solid #e2e8f0' : 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '16px'
            }}
          >
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: getSeverityColor(log.severity),
              flexShrink: 0
            }} />
            <div style={{ flex: 1 }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '4px'
              }}>
                <h4 style={{
                  fontSize: '16px',
                  fontWeight: 'bold',
                  color: '#1e293b',
                  margin: 0
                }}>
                  {log.user}
                </h4>
                <span style={{
                  padding: '4px 10px',
                  backgroundColor: `${getSeverityColor(log.severity)}15`,
                  color: getSeverityColor(log.severity),
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>
                  {log.severity.toUpperCase()}
                </span>
              </div>
              <p style={{
                fontSize: '15px',
                color: '#1e293b',
                margin: 0,
                marginBottom: '4px'
              }}>
                <strong>{log.action}</strong> - {log.details}
              </p>
              <p style={{
                fontSize: '13px',
                color: '#94a3b8',
                margin: 0
              }}>
                {log.timestamp}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Services Management Section
  const renderServicesManagement = () => {
    const handleSaveService = async () => {
      try {
        if (!serviceForm.name.trim()) {
          alert('Please enter a service name');
          return;
        }

        if (editingService) {
          // Update existing service
          const response = await fetch(`${API_BASE_URL}/admin/services/${editingService.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: serviceForm.name,
              description: serviceForm.description
            })
          });

          if (response.ok) {
            const data = await response.json();
            setServices(services.map(s =>
              s.id === editingService.id ? { ...s, name: data.service.name, description: data.service.description } : s
            ));
            setShowAddServiceModal(false);
            setEditingService(null);
            setServiceForm({ name: '', description: '' });
          } else {
            const error = await response.json();
            alert(error.error || 'Failed to update service');
          }
        }
      } catch (error) {
        console.error('Save service error:', error);
        alert('Failed to save service');
      }
    };

    return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '32px'
      }}>
        <div>
          <h2 style={{
            fontSize: '28px',
            fontWeight: 'bold',
            color: '#1e293b',
            marginBottom: '8px'
          }}>
            Services Management
          </h2>
          <p style={{
            fontSize: '16px',
            color: '#64748b'
          }}>
            Add, edit, or remove services available on the platform
          </p>
        </div>
        <button
          onClick={() => {
            setEditingService(null);
            setShowAddServiceModal(true);
          }}
          style={{
            padding: '12px 24px',
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '15px',
            fontWeight: 'bold',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Plus size={18} />
          ADD SERVICE
        </button>
      </div>

      {/* Services Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: '20px'
      }}>
        {services.map(service => (
          <div
            key={service.id}
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              border: `2px solid ${service.active ? '#10b981' : '#e2e8f0'}`,
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              position: 'relative'
            }}
          >
            {/* Active/Inactive Badge */}
            <div style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              backgroundColor: service.active ? '#d1fae5' : '#fee2e2',
              borderRadius: '6px'
            }}>
              {service.active ? (
                <ToggleRight size={16} color="#10b981" />
              ) : (
                <ToggleLeft size={16} color="#ef4444" />
              )}
              <span style={{
                fontSize: '12px',
                fontWeight: 'bold',
                color: service.active ? '#166534' : '#991b1b'
              }}>
                {service.active ? 'ACTIVE' : 'INACTIVE'}
              </span>
            </div>

            <div style={{ marginTop: '24px' }}>
              <h3 style={{
                fontSize: '20px',
                fontWeight: 'bold',
                color: '#1e293b',
                marginBottom: '4px'
              }}>
                {service.name}
              </h3>
              <p style={{
                fontSize: '13px',
                color: '#64748b',
                marginBottom: '12px',
                fontWeight: '600'
              }}>
                Category: {service.category}
              </p>
              <p style={{
                fontSize: '14px',
                color: '#475569',
                marginBottom: '16px',
                lineHeight: '1.5'
              }}>
                {service.description}
              </p>

              {/* Contractor Count */}
              <div style={{
                padding: '12px',
                backgroundColor: '#f8fafc',
                borderRadius: '8px',
                marginBottom: '16px'
              }}>
                <p style={{
                  fontSize: '14px',
                  color: '#64748b',
                  margin: 0
                }}>
                  <strong style={{ color: '#1e293b' }}>{service.contractorCount}</strong> contractors offer this service
                </p>
              </div>

              {/* Actions */}
              <div style={{
                display: 'flex',
                gap: '8px'
              }}>
                <button
                  onClick={() => {
                    setEditingService(service);
                    setServiceForm({ name: service.name, description: service.description });
                    setShowAddServiceModal(true);
                  }}
                  style={{
                    flex: 1,
                    padding: '10px',
                    backgroundColor: 'transparent',
                    color: '#64748b',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <Edit size={14} />
                  EDIT
                </button>
                <button
                  onClick={async () => {
                    try {
                      const response = await fetch(`${API_BASE_URL}/admin/services/${service.id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          isActive: !service.active
                        })
                      });

                      if (response.ok) {
                        const updatedServices = services.map(s =>
                          s.id === service.id ? { ...s, active: !s.active } : s
                        );
                        setServices(updatedServices);
                      } else {
                        const errorText = await response.text();
                        console.error('Error response:', errorText);
                        try {
                          const error = JSON.parse(errorText);
                          alert(error.error || 'Failed to update service');
                        } catch {
                          alert(`Failed to update service: ${errorText}`);
                        }
                      }
                    } catch (error) {
                      console.error('Toggle service error:', error);
                      alert('Failed to update service');
                    }
                  }}
                  style={{
                    flex: 1,
                    padding: '10px',
                    backgroundColor: 'transparent',
                    color: '#64748b',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  {service.active ? <ToggleLeft size={14} /> : <ToggleRight size={14} />}
                  {service.active ? 'DEACTIVATE' : 'ACTIVATE'}
                </button>
                <button
                  onClick={() => {
                    // TODO: Implement delete with confirmation
                    if (window.confirm(`Delete "${service.name}"? This will remove it from all contractors. This cannot be undone.`)) {
                      const updatedServices = services.filter(s => s.id !== service.id);
                      setServices(updatedServices);
                    }
                  }}
                  style={{
                    padding: '10px 14px',
                    backgroundColor: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Service Modal */}
      {showAddServiceModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '32px',
            maxWidth: '500px',
            width: '90%'
          }}>
            <h3 style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#1e293b',
              marginBottom: '24px'
            }}>
              Edit Service
            </h3>

            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: 'bold',
                color: '#1e293b',
                marginBottom: '8px'
              }}>
                Service Name *
              </label>
              <input
                type="text"
                value={serviceForm.name}
                onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                placeholder="e.g., Lawn Mowing, Tree Trimming"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '15px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: 'bold',
                color: '#1e293b',
                marginBottom: '8px'
              }}>
                Description (Optional)
              </label>
              <textarea
                value={serviceForm.description}
                onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                placeholder="Brief description of the service"
                rows={3}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '15px',
                  boxSizing: 'border-box',
                  resize: 'vertical'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  setShowAddServiceModal(false);
                  setEditingService(null);
                  setServiceForm({ name: '', description: '' });
                }}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#e2e8f0',
                  color: '#1e293b',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '15px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                CANCEL
              </button>
              <button
                onClick={handleSaveService}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '15px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                UPDATE SERVICE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    );
  };

  // Service Areas Management Section
  const renderServiceAreasManagement = () => {
    const handleSaveArea = async () => {
      try {
        if (!areaForm.name.trim()) {
          alert('Please enter an area name');
          return;
        }

        if (editingArea) {
          // Update existing area
          const response = await fetch(`/api/admin/service-areas/${editingArea.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(areaForm)
          });

          if (response.ok) {
            const data = await response.json();
            setServiceAreas(serviceAreas.map(a =>
              a.id === editingArea.id ? data.serviceArea : a
            ));
            setShowAddAreaModal(false);
            setEditingArea(null);
            setAreaForm({ name: '', state: '' });
          } else {
            const error = await response.json();
            alert(error.error || 'Failed to update service area');
          }
        } else {
          // Create new area
          const response = await fetch('/api/admin/service-areas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(areaForm)
          });

          if (response.ok) {
            const data = await response.json();
            setServiceAreas([...serviceAreas, data.serviceArea]);
            setShowAddAreaModal(false);
            setAreaForm({ name: '', state: '' });
          } else {
            const error = await response.json();
            alert(error.error || 'Failed to create service area');
          }
        }
      } catch (error) {
        console.error('Save service area error:', error);
        alert('Failed to save service area');
      }
    };

    const handleDeleteArea = async (area: any) => {
      if (!window.confirm(`Delete "${area.name}"? This will remove it from all contractors. This cannot be undone.`)) {
        return;
      }

      try {
        const response = await fetch(`/api/admin/service-areas/${area.id}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          setServiceAreas(serviceAreas.filter(a => a.id !== area.id));
        } else {
          const error = await response.json();
          alert(error.error || 'Failed to delete service area');
        }
      } catch (error) {
        console.error('Delete service area error:', error);
        alert('Failed to delete service area');
      }
    };

    const handleToggleAreaActive = async (area: any) => {
      try {
        const response = await fetch(`/api/admin/service-areas/${area.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: area.name,
            state: area.state,
            isActive: !area.isActive
          })
        });

        if (response.ok) {
          const data = await response.json();
          setServiceAreas(serviceAreas.map(a =>
            a.id === area.id ? data.serviceArea : a
          ));
        } else {
          const error = await response.json();
          alert(error.error || 'Failed to update service area');
        }
      } catch (error) {
        console.error('Toggle service area error:', error);
        alert('Failed to update service area');
      }
    };

    return (
      <div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px'
        }}>
          <div>
            <h2 style={{
              fontSize: '28px',
              fontWeight: 'bold',
              color: '#1e293b',
              marginBottom: '8px'
            }}>
              Service Areas Management
            </h2>
            <p style={{
              fontSize: '16px',
              color: '#64748b'
            }}>
              Manage cities and areas where contractors can provide services
            </p>
          </div>
          <button
            onClick={() => {
              setEditingArea(null);
              setAreaForm({ name: '', state: '' });
              setShowAddAreaModal(true);
            }}
            style={{
              padding: '12px 24px',
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Plus size={18} />
            ADD SERVICE AREA
          </button>
        </div>

        {/* Service Areas Table */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse'
          }}>
            <thead>
              <tr style={{
                backgroundColor: '#f8fafc',
                borderBottom: '2px solid #e2e8f0'
              }}>
                <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: 'bold', color: '#1e293b' }}>Area Name</th>
                <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: 'bold', color: '#1e293b' }}>State</th>
                <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: 'bold', color: '#1e293b' }}>Status</th>
                <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: 'bold', color: '#1e293b' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {serviceAreas.map(area => (
                <tr key={area.id} style={{
                  borderBottom: '1px solid #e2e8f0'
                }}>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <MapPin size={16} color="#64748b" />
                      <span style={{ fontSize: '15px', color: '#1e293b', fontWeight: '500' }}>
                        {area.name}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: '16px', fontSize: '14px', color: '#64748b' }}>
                    {area.state || '—'}
                  </td>
                  <td style={{ padding: '16px' }}>
                    <span style={{
                      padding: '4px 12px',
                      backgroundColor: area.isActive ? '#dcfce7' : '#fee2e2',
                      color: area.isActive ? '#166534' : '#991b1b',
                      borderRadius: '6px',
                      fontSize: '13px',
                      fontWeight: '600'
                    }}>
                      {area.isActive ? 'ACTIVE' : 'INACTIVE'}
                    </span>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => {
                          setEditingArea(area);
                          setAreaForm({ name: area.name, state: area.state || '' });
                          setShowAddAreaModal(true);
                        }}
                        style={{
                          padding: '8px 12px',
                          backgroundColor: 'transparent',
                          color: '#64748b',
                          border: '1px solid #e2e8f0',
                          borderRadius: '6px',
                          fontSize: '13px',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <Edit size={14} />
                        EDIT
                      </button>
                      <button
                        onClick={() => handleToggleAreaActive(area)}
                        style={{
                          padding: '8px 12px',
                          backgroundColor: 'transparent',
                          color: '#64748b',
                          border: '1px solid #e2e8f0',
                          borderRadius: '6px',
                          fontSize: '13px',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        {area.isActive ? <ToggleLeft size={14} /> : <ToggleRight size={14} />}
                        {area.isActive ? 'DEACTIVATE' : 'ACTIVATE'}
                      </button>
                      <button
                        onClick={() => handleDeleteArea(area)}
                        style={{
                          padding: '8px 12px',
                          backgroundColor: '#ef4444',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '13px',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <Trash2 size={14} />
                        DELETE
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {serviceAreas.length === 0 && (
            <div style={{
              textAlign: 'center',
              padding: '48px 24px',
              color: '#64748b'
            }}>
              <MapPin size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
              <p style={{ fontSize: '16px', margin: 0 }}>No service areas yet. Add your first one!</p>
            </div>
          )}
        </div>

        {/* Add/Edit Service Area Modal */}
        {showAddAreaModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '32px',
              maxWidth: '500px',
              width: '90%'
            }}>
              <h3 style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#1e293b',
                marginBottom: '24px'
              }}>
                {editingArea ? 'Edit Service Area' : 'Add Service Area'}
              </h3>

              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  color: '#1e293b',
                  marginBottom: '8px'
                }}>
                  Area Name *
                </label>
                <input
                  type="text"
                  value={areaForm.name}
                  onChange={(e) => setAreaForm({ ...areaForm, name: e.target.value })}
                  placeholder="e.g., Boise, Nampa, Meridian"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '15px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  color: '#1e293b',
                  marginBottom: '8px'
                }}>
                  State (Optional)
                </label>
                <input
                  type="text"
                  value={areaForm.state}
                  onChange={(e) => setAreaForm({ ...areaForm, state: e.target.value })}
                  placeholder="e.g., ID, WA, OR"
                  maxLength={2}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '15px',
                    boxSizing: 'border-box',
                    textTransform: 'uppercase'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => {
                    setShowAddAreaModal(false);
                    setEditingArea(null);
                    setAreaForm({ name: '', state: '' });
                  }}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#e2e8f0',
                    color: '#1e293b',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '15px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  CANCEL
                </button>
                <button
                  onClick={handleSaveArea}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '15px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  {editingArea ? 'UPDATE' : 'ADD'} AREA
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Languages Management Section
  const renderLanguagesManagement = () => {
    const handleSaveLanguage = async () => {
      try {
        if (!languageForm.name.trim() || !languageForm.code.trim() || !languageForm.flag.trim()) {
          alert('Please fill in all fields');
          return;
        }

        if (editingLanguage) {
          // Update existing language
          const response = await fetch(`${API_BASE_URL}/languages/${editingLanguage.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(languageForm)
          });

          const data = await response.json();
          if (data.success) {
            setLanguages(languages.map(l =>
              l.id === editingLanguage.id ? data.language : l
            ));
            setShowAddLanguageModal(false);
            setEditingLanguage(null);
            setLanguageForm({ name: '', code: '', flag: '' });
          } else {
            alert(data.error || 'Failed to update language');
          }
        } else {
          // Create new language
          const response = await fetch(`${API_BASE_URL}/languages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(languageForm)
          });

          const data = await response.json();
          if (data.success) {
            setLanguages([...languages, data.language]);
            setShowAddLanguageModal(false);
            setLanguageForm({ name: '', code: '', flag: '' });
          } else {
            alert(data.error || 'Failed to create language');
          }
        }
      } catch (error) {
        console.error('Save language error:', error);
        alert('Failed to save language');
      }
    };

    const handleToggleLanguage = async (language: Language) => {
      try {
        const response = await fetch(`${API_BASE_URL}/languages/${language.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isActive: !language.isActive })
        });

        const data = await response.json();
        if (data.success) {
          setLanguages(languages.map(l =>
            l.id === language.id ? { ...l, isActive: !l.isActive } : l
          ));
        }
      } catch (error) {
        console.error('Toggle language error:', error);
      }
    };

    const handleDeleteLanguage = async (languageId: number) => {
      if (!window.confirm('Are you sure you want to delete this language?')) return;

      try {
        const response = await fetch(`${API_BASE_URL}/languages/${languageId}`, {
          method: 'DELETE'
        });

        const data = await response.json();
        if (data.success) {
          setLanguages(languages.filter(l => l.id !== languageId));
        }
      } catch (error) {
        console.error('Delete language error:', error);
      }
    };

    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1e293b', marginBottom: '8px' }}>
              Languages
            </h2>
            <p style={{ fontSize: '16px', color: '#64748b' }}>
              Manage languages that contractors can speak
            </p>
          </div>
          <button
            onClick={() => {
              setEditingLanguage(null);
              setLanguageForm({ name: '', code: '', flag: '' });
              setShowAddLanguageModal(true);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 20px',
              backgroundColor: '#6366f1',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            <Plus size={18} />
            Add Language
          </button>
        </div>

        {/* Languages List */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          overflow: 'hidden'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc' }}>
                <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#64748b' }}>Flag</th>
                <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#64748b' }}>Name</th>
                <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#64748b' }}>Code</th>
                <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: '#64748b' }}>Status</th>
                <th style={{ padding: '16px', textAlign: 'right', fontSize: '14px', fontWeight: '600', color: '#64748b' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {languages.map(language => (
                <tr key={language.id} style={{ borderTop: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '16px', fontSize: '24px' }}>{language.flag}</td>
                  <td style={{ padding: '16px', fontSize: '15px', color: '#1e293b', fontWeight: '500' }}>{language.name}</td>
                  <td style={{ padding: '16px', fontSize: '14px', color: '#64748b' }}>{language.code}</td>
                  <td style={{ padding: '16px' }}>
                    <button
                      onClick={() => handleToggleLanguage(language)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 12px',
                        backgroundColor: language.isActive ? '#dcfce7' : '#f1f5f9',
                        color: language.isActive ? '#15803d' : '#64748b',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '13px',
                        fontWeight: '500',
                        cursor: 'pointer'
                      }}
                    >
                      {language.isActive ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                      {language.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td style={{ padding: '16px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => {
                          setEditingLanguage(language);
                          setLanguageForm({
                            name: language.name,
                            code: language.code,
                            flag: language.flag
                          });
                          setShowAddLanguageModal(true);
                        }}
                        style={{
                          padding: '8px',
                          backgroundColor: '#f1f5f9',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer'
                        }}
                      >
                        <Edit size={16} color="#64748b" />
                      </button>
                      <button
                        onClick={() => handleDeleteLanguage(language.id)}
                        style={{
                          padding: '8px',
                          backgroundColor: '#fef2f2',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer'
                        }}
                      >
                        <Trash2 size={16} color="#ef4444" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {languages.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: '48px', textAlign: 'center', color: '#64748b' }}>
                    No languages added yet. Click "Add Language" to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Add/Edit Language Modal */}
        {showAddLanguageModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '32px',
              width: '400px',
              maxWidth: '90%'
            }}>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '24px' }}>
                {editingLanguage ? 'Edit Language' : 'Add New Language'}
              </h3>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>
                  Language Name *
                </label>
                <input
                  type="text"
                  value={languageForm.name}
                  onChange={(e) => setLanguageForm({ ...languageForm, name: e.target.value })}
                  placeholder="e.g., Spanish"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '15px'
                  }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>
                  Language Code *
                </label>
                <input
                  type="text"
                  value={languageForm.code}
                  onChange={(e) => setLanguageForm({ ...languageForm, code: e.target.value.toLowerCase() })}
                  placeholder="e.g., es"
                  maxLength={5}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '15px'
                  }}
                />
                <p style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                  ISO 639-1 code (2-3 letters)
                </p>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>
                  Flag Emoji *
                </label>
                <input
                  type="text"
                  value={languageForm.flag}
                  onChange={(e) => setLanguageForm({ ...languageForm, flag: e.target.value })}
                  placeholder="e.g., 🇲🇽"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '24px'
                  }}
                />
                <p style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                  Copy and paste a flag emoji
                </p>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => {
                    setShowAddLanguageModal(false);
                    setEditingLanguage(null);
                    setLanguageForm({ name: '', code: '', flag: '' });
                  }}
                  style={{
                    flex: 1,
                    padding: '12px',
                    backgroundColor: '#f1f5f9',
                    color: '#64748b',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveLanguage}
                  style={{
                    flex: 1,
                    padding: '12px',
                    backgroundColor: '#6366f1',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  {editingLanguage ? 'Update' : 'Add'} Language
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      display: 'flex'
    }}>
      {/* Sidebar */}
      <div style={{
        width: '280px',
        backgroundColor: 'white',
        borderRight: '1px solid #e2e8f0',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '32px'
        }}>
          <Lock size={28} color="#ef4444" />
          <h1 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#1e293b',
            margin: 0
          }}>
            Admin Panel
          </h1>
        </div>

        <nav style={{ flex: 1 }}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  marginBottom: '8px',
                  backgroundColor: isActive ? '#ef4444' : 'transparent',
                  color: isActive ? 'white' : '#64748b',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '15px',
                  fontWeight: isActive ? 'bold' : '500',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  transition: 'all 0.2s'
                }}
              >
                <Icon size={18} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <button
          onClick={() => {
            if (window.confirm('Are you sure you want to logout?')) {
              setIsAuthenticated(false);
              setPassword('');
            }
          }}
          style={{
            width: '100%',
            padding: '14px',
            backgroundColor: '#f8fafc',
            color: '#64748b',
            border: '2px solid #e2e8f0',
            borderRadius: '8px',
            fontSize: '15px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          ← Logout
        </button>
      </div>

      {/* Main Content */}
      <div style={{
        flex: 1,
        padding: '48px',
        overflowY: 'auto'
      }}>
        {activeSection === 'users' && renderUserManagement()}
        {activeSection === 'services' && renderServicesManagement()}
        {activeSection === 'service-areas' && renderServiceAreasManagement()}
        {activeSection === 'languages' && renderLanguagesManagement()}
        {activeSection === 'messages' && renderMessageMonitoring()}
        {activeSection === 'reports' && renderReports()}
        {activeSection === 'activity' && renderActivityLogs()}
      </div>

      {/* User Detail Modal */}
      {showUserModal && selectedUser && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '32px',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '80vh',
            overflowY: 'auto'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '24px'
            }}>
              <h2 style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#1e293b',
                margin: 0
              }}>
                User Details
              </h2>
              <button
                onClick={() => setShowUserModal(false)}
                style={{
                  padding: '8px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <X size={24} color="#64748b" />
              </button>
            </div>

            <div style={{
              display: 'grid',
              gap: '16px'
            }}>
              <div>
                <label style={{ fontSize: '14px', fontWeight: '600', color: '#64748b' }}>Name</label>
                <p style={{ fontSize: '16px', color: '#1e293b', margin: '4px 0 0 0' }}>{selectedUser.name}</p>
              </div>
              <div>
                <label style={{ fontSize: '14px', fontWeight: '600', color: '#64748b' }}>Email</label>
                <p style={{ fontSize: '16px', color: '#1e293b', margin: '4px 0 0 0' }}>{selectedUser.email}</p>
              </div>
              <div>
                <label style={{ fontSize: '14px', fontWeight: '600', color: '#64748b' }}>Phone</label>
                <p style={{ fontSize: '16px', color: '#1e293b', margin: '4px 0 0 0' }}>{selectedUser.phone}</p>
              </div>
              <div>
                <label style={{ fontSize: '14px', fontWeight: '600', color: '#64748b' }}>Account Type</label>
                <p style={{ fontSize: '16px', color: '#1e293b', margin: '4px 0 0 0', textTransform: 'capitalize' }}>{selectedUser.type}</p>
              </div>
              <div>
                <label style={{ fontSize: '14px', fontWeight: '600', color: '#64748b' }}>Status</label>
                <p style={{ fontSize: '16px', color: '#1e293b', margin: '4px 0 0 0', textTransform: 'capitalize' }}>{selectedUser.status}</p>
              </div>
              <div>
                <label style={{ fontSize: '14px', fontWeight: '600', color: '#64748b' }}>Join Date</label>
                <p style={{ fontSize: '16px', color: '#1e293b', margin: '4px 0 0 0' }}>{selectedUser.joinDate}</p>
              </div>
              <div>
                <label style={{ fontSize: '14px', fontWeight: '600', color: '#64748b' }}>Total Jobs</label>
                <p style={{ fontSize: '16px', color: '#1e293b', margin: '4px 0 0 0' }}>{selectedUser.totalJobs}</p>
              </div>
              {selectedUser.totalSpent && (
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '600', color: '#64748b' }}>Total Spent</label>
                  <p style={{ fontSize: '16px', color: '#1e293b', margin: '4px 0 0 0' }}>${selectedUser.totalSpent}</p>
                </div>
              )}
              {selectedUser.totalEarned && (
                <div>
                  <label style={{ fontSize: '14px', fontWeight: '600', color: '#64748b' }}>Total Earned</label>
                  <p style={{ fontSize: '16px', color: '#1e293b', margin: '4px 0 0 0' }}>${selectedUser.totalEarned}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Review Modal */}
      {showReviewModal && selectedFlag && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '32px',
            maxWidth: '800px',
            width: '90%',
            maxHeight: '80vh',
            overflowY: 'auto'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '24px'
            }}>
              <div>
                <h2 style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: '#1e293b',
                  margin: 0,
                  marginBottom: '8px'
                }}>
                  Review Flagged Message
                </h2>
                <div style={{
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'center'
                }}>
                  <span style={{
                    padding: '4px 12px',
                    backgroundColor: selectedFlag.status === 'PENDING' ? '#fee2e2' :
                                     selectedFlag.status === 'REVIEWED' ? '#dbeafe' :
                                     selectedFlag.status === 'ACTION_TAKEN' ? '#dcfce7' : '#f1f5f9',
                    color: selectedFlag.status === 'PENDING' ? '#991b1b' :
                           selectedFlag.status === 'REVIEWED' ? '#1e40af' :
                           selectedFlag.status === 'ACTION_TAKEN' ? '#166534' : '#475569',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    {selectedFlag.status}
                  </span>
                  <span style={{
                    fontSize: '14px',
                    color: '#64748b'
                  }}>
                    Flag ID: #{selectedFlag.id}
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowReviewModal(false);
                  setSelectedFlag(null);
                  setActionNote('');
                }}
                style={{
                  padding: '8px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <X size={24} color="#64748b" />
              </button>
            </div>

            {/* Conversation Participants */}
            <div style={{
              backgroundColor: '#f8fafc',
              padding: '16px',
              borderRadius: '12px',
              marginBottom: '20px'
            }}>
              <h3 style={{
                fontSize: '16px',
                fontWeight: 'bold',
                color: '#1e293b',
                margin: 0,
                marginBottom: '12px'
              }}>
                Conversation Participants
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px'
              }}>
                <div>
                  <p style={{
                    fontSize: '13px',
                    color: '#64748b',
                    margin: 0,
                    marginBottom: '4px'
                  }}>
                    Client
                  </p>
                  <p style={{
                    fontSize: '15px',
                    fontWeight: 'bold',
                    color: '#1e293b',
                    margin: 0
                  }}>
                    {selectedFlag.client.firstName} {selectedFlag.client.lastName}
                  </p>
                  <p style={{
                    fontSize: '13px',
                    color: '#64748b',
                    margin: 0
                  }}>
                    ID: {selectedFlag.clientId}
                  </p>
                </div>
                <div>
                  <p style={{
                    fontSize: '13px',
                    color: '#64748b',
                    margin: 0,
                    marginBottom: '4px'
                  }}>
                    Contractor
                  </p>
                  <p style={{
                    fontSize: '15px',
                    fontWeight: 'bold',
                    color: '#1e293b',
                    margin: 0
                  }}>
                    {selectedFlag.contractor.name}
                  </p>
                  <p style={{
                    fontSize: '13px',
                    color: '#64748b',
                    margin: 0
                  }}>
                    ID: {selectedFlag.contractorId}
                  </p>
                </div>
              </div>
            </div>

            {/* Flag Details */}
            <div style={{
              backgroundColor: '#fef2f2',
              padding: '16px',
              borderRadius: '12px',
              marginBottom: '20px',
              border: '2px solid #fee2e2'
            }}>
              <h3 style={{
                fontSize: '16px',
                fontWeight: 'bold',
                color: '#991b1b',
                margin: 0,
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <AlertTriangle size={18} />
                Flag Information
              </h3>
              <div style={{
                display: 'grid',
                gap: '12px'
              }}>
                <div>
                  <p style={{
                    fontSize: '13px',
                    color: '#64748b',
                    margin: 0,
                    marginBottom: '4px'
                  }}>
                    Flagged By
                  </p>
                  <p style={{
                    fontSize: '15px',
                    fontWeight: 'bold',
                    color: '#7f1d1d',
                    margin: 0
                  }}>
                    {selectedFlag.flaggedBy} (User ID: {selectedFlag.flaggedById})
                  </p>
                </div>
                <div>
                  <p style={{
                    fontSize: '13px',
                    color: '#64748b',
                    margin: 0,
                    marginBottom: '4px'
                  }}>
                    Reason
                  </p>
                  <p style={{
                    fontSize: '15px',
                    fontWeight: 'bold',
                    color: '#7f1d1d',
                    margin: 0
                  }}>
                    {selectedFlag.reason}
                  </p>
                </div>
                {selectedFlag.details && (
                  <div>
                    <p style={{
                      fontSize: '13px',
                      color: '#64748b',
                      margin: 0,
                      marginBottom: '4px'
                    }}>
                      Additional Details
                    </p>
                    <p style={{
                      fontSize: '15px',
                      color: '#7f1d1d',
                      margin: 0
                    }}>
                      {selectedFlag.details}
                    </p>
                  </div>
                )}
                <div>
                  <p style={{
                    fontSize: '13px',
                    color: '#64748b',
                    margin: 0,
                    marginBottom: '4px'
                  }}>
                    Flagged At
                  </p>
                  <p style={{
                    fontSize: '15px',
                    color: '#7f1d1d',
                    margin: 0
                  }}>
                    {new Date(selectedFlag.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Flagged Message Content */}
            <div style={{
              backgroundColor: '#fff7ed',
              padding: '16px',
              borderRadius: '12px',
              marginBottom: '20px',
              border: '1px solid #fed7aa'
            }}>
              <h3 style={{
                fontSize: '16px',
                fontWeight: 'bold',
                color: '#1e293b',
                margin: 0,
                marginBottom: '12px'
              }}>
                Flagged Message
              </h3>
              <p style={{
                fontSize: '15px',
                color: '#475569',
                margin: 0,
                lineHeight: '1.6',
                whiteSpace: 'pre-wrap'
              }}>
                "{selectedFlag.messageText}"
              </p>
            </div>

            {/* Action Note Input */}
            <div style={{
              marginBottom: '20px'
            }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: 'bold',
                color: '#1e293b',
                marginBottom: '8px'
              }}>
                Admin Note (Optional)
              </label>
              <textarea
                value={actionNote}
                onChange={(e) => setActionNote(e.target.value)}
                placeholder="Add notes about your decision or actions taken..."
                style={{
                  width: '100%',
                  minHeight: '80px',
                  padding: '12px',
                  fontSize: '14px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  resize: 'vertical'
                }}
              />
            </div>

            {/* Action Buttons */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '12px'
            }}>
              <button
                onClick={() => {
                  setConfirmAction('dismiss');
                  setShowConfirmDialog(true);
                }}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#f1f5f9',
                  color: '#475569',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Dismiss Flag
              </button>
              <button
                onClick={() => {
                  setConfirmAction('warn');
                  setShowConfirmDialog(true);
                }}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#fef3c7',
                  color: '#92400e',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Warn User
              </button>
              <button
                onClick={() => {
                  setConfirmAction('suspend');
                  setShowConfirmDialog(true);
                }}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#fed7aa',
                  color: '#9a3412',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Suspend User (7 days)
              </button>
              <button
                onClick={() => {
                  setConfirmAction('ban');
                  setShowConfirmDialog(true);
                }}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#fecaca',
                  color: '#991b1b',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Ban User
              </button>
              <button
                onClick={() => {
                  setConfirmAction('delete');
                  setShowConfirmDialog(true);
                }}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#fee2e2',
                  color: '#991b1b',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Delete Message
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      {showConfirmDialog && confirmAction && selectedFlag && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1100
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '32px',
            maxWidth: '500px',
            width: '90%'
          }}>
            <h3 style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#1e293b',
              margin: 0,
              marginBottom: '16px'
            }}>
              Confirm Action
            </h3>
            <p style={{
              fontSize: '15px',
              color: '#475569',
              margin: 0,
              marginBottom: '24px',
              lineHeight: '1.6'
            }}>
              {confirmAction === 'dismiss' && 'Are you sure you want to dismiss this flag? The flag will be marked as reviewed with no action taken.'}
              {confirmAction === 'warn' && `Are you sure you want to send a warning to this user? They will receive a notification about their behavior.`}
              {confirmAction === 'suspend' && `Are you sure you want to suspend this user for 7 days? They will not be able to access their account during this time.`}
              {confirmAction === 'ban' && `Are you sure you want to permanently ban this user? This action is severe and should only be used for serious violations.`}
              {confirmAction === 'delete' && 'Are you sure you want to delete this message? This action cannot be undone.'}
            </p>
            <div style={{
              backgroundColor: '#f8fafc',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '24px'
            }}>
              <p style={{
                fontSize: '13px',
                color: '#64748b',
                margin: 0,
                marginBottom: '4px'
              }}>
                Target User:
              </p>
              <p style={{
                fontSize: '14px',
                fontWeight: 'bold',
                color: '#1e293b',
                margin: 0
              }}>
                {selectedFlag.flaggedBy === 'CLIENT'
                  ? `${selectedFlag.contractor.name} (Contractor)`
                  : `${selectedFlag.client.firstName} ${selectedFlag.client.lastName} (Client)`}
              </p>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px'
            }}>
              <button
                onClick={() => {
                  setShowConfirmDialog(false);
                  setConfirmAction('');
                }}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#f1f5f9',
                  color: '#475569',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleAdminAction(confirmAction)}
                style={{
                  padding: '12px 24px',
                  backgroundColor: confirmAction === 'ban' || confirmAction === 'delete' ? '#ef4444' : '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
