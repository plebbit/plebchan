import { useState } from 'react';
import { getFormattedDate, getFormattedTimeAgo } from '../../../lib/utils/time-utils';
import { useFloating, autoUpdate, offset, flip, shift, useHover, useFocus, useDismiss, useRole, useInteractions, FloatingPortal } from '@floating-ui/react';

const Timestamp = ({ timestamp }: { timestamp: number }) => {
  const [isOpen, setIsOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: 'top',
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(5),
      flip({
        fallbackAxisSideDirection: 'start',
      }),
      shift(),
    ],
  });

  const hover = useHover(context, { move: false, delay: { open: 250, close: 0 } });
  const focus = useFocus(context);
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: 'tooltip' });

  const { getReferenceProps, getFloatingProps } = useInteractions([hover, focus, dismiss, role]);

  return (
    <>
      <span ref={refs.setReference} {...getReferenceProps()}>
        {getFormattedDate(timestamp)}
      </span>
      <FloatingPortal>
        {isOpen && (
          <div className='tooltip' ref={refs.setFloating} style={floatingStyles} {...getFloatingProps()}>
            {getFormattedTimeAgo(timestamp)}
          </div>
        )}
      </FloatingPortal>
    </>
  );
};

export default Timestamp;
