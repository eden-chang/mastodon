import { useEffect, useState, useCallback, useId } from 'react';

import ArrowDropDownIcon from '@/material-icons/400-24px/arrow_drop_down.svg?react';
import ArrowLeftIcon from '@/material-icons/400-24px/arrow_left.svg?react';
import type { IconProp } from 'mastodon/components/icon';
import { IconButton } from 'mastodon/components/icon_button';
import { LoadingIndicator } from 'mastodon/components/loading_indicator';
import { ColumnLink } from 'mastodon/features/ui/components/column_link';

export const CollapsiblePanel: React.FC<{
  children: React.ReactNode[];
  to: string;
  title: string;
  collapseTitle: string;
  expandTitle: string;
  icon: string;
  iconComponent: IconProp;
  activeIconComponent?: IconProp;
  load?: () => void;
  loading?: boolean;
}> = ({
  children,
  to,
  icon,
  iconComponent,
  activeIconComponent,
  title,
  collapseTitle,
  expandTitle,
  load,
  loading,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const accessibilityId = useId();

  useEffect(() => {
    if (expanded && !loaded) {
      load?.();
      setLoaded(true);
    }
  }, [setLoaded, load, loaded, expanded]);

  const handleClick = useCallback(() => {
    setExpanded((value) => !value);
  }, [setExpanded]);

  return (
    <div className='navigation-panel__list-panel'>
      <div className='navigation-panel__list-panel__header'>
        <ColumnLink
          transparent
          to={to}
          icon={icon}
          iconComponent={iconComponent}
          activeIconComponent={activeIconComponent}
          text={title}
          id={`${accessibilityId}-title`}
        />

        {(!loaded || loading || children.length > 0) && (
          <IconButton
            icon='down'
            expanded={expanded}
            iconComponent={
              loading
                ? LoadingIndicator
                : expanded
                  ? ArrowDropDownIcon
                  : ArrowLeftIcon
            }
            title={expanded ? collapseTitle : expandTitle}
            onClick={handleClick}
            aria-controls={`${accessibilityId}-content`}
          />
        )}
      </div>

      {children.length > 0 && expanded && (
        <div
          className='navigation-panel__list-panel__items'
          role='region'
          id={`${accessibilityId}-content`}
          aria-labelledby={`${accessibilityId}-title`}
        >
          {children}
        </div>
      )}
    </div>
  );
};
