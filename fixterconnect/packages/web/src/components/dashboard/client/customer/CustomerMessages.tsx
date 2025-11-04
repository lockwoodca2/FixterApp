import React from 'react';
import { MessageItem } from '../CustomerDashboard';
import styles from './CustomerMessages.module.css';

interface CustomerMessagesProps {
  messages: MessageItem[];
}

const CustomerMessages: React.FC<CustomerMessagesProps> = ({ messages }) => {
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

export default CustomerMessages;