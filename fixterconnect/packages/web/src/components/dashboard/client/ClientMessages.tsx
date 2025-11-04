import React from 'react';
import { MessageItem } from '../ClientDashboard';
import styles from './ClientMessages.module.css';

interface ClientMessagesProps {
  messages: MessageItem[];
}

const ClientMessages: React.FC<ClientMessagesProps> = ({ messages }) => {
  if (messages.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>You have no messages yet.</p>
        <button className={styles.actionButton}>Browse Services</button>
      </div>
    );
  }

  return (
    <div className={styles.messagesList}>
      {messages.map((message) => {
        const messageClass = message.unread ? styles.unread : styles.read;
        
        return (
          <div key={message.id} className={`${styles.messageCard} ${messageClass}`}>
            <div className={styles.messageHeader}>
              <h3 className={styles.messageFrom}>{message.contractor}</h3>
              <div className={styles.messageInfo}>
                <span className={styles.messageDate}>{message.date}</span>
                {message.unread && (
                  <span className={styles.unreadBadge}>UNREAD</span>
                )}
              </div>
            </div>
            
            <p className={styles.messageSubject}>
              <strong>📧 Subject:</strong> {message.subject}
            </p>
            <p className={styles.messageContent}>
              <strong>💬 Message:</strong> {message.lastMessage}
            </p>
            
            <div className={styles.messageActions}>
              <button 
                className={styles.replyButton}
                onClick={() => alert(`Reply to message #${message.id}`)}
              >
                💬 Reply
              </button>
              {message.unread && (
                <button 
                  className={styles.markReadButton}
                  onClick={() => alert(`Mark message #${message.id} as read`)}
                >
                  ✓ Mark Read
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ClientMessages;