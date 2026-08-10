import { Linking, Text } from 'react-native';
import { parseRichText } from '@tobeatraveller/shared';

const isInternal = (href) => href.startsWith('/');

// Shared locale strings embed <strong> and <a href="..."> so both web and mobile
// render the same translation. React Native's <Text> doesn't parse HTML, so this
// splits the string and renders bold/linked segments as nested <Text> nodes,
// the idiomatic RN way to do inline rich text.
export const RichText = ({ text, style, boldStyle, linkStyle, onInternalLink }) => (
  <Text style={style}>
    {parseRichText(text).map((part, i) => {
      if (part.type === 'bold') return <Text key={i} style={boldStyle}>{part.text}</Text>;
      if (part.type === 'link') {
        return (
          <Text
            key={i}
            style={linkStyle}
            onPress={() => (isInternal(part.href) ? onInternalLink?.(part.href) : Linking.openURL(part.href))}
          >
            {part.text}
          </Text>
        );
      }
      return part.text;
    })}
  </Text>
);
