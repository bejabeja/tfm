import { Text } from 'react-native';

// Shared locale strings use <strong> for emphasis so web can render them with
// react-i18next's Trans component. React Native's <Text> doesn't parse HTML,
// so on mobile those tags would otherwise show up as literal text.
const STRONG_SPLIT = /(<strong>.*?<\/strong>)/gs;
const STRONG_MATCH = /^<strong>(.*)<\/strong>$/s;

export const BoldText = ({ text, style, boldStyle }) => (
  <Text style={style}>
    {text.split(STRONG_SPLIT).map((part, i) => {
      const match = part.match(STRONG_MATCH);
      return match ? <Text key={i} style={boldStyle}>{match[1]}</Text> : part;
    })}
  </Text>
);
