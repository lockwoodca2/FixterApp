import React from 'react';
import { useParams } from 'react-router-dom';

const ContractorsList: React.FC = () => {
  const { serviceId } = useParams<{ serviceId: string }>();

  return (
    <div>
      <h1>Contractors for Service {serviceId}</h1>
      <p>Browse available contractors for this service</p>
    </div>
  );
};

export default ContractorsList;