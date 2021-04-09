import { useState } from 'react';
import { matchPath, useHistory, useLocation } from 'react-router-dom';
import { useHotkeys } from 'react-hotkeys-hook';
import { sortDistinct } from 'services/ids';
import useReadWebhook from './useReadWebhook';
import useDeleteWebhooks from './useDeleteWebhooks';
import { GetWebhooks_webhooks_nodes } from 'schema/types/GetWebhooks';
import { useMe } from 'context/user-context';

const useWebhookSelectionManager = ({
  endpointId,
  webhooks,
  ensureIndexVisible,
}: {
  endpointId: string;
  webhooks: GetWebhooks_webhooks_nodes[];
  ensureIndexVisible: (index: number) => void;
}) => {
  const history = useHistory();
  const location = useLocation();
  const me = useMe();
  const { readWebhook } = useReadWebhook();
  const { deleteWebhooks } = useDeleteWebhooks(endpointId);

  const match = matchPath<{
    webhookIds: string | undefined;
  }>(location.pathname, {
    path: '/dashboard/:endpointId/webhooks/:webhookIds',
  });

  const selectedWebhookIds =
    match?.params.webhookIds?.split(',') ?? [];

  const [activeWebhookId, setActiveWebhookId] = useState<
    string | undefined
  >(selectedWebhookIds.length ? selectedWebhookIds[0] : undefined);

  const [startWebhookId, setStartWebhookId] = useState<
    string | undefined
  >(selectedWebhookIds.length ? selectedWebhookIds[0] : undefined);

  const setSelection = (ids: string[]) => {
    const path = !ids.length
      ? `/dashboard/${endpointId}`
      : location.pathname.includes('/forwards')
      ? `/dashboard/${endpointId}/webhooks/${ids.join(',')}/forwards`
      : `/dashboard/${endpointId}/webhooks/${ids.join(',')}`;

    if (location.pathname !== path) history.push(path);
  };

  const handleWebhookClick = (
    webhook: GetWebhooks_webhooks_nodes,
    ctrlKey: boolean,
    shiftKey: boolean,
  ) => {
    setActiveWebhookId(webhook.id);
    if (!shiftKey) setStartWebhookId(webhook.id);
    if (ctrlKey) {
      let alreadySelectedIndex = selectedWebhookIds.findIndex(
        webhookId => {
          return webhookId === webhook.id;
        },
      );

      if (alreadySelectedIndex < 0) {
        setSelection(
          sortDistinct(selectedWebhookIds.concat(webhook.id)),
        );
      } else {
        selectedWebhookIds.splice(alreadySelectedIndex, 1);
        setSelection(sortDistinct(selectedWebhookIds));
      }
      return;
    }

    if (shiftKey) {
      let start = webhooks.findIndex(w => w.id === startWebhookId);
      if (start === -1) start = 0;

      let end = webhooks.findIndex(w => w.id === webhook.id);
      if (start < 0 || end < 0) return;

      if (end < start) {
        const prevStart = start;
        start = end;
        end = prevStart;
      }

      setSelection(
        webhooks.reduce(
          (acc, cur, index) => {
            if (acc.including) {
              acc.selected.push(cur.id);
              if (index === end) acc.including = false;
            } else if (index === start) {
              acc.selected.push(cur.id);
              acc.including = true;
            }
            return acc;
          },
          { including: false, selected: [] } as {
            including: boolean;
            selected: string[];
          },
        ).selected,
      );
      return;
    }

    setSingleSelection(webhook);
  };

  const setSingleSelection = (
    webhook: GetWebhooks_webhooks_nodes,
  ) => {
    setSelection([webhook.id]);
    setStartWebhookId(webhook.id);
    if (!webhook.reads.some(r => r.reader.id === me?.id))
      readWebhook(webhook);
  };

  const selectIndex = (index: number) => {
    setActiveWebhookId(webhooks[index].id);
    setSingleSelection(webhooks[index]);
    ensureIndexVisible(index);
  };

  const selectPrevious = () => {
    let selectedIndex = webhooks.findIndex(
      w => w.id === activeWebhookId,
    );
    if (selectedIndex === 0) selectIndex(selectedIndex);
    else selectIndex(selectedIndex - 1);
  };

  const selectNext = () => {
    let selectedIndex = webhooks.findIndex(
      w => w.id === activeWebhookId,
    );
    if (selectedIndex + 1 >= webhooks.length)
      selectIndex(selectedIndex);
    else selectIndex(selectedIndex + 1);
  };

  const shiftKeyboardSelect = (direction: string) => {
    let start = webhooks.findIndex(w => w.id === startWebhookId);
    let end = webhooks.findIndex(w => w.id === activeWebhookId);
    if (direction === 'up') end -= 1;
    else if (direction === 'down') end += 1;
    if (end >= webhooks.length) return;
    if (start === -1) start = 0;
    if (start < 0 || end < 0) return;
    setActiveWebhookId(webhooks[end].id);

    if (start === end) {
      selectIndex(start);
      return;
    }

    if (end < start) {
      const prevStart = start;
      start = end;
      end = prevStart;
    }

    setSelection(
      webhooks.reduce(
        (acc, cur, index) => {
          if (acc.including) {
            acc.selected.push(cur.id);
            if (index === end) acc.including = false;
          } else if (index === start) {
            acc.selected.push(cur.id);
            acc.including = true;
          }
          return acc;
        },
        { including: false, selected: [] } as {
          including: boolean;
          selected: string[];
        },
      ).selected,
    );
    return;
  };

  useHotkeys(
    'ctrl+a',
    e => {
      e.preventDefault();
      setSelection(
        webhooks.reduce(
          (acc, cur, index) => {
            if (acc.including) {
              acc.selected.push(cur.id);
              if (index === 0) acc.including = false;
            } else if (index === 0) {
              acc.selected.push(cur.id);
              acc.including = true;
            }
            return acc;
          },
          { including: false, selected: [] } as {
            including: boolean;
            selected: string[];
          },
        ).selected,
      );
      return;
    },
    undefined,
    [selectedWebhookIds],
  );

  useHotkeys(
    'up',
    e => {
      e.preventDefault();
      selectPrevious();
    },
    undefined,
    [selectedWebhookIds],
  );

  useHotkeys(
    'down',
    e => {
      e.preventDefault();
      selectNext();
    },
    undefined,
    [selectedWebhookIds],
  );

  useHotkeys(
    'shift+up',
    () => {
      shiftKeyboardSelect('up');
    },
    undefined,
    [selectedWebhookIds],
  );

  useHotkeys(
    'shift+down',
    () => {
      shiftKeyboardSelect('down');
    },
    undefined,
    [selectedWebhookIds],
  );

  const handleWebhookDelete = (
    webhookId: string | string[],
    selectAfterDelete: boolean = false,
  ) => {
    const ids = Array.isArray(webhookId) ? webhookId : [webhookId];
    const lowestIndex = ids.reduce(
      (acc, curr) =>
        Math.min(
          acc,
          webhooks.findIndex(w => w.id === curr),
        ),
      webhooks.length - 1,
    );
    deleteWebhooks(ids);

    const remainingSelections = selectedWebhookIds.filter(
      i => !ids.includes(i),
    );
    const remainingWebhooks = webhooks.filter(
      w => !ids.includes(w.id),
    );
    if (selectAfterDelete && !remainingSelections.length) {
      if (remainingWebhooks.length) {
        if (remainingWebhooks.length > lowestIndex)
          selectIndex(
            webhooks.findIndex(
              w => w.id === remainingWebhooks[lowestIndex].id,
            ),
          );
        else
          selectIndex(
            webhooks.findIndex(
              w =>
                w.id ===
                remainingWebhooks[remainingWebhooks.length - 1].id,
            ),
          );
        return;
      }
    }

    setSelection(remainingSelections);
  };

  useHotkeys(
    'del',
    () => handleWebhookDelete(selectedWebhookIds, true),
    undefined,
    [selectedWebhookIds],
  );

  return {
    activeWebhookId,
    selectedWebhookIds,
    handleWebhookClick,
    handleWebhookDelete,
  };
};

export default useWebhookSelectionManager;
