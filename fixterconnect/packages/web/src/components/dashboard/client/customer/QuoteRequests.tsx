import React from 'react';
import { QuoteRequest } from '../CustomerDashboard';
import styles from './Services.module.css';

interface QuoteRequestsProps {
  quotes: QuoteRequest[];
}

const QuoteRequests: React.FC<QuoteRequestsProps> = ({ quotes }) => {
  if (quotes.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>You have no pending quote requests.</p>
        <button className={styles.actionButton}>Request a Quote</button>
      </div>
    );
  }

  return (
    <div className={styles.servicesList}>
      {quotes.map((quote) => {
        const isQuoted = quote.status === 'quoted';
        const statusClass = isQuoted ? styles.quoted : styles.pending;
        
        return (
          <div key={quote.id} className={styles.serviceCard}>
            <div className={styles.serviceHeader}>
              <div>
                <h3 className={styles.serviceTitle}>{quote.service}</h3>
                <p className={styles.serviceProvider}>
                  <strong>🧑‍🔧 Provider:</strong> {quote.contractor}
                </p>
                <p className={styles.serviceDetail}>
                  <strong>📝 Request Date:</strong> {quote.requestDate}
                </p>
                <p className={styles.serviceDetail}>
                  <strong>📍 Address:</strong> {quote.address}
                </p>
              </div>
              <div className={`${styles.statusBadge} ${statusClass}`}>
                {isQuoted ? 'QUOTE RECEIVED' : 'WAITING FOR QUOTE'}
              </div>
            </div>
            
            {isQuoted && quote.quoteAmount && (
              <div className={styles.quoteDetails}>
                <p className={styles.quoteAmount}>
                  <strong>Quote Amount:</strong> {quote.quoteAmount}
                </p>
                {quote.quoteDetails && (
                  <p className={styles.quoteDescription}>
                    {quote.quoteDetails}
                  </p>
                )}
              </div>
            )}
            
            <div className={styles.actionButtons}>
              {isQuoted ? (
                <>
                  <button 
                    className={styles.acceptButton}
                    onClick={() => alert(`Accept quote #${quote.id}`)}
                  >
                    Accept Quote
                  </button>
                  <button 
                    className={styles.declineButton}
                    onClick={() => alert(`Decline quote #${quote.id}`)}
                  >
                    Decline
                  </button>
                </>
              ) : (
                <>
                  <button 
                    className={styles.detailButton}
                    onClick={() => alert(`View request #${quote.id}`)}
                  >
                    View Request
                  </button>
                  <button 
                    className={styles.messageButton}
                    onClick={() => alert(`Contact provider #${quote.contractorId}`)}
                  >
                    Contact Provider
                  </button>
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default QuoteRequests;