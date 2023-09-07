import { FC } from 'react';
import {
  Text, unstable_Popover as Popover, Subhead,
} from '@vkontakte/vkui';
import { Icon16HelpOutline } from '@vkontakte/icons';

interface TooltipTextProps {
  text: string;
  tooltipContent: string;
}

const ExplanationTooltip: FC<TooltipTextProps> = ({ text, tooltipContent }) => {
  const textTooltip = (
    <Subhead style={{ padding: '8px ', color: 'var(--vkui--color_text_primary)' }}>
      {tooltipContent}
    </Subhead>
  );
  
  return (
    <Text>
      {text}
      <Popover
        style={{ maxWidth: 220 }}
        action='hover'
        content={textTooltip}
      >
        <Icon16HelpOutline
          style={{
            display: 'inline-block',
            verticalAlign: 'middle',
            position: 'relative',
            top: -1,
            color: 'var(--vkui--color_icon_secondary)',
            marginLeft: 5,
          }}
        />
      </Popover>
    </Text>
  );
};

export default ExplanationTooltip;
