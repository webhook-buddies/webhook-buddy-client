import { Webhook } from 'schema/types';
import useForwardingIds from './useForwardingIds';
import useForwardUrls from './useForwardUrls';
import {
  AddForward_addForward_webhook,
  AddForward_addForward_webhook_forwards,
} from './types/AddForward';
import useAddForward from './useAddForward';
import { appendQuery } from 'utils/http-fragment';
// import useSender from './useNodeSender';

const useForwarder = (endpointId: string) => {
  const { addForwardingIds, removeForwardingId } = useForwardingIds();
  const { addForwardUrl } = useForwardUrls(endpointId);
  const { addForward } = useAddForward();

  const onForwarded = (
    webhook: AddForward_addForward_webhook,
    forward: AddForward_addForward_webhook_forwards,
  ) => {
    removeForwardingId(webhook.id);

    addForward({
      variables: {
        input: {
          webhookId: webhook.id,
          url: forward.url,
          method: forward.method,
          statusCode: forward.statusCode,
          // need to remap here b/c server rejects __typename property
          headers: forward.headers.map(kv => ({
            key: kv.key,
            value: kv.value,
          })),
          // need to remap here b/c server rejects __typename property
          query: forward.query.map(kv => ({
            key: kv.key,
            value: kv.value,
          })),
          body: forward.body,
        },
      },
      optimisticResponse: {
        addForward: {
          __typename: 'AddForwardPayload',
          webhook: {
            ...webhook,
            forwards: [forward, ...webhook.forwards],
          },
        },
      },
    });
  };

  const { send } = { send: (url: string, webhook: Webhook) => {} }; //useSender({ onForwarded });

  const forwardWebhook = (url: string, webhooks: Webhook[]) => {
    addForwardUrl(url);
    addForwardingIds(webhooks.map(w => w.id));
    webhooks
      .sort((a, b) => parseInt(a.id, 10) - parseInt(b.id, 10))
      .forEach(webhook =>
        send(appendQuery(url, webhook.query), webhook),
      );
  };

  return {
    forwardWebhook,
  };
};

export default useForwarder;
