import { useState } from 'react';
import { useQuery, useSubscription } from '@apollo/client';
import { GET_ENDPOINTS, WEBHOOK_CREATED } from 'schema/queries';
import { Webhook } from 'schema/types';
import { GetEndpoints } from 'schema/types/GetEndpoints';
import useForwarder from 'hooks/useForwarder';
import styles from './styles.module.css';
import { WebhookCreated } from 'schema/types/WebhookCreated';
import AutoForwardSuggest from 'components/AutoForward/AutoForwardSuggest';
import AutoForwardDropdown from 'components/AutoForward/AutoForwardDropdown';

const AutoForwarder = ({ docked }: { docked: Boolean }) => {
  const { data, error, loading, refetch } = useQuery<GetEndpoints>(
    GET_ENDPOINTS,
    {
      fetchPolicy: 'cache-and-network',
    },
  );

  const [endpointId, setEndpointId] = useState('');
  const [running, setRunning] = useState(false);
  const [url, setUrl] = useState('');
  const { forwardWebhook } = useForwarder(endpointId);

  useSubscription<WebhookCreated>(WEBHOOK_CREATED, {
    variables: { endpointId, url },
    onSubscriptionData: ({ subscriptionData: { data } }) => {
      if (!data) return;
      const forwardTo = (url: string) => {
        forwardWebhook(url, [data.webhookCreated.webhook as Webhook]);
      };
      if (running) forwardTo(url);
    },
  });

  const retry = () => refetch().catch(() => {}); // Unless we catch, a network error will cause an unhandled rejection: https://github.com/apollographql/apollo-client/issues/3963

  return (
    <div
      className={`${styles.autoForwarder} ${
        docked ? styles.docked : ''
      }`}
    >
      <div className={`${styles.iconWrapper}`}>
        {running ? (
          <i
            className={`fa fa-circle fa-2x pointer ${styles.runningIcon}`}
            onClick={() => setRunning(false)}
          ></i>
        ) : (
          <i
            className={`fa fa-play fa-2x pointer ${styles.idleIcon}`}
            onClick={() => setRunning(true)}
          ></i>
        )}
      </div>
      <AutoForwardDropdown
        error={error}
        retry={retry}
        setEndpointId={setEndpointId}
        running={running}
        data={data}
        loading={loading}
      />
      {endpointId !== '' ? (
        <AutoForwardSuggest
          url={url}
          setUrl={setUrl}
          running={running}
          endpointId={endpointId}
        />
      ) : (
        <div className={`${styles['not-selected']}`}>
          <p>No Endpoint selected</p>
        </div>
      )}
    </div>
  );
};

export default AutoForwarder;
